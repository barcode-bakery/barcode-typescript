import { BCGColor } from '@barcode-bakery/barcode-common';

export interface BakeryBarcodeProps {
  scale?: number;
  foregroundColor?: BCGColor;
  backgroundColor?: BCGColor;
  offsetX?: number;
  offsetY?: number;
}
