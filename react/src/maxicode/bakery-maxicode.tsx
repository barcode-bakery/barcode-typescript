'use client';

import { BCGmaxicode } from '@barcode-bakery/barcode-maxicode';
import { useCanvasDisplay } from '../common/canvas-hook';
import { BakeryBarcode2DProps } from '../common/models/barcode-2d-props';

export interface BakeryMaxicodeProps extends BakeryBarcode2DProps {
  quietZone?: boolean;
  mode?: number;
  acceptECI?: boolean;
  text: string;
}

export function BakeryMaxicode({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  quietZone,
  mode,
  acceptECI,
  text
}: Readonly<BakeryMaxicodeProps>) {
  const { component } = useCanvasDisplay(
    BCGmaxicode,
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

      if (mode !== undefined) {
        code.setMode(mode);
      }

      if (acceptECI !== undefined) {
        code.setAcceptECI(acceptECI);
      }

      code.parse(text);
    },
    [scale, foregroundColor, backgroundColor, offsetX, offsetY, quietZone, mode, acceptECI, text]
  );

  return component;
}
