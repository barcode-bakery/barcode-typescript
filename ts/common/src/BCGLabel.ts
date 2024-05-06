'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGArgumentException } from './BCGArgumentException';
import { BCGFont } from './BCGFont';
import { BCGColor } from './BCGColor';
import * as draw from './draw';

class BCGLabel {
  private font = new BCGFont('Arial', 12);
  private text = '';
  private position = BCGLabel.Position.Bottom;
  private alignment = BCGLabel.Alignment.Center;
  private offset = 0;
  private spacing = 4;
  private rotationAngle = 0;
  private backgroundColor = new BCGColor(0xffffff);
  private foregroundColor = new BCGColor(0x000000);

  /**
   * Constructor.
   *
   * @param text The text.
   * @param font The font.
   * @param position The position.
   * @param alignment The alignment.
   */
  constructor(
    text: string = '',
    font: BCGFont | null = null,
    position: BCGLabel.Position = BCGLabel.Position.Bottom,
    alignment: BCGLabel.Alignment = BCGLabel.Alignment.Center
  ) {
    if (font != null) {
      this.setFont(font);
    }

    this.setText(text);
    this.setPosition(position);
    this.setAlignment(alignment);
    this.setSpacing(4);
  }

  /**
   * Gets the text.
   *
   * @return The text.
   */
  getText(): string {
    return this.font.getText();
  }

  /**
   * Sets the text.
   *
   * @param text The text.
   */
  setText(text: string): void {
    this.text = text;
    this.font.setText(this.text);
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
    if (font === null) {
      throw new BCGArgumentException('Font cannot be null.', 'font');
    }

    this.font = font.clone();
    this.font.setText(this.text);
    this.font.setRotationAngle(this.rotationAngle);
    this.font.setBackgroundColor(this.backgroundColor);
    this.font.setForegroundColor(this.foregroundColor);
  }

  /**
   * Gets the text position for drawing.
   *
   * @return The position.
   */
  getPosition(): BCGLabel.Position {
    return this.position;
  }

  /**
   * Sets the text position for drawing.
   *
   * @param position The position.
   */
  setPosition(position: BCGLabel.Position): void {
    if (
      position !== BCGLabel.Position.Top &&
      position !== BCGLabel.Position.Right &&
      position !== BCGLabel.Position.Bottom &&
      position !== BCGLabel.Position.Left
    ) {
      throw new BCGArgumentException('The text position must be one of a valid value.', 'position');
    }

    this.position = position;
  }

  /**
   * Gets the text alignment for drawing.
   *
   * @return The alignment.
   */
  getAlignment(): BCGLabel.Alignment {
    return this.alignment;
  }

  /**
   * Sets the text alignment for drawing.
   *
   * @param alignment The alignment.
   */
  setAlignment(alignment: BCGLabel.Alignment): void {
    if (
      alignment !== BCGLabel.Alignment.Left &&
      alignment !== BCGLabel.Alignment.Top &&
      alignment !== BCGLabel.Alignment.Center &&
      alignment !== BCGLabel.Alignment.Right &&
      alignment !== BCGLabel.Alignment.Bottom
    ) {
      throw new BCGArgumentException('The text alignment must be one of a valid value.', 'alignment');
    }

    this.alignment = alignment;
  }

  /**
   * Gets the offset.
   *
   * @return The offset.
   */
  getOffset(): number {
    return this.offset;
  }

  /**
   * Sets the offset.
   *
   * @param offset The offset.
   */
  setOffset(offset: number | string): void {
    this.offset = parseInt(offset.toString(), 10);
  }

  /**
   * Gets the spacing.
   *
   * @return The spacing.
   */
  getSpacing(): number {
    return this.spacing;
  }

  /**
   * Sets the spacing.
   *
   * @param spacing The spacing.
   */
  setSpacing(spacing: number | string): void {
    this.spacing = Math.max(0, parseInt(spacing?.toString(), 10));
  }

  /**
   * Gets the rotation angle in degree.
   *
   * @return The rotation angle.
   */
  getRotationAngle(): number {
    return this.font.getRotationAngle();
  }

  /**
   * Sets the rotation angle in degree.
   *
   * @param rotationAngle The rotation angle.
   */
  setRotationAngle(rotationAngle: number | string): void {
    this.rotationAngle = parseInt(rotationAngle.toString(), 10);
    this.font.setRotationAngle(this.rotationAngle);
  }

  /**
   * Gets the background color in case of rotation.
   *
   * @return The background color.
   */
  getBackgroundColor(): BCGColor {
    return this.backgroundColor;
  }

  /**
   * Sets the background color in case of rotation.
   *
   * @param backgroundColor The background color.
   */
  setBackgroundColor(backgroundColor: BCGColor): void {
    this.backgroundColor = backgroundColor;
    this.font.setBackgroundColor(this.backgroundColor);
  }

  /**
   * Gets the foreground color.
   *
   * @return The foreground color.
   */
  getForegroundColor(): BCGColor {
    return this.foregroundColor;
  }

  /**
   * Sets the foreground color.
   *
   * @param foregroundColor The foreground color.
   */
  setForegroundColor(foregroundColor: BCGColor): void {
    this.foregroundColor = foregroundColor;
    this.font.setForegroundColor(this.foregroundColor);
  }

  /**
   * Gets the dimension taken by the label, including the spacing and offset.
   * [0]: width
   * [1]: height
   *
   * @return The dimension.
   */
  getDimension(createSurface: draw.CreateSurface): [number, number] {
    let w = 0;
    let h = 0;

    const dimension = this.font.getDimension(createSurface);
    w = dimension[0];
    h = dimension[1];

    if (this.position === BCGLabel.Position.Top || this.position === BCGLabel.Position.Bottom) {
      h += this.spacing;
      w += Math.max(0, this.offset);
    } else {
      w += this.spacing;
      h += Math.max(0, this.offset);
    }

    return [w, h];
  }

  /**
   * Draws the text.
   * The coordinate passed are the positions of the barcode.
   * x1 and y1 represent the top left corner.
   * x2 and y2 represent the bottom right corner.
   *
   * @param image The image.
   * @param x1 X1.
   * @param y1 Y1.
   * @param x2 X2.
   * @param y2 Y2.
   */
  draw(image: draw.Surface, x1: number, y1: number, x2: number, y2: number): void {
    let x = 0;
    let y = 0;

    const fontDimension = this.font.getDimension(image.createSurface);

    if (this.position === BCGLabel.Position.Top || this.position === BCGLabel.Position.Bottom) {
      if (this.position === BCGLabel.Position.Top) {
        y = y1 - this.spacing - fontDimension[1];
      } else if (this.position === BCGLabel.Position.Bottom) {
        y = y2 + this.spacing;
      }

      if (this.alignment === BCGLabel.Alignment.Center) {
        x = (x2 - x1) / 2 + x1 - fontDimension[0] / 2 + this.offset;
      } else if (this.alignment === BCGLabel.Alignment.Left) {
        x = x1 + this.offset;
      } else {
        x = x2 + this.offset - fontDimension[0];
      }
    } else {
      if (this.position === BCGLabel.Position.Left) {
        x = x1 - this.spacing - fontDimension[0];
      } else if (this.position === BCGLabel.Position.Right) {
        x = x2 + this.spacing;
      }

      if (this.alignment === BCGLabel.Alignment.Center) {
        y = (y2 - y1) / 2 + y1 - fontDimension[1] / 2 + this.offset;
      } else if (this.alignment === BCGLabel.Alignment.Top) {
        y = y1 + this.offset;
      } else {
        y = y2 + this.offset - fontDimension[1];
      }
    }

    this.font.setText(this.text);
    this.font.draw(image, x, y);
  }
}

namespace BCGLabel {
  /**
   * The position.
   */
  export enum Position {
    /**
     * Top.
     */
    Top = 0,

    /**
     * Right.
     */
    Right = 1,

    /**
     * Bottom.
     */
    Bottom = 2,

    /**
     * Left.
     */
    Left = 3
  }

  /**
   * The alignement.
   */
  export enum Alignment {
    /**
     * Left, when used horizontally.
     */
    Left = 0,

    /**
     * Top, when used vertically.
     */
    Top,

    /**
     * Center.
     */
    Center,

    /**
     * Right, when used horizontally.
     */
    Right,

    /**
     * Bottom, when used vertically.
     */
    Bottom
  }
}

export { BCGLabel };

BCGLabel.Position.Bottom;
