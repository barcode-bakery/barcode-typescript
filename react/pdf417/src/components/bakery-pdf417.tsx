'use client';

import { BCGpdf417 } from '@barcode-bakery/barcode-pdf417';
import { Barcode2DProps, useCanvasDisplay } from '@barcode-bakery/barcode-react-common';

export interface BCGpdf417Props extends Barcode2DProps {
  quietZone?: boolean;
  compact?: boolean;
  column?: number | string;
  errorLevel?: number | string;
  ratio?: number | string;
  text: string;
}

export function BakeryPdf417({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  quietZone,
  compact,
  column,
  errorLevel,
  ratio,
  text
}: Readonly<BCGpdf417Props>) {
  const { component } = useCanvasDisplay(
    BCGpdf417,
    code => {
      if (scale !== undefined) {
        code.setScale(scale);
      }

      if (foregroundColor !== undefined) {
        code.setForegroundColor(foregroundColor);
      }

      if (backgroundColor !== undefined) {
        code.setBackgroundColor(backgroundColor);
      }

      if (offsetX !== undefined) {
        code.setOffsetX(offsetX);
      }

      if (offsetY !== undefined) {
        code.setOffsetY(offsetY);
      }

      if (quietZone !== undefined) {
        code.setQuietZone(quietZone);
      }

      if (compact !== undefined) {
        code.setCompact(compact);
      }

      if (column !== undefined) {
        code.setColumn(column);
      }

      if (errorLevel !== undefined) {
        code.setErrorLevel(errorLevel);
      }

      if (ratio !== undefined) {
        code.setRatio(ratio);
      }

      code.parse(text);
    },
    [scale, foregroundColor, backgroundColor, offsetX, offsetY, quietZone, compact, column, errorLevel, ratio, text]
  );

  return component;
}
