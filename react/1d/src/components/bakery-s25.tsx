'use client';

import { BCGs25 } from '@barcode-bakery/barcode-1d';
import { Barcode1DProps, useCanvasDisplay } from '@barcode-bakery/barcode-react-common';

export interface BCGs25Props extends Barcode1DProps {
  checksum?: boolean;
  text: string;
}

export function BakeryS25({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  thickness,
  label,
  font,
  displayChecksum,
  checksum,
  text
}: Readonly<BCGs25Props>) {
  const { component } = useCanvasDisplay(
    BCGs25,
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
    [scale, thickness, backgroundColor, foregroundColor, font, label, displayChecksum, offsetX, offsetY, checksum, text]
  );

  return component;
}
