'use client';

import { BCGcode128 } from '@barcode-bakery/barcode-1d';
import { BCGDataInput } from '@barcode-bakery/barcode-common';
import { useCanvasDisplay } from '../common/canvas-hook';
import { BakeryBarcode1DProps } from '../common/models/barcode-1d-props';

export interface BakeryCode128Props extends BakeryBarcode1DProps {
  start?: 'A' | 'B' | 'C' | null;
  tilde?: boolean;
  text: BCGDataInput<BCGcode128.Code> | BCGDataInput<BCGcode128.Code>[] | string;
}

export function BakeryCode128({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  thickness,
  label,
  font,
  displayChecksum,
  start,
  tilde,
  text
}: Readonly<BakeryCode128Props>) {
  const { component } = useCanvasDisplay(
    BCGcode128,
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

      if (start !== undefined) {
        code.setStart(start);
      }

      if (tilde !== undefined) {
        code.setTilde(tilde);
      }

      code.parse(text);
    },
    [scale, thickness, backgroundColor, foregroundColor, font, label, displayChecksum, offsetX, offsetY, start, tilde, text]
  );

  return component;
}

BakeryCode128.Code = BCGcode128.Code;
