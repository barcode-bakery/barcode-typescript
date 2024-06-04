'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * Code 39.
 */
class BCGcode39 extends BCGBarcode1D {
  /**
   * Code index for the starting character.
   */
  protected readonly starting: number;

  /**
   * Code index for the ending character.
   */
  protected readonly ending: number;

  /**
   * Indicates if we display the checksum.
   */
  protected checksum = false;

  /**
   * Creates a Code 39 barcode.
   */
  constructor() {
    super();

    this.starting = this.ending = 43;
    this.keys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '-',
      '.',
      ' ',
      '',
      '/',
      '+',
      '%',
      '*'
    ];
    this.code = [
      // 0 added to add an extra space
      '0001101000' /* 0 */,
      '1001000010' /* 1 */,
      '0011000010' /* 2 */,
      '1011000000' /* 3 */,
      '0001100010' /* 4 */,
      '1001100000' /* 5 */,
      '0011100000' /* 6 */,
      '0001001010' /* 7 */,
      '1001001000' /* 8 */,
      '0011001000' /* 9 */,
      '1000010010' /* A */,
      '0010010010' /* B */,
      '1010010000' /* C */,
      '0000110010' /* D */,
      '1000110000' /* E */,
      '0010110000' /* F */,
      '0000011010' /* G */,
      '1000011000' /* H */,
      '0010011000' /* I */,
      '0000111000' /* J */,
      '1000000110' /* K */,
      '0010000110' /* L */,
      '1010000100' /* M */,
      '0000100110' /* N */,
      '1000100100' /* O */,
      '0010100100' /* P */,
      '0000001110' /* Q */,
      '1000001100' /* R */,
      '0010001100' /* S */,
      '0000101100' /* T */,
      '1100000010' /* U */,
      '0110000010' /* V */,
      '1110000000' /* W */,
      '0100100010' /* X */,
      '1100100000' /* Y */,
      '0110100000' /* Z */,
      '0100001010' /* - */,
      '1100001000' /* . */,
      '0110001000' /*   */,
      '0101010000' /* $ */,
      '0101000100' /* / */,
      '0100010100' /* + */,
      '0001010100' /* % */,
      '0100101000' /* * */
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
   * Parses the text before displaying it.
   *
   * @param text The text.
   */
  parse(text: string): void {
    super.parse(text.toUpperCase());
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    // Starting *
    this.drawChar(image, this.code[this.starting], true);

    // Chars
    const c = this.text.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.findCode(this.text[i])!, true); // !It has been validated
    }

    // Checksum (rarely used)
    if (this.checksum === true) {
      this.calculateChecksum();

      if (this.checksumValue === null) {
        throw new Error();
      }

      this.drawChar(image, this.code[this.checksumValue[0] % 43], true);
    }

    // Ending *
    this.drawChar(image, this.code[this.ending], true);
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
    const textlength = 13 * this.text.length;
    const startlength = 13;
    let checksumlength = 0;
    if (this.checksum === true) {
      checksumlength = 13;
    }

    const endlength = 13;

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
      throw new BCGParseException('Code39', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('Code39', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    if (this.text.indexOf('*') !== -1) {
      throw new BCGParseException('Code39', "The character '*' is not allowed.");
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  protected calculateChecksum(): void {
    this.checksumValue = [0];
    const c = this.text.length;
    for (let i = 0; i < c; i++) {
      this.checksumValue[0] += this.findIndex(this.text[i]);
    }

    this.checksumValue[0] = this.checksumValue[0] % 43;
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

export { BCGcode39 };
