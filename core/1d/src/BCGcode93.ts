'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * Code 93.
 */
class BCGcode93 extends BCGBarcode1D {
  private static readonly EXTENDED_1 = 43;
  private static readonly EXTENDED_2 = 44;
  private static readonly EXTENDED_3 = 45;
  private static readonly EXTENDED_4 = 46;

  private readonly starting: number;
  private readonly ending: number;

  /**
   * The encoded data.
   */
  protected data: string[] | null = null;

  /**
   * Data for handling the checksum.
   */
  protected indcheck: number[] | null = null;

  /**
   * Creates a Code 93 barcode.
   */
  constructor() {
    super();

    this.starting = this.ending = 47; /* * */
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
      '$',
      '/',
      '+',
      '%',
      '($)',
      '(%)',
      '(/)',
      '(+)',
      '(*)'
    ];
    this.code = [
      '020001' /* 0 */,
      '000102' /* 1 */,
      '000201' /* 2 */,
      '000300' /* 3 */,
      '010002' /* 4 */,
      '010101' /* 5 */,
      '010200' /* 6 */,
      '000003' /* 7 */,
      '020100' /* 8 */,
      '030000' /* 9 */,
      '100002' /* A */,
      '100101' /* B */,
      '100200' /* C */,
      '110001' /* D */,
      '110100' /* E */,
      '120000' /* F */,
      '001002' /* G */,
      '001101' /* H */,
      '001200' /* I */,
      '011001' /* J */,
      '021000' /* K */,
      '000012' /* L */,
      '000111' /* M */,
      '000210' /* N */,
      '010011' /* O */,
      '020010' /* P */,
      '101001' /* Q */,
      '101100' /* R */,
      '100011' /* S */,
      '100110' /* T */,
      '110010' /* U */,
      '111000' /* V */,
      '001011' /* W */,
      '001110' /* X */,
      '011010' /* Y */,
      '012000' /* Z */,
      '010020' /* - */,
      '200001' /* . */,
      '200100' /*   */,
      '210000' /* $ */,
      '001020' /* / */,
      '002010' /* + */,
      '100020' /* % */,
      '010110' /*($)*/,
      '201000' /*(%)*/,
      '200010' /*(/)*/,
      '011100' /*(+)*/,
      '000030' /* * */
    ];
  }

  /**
   * Parses the text before displaying it.
   *
   * @param text The text.
   */
  parse(text: string): void {
    this.text = text;

    const data: string[] = [];
    const indcheck: number[] = [];

    const c = this.text.length;
    for (let i = 0; i < c; i++) {
      const pos = Utility.arraySearch(this.keys, this.text[i]);
      if (pos === -1) {
        // Search in extended?
        const extended = this.getExtendedVersion(this.text[i]);
        if (extended === null) {
          throw new BCGParseException('Code93', "The character '" + this.text[i] + "' is not allowed.");
        } else {
          const extc = extended.length;
          for (let j = 0; j < extc; j++) {
            const v = extended[j];
            if (v === '') {
              indcheck.push(BCGcode93.EXTENDED_1);
              data.push(this.code[BCGcode93.EXTENDED_1]);
            } else if (v === '%') {
              indcheck.push(BCGcode93.EXTENDED_2);
              data.push(this.code[BCGcode93.EXTENDED_2]);
            } else if (v === '/') {
              indcheck.push(BCGcode93.EXTENDED_3);
              data.push(this.code[BCGcode93.EXTENDED_3]);
            } else if (v === '+') {
              indcheck.push(BCGcode93.EXTENDED_4);
              data.push(this.code[BCGcode93.EXTENDED_4]);
            } else {
              const pos2 = Utility.arraySearch(this.keys, v);
              indcheck.push(pos2);
              data.push(this.code[pos2]);
            }
          }
        }
      } else {
        indcheck.push(pos);
        data.push(this.code[pos]);
      }
    }

    this.setData([indcheck, data]);
    this.addDefaultLabel();
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    if (this.data === null || this.checksumValue === null) {
      throw new Error();
    }

    // Starting *
    this.drawChar(image, this.code[this.starting], true);
    let c = this.data.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.data[i], true);
    }

    // Checksum
    c = this.checksumValue.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.code[this.checksumValue[i]], true);
    }

    // Ending *
    this.drawChar(image, this.code[this.ending], true);

    // Draw a Final Bar
    this.drawChar(image, '0', true);
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
    if (this.data === null) {
      throw new Error();
    }

    const startlength = 9;
    const textlength = 9 * this.data.length;
    const checksumlength = 2 * 9;
    const endlength = 9 + 1; // + final bar

    width += startlength + textlength + checksumlength + endlength;
    height += this.thickness;
    return super.getDimension(width, height, createSurface);
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    if (this.data === null) {
      throw new Error();
    }

    const c = this.data.length;
    if (c === 0) {
      throw new BCGParseException('Code93', 'No data has been entered.');
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  calculateChecksum() {
    if (this.indcheck === null) {
      throw new Error();
    }

    // Checksum
    // First CheckSUM "C"
    // The "C" checksum character is the modulo 47 remainder of the sum of the weighted
    // value of the data characters. The weighting value starts at "1" for the right-most
    // data character, 2 for the second to last, 3 for the third-to-last, and so on up to 20.
    // After 20, the sequence wraps around back to 1.
    // Second CheckSUM "K"
    // Same as CheckSUM "C" but we count the CheckSum "C" at the end
    // After 15, the sequence wraps around back to 1.
    const sequenceMultiplier = [20, 15];
    this.checksumValue = [];
    const indcheck = this.indcheck;
    for (let z = 0; z < 2; z++) {
      let checksum = 0;
      for (let i = indcheck.length, j = 0; i > 0; i--, j++) {
        let multiplier = i % sequenceMultiplier[z];
        if (multiplier === 0) {
          multiplier = sequenceMultiplier[z];
        }

        checksum += indcheck[j] * multiplier;
      }

      this.checksumValue[z] = checksum % 47;
      indcheck.push(this.checksumValue[z]);
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

  /**
   * Saves data into the classes.
   *
   * This method will save data, calculate real column number
   * (if -1 was selected), the real error level (if -1 was
   * selected)... It will add Padding to the end and generate
   * the error codes.
   *
   * @param data The data.
   */
  setData(data: [number[], string[]]): void {
    this.indcheck = data[0];
    this.data = data[1];
    this.calculateChecksum();
  }

  /**
   * Returns the extended reprensentation of the character.
   *
   * @param val The value.
   * @return The representation.
   */
  private getExtendedVersion(val: string): string | null {
    const o = val.charCodeAt(0);
    if (o === 0) {
      return '%U';
    } else if (o >= 1 && o <= 26) {
      return '$' + String.fromCharCode(o + 64);
    } else if ((o >= 33 && o <= 44) || o === 47 || o === 48) {
      return '/' + String.fromCharCode(o + 32);
    } else if (o >= 97 && o <= 122) {
      return '+' + String.fromCharCode(o - 32);
    } else if (o >= 27 && o <= 31) {
      return '%' + String.fromCharCode(o + 38);
    } else if (o >= 59 && o <= 63) {
      return '%' + String.fromCharCode(o + 11);
    } else if (o >= 91 && o <= 95) {
      return '%' + String.fromCharCode(o - 16);
    } else if (o >= 123 && o <= 127) {
      return '%' + String.fromCharCode(o - 43);
    } else if (o === 64) {
      return '%V';
    } else if (o === 96) {
      return '%W';
    } else if (o > 127) {
      return null;
    } else {
      return val;
    }
  }
}

export { BCGcode93 };
