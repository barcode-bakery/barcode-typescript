'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */

import { BCGBarcode } from './BCGBarcode';
import { BCGColor } from './BCGColor';
import { BCGFont } from './BCGFont';
import { setFont } from './Utility';
import { Surface, imagefilledrectangle } from './draw';

export interface BCGDrawingOptions {
  /**
   * By setting to true, the owner of the surface is responsible to resize it correctly before drawing.
   * Otherwise, the surface will not be correct.
   * This defaults to false.
   */
  skipResizingSurface?: boolean;

  /**
   * By setting to true, if an exception happens, it will be thrown.
   * Otherwise, it will be drawn.
   * The canvas will be resized accordingly, regardless of the @see BCGDrawingOptions.skipResizingSurface setting.
   * This defaults to false.
   */
  throwException?: boolean;
}

class BCGDrawing {
  private surface?: Surface;
  private readonly createSurface: (width: number, height: number) => Surface;
  private dpi: number | null = null;
  private rotateDegree = 0.0;
  private backgroundColor = new BCGColor(0xffffff);

  /**
   * Creates a drawing surface by indicating its background color.
   *
   * @param barcode The barcode.
   * @param Color The background color.
   */
  constructor(surface: Surface, color?: BCGColor | null);
  constructor(createSurface: (width: number, height: number) => Surface, color?: BCGColor | null);
  constructor(surfaceOrCreateSurface: Surface | ((width: number, height: number) => Surface), color?: BCGColor | null) {
    if (typeof surfaceOrCreateSurface === 'function') {
      this.createSurface = surfaceOrCreateSurface;
    } else {
      this.surface = surfaceOrCreateSurface;
      this.createSurface = surfaceOrCreateSurface.createSurface;
    }

    this.backgroundColor = color ?? this.backgroundColor;
  }

  /**
   * Gets the image resource.
   *
   * @return The surface abstraction where the barcode is drawn.
   */
  getImage(): Surface | null {
    return this.surface ?? null;
  }

  /**
   * Gets the DPI for supported filetype.
   *
   * @return The DPI.
   */
  getDPI(): number | null {
    return this.dpi;
  }

  /**
   * Sets the DPI for supported filetype.
   *
   * @param dpi The DPI.
   */
  setDPI(dpi: number): void {
    this.dpi = dpi;
  }

  /**
   * Gets the rotation angle in degree. The rotation is clockwise.
   *
   * @return The rotation angle.
   */
  getRotationAngle(): number {
    return this.rotateDegree;
  }

  /**
   * Sets the rotation angle in degree. The rotation is clockwise.
   *
   * @param degree Rotation angle in degree.
   */
  setRotationAngle(degree: number | string): void {
    this.rotateDegree = parseFloat(degree?.toString());
  }

  draw(barcode: BCGBarcode, options?: BCGDrawingOptions): void {
    try {
      const [width, height] = barcode.getDimension(0, 0, this.createSurface);
      this.surface = this.changeSurfaceSize(this.surface ?? this.createSurface(width, height), width, height, options);
      this.prepareSurface(this.surface, width, height);

      barcode.draw(this.surface);
    } catch (ex) {
      if (options?.throwException) {
        throw ex;
      }

      this.drawException(ex);
    }
  }

  private changeSurfaceSize(surface: Surface, width: number, height: number, options?: BCGDrawingOptions): Surface {
    if (!options || !options.skipResizingSurface) {
      surface.context.canvas.width = width;
      surface.context.canvas.height = height;
    }

    return surface;
  }

  private prepareSurface(surface: Surface, width: number, height: number): void {
    imagefilledrectangle(surface, 0, 0, width - 1, height - 1, this.backgroundColor.allocate(surface));
  }

  /**
   * Writes the Error on the picture.
   *
   * @param Exception $exception
   */
  public drawException(exception: unknown): void {
    let message = '';
    if (exception instanceof Error) {
      message = exception.message;
    }

    if (!message) {
      message = 'No barcode available';
    }

    const temporarySurface = this.createSurface(1, 1);
    setFont(temporarySurface, 'Arial', '14pt');
    const box = temporarySurface.context.measureText(message);
    const width = box.actualBoundingBoxRight - box.actualBoundingBoxLeft + 1;
    const height = box.actualBoundingBoxAscent + box.actualBoundingBoxDescent + 1;

    const surface = this.changeSurfaceSize(this.surface ?? this.createSurface(width, height), width, height, undefined);
    this.prepareSurface(surface, width, height);

    const font = new BCGFont('Arial', 14);
    font.setText(message);
    font.setRotationAngle(this.getRotationAngle());
    font.draw(surface, 0, 0);
  }
}

namespace BCGDrawing {
  export enum ImageFormat {
    Png = 1,
    Jpeg,
    Gif,
    Wbmp
    //Svg
  }
}

export { BCGDrawing };
