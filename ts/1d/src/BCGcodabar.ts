'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * Codabar.
 */
class BCGcodabar extends BCGBarcode1D {
  /**
   * Creates a Codabar barcode.
   */
  constructor() {
    super();

    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '', ':', '/', '.', '+', 'A', 'B', 'C', 'D'];
    this.code = [
      // 0 added to add an extra space
      '00000110' /* 0 */,
      '00001100' /* 1 */,
      '00010010' /* 2 */,
      '11000000' /* 3 */,
      '00100100' /* 4 */,
      '10000100' /* 5 */,
      '01000010' /* 6 */,
      '01001000' /* 7 */,
      '01100000' /* 8 */,
      '10010000' /* 9 */,
      '00011000' /* - */,
      '00110000' /*  */,
      '10001010' /* : */,
      '10100010' /* / */,
      '10101000' /* . */,
      '00111110' /* + */,
      '00110100' /* A */,
      '01010010' /* B */,
      '00010110' /* C */,
      '00011100' /* D */
    ];
  }

  /**
   * Parses the text before displaying it.
   *
   * @param mixed text
   */
  parse(text: string): void {
    super.parse(text.toUpperCase()); // Only Capital Letters are Allowed
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    const c = this.text.length;
    for (let i = 0; i < c; i++) {
      this.drawChar(image, this.findCode(this.text[i])!, true); // !It has been validated
    }

    this.drawText(image, 0, 0, this.positionX, this.thickness);
  }

  /**
   * Returns the maximal size of a barcode.
   * [0]->width
   *
   * [1]->height
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  getDimension(width: number, height: number, createSurface?: draw.CreateSurface): [number, number] {
    let textLength = 0;
    const c = this.text.length;
    let index;
    for (let i = 0; i < c; i++) {
      index = this.findIndex(this.text[i]);
      if (index !== -1) {
        textLength += 8;
        textLength += Utility.substrCount(this.code[index], '1');
      }
    }

    width += textLength;
    height += this.thickness;
    return super.getDimension(width, height, createSurface);
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    const c = this.text.length;
    if (c === 0) {
      throw new BCGParseException('Codabar', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('Codabar', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    // Must start by A, B, C or D
    if (c === 0 || (this.text[0] !== 'A' && this.text[0] !== 'B' && this.text[0] !== 'C' && this.text[0] !== 'D')) {
      throw new BCGParseException('Codabar', 'The text must start by the character A, B, C, or D.');
    }

    // Must end by A, B, C or D
    const c2 = c - 1;
    if (c2 === 0 || (this.text[c2] !== 'A' && this.text[c2] !== 'B' && this.text[c2] !== 'C' && this.text[c2] !== 'D')) {
      throw new BCGParseException('Codabar', 'The text must end by the character A, B, C, or D.');
    }

    super.validate();
  }
}

export { BCGcodabar };
