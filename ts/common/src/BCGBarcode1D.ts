'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGArgumentException } from './BCGArgumentException';
import { BCGBarcode } from './BCGBarcode';
import { BCGFont } from './BCGFont';
import { BCGLabel } from './BCGLabel';
import { arraySearch } from './Utility';
import * as draw from './draw';

abstract class BCGBarcode1D extends BCGBarcode {
  /**
   * The value used in the label to mark the usage of the default label.
   */
  public static readonly AUTO_LABEL = '##!!AUTO_LABEL!!##';

  public static readonly SIZE_SPACING_FONT = 5;

  /**
   * Thickness of the barcode (usually the height).
   */
  protected thickness = 30;

  /**
   * Characters that can be displayed in the barcode.
   */
  protected keys: string[] = [];

  /**
   * Code corresponding to the characters.
   */
  protected code: string[] = [];

  /**
   * X Position where we are supposed to draw.
   */
  protected positionX = 0;

  /**
   * The font.
   */
  protected font = new BCGFont('Arial', 8);

  /**
   * The text to parse.
   */
  protected text = '';

  /**
   * The checksum value, if supported.
   */
  protected checksumValue: number[] | null = null;

  /**
   * Indicates if the checksum is displayed.
   */
  protected displayChecksum = false;

  /**
   * Simple label for the barcode.
   */
  protected label: string | null = BCGBarcode1D.AUTO_LABEL;

  /**
   * Default label for the barcode.
   */
  protected defaultLabel: BCGLabel;

  constructor() {
    super();

    this.defaultLabel = new BCGLabel();
    this.defaultLabel.setPosition(BCGLabel.Position.Bottom);
  }

  /**
   * Gets the thickness.
   *
   * @return The thickness.
   */
  getThickness(): number {
    return this.thickness;
  }

  /**
   * Sets the thickness.
   *
   * @param thickness The thickness.
   */
  setThickness(thickness: number | string): void {
    thickness = parseInt(thickness.toString(), 10);
    if (thickness <= 0) {
      throw new BCGArgumentException('The thickness must be larger than 0.', 'thickness');
    }

    this.thickness = thickness;
  }

  /**
   * Gets the label.
   * If the label was set to Barcode1D::AUTO_LABEL, the label will display the value from the text parsed.
   *
   * @return The label.
   */
  getLabel(): string | null {
    let label = this.label;
    if (this.label === BCGBarcode1D.AUTO_LABEL) {
      let checksum: string | null;
      label = this.text;
      if (this.displayChecksum === true && (checksum = this.processChecksum()) !== null) {
        label += checksum;
      }
    }

    return label;
  }

  /**
   * Sets the label.
   * You can use Barcode1D.AUTO_LABEL to have the label automatically written based on the parsed text.
   *
   * @param label The label or Barcode1D.AUTO_LABEL.
   */
  setLabel(label: string | null): void {
    this.label = label;
  }

  /**
   * Gets the font.
   *
   * @return The font.
   */
  getFont(): BCGFont {
    return this.font;
  }

  /**
   * Sets the font.
   *
   * @param font The font.
   */
  setFont(font: BCGFont): void {
    this.font = font;
  }

  /**
   * Parses the text before displaying it.
   *
   * @param string text
   */
  parse(text: string): void {
    this.text = text;
    this.checksumValue = null; // Reset checksumValue
    this.validate();

    this.addDefaultLabel();
  }

  /**
   * Gets the checksum of a Barcode.
   * If no checksum is available, return null.
   *
   * @return The checksum or null.
   */
  getChecksum(): string | null {
    return this.processChecksum();
  }

  /**
   * Sets if the checksum is displayed with the label or not.
   * The checksum must be activated in some case to make this variable effective.
   *
   * @param displayChecksum Toggle to display the checksum on the label.
   */
  setDisplayChecksum(displayChecksum: boolean): void {
    this.displayChecksum = !!displayChecksum;
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
    return super.getDimension(width, height, createSurface);
  }

  /**
   * Returns the maximal size of a barcode.
   * This method exists because some sub-class need to know the base size of the barcode.
   * [0]->width
   * [1]->height
   *
   * @param width The width.
   * @param height The height.
   * @return An array, [0] being the width, [1] being the height.
   */
  get1DDimension(width: number, height: number, createSurface?: draw.CreateSurface): [number, number] {
    return super.getDimension(width, height, createSurface);
  }

  /**
   * Adds the default label.
   */
  protected addDefaultLabel(): void {
    const label = this.getLabel();
    const font = this.font;
    if (label !== null && label !== '' && font !== null && this.defaultLabel !== null) {
      this.defaultLabel.setText(label);
      this.defaultLabel.setFont(font);
      this.addLabel(this.defaultLabel);
    }
  }

  /**
   * Validates the input
   */
  protected validate(): void {
    // No validation in the abstract class.
  }

  /**
   * Returns the index in keys (useful for checksum).
   *
   * @param val The character.
   * @return The position.
   */
  protected findIndex(val: string): number {
    return arraySearch(this.keys, val);
  }

  /**
   * Returns the code of the char (useful for drawing bars).
   *
   * @param val The characer.
   * @return The code.
   */
  protected findCode(val: string): string | null {
    return this.code[this.findIndex(val)];
  }

  /**
   * Draws all chars thanks to code. if startBar is true, the line begins by a space.
   * if start is false, the line begins by a bar.
   *
   * @param image The surface.
   * @param code The code.
   * @param startBar True if we begin with a space.
   */
  protected drawChar(image: draw.Surface, code: string, startBar: boolean = true): void {
    const colors = [BCGBarcode.COLOR_FG, BCGBarcode.COLOR_BG];
    let currentColor = startBar ? 0 : 1;
    const c = code.length;
    for (let i = 0; i < c; i++) {
      for (let j = 0; j < parseInt(code[i], 10) + 1; j++) {
        this.drawSingleBar(image, colors[currentColor]);
        this.nextX();
      }

      currentColor = (currentColor + 1) % 2;
    }
  }

  /**
   * Draws a Bar of color depending of the resolution.
   *
   * @param image The surface.
   * @param color The color.
   */
  protected drawSingleBar(image: draw.Surface, color: number): void {
    this.drawFilledRectangle(image, this.positionX, 0, this.positionX, this.thickness - 1, color);
  }

  /**
   * Moving the pointer right to write a bar.
   */
  protected nextX(): void {
    this.positionX++;
  }

  /**
   * Method that saves null into the checksumValue. This means no checksum
   * but this method should be overriden when needed.
   */
  protected calculateChecksum(): void {
    this.checksumValue = null;
  }

  /**
   * Returns NULL because there is no checksum. This method should be
   * overriden to return correctly the checksum in string with checksumValue.
   *
   * @return string
   */
  protected processChecksum(): string | null {
    return null;
  }
}

export { BCGBarcode1D };
