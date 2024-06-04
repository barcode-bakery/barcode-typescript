'use strict';

/*!
 * Copyright (C) Jean-Sebastien Goupil
 * http://www.barcodebakery.com
 */
import { setColor } from './Utility';

interface InternalCanvasRenderingContext2D {
  readonly canvas: {
    width: number;
    height: number;
  };
}

interface InternalCanvasRect {
  fillRect(x: number, y: number, w: number, h: number): void;
}

interface InternalCanvasDrawPath {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/beginPath) */
  beginPath(): void;
}

interface InternalCanvasPath {
  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void;
}

type InternalCanvasFillRule = 'evenodd' | 'nonzero';

interface InternalCanvasDrawPath {
  fill(fillRule?: InternalCanvasFillRule): void;
}

interface InternalCanvasState {
  restore(): void;
  save(): void;
}

interface InternalCanvasTransform {
  rotate(angle: number): void;
  translate(x: number, y: number): void;
}

interface InternalCanvasText {
  measureText(text: string): TextMetrics;
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
}

interface InternalCanvasGradient {
  addColorStop(offset: number, color: string): void;
}

interface InternalDOMMatrix2DInit {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  e?: number;
  f?: number;
  m11?: number;
  m12?: number;
  m21?: number;
  m22?: number;
  m41?: number;
  m42?: number;
}

interface InternalCanvasPattern {
  setTransform(transform?: InternalDOMMatrix2DInit): void;
}

interface InternalCanvasFillStrokeStyles {
  fillStyle: string | InternalCanvasGradient | InternalCanvasPattern;
}

interface InternalCanvasTextDrawingStyles {
  font: string;
}

export interface TextMetrics {
  readonly actualBoundingBoxAscent: number;
  readonly actualBoundingBoxDescent: number;
  readonly actualBoundingBoxLeft: number;
  readonly actualBoundingBoxRight: number;
}

type InternalCanvasContext2D = InternalCanvasRenderingContext2D &
  InternalCanvasRect &
  InternalCanvasDrawPath &
  InternalCanvasPath &
  InternalCanvasDrawPath &
  InternalCanvasState &
  InternalCanvasTransform &
  InternalCanvasText &
  InternalCanvasFillStrokeStyles &
  InternalCanvasTextDrawingStyles;

export type CreateSurface = (width: number, height: number) => Surface;

export type Surface = {
  context: InternalCanvasContext2D;
  createSurface: CreateSurface;
};

export function imagecreatetruecolor(create: () => Surface): Surface {
  return create();
}

export function imagecolortransparent(
  _image: Surface,
  _allocated: { r: number; g: number; b: number }
): { r: number; g: number; b: number } {
  // TODO
  return { r: 0, g: 0, b: 0 };
}

export function imagedestroy(_image: Surface | null): void {
  // We don't have to do anything here
}

export function imagesx(image: Surface): number {
  return image.context.canvas.width;
}

export function imagesy(image: Surface): number {
  return image.context.canvas.height;
}

export function imagefill(image: Surface, x: number, y: number, color: { r: number; g: number; b: number }): void {
  // We don't use x and y here
  setColor(image, color);
  image.context.fillRect(0, 0, image.context.canvas.width, image.context.canvas.height);
}

export function imagefilledrectangle(
  image: Surface,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: { r: number; g: number; b: number }
): void {
  setColor(image, color);
  image.context.fillRect(x1, y1, x2 - x1 + 1, y2 - y1 + 1);
}

export function imagefillcircle(image: Surface, x: number, y: number, radius: number, color: { r: number; g: number; b: number }): void {
  image.context.beginPath();
  image.context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI, false);
  setColor(image, color);
  image.context.fill();
}

export function imagecolorallocate(image: Surface, red: number, green: number, blue: number): { r: number; g: number; b: number } {
  return { r: red, g: green, b: blue };
}

export function imagecopy(): void {}

export function imagefontwidth(): void {}
export function imagefontheight(): void {}
export function imagestring(): void {}

export abstract class Draw {
  protected image: Surface;
  protected dpi: number | null = null;
  constructor(image: Surface) {
    this.image = image;
  }

  setDPI(dpi: number | string | null): void {
    const temp = parseFloat(dpi?.toString() || '');
    if (!isNaN(temp) && isFinite(temp)) {
      throw new Error('Not yet implemented');
      this.dpi = Math.max(1, temp);
    } else {
      this.dpi = null;
    }
  }
}
