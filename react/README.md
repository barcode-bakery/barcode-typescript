# [Barcode Bakery](https://www.barcodebakery.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-CC%20BY--ND-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0/deed.en)

<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

This repository allows you to generate 1D barcodes in React. You can find more information on our [Barcode Bakery website](https://www.barcodebakery.com).

The TypeScript library is under the [Creative Commons Attribution-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nd/4.0/deed.en).

Please consider doing a donation.

## Installation

- Run the following command:

```bash
$ npm install @barcode-bakery/barcode-react
```

or

```bash
$ yarn add @barcode-bakery/barcode-react
```

You can follow our [developer's guide](https://www.barcodebakery.com/en/docs/react/guide) on our website to learn how to use our library.

## Example

### 1D Barcode

```jsx
import { BakeryCode128 } from '@barcode-bakery/barcode-react/1d';

export default function Home() {
  return <BakeryCode128 text="a123" thickness={30} scale={1} />;
}
```

### Aztec

```jsx
import { BakeryAztec } from '@barcode-bakery/barcode-react/aztec';

export default function Home() {
  return <BakeryAztec text="Aztec" scale={1} />;
}
```

### Databar Expanded

```jsx
import { BakeryDatabarexpanded } from '@barcode-bakery/barcode-react/databarexpanded';

export default function Home() {
  return <BakeryDatabarexpanded text="01900123456789083103001750" scale={1} />;
}
```

### DataMatrix

```jsx
import { BakeryDatamatrix } from '@barcode-bakery/barcode-react/datamatrix';

export default function Home() {
  return <BakeryDatamatrix text="DataMatrix" scale={1} />;
}
```

### MaxiCode

```jsx
import { BakeryMaxicode } from '@barcode-bakery/barcode-react/maxicode';

export default function Home() {
  return <BakeryMaxicode text="MaxiCode" scale={1} />;
}
```

### PDF417

```jsx
import { BakeryPdf417 } from '@barcode-bakery/barcode-react/pdf417';

export default function Home() {
  return <BakeryPdf417 text="PDF417" scale={1} />;
}
```

### QRCode

```jsx
import { BakeryQrcode } from '@barcode-bakery/barcode-react/qrcode';

export default function Home() {
  return <BakeryQrcode text="QRCode" scale={1} />;
}
```

## Supported types

### 1D

- [Codabar](https://www.barcodebakery.com/en/docs/react/barcode/codabar/api)
- [Code 11](https://www.barcodebakery.com/en/docs/react/barcode/code11/api)
- [Code 128](https://www.barcodebakery.com/en/docs/react/barcode/code128/api)
- [Code 39](https://www.barcodebakery.com/en/docs/react/barcode/code39/api)
- [Code 39 Extended](https://www.barcodebakery.com/en/docs/react/barcode/code39extended/api)
- [Code 93](https://www.barcodebakery.com/en/docs/react/barcode/code93/api)
- [EAN-13](https://www.barcodebakery.com/en/docs/react/barcode/ean13/api)
- [EAN-8](https://www.barcodebakery.com/en/docs/react/barcode/ean8/api)
- [Interleaved 2 of 5](https://www.barcodebakery.com/en/docs/react/barcode/i25/api)
- [ISBN-10 / ISBN-13](https://www.barcodebakery.com/en/docs/react/barcode/isbn/api)
- [MSI Plessey](https://www.barcodebakery.com/en/docs/react/barcode/msi/api)
- [Other (Custom)](https://www.barcodebakery.com/en/docs/react/barcode/othercode/api)
- [Standard 2 of 5](https://www.barcodebakery.com/en/docs/react/barcode/s25/api)
- [UPC-A](https://www.barcodebakery.com/en/docs/react/barcode/upca/api)
- [UPC-E](https://www.barcodebakery.com/en/docs/react/barcode/upce/api)
- [UPC Extension 2](https://www.barcodebakery.com/en/docs/react/barcode/upcext2/api)
- [UPC Extension 5](https://www.barcodebakery.com/en/docs/react/barcode/upcext5/api)

### 2D

- [Aztec](https://www.barcodebakery.com/en/docs/react/barcode/aztec/api)
- [Databar Expanded](https://www.barcodebakery.com/en/docs/react/barcode/databarexpanded/api)
- [DataMatrix](https://www.barcodebakery.com/en/docs/react/barcode/datamatrix/api)
- [MaxiCode](https://www.barcodebakery.com/en/docs/react/barcode/maxicode/api)
- [PDF417](https://www.barcodebakery.com/en/docs/react/barcode/pdf417/api)
- [QRCode](https://www.barcodebakery.com/en/docs/react/barcode/qrcode/api)
