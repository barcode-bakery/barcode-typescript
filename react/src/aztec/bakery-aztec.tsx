'use client';

import { BCGaztec } from '@barcode-bakery/barcode-aztec';
import { useCanvasDisplay } from '../common/canvas-hook';
import { Barcode2DProps } from '../common/models/barcode-2d-props';

export interface BCGaztecProps extends Barcode2DProps {
  errorLevel?: number;
  size?: BCGaztec.Size;
  tilde?: boolean;
  rune?: number;
  text: string;
}

export function BakeryAztec({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  errorLevel,
  size,
  tilde,
  rune,
  text
}: Readonly<BCGaztecProps>) {
  const { component } = useCanvasDisplay(
    BCGaztec,
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

      if (errorLevel !== undefined) {
        code.setErrorLevel(errorLevel);
      }

      if (size !== undefined) {
        code.setSize(size);
      }

      if (tilde !== undefined) {
        code.setTilde(tilde);
      }

      if (rune !== undefined) {
        code.setRune(rune);
      }

      code.parse(text);
    },
    [scale, foregroundColor, backgroundColor, offsetX, offsetY, errorLevel, size, tilde, rune, text]
  );

  return component;
}
