import { BCGFont } from '@barcode-bakery/barcode-common';
import { BakeryBarcodeProps } from './barcode-props';

export interface BakeryBarcode1DProps extends BakeryBarcodeProps {
  thickness?: number | string;
  label?: string;
  font?: BCGFont;
  displayChecksum?: boolean;
}
