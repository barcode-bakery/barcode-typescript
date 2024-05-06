'use client';

import { BCGdatamatrix } from '@barcode-bakery/barcode-datamatrix';
import { Barcode2DProps, useCanvasDisplay } from '@barcode-bakery/barcode-react-common';

export interface BCGdatamatrixProps extends Barcode2DProps {
  size?: BCGdatamatrix.Size;
  datamatrixSizeRow?: number;
  datamatrixSizeCol?: number;
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
  datamatrixSizeRow,
  datamatrixSizeCol,
  quietZone,
  tilde,
  acceptECI,
  fnc1,
  encoding,
  macro,
  text
}: Readonly<BCGdatamatrixProps>) {
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

      if (datamatrixSizeRow !== undefined && datamatrixSizeCol !== undefined) {
        code.setDataMatrixSize(datamatrixSizeRow, datamatrixSizeCol);
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
      datamatrixSizeRow,
      datamatrixSizeCol,
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
