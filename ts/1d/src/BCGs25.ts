'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGParseException, draw, Utility } from '@barcode-bakery/barcode-common';

/**
 * Standard 2 of 5.
 */
class BCGs25 extends BCGBarcode1D {
  private checksum = false;

  /**
   * Creates an Standard 2 of 5 barcode.
   */
  constructor() {
    super();
    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.code = [
      '0000202000' /* 0 */,
      '2000000020' /* 1 */,
      '0020000020' /* 2 */,
      '2020000000' /* 3 */,
      '0000200020' /* 4 */,
      '2000200000' /* 5 */,
      '0020200000' /* 6 */,
      '0000002020' /* 7 */,
      '2000002000' /* 8 */,
      '0020002000' /* 9 */
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
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    let tempText = this.text;

    // Checksum
    if (this.checksum === true) {
      this.calculateChecksum();
      if (this.checksumValue === null) {
        throw new Error();
      }

      tempText += this.keys[this.checksumValue[0]];
    }

    // Starting Code
    this.drawChar(image, '101000', true);

    // Chars
    let c = tempText.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.findCode(tempText[i])!, true); // !It has been validated
    }

    // Ending Code
    this.drawChar(image, '10001', true);
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
    let c = this.text.length;
    let startlength = 8;
    let textlength = c * 14;
    let checksumlength = 0;
    if (c % 2 !== 0) {
      checksumlength = 14;
    }

    let endlength = 7;

    width += startlength + textlength + checksumlength + endlength;
    height += this.thickness;
    return super.getDimension(width, height, createSurface);
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    let c = this.text.length;
    if (c === 0) {
      throw new BCGParseException('S25', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('S25', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    // Must be even
    if (c % 2 !== 0 && this.checksum === false) {
      throw new BCGParseException('S25', 'S25 must contain an even amount of digits if checksum is false.');
    } else if (c % 2 === 0 && this.checksum === true) {
      throw new BCGParseException('S25', 'S25 must contain an odd amount of digits if checksum is true.');
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  protected calculateChecksum(): void {
    // Calculating Checksum
    // Consider the right-most digit of the message to be in an "even" position,
    // and assign odd/even to each character moving from right to left
    // Even Position = 3, Odd Position = 1
    // Multiply it by the number
    // Add all of that and do 10-(?mod10)
    let even = true;
    this.checksumValue = [0];
    let c = this.text.length;
    let multiplier;
    for (let i = c; i > 0; i--) {
      if (even === true) {
        multiplier = 3;
        even = false;
      } else {
        multiplier = 1;
        even = true;
      }

      let n1 = parseInt(this.text[i - 1], 10);
      let n2 = parseInt(this.keys[n1], 10);
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
      this.calculateChecksum();
    }

    if (this.checksumValue !== null) {
      return this.keys[this.checksumValue[0]];
    }

    return null;
  }
}

export { BCGs25 };
