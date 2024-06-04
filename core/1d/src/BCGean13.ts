'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode, BCGBarcode1D, BCGLabel, BCGParseException, Utility, draw } from '@barcode-bakery/barcode-common';

/**
 * EAN-13.
 */
class BCGean13 extends BCGBarcode1D {
  /**
   * Holds the data about the code parity.
   */
  protected codeParity: number[][];

  /**
   * The label on the left.
   */
  protected labelLeft: BCGLabel | null = null;

  /**
   * The label on the left center.
   */
  protected labelCenter1: BCGLabel | null = null;

  /**
   * The label on the right center.
   */
  protected labelCenter2: BCGLabel | null = null;

  /**
   * Indicates if we align the default labels.
   */
  protected alignLabel = false;

  /**
   * Indicates if we need to handle the labels.
   * If a child class has done it, then we will skip it.
   * TS only.
   */
  protected handleLabel = true;

  /**
   * Creates an EAN-13 barcode.
   */
  constructor() {
    super();
    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Left-Hand Odd Parity starting with a space
    // Left-Hand Even Parity is the inverse (0=0012) starting with a space
    // Right-Hand is the same of Left-Hand starting with a bar
    this.code = [
      '2100' /* 0 */,
      '1110' /* 1 */,
      '1011' /* 2 */,
      '0300' /* 3 */,
      '0021' /* 4 */,
      '0120' /* 5 */,
      '0003' /* 6 */,
      '0201' /* 7 */,
      '0102' /* 8 */,
      '2001' /* 9 */
    ];

    // Parity, 0=Odd, 1=Even for manufacturer code. Depending on 1st System Digit
    this.codeParity = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 1],
      [0, 1, 1, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1],
      [1, 1, 1, 0, 0],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0],
      [1, 1, 0, 1, 0] /* 9 */
    ];

    this.alignDefaultLabel(true);
  }

  /**
   * Aligns the default label.
   *
   * @param align Aligns the label.
   */
  alignDefaultLabel(align: boolean): void {
    this.alignLabel = !!align;
  }

  /**
   * Draws the barcode.
   *
   * @param image The surface.
   */
  draw(image: draw.Surface): void {
    this.drawBars(image);
    this.drawText(image, 0, 0, this.positionX, this.thickness);

    if (this.isDefaultEanLabelEnabled()) {
      if (this.labelCenter1 === null) {
        throw new Error();
      }

      const dimension = this.labelCenter1.getDimension(image.createSurface);
      this.drawExtendedBars(image, dimension[1] - 2);
    }
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
    const startlength = 3;
    const centerlength = 5;
    const textlength = 12 * 7;
    const endlength = 3;

    if (this.handleLabel && createSurface && this.labelLeft && this.labelCenter1 && this.labelCenter2) {
      const labelCenter1Dimension = this.labelCenter1.getDimension(createSurface);
      this.labelCenter1.setOffset((this.scale * 44 - labelCenter1Dimension[0]) / 2 + this.scale * 2);
      this.labelCenter2.setOffset((this.scale * 44 - labelCenter1Dimension[0]) / 2 + this.scale * 48);

      if (this.alignLabel) {
        const labelDimension = this.labelCenter1.getDimension(createSurface);
        this.labelLeft.setOffset(labelDimension[1]);
      } else {
        const labelDimension = this.labelLeft.getDimension(createSurface);
        this.labelLeft.setOffset(labelDimension[1] / 2);
      }
    }

    width += startlength + centerlength + textlength + endlength;
    height += this.thickness;
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

      this.labelCenter1 = new BCGLabel(label.substring(1, 7), font, BCGLabel.Position.Bottom, BCGLabel.Alignment.Left);
      this.labelCenter2 = new BCGLabel(
        label.substring(7, 12) + this.keys[this.checksumValue[0]],
        font,
        BCGLabel.Position.Bottom,
        BCGLabel.Alignment.Left
      );

      this.addLabel(this.labelLeft);
      this.addLabel(this.labelCenter1);
      this.addLabel(this.labelCenter2);
    }
  }

  /**
   * Checks if the default ean label is enabled.
   *
   * @return True if default label is enabled.
   */
  protected isDefaultEanLabelEnabled(): boolean {
    const label = this.getLabel();
    const font = this.font;
    return label !== null && label !== '' && font !== null && this.defaultLabel !== null;
  }

  /**
   * Validates the input.
   */
  protected validate(): void {
    const c = this.text.length;
    if (c === 0) {
      throw new BCGParseException('Ean13', 'No data has been entered.');
    }

    this.checkCharsAllowed();
    this.checkCorrectLength();

    super.validate();
  }

  /**
   * Check chars allowed.
   */
  protected checkCharsAllowed(): void {
    // Checking if all chars are allowed
    const c = this.text.length;
    for (let i = 0; i < c; i++) {
      if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
        throw new BCGParseException('Ean13', "The character '" + this.text[i] + "' is not allowed.");
      }
    }
  }

  /**
   * Check correct length.
   */
  protected checkCorrectLength(): void {
    // If we have 13 chars, just flush the last one without throwing anything
    const c = this.text.length;
    if (c === 13) {
      this.text = this.text.substring(0, 12);
    } else if (c !== 12) {
      throw new BCGParseException('Ean13', 'Must contain 12 digits, the 13th digit is automatically added.');
    }
  }

  /**
   * Overloaded method to calculate checksum.
   */
  _calculateChecksum(): void {
    // Calculating Checksum
    // Consider the right-most digit of the message to be in an "odd" position,
    // and assign odd/even to each character moving from right to left
    // Odd Position = 3, Even Position = 1
    // Multiply it by the number
    // Add all of that and do 10-(?mod10)
    let odd = true;
    this.checksumValue = [0];
    const c = this.text.length;
    let multiplier;
    for (let i = c; i > 0; i--) {
      if (odd === true) {
        multiplier = 3;
        odd = false;
      } else {
        multiplier = 1;
        odd = true;
      }

      if (Utility.arraySearch(this.keys, this.text[i - 1]) === -1) {
        return;
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
   * Draws the bars.
   *
   * @param image The surface.
   */
  drawBars(image: draw.Surface): void {
    // Checksum
    this._calculateChecksum();
    if (this.checksumValue === null) {
      throw new Error();
    }

    const temptext = this.text + this.keys[this.checksumValue[0]];

    // Starting Code
    this.drawChar(image, '000', true);

    // Draw Second Code
    this.drawChar(image, this.findCode(temptext[1])!, false); // !It has been validated

    // Draw Manufacturer Code
    for (let i = 0; i < 5; i++) {
      this.drawChar(image, BCGean13.inverse(this.findCode(temptext[i + 2])!, this.codeParity[parseInt(temptext[0], 10)][i]), false); // !It has been validated
    }

    // Draw Center Guard Bar
    this.drawChar(image, '00000', false);

    // Draw Product Code
    for (let i = 7; i < 13; i++) {
      this.drawChar(image, this.findCode(temptext[i])!, true); // !It has been validated
    }

    // Draw Right Guard Bar
    this.drawChar(image, '000', true);
  }

  /**
   * Draws the extended bars on the image.
   *
   * @param image The surface.
   * @param plus How much more we should display the bars.
   */
  protected drawExtendedBars(image: draw.Surface, plus: number): void {
    const rememberX = this.positionX;
    const rememberH = this.thickness;

    // We increase the bars
    this.thickness = this.thickness + parseInt((plus / this.scale).toString(), 10);
    this.positionX = 0;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);
    this.positionX += 2;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);

    // Center Guard Bar
    this.positionX += 44;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);
    this.positionX += 2;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);

    // Last Bars
    this.positionX += 44;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);
    this.positionX += 2;
    this.drawSingleBar(image, BCGBarcode.COLOR_FG);

    this.positionX = rememberX;
    this.thickness = rememberH;
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

export { BCGean13 };
