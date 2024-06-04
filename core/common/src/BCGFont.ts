'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { setFont, setColor } from './Utility';
import { BCGColor } from './BCGColor';
import * as draw from './draw';

class BCGFont {
  private text = '';
  private foregroundColor = new BCGColor(0x000000);
  private size: string;
  private rotationAngle = 0;
  private box: draw.TextMetrics | null = null;

  /**
   * Constructor.
   *
   * @param font The font family.
   * @param size The size in point. size in point
   */
  constructor(
    private font: string,
    size: number | string
  ) {
    this.size = typeof size === 'number' ? size + 'pt' : size;
  }

  /**
   * Gets the text associated to the font.
   *
   * @return The text.
   */
  getText(): string {
    return this.text;
  }

  /**
   * Sets the text associated to the font.
   *
   * @param text The text.
   */
  setText(text: string): void {
    this.text = text;
    this.box = null;
  }

  /**
   * Gets the rotation in degree.
   *
   * @return The rotation angle.
   */
  getRotationAngle(): number {
    return this.rotationAngle % 360;
  }

  /**
   * Sets the rotation in degree.
   *
   * @param rotationAngle The rotation angle.
   */
  setRotationAngle(rotationDegree: number | string): void {
    this.rotationAngle = parseInt(rotationDegree.toString(), 10);
    if (this.rotationAngle !== 90 && this.rotationAngle !== 180 && this.rotationAngle !== 270) {
      this.rotationAngle = 0;
    }

    this.rotationAngle = this.rotationAngle % 360;

    this.box = null;
  }

  /**
   * Gets the background color.
   *
   * @return The background color.
   */
  getBackgroundColor(): BCGColor | null {
    return null;
  }

  /**
   * Sets the background color.
   *
   * @param _backgroundColor The background color.;
   */
  setBackgroundColor(_backgroundColor: BCGColor | null): void {}

  /**
   * Gets the foreground color.
   *
   * @return Color
   */
  getForegroundColor(): BCGColor {
    return this.foregroundColor;
  }

  /**
   * Sets the foregroung color.
   *
   * @param Color $foregroundColor
   */
  setForegroundColor(foregroundColor: BCGColor): void {
    this.foregroundColor = foregroundColor;
  }

  /**
   * Returns the width and height that the text takes to be written.
   *
   * @return The dimension.
   */
  getDimension(createSurface: draw.CreateSurface): [number, number] {
    let w = 0.0,
      h = 0.0;
    const box = this.getBox(createSurface);

    w = box.actualBoundingBoxRight - box.actualBoundingBoxLeft + 1;
    h = box.actualBoundingBoxAscent + box.actualBoundingBoxDescent + 1;

    const rotationAngle = this.getRotationAngle();
    if (rotationAngle === 90 || rotationAngle === 270) {
      return [h, w];
    } else {
      return [w, h];
    }
  }

  /**
   * Draws the text on the image at a specific position.
   * $x and $y represent the left bottom corner.
   *
   * @param image The image.
   * @param x X.
   * @param y Y.
   */
  draw(image: draw.Surface, x: number, y: number): void {
    const drawingPosition = this.getDrawingPosition(image.createSurface, x, y);
    setFont(image, this.font, this.size);
    setColor(image, this.foregroundColor.allocate(image));

    image.context.save();
    image.context.translate(drawingPosition[0], drawingPosition[1]);
    const rotationAngle = this.getRotationAngle();
    image.context.rotate((-rotationAngle * Math.PI) / 180);
    image.context.fillText(this.text, 0, 0);
    image.context.restore();
  }

  private getDrawingPosition(createSurface: draw.CreateSurface, x: number, y: number): number[] {
    const dimension = this.getDimension(createSurface),
      box = this.getBox(createSurface),
      rotationAngle = this.getRotationAngle();
    if (rotationAngle === 0) {
      y += box.actualBoundingBoxAscent;
    } else if (rotationAngle === 90) {
      x += box.actualBoundingBoxAscent;
      y += dimension[1];
    } else if (rotationAngle === 180) {
      x += dimension[0];
      y += box.actualBoundingBoxDescent;
    } else if (rotationAngle === 270) {
      x += box.actualBoundingBoxDescent;
    }

    return [x, y];
  }

  private getBox(createSurface: draw.CreateSurface): draw.TextMetrics {
    if (!this.box) {
      const ctx = draw.imagecreatetruecolor(() => createSurface(1, 1));

      setFont(ctx, this.font, this.size);
      this.box = ctx.context.measureText(this.text);
    }

    return this.box;
  }

  clone(): BCGFont {
    return new BCGFont(this.font, this.size);
  }
}

export { BCGFont };
