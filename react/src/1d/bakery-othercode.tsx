'use client';

import { BCGothercode } from '@barcode-bakery/barcode-1d';
import { useCanvasDisplay } from '../common/canvas-hook';
import { BakeryBarcode1DProps } from '../common/models/barcode-1d-props';

export interface BakeryOthercodeProps extends BakeryBarcode1DProps {
  text: string;
}

export function BakeryOthercode({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  thickness,
  label,
  font,
  displayChecksum,
  text
}: Readonly<BakeryOthercodeProps>) {
  const { component } = useCanvasDisplay(
    BCGothercode,
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

      if (thickness !== undefined) {
        code.setThickness(thickness);
      }

      if (label !== undefined) {
        code.setLabel(label);
      }

      if (font !== undefined) {
        code.setFont(font);
      }

      if (displayChecksum !== undefined) {
        code.setDisplayChecksum(displayChecksum);
      }

      code.parse(text);
    },
    [scale, thickness, backgroundColor, foregroundColor, font, label, displayChecksum, offsetX, offsetY, text]
  );

  return component;
}
