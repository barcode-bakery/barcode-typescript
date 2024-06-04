'use client';

import { BCGcode39extended } from '@barcode-bakery/barcode-1d';
import { useCanvasDisplay } from '../common/canvas-hook';
import { BCGcode39Props } from './bakery-code39';

export interface BCGcode39extendedProps extends BCGcode39Props {
  text: string;
}

export function BakeryCode39Extended({
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
}: Readonly<BCGcode39extendedProps>) {
  const { component } = useCanvasDisplay(
    BCGcode39extended,
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

      code.parse(text);
    },
    [scale, thickness, backgroundColor, foregroundColor, font, label, displayChecksum, offsetX, offsetY, checksum, text]
  );

  return component;
}
