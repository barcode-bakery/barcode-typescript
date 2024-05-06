'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGArgumentException, BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * MSI Plessey.
 */
class BCGmsi extends BCGBarcode1D {
  private checksum = 0;

  /**
   * Creates an MSI Plessey barcode.
   */
  constructor() {
    super();

    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.code = [
      '01010101' /* 0 */,
      '01010110' /* 1 */,
      '01011001' /* 2 */,
      '01011010' /* 3 */,
      '01100101' /* 4 */,
      '01100110' /* 5 */,
      '01101001' /* 6 */,
      '01101010' /* 7 */,
      '10010101' /* 8 */,
      '10010110' /* 9 */
    ];
  }

  /**
   * Sets how many checksums we display. 0 to 2.
   *
   * @param checksum The amount of checksums.
   */
  setChecksum(checksum: number | string): void {
    checksum = parseInt(checksum.toString(), 10);
    if (checksum < 0 && checksum > 2) {
      throw new BCGArgumentException('The checksum must be between 0 and 2 included.', 'checksum');
    }

    this.checksum = checksum;
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    // Checksum
    this.calculateChecksum();

    if (this.checksumValue === null) {
      throw new Error();
    }

    // Starting Code
    this.drawChar(image, '10', true);

    // Chars
    let c = this.text.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.findCode(this.text[i])!, true); // !It has been validated
    }

    c = this.checksumValue.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.findCode(this.checksumValue[i].toString())!, true); // !It has been validated
    }

    // Ending Code
    this.drawChar(image, '010', true);
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
    const textlength = 12 * this.text.length;
    const startlength = 3;
    const checksumlength = this.checksum * 12;
    const endlength = 4;

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
      throw new BCGParseException('Msi', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('Msi', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  protected calculateChecksum(): void {
    // Forming a new number
    // If the original number is even, we take all even position
    // If the original number is odd, we take all odd position
    // 123456 = 246
    // 12345 = 135
    // Multiply by 2
    // Add up all the digit in the result (270 : 2+7+0)
    // Add up other digit not used.
    // 10 - (? Modulo 10). If result = 10, change to 0
    let lasttext = this.text;
    this.checksumValue = [];
    for (let i = 0; i < this.checksum; i++) {
      let newtext = '';
      let newNumber = 0;
      const c = lasttext.length;
      let starting;
      if (c % 2 === 0) {
        // Even
        starting = 1;
      } else {
        starting = 0;
      }

      for (let j = starting; j < c; j += 2) {
        newtext += lasttext[j];
      }

      newtext = String(parseInt(newtext, 10) * 2);
      const c2 = newtext.length;
      for (let j = 0; j < c2; j++) {
        newNumber += parseInt(newtext[j], 10);
      }

      for (let j = starting === 0 ? 1 : 0; j < c; j += 2) {
        newNumber += parseInt(lasttext[j], 10);
      }

      newNumber = (10 - (newNumber % 10)) % 10;
      this.checksumValue.push(newNumber);
      lasttext += newNumber;
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
}

export { BCGmsi };
