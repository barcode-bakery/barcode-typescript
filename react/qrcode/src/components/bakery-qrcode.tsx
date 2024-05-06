'use client';

import { BCGqrcode } from '@barcode-bakery/barcode-qrcode';
import { Barcode2DProps, useCanvasDisplay } from '@barcode-bakery/barcode-react-common';

export interface BCGqrcodeProps extends Barcode2DProps {
  errorLevel?: string;
  size?: number;
  fnc1?: number;
  fnc1Id?: number;
  acceptECI?: boolean;
  quietZone?: boolean;
  mirror?: boolean;
  mask?: number;
  qrSize?: number;
  qrMicro?: boolean;
  text: string;
}

export function BakeryQrcode({
  scale,
  foregroundColor,
  backgroundColor,
  offsetX,
  offsetY,
  errorLevel,
  size,
  fnc1,
  fnc1Id,
  acceptECI,
  quietZone,
  mirror,
  mask,
  qrSize,
  qrMicro,
  text
}: Readonly<BCGqrcodeProps>) {
  const { component } = useCanvasDisplay(
    BCGqrcode,
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

      if (errorLevel !== undefined) {
        code.setErrorLevel(errorLevel);
      }

      if (size !== undefined) {
        code.setSize(size);
      }

      if (acceptECI !== undefined) {
        code.setAcceptECI(acceptECI);
      }

      if (quietZone !== undefined) {
        code.setQuietZone(quietZone);
      }

      if (mirror !== undefined) {
        code.setMirror(mirror);
      }

      if (mask !== undefined) {
        code.setMask(mask);
      }

      if (qrSize !== undefined) {
        code.setQRSize(qrSize, qrMicro ?? false);
      }

      code.parse(text);
    },
    [
      scale,
      foregroundColor,
      backgroundColor,
      offsetX,
      offsetY,
      errorLevel,
      size,
      fnc1,
      fnc1Id,
      acceptECI,
      quietZone,
      mirror,
      mask,
      qrSize,
      qrMicro,
      text
    ]
  );

  return component;
}
