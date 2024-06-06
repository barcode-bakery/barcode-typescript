'use client';

import { BCGdatabarexpanded } from '@barcode-bakery/barcode-databarexpanded';
import { useCanvasDisplay } from '../common/canvas-hook';
import { BakeryBarcode1DProps } from '../common/models/barcode-1d-props';

export interface BakeryDatabarexpandedProps extends BakeryBarcode1DProps {
  linkageFlag?: boolean;
  stacked?: number;
  text: string;
}

export function BakeryDatabarexpanded({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  linkageFlag,
  stacked,
  text
}: Readonly<BakeryDatabarexpandedProps>) {
  const { component } = useCanvasDisplay(
    BCGdatabarexpanded,
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

      if (linkageFlag !== undefined) {
        code.setLinkageFlag(linkageFlag);
      }

      if (stacked !== undefined) {
        code.setStacked(stacked);
      }

      code.parse(text);
    },
    [scale, foregroundColor, backgroundColor, offsetX, offsetY, linkageFlag, stacked, text]
  );

  return component;
}
