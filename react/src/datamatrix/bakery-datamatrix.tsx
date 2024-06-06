'use client';

import { BCGdatamatrix } from '@barcode-bakery/barcode-datamatrix';
import { useCanvasDisplay } from '../common/canvas-hook';
import { BakeryBarcode2DProps } from '../common/models/barcode-2d-props';

export interface BakeryDatamatrixProps extends BakeryBarcode2DProps {
  size?: BCGdatamatrix.Size;
  datamatrixSize?: [number, number];
  quietZone?: number;
  tilde?: boolean;
  acceptECI?: boolean;
  fnc1?: BCGdatamatrix.Fnc1;
  encoding?: BCGdatamatrix.Encoding;
  macro?: BCGdatamatrix.Macro;
  text: string;
}

export function BakeryDatamatrix({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  size,
  datamatrixSize,
  quietZone,
  tilde,
  acceptECI,
  fnc1,
  encoding,
  macro,
  text
}: Readonly<BakeryDatamatrixProps>) {
  const { component } = useCanvasDisplay(
    BCGdatamatrix,
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

      if (size !== undefined) {
        code.setSize(size);
      }

      if (datamatrixSize !== undefined) {
        code.setDataMatrixSize(datamatrixSize[0], datamatrixSize[1]);
      }

      if (quietZone !== undefined) {
        code.setQuietZoneSize(quietZone);
      }

      if (tilde !== undefined) {
        code.setTilde(tilde);
      }

      if (acceptECI !== undefined) {
        code.setAcceptECI(acceptECI);
      }

      if (fnc1 !== undefined) {
        code.setFNC1(fnc1);
      }

      if (encoding !== undefined) {
        code.setEncoding(encoding);
      }

      if (macro !== undefined) {
        code.setMacro(macro);
      }

      code.parse(text);
    },
    [
      scale,
      foregroundColor,
      backgroundColor,
      offsetX,
      offsetY,
      size,
      datamatrixSize,
      quietZone,
      tilde,
      acceptECI,
      fnc1,
      encoding,
      macro,
      text
    ]
  );

  return component;
}

BakeryDatamatrix.Size = BCGdatamatrix.Size;
BakeryDatamatrix.Encoding = BCGdatamatrix.Encoding;
BakeryDatamatrix.Fnc1 = BCGdatamatrix.Fnc1;
BakeryDatamatrix.Macro = BCGdatamatrix.Macro;
