'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * Code 11.
 */
class BCGcode11 extends BCGBarcode1D {
  /**
   * Creates a Code 11 barcode.
   */
  constructor() {
    super();

    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
    this.code = [
      // 0 added to add an extra space
      '000010' /* 0 */,
      '100010' /* 1 */,
      '010010' /* 2 */,
      '110000' /* 3 */,
      '001010' /* 4 */,
      '101000' /* 5 */,
      '011000' /* 6 */,
      '000110' /* 7 */,
      '100100' /* 8 */,
      '100000' /* 9 */,
      '001000' /* - */
    ];
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    // Starting Code
    this.drawChar(image, '001100', true);

    // Chars
    let c = this.text.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.findCode(this.text[i])!, true); // !It has been validated
    }

    // Checksum
    this.calculateChecksum();

    if (this.checksumValue === null) {
      throw new Error();
    }

    c = this.checksumValue.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.code[this.checksumValue[i]], true);
    }

    // Ending Code
    this.drawChar(image, '00110', true);
    this.drawText(image, 0, 0, this.positionX, this.thickness);
  }

  /**
   * Returns the maximal size of a barcode.
   * [0]->width
   * [1]->height
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number, createSurface?: draw.CreateSurface): [number, number] {
    const startlength = 8;

    let textlength = 0;
    let c = this.text.length;
    for (let i = 0; i < c; i++) {
      textlength += this.getIndexLength(this.findIndex(this.text[i]));
    }

    let checksumlength = 0;
    this.calculateChecksum();

    if (this.checksumValue === null) {
      throw new Error();
    }

    c = this.checksumValue.length;
    for (let i = 0; i < c; i++) {
      checksumlength += this.getIndexLength(this.checksumValue[i]);
    }

    const endlength = 7;

    width += startlength + textlength + checksumlength + endlength;
    height += this.thickness;

    return super.getDimension(width, height, createSurface);
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    const c = this.text.length;
    if (c === 0) {
      throw new BCGParseException('Code11', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('Code11', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  protected calculateChecksum(): void {
    // Checksum
    // First CheckSUM "C"
    // The "C" checksum character is the modulo 11 remainder of the sum of the weighted
    // value of the data characters. The weighting value starts at "1" for the right-most
    // data character, 2 for the second to last, 3 for the third-to-last, and so on up to 20.
    // After 10, the sequence wraps around back to 1.
    // Second CheckSUM "K"
    // Same as CheckSUM "C" but we count the CheckSum "C" at the end
    // After 9, the sequence wraps around back to 1.
    const sequenceMultiplier = [10, 9];
    let tempText = this.text;
    this.checksumValue = [];
    for (let z = 0; z < 2; z++) {
      const c = tempText.length;

      // We don't display the K CheckSum if the original text had a length less than 10
      if (c <= 10 && z === 1) {
        break;
      }

      let checksum = 0;
      for (let i = c, j = 0; i > 0; i--, j++) {
        let multiplier = i % sequenceMultiplier[z];
        if (multiplier === 0) {
          multiplier = sequenceMultiplier[z];
        }

        checksum += this.findIndex(tempText[j]) * multiplier;
      }

      this.checksumValue[z] = checksum % 11;
      tempText += this.keys[this.checksumValue[z]];
    }
  }

  /**
   * Overloaded method to display the checksum.
   *
   * @return The checksum value.
   */
  protected processChecksum(): string | null {
    // Calculate the checksum only once
    if (this.checksumValue === null) {
      this.calculateChecksum();
    }

    if (this.checksumValue !== null) {
      let ret = '';
      const c = this.checksumValue.length;
      for (let i = 0; i < c; i++) {
        ret += this.keys[this.checksumValue[i]];
      }

      return ret;
    }

    return null;
  }

  private getIndexLength(index: number): number {
    let length = 0;
    if (index !== -1) {
      length += 6;
      length += Utility.substrCount(this.code[index], '1');
    }

    return length;
  }
}

export { BCGcode11 };
