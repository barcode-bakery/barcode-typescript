import { BCGColor } from '@barcode-bakery/barcode-common';

export interface BarcodeProps {
  scale?: number;
  foregroundColor?: BCGColor;
  backgroundColor?: BCGColor;
  offsetX?: number;
  offsetY?: number;
}
