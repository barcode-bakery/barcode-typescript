'use client';

import { BCGdatabarexpanded } from '@barcode-bakery/barcode-databarexpanded';
import { Barcode2DProps, useCanvasDisplay } from '@barcode-bakery/barcode-react-common';

export interface BCGdatabarexpandedProps extends Barcode2DProps {
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
}: Readonly<BCGdatabarexpandedProps>) {
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
