'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';
import { BCGcode39 } from './BCGcode39';

/**
 * Code 39 Extended.
 */
class BCGcode39extended extends BCGcode39 {
  private static readonly EXTENDED_1 = 39;
  private static readonly EXTENDED_2 = 40;
  private static readonly EXTENDED_3 = 41;
  private static readonly EXTENDED_4 = 42;

  /**
   * The encoded data.
   */
  protected data: string[] | null = null;

  /**
   * Data for handling the checksum.
   */
  protected indcheck: number[] | null = null;

  /**
   * Creates a Code 39 Extended barcode.
   */
  constructor() {
    super();

    // We just put parenthesis around special characters.
    this.keys[BCGcode39extended.EXTENDED_1] = '($)';
    this.keys[BCGcode39extended.EXTENDED_2] = '(/)';
    this.keys[BCGcode39extended.EXTENDED_3] = '(+)';
    this.keys[BCGcode39extended.EXTENDED_4] = '(%)';
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
          throw new BCGParseException('Code39extended', "The character '" + this.text[i] + "' is not allowed.");
        } else {
          const extc = extended.length;
          for (let j = 0; j < extc; j++) {
            const v = extended[j];
            if (v === '') {
              indcheck.push(BCGcode39extended.EXTENDED_1);
              data.push(this.code[BCGcode39extended.EXTENDED_1]);
            } else if (v === '%') {
              indcheck.push(BCGcode39extended.EXTENDED_2);
              data.push(this.code[BCGcode39extended.EXTENDED_2]);
            } else if (v === '/') {
              indcheck.push(BCGcode39extended.EXTENDED_3);
              data.push(this.code[BCGcode39extended.EXTENDED_3]);
            } else if (v === '+') {
              indcheck.push(BCGcode39extended.EXTENDED_4);
              data.push(this.code[BCGcode39extended.EXTENDED_4]);
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
    const c = this.data.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.data[i], true);
    }

    // Checksum (rarely used)
    if (this.checksum === true) {
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
    if (this.data === null) {
      throw new Error();
    }

    const textlength = 13 * this.data.length;
    const startlength = 13;
    let checksumlength = 0;
    if (this.checksum === true) {
      checksumlength = 13;
    }

    const endlength = 13;

    width += startlength + textlength + checksumlength + endlength;
    height += this.thickness;
    return super.get1DDimension(width, height, createSurface);
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
      throw new BCGParseException('Code39extended', 'No data has been entered.');
    }

    super.validate();
  }

  /**
   * Overloaded method to calculate checksum.
   */
  protected calculateChecksum(): void {
    if (this.indcheck === null) {
      throw new Error();
    }

    this.checksumValue = [0];
    const c = this.indcheck.length;
    for (let i = 0; i < c; i++) {
      this.checksumValue[0] += this.indcheck[i];
    }

    this.checksumValue[0] = this.checksumValue[0] % 43;
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
  private setData(data: [number[], string[]]): void {
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

export { BCGcode39extended };
