'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode, BCGLabel, BCGParseException, draw } from '@barcode-bakery/barcode-common';
import { BCGean13 } from './BCGean13';

/**
 * UPC-A.
 * UPC-A contains
 *    - 2 system digits(1 not provided, a 0 is added automatically)
 *    - 5 manufacturer code digits
 *    - 5 product digits
 *    - 1 checksum digit
 *
 * The checksum is always displayed.
 */
class BCGupca extends BCGean13 {
  /**
   * The label on the right.
   */
  protected labelRight: BCGLabel | null = null;

  /**
   * Creates a UPC-A barcode.
   */
  constructor() {
    super();
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    // The following code is exactly the same as EAN13. We just add a 0 in front of the code !
    this.text = '0' + this.text; // We will remove it at the end... don't worry

    super.draw(image);

    // We remove the 0 in front, as we said :)
    this.text = this.text.substring(1);
  }

  /**
   * Draws the extended bars on the image.
   *
   * @param image The surface.
   * @param plus How much more we should display the bars.
   */
  protected drawExtendedBars(image: draw.Surface, plus: number): void {
    if (this.checksumValue === null) {
      throw new Error();
    }

    const temptext = this.text + this.keys[this.checksumValue[0]];
    const rememberX = this.positionX;
    const rememberH = this.thickness;

    // We increase the bars
    // First 2 Bars
    this.thickness = this.thickness + parseInt((plus / this.scale).toString(), 10);
    this.positionX = 0;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);
    this.positionX += 2;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);

    // Attemping to increase the 2 following bars
    this.positionX += 1;
    let tempValue = this.findCode(temptext[1])!; // !It has been validated
    this.drawChar(image, tempValue, false);

    // Center Guard Bar
    this.positionX += 36;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);
    this.positionX += 2;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);

    // Attemping to increase the 2 last bars
    this.positionX += 37;
    tempValue = this.findCode(temptext[12])!; // !It has been validated
    this.drawChar(image, tempValue, true);

    // Completly last bars
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);
    this.positionX += 2;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);

    this.positionX = rememberX;
    this.thickness = rememberH;
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
    this.handleLabel = false;
    if (createSurface && this.labelLeft && this.labelCenter1 && this.labelCenter2 && this.labelRight) {
      const labelCenter1Dimension = this.labelCenter1.getDimension(createSurface);
      this.labelCenter1.setOffset((this.scale * 44 - labelCenter1Dimension[0]) / 2 + this.scale * 6);
      this.labelCenter2.setOffset((this.scale * 44 - labelCenter1Dimension[0]) / 2 + this.scale * 45);
      let labelDimension;
      if (this.alignLabel) {
        labelDimension = this.labelCenter1.getDimension(createSurface);
        this.labelLeft.setOffset(labelDimension[1]);
        this.labelRight.setOffset(labelDimension[1]);
      } else {
        labelDimension = this.labelLeft.getDimension(createSurface);
        this.labelLeft.setOffset(labelDimension[1] / 2);
        labelDimension = this.labelLeft.getDimension(createSurface);
        this.labelRight.setOffset(labelDimension[1] / 2);
      }
    }

    return super.getDimension(width, height, createSurface);
  }

  /**
   * Adds the default label.
   */
  protected addDefaultLabel(): void {
    if (this.isDefaultEanLabelEnabled()) {
      this.processChecksum();
      if (this.checksumValue === null) {
        throw new Error();
      }

      const label = this.getLabel();
      if (label === null) {
        throw new Error();
      }

      const font = this.font;

      this.labelLeft = new BCGLabel(label.substring(0, 1), font, BCGLabel.Position.Left, BCGLabel.Alignment.Bottom);
      this.labelLeft.setSpacing(4 * this.scale);

      this.labelCenter1 = new BCGLabel(label.substring(1, 6), font, BCGLabel.Position.Bottom, BCGLabel.Alignment.Left);
      this.labelCenter2 = new BCGLabel(label.substring(6, 11), font, BCGLabel.Position.Bottom, BCGLabel.Alignment.Left);

      this.labelRight = new BCGLabel(this.keys[this.checksumValue[0]], font, BCGLabel.Position.Right, BCGLabel.Alignment.Bottom);
      this.labelRight.setSpacing(4 * this.scale);

      this.addLabel(this.labelLeft);
      this.addLabel(this.labelCenter1);
      this.addLabel(this.labelCenter2);
      this.addLabel(this.labelRight);
    }
  }

  /**
   * Check correct length.
   */
  protected checkCorrectLength(): void {
    // If we have 12 chars, just flush the last one without throwing anything
    const c = this.text.length;
    if (c === 12) {
      this.text = this.text.substring(0, 11);
    } else if (c !== 11) {
      throw new BCGParseException('Upca', 'Must contain 11 digits, the 12th digit is automatically added.');
    }
  }
}

export { BCGupca };
