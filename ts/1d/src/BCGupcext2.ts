'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGLabel, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * UPC Supplemental Barcode 2 digits.
 *
 * Working with UPC-A, UPC-E, EAN-13, EAN-8
 * This includes 2 digits(normaly for publications)
 * Must be placed next to UPC or EAN Code
 */
class BCGupcext2 extends BCGBarcode1D {
  private readonly codeParity: number[][];

  /**
   * Creates a UPC supplemental 2 digits barcode.
   */
  constructor() {
    super();

    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.code = ['2100', '1110', '1011', '0300', '0021', '0120', '0003', '0201', '0102', '2001' /* 9 */];

    // Parity, 0=Odd, 1=Even. Depending on ?%4
    this.codeParity = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1] /* 3 */
    ];
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    // Starting Code
    this.drawChar(image, '001', true);

    // Code
    for (let i = 0; i < 2; i++) {
      this.drawChar(image, BCGupcext2.inverse(this.findCode(this.text[i])!, this.codeParity[parseInt(this.text, 10) % 4][i]), false); // !It has been validated
      if (i === 0) {
        this.drawChar(image, '00', false); // Inter-char
      }
    }

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
    const startlength = 4;
    const textlength = 2 * 7;
    const intercharlength = 2;

    width += startlength + textlength + intercharlength;
    height += this.thickness;
    return super.getDimension(width, height, createSurface);
  }

  /**
   * Adds the default label.
   */
  protected addDefaultLabel(): void {
    super.addDefaultLabel();

    if (this.defaultLabel !== null) {
      this.defaultLabel.setPosition(BCGLabel.Position.Top);
    }
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    const c = this.text.length;
    if (c === 0) {
      throw new BCGParseException('Upcext2', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('Upcext2', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    // Must contain 2 digits
    if (c !== 2) {
      throw new BCGParseException('Upcext2', 'Must contain 2 digits.');
    }

    super.validate();
  }

  /**
   * Inverses the string when the inverse parameter is equal to 1.
   *
   * @param text The text.
   * @param inverse The inverse.
   * @return string The reversed string.
   */
  private static inverse(text: string, inverse: number): string {
    if (inverse === 1) {
      text = Utility.strrev(text);
    }

    return text;
  }
}

export { BCGupcext2 };
