'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode1D, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * Other Code.
 * Starting with a bar and altern to space, bar, ...
 * 0 is the smallest.
 */
class BCGothercode extends BCGBarcode1D {
  /**
   * Creates an other type barcode.
   */
  constructor() {
    super();
    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    this.drawChar(image, this.text, true);
    this.drawText(image, 0, 0, this.positionX, this.thickness);
  }

  /**
   * Gets the label.
   * If the label was set to BCGBarcode1D::AUTOlabel, the label will display the value from the text parsed.
   *
   * @return The label string.
   */
  getLabel(): string | null {
    let label = this.label;
    if (this.label === BCGBarcode1D.AUTO_LABEL) {
      label = '';
    }

    return label;
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
    const array = this.text.split('').map(Number);
    const textlength = Utility.arraySum(array) + array.length;

    width += textlength;
    height += this.thickness;
    return super.getDimension(width, height, createSurface);
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    const c = this.text.length;
    if (c === 0) {
      throw new BCGParseException('OtherCode', 'No data has been entered.');
    }

    // Checking if all chars are allowed
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('OtherCode', "The character '" + this.text[i] + "' is not allowed.");
      }
    }

    super.validate();
  }
}

export { BCGothercode };
