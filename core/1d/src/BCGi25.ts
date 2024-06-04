'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * Interleaved 2 of 5.
 */
class BCGi25 extends BCGBarcode1D {
  private checksum = false;
  private ratio = 2;

  /**
   * Creates an Interleaved 2 of 5 barcode.
   */
  constructor() {
    super();

    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.code = [
      '00110' /* 0 */,
      '10001' /* 1 */,
      '01001' /* 2 */,
      '11000' /* 3 */,
      '00101' /* 4 */,
      '10100' /* 5 */,
      '01100' /* 6 */,
      '00011' /* 7 */,
      '10010' /* 8 */,
      '01010' /* 9 */
    ];
  }

  /**
   * Sets if we display the checksum.
   *
   * @param checksum Displays the checksum.
   */
  setChecksum(checksum: boolean): void {
    this.checksum = !!checksum;
  }

  /**
   * Sets the ratio of the black bar compared to the white bars.
   *
   * @param ratio The ratio.
   */
  setRatio(ratio: number | string): void {
    this.ratio = parseInt(ratio.toString(), 10);
  }

  /**
   * Draws the barcode.
   *
   * @param image The image.
   */
  draw(image: draw.Surface): void {
    let temptext = this.text;

    // Checksum
    if (this.checksum === true) {
      this._calculateChecksum();
      if (this.checksumValue === null) {
        throw new Error();
      }

      temptext += this.keys[this.checksumValue[0]];
    }

    // Starting Code
    this.drawChar(image, '0000', true);

    // Chars
    const c = temptext.length;
    for (let i = 0; i < c; i += 2) {
      let tempBar = '';
      const c2 = this.findCode(temptext[i])!.length; // !It has been validated
      for (let j = 0; j < c2; j++) {
        tempBar += this.findCode(temptext[i])!.substring(j, j + 1); // !It has been validated
        tempBar += this.findCode(temptext[i + 1])!.substring(j, j + 1); // !It has been validated
      }

      this.drawChar(image, this.changeBars(tempBar), true);
    }

    // Ending Code
    this.drawChar(image, this.changeBars('100'), true);
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
    const textlength = (3 + (this.ratio + 1) * 2) * this.text.length;

    const startlength = 4;
    let checksumlength = 0;
    if (this.checksum === true) {
      checksumlength = 3 + (this.ratio + 1) * 2;
    }

    const endlength = 2 + (this.ratio + 1);

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
      throw new BCGParseException('I25', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('I25', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    // Must be even
    if (c % 2 !== 0 && this.checksum === false) {
      throw new BCGParseException('I25', 'I25 must contain an even amount of digits if checksum is false.');
    } else if (c % 2 === 0 && this.checksum === true) {
      throw new BCGParseException('I25', 'I25 must contain an odd amount of digits if checksum is true.');
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  _calculateChecksum(): void {
    // Calculating Checksum
    // Consider the right-most digit of the message to be in an "even" position,
    // and assign odd/even to each character moving from right to left
    // Even Position = 3, Odd Position = 1
    // Multiply it by the number
    // Add all of that and do 10-(?mod10)
    let even = true;
    this.checksumValue = [0];
    const c = this.text.length;
    let multiplier;
    for (let i = c; i > 0; i--) {
      if (even === true) {
        multiplier = 3;
        even = false;
      } else {
        multiplier = 1;
        even = true;
      }

      const n1 = parseInt(this.text[i - 1], 10);
      const n2 = parseInt(this.keys[n1], 10);
      this.checksumValue[0] += n2 * multiplier;
    }

    this.checksumValue[0] = (10 - (this.checksumValue[0] % 10)) % 10;
  }

  /**
   * Overloaded method to display the checksum.
   *
   * @return The checksum value.
   */
  protected processChecksum(): string | null {
    // Calculate the checksum only once
    if (this.checksumValue === null) {
      this._calculateChecksum();
    }

    if (this.checksumValue !== null) {
      return this.keys[this.checksumValue[0]];
    }

    return null;
  }

  /**
   * Changes the size of the bars based on the ratio
   *
   * @param bar The bars.
   * @return New bars.
   */
  private changeBars(bar: string): string {
    const arr = bar.split('');
    if (this.ratio > 1) {
      const c = arr.length;
      for (let i = 0; i < c; i++) {
        arr[i] = arr[i] === '1' ? this.ratio.toString() : arr[i];
      }
    }

    return arr.join('');
  }
}

export { BCGi25 };
