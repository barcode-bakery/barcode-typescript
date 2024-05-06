import { BCGFont } from '@barcode-bakery/barcode-common';
import { BarcodeProps } from './barcode-props';

export interface Barcode1DProps extends BarcodeProps {
  thickness?: number | string;
  label?: string;
  font?: BCGFont;
  displayChecksum?: boolean;
}
