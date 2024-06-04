'use client';

import { BCGi25 } from '@barcode-bakery/barcode-1d';
import { useCanvasDisplay } from '../common/canvas-hook';
import { Barcode1DProps } from '../common/models/barcode-1d-props';

export interface BCGi25Props extends Barcode1DProps {
  checksum?: boolean;
  ratio?: number | string;
  text: string;
}

export function BakeryI25({
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
  ratio,
  text
}: Readonly<BCGi25Props>) {
  const { component } = useCanvasDisplay(
    BCGi25,
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

      if (checksum !== undefined) {
        code.setChecksum(checksum);
      }

      if (ratio !== undefined) {
        code.setRatio(ratio);
      }

      code.parse(text);
    },
    [scale, thickness, backgroundColor, foregroundColor, font, label, displayChecksum, offsetX, offsetY, checksum, ratio, text]
  );

  return component;
}
