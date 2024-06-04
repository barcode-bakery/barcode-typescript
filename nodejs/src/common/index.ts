import { BCGDrawException, BCGDrawing, draw } from '@barcode-bakery/barcode-common';
import canvas, { Canvas } from 'canvas';
import { writeFile, writeFileSync } from 'fs';

export interface SaveOptions {
  format: BCGDrawing.ImageFormat;
}

export const createSurface = (width: number, height: number): draw.Surface => {
  const c = canvas.createCanvas(width, height);
  return {
    context: c.getContext('2d')!,
    createSurface
  };
};

export function toBuffer(drawing: BCGDrawing, format: BCGDrawing.ImageFormat): Buffer;
export function toBuffer(drawing: BCGDrawing, format: BCGDrawing.ImageFormat, callback?: (err: Error | null, data: Buffer) => void): void;
export function toBuffer(
  drawing: BCGDrawing,
  format: BCGDrawing.ImageFormat,
  callback?: (err: Error | null, data: Buffer) => void
): Buffer | void {
  const surface = drawing.getImage();
  if (!surface) {
    throw new BCGDrawException('We do not have a drawing surface.');
  }

  const drawer = getDrawerFromFormat(format, surface);
  return drawer.toBuffer(callback);
}

export function save(drawing: BCGDrawing, fileName: string, callback?: (err: NodeJS.ErrnoException | null) => void): void;
export function save(
  drawing: BCGDrawing,
  fileName: string,
  format: BCGDrawing.ImageFormat,
  callback?: (err: NodeJS.ErrnoException | null) => void
): void;
export function save(
  drawing: BCGDrawing,
  fileName: string,
  arg2?: ((err: NodeJS.ErrnoException | null) => void) | BCGDrawing.ImageFormat,
  callback?: (err: NodeJS.ErrnoException | null) => void
): void {
  const surface = drawing.getImage();
  if (!surface) {
    throw new BCGDrawException('We do not have a drawing surface.');
  }

  let format: BCGDrawing.ImageFormat;
  if (typeof arg2 === 'function') {
    callback = arg2;
    arg2 = undefined;
  }

  if (typeof arg2 !== 'function' && arg2) {
    format = arg2;
  } else {
    format = getFormatFromFileName(fileName);
  }

  const drawer = getDrawerFromFormat(format, surface); // !Done in draw.
  drawer.toFile(fileName, callback);
}

const getFormatFromFileName = (fileName: string): BCGDrawing.ImageFormat => {
  const extension = getExtension(fileName).toUpperCase();
  switch (extension) {
    case '.PNG':
      return BCGDrawing.ImageFormat.Png;
    case '.JPG':
    case '.JPEG':
      return BCGDrawing.ImageFormat.Jpeg;
    case '.GIF':
      return BCGDrawing.ImageFormat.Gif;

    // Not supported yet.
    //case '.SVG':
    //    return BCGDrawing.ImageFormat.Svg;
  }

  throw new BCGDrawException('The format cannot be found based on the filename, specify a format.');
};

const getExtension = (fileName: string): string => {
  const i = fileName.lastIndexOf('.');
  return i < 0 ? '' : fileName.substring(i);
};

const getDrawerFromFormat = (format: BCGDrawing.ImageFormat, image: draw.Surface): Draw => {
  switch (format) {
    case BCGDrawing.ImageFormat.Png:
      return new Draw(image, 'image/png');
    case BCGDrawing.ImageFormat.Jpeg:
      return new Draw(image, 'image/jpeg');
    default:
      throw new BCGDrawException('There are no drawers for this format.');
  }
};

type SupportedMimeType = 'image/png' | 'image/jpeg';

class Draw {
  constructor(
    private readonly surface: draw.Surface,
    private readonly mimeType: SupportedMimeType
  ) {}

  toFile(fileName: string, callback?: (err: NodeJS.ErrnoException | null) => void): void {
    const canvas = this.surface.context.canvas as Canvas;
    const mimeType = this.mimeType;

    if (callback) {
      // TypeScript is picky?
      if (mimeType === 'image/png') {
        canvas.toBuffer((err: Error | null, data: Buffer) => {
          writeFile(fileName, data, 'utf8', callback);
        }, mimeType);
      } else {
        canvas.toBuffer((err: Error | null, data: Buffer) => {
          writeFile(fileName, data, 'utf8', callback);
        }, mimeType);
      }
    } else {
      // TypeScript is picky?
      if (mimeType === 'image/png') {
        writeFileSync(fileName, canvas.toBuffer(mimeType), 'utf8');
      } else {
        writeFileSync(fileName, canvas.toBuffer(mimeType), 'utf8');
      }
    }
  }

  toBuffer(callback?: (err: Error | null, data: Buffer) => void): void;
  toBuffer(): Buffer;
  toBuffer(callback?: (err: Error | null, data: Buffer) => void): Buffer | void {
    const canvas = this.surface.context.canvas as Canvas;
    const mimeType = this.mimeType;

    if (callback) {
      if (mimeType === 'image/png') {
        canvas.toBuffer(callback, mimeType);
      } else {
        canvas.toBuffer(callback, mimeType);
      }
    } else {
      if (mimeType === 'image/png') {
        return canvas.toBuffer(mimeType);
      } else {
        return canvas.toBuffer(mimeType);
      }
    }
  }
}

export {
  BCGDrawing,
  BCGBarcode1D,
  BCGBarcode2D,
  BCGColor,
  BCGBarcode,
  BCGDataInput,
  BCGLabel,
  BCGFont,
  BCGArgumentException,
  BCGDrawException,
  BCGParseException
} from '@barcode-bakery/barcode-common';
