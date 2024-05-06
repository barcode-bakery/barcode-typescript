'use client';

import { BCGisbn } from '@barcode-bakery/barcode-1d';
import { Barcode1DProps, useCanvasDisplay } from '@barcode-bakery/barcode-react-common';

export interface BCGisbnProps extends Barcode1DProps {
  gs1?: BCGisbn.GS1;
  text: string;
}

export function BakeryIsbn({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  thickness,
  label,
  font,
  displayChecksum,
  gs1,
  text
}: Readonly<BCGisbnProps>) {
  const { component } = useCanvasDisplay(
    BCGisbn,
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

      if (gs1 !== undefined) {
        code.setGS1(gs1);
      }

      code.parse(text);
    },
    [scale, thickness, backgroundColor, foregroundColor, font, label, displayChecksum, offsetX, offsetY, gs1, text]
  );

  return component;
}
