# [Barcode Bakery](https://www.barcodebakery.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-CC%20BY--ND-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0/deed.en)

<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

This example repository allows you to generate any type of 1D and 2D barcodes in React. You can find more information on our [Barcode Bakery website](https://www.barcodebakery.com).

The TypeScript library is under the [Creative Commons Attribution-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nd/4.0/deed.en).

Please consider doing a <a href="https://github.com/sponsors/barcode-bakery">donation</a>.

## Installation

- Run the following command:

```bash
$ npm install @barcode-bakery/barcode-react
```

or

```bash
$ yarn add @barcode-bakery/barcode-react
```

For React 16-18:

```bash
$ npm install @barcode-bakery/barcode-react@1
```

or

```bash
$ yarn add @barcode-bakery/barcode-react@1
```

This repository is already setup to run the examples. You simply need to run:

```bash
$ npm install
```

You can follow our [developer's guide](https://www.barcodebakery.com/en/docs/react/guide) on our website to learn how to use our library.

## Example

```jsx
import { BakeryCode128 } from '@barcode-bakery/barcode-react/1d';

export default function Home() {
  return <BakeryCode128 text="a123" thickness={30} scale={1} />;
}
```

### From this repository

This repository is a Next.js project implementing all the barcodes.

Run the following command and navigate to http://localhost:3000

```bash
yarn dev
```

Have a look at the file [1d/page.tsx](https://github.com/barcode-bakery/barcode-typescript/blob/master/examples/react/src/app/1d/page.tsx)

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
- [UPC Extension 2](https://www.barcodebakery.com/en/docs/react/barcode/upcext2/api)
- [UPC Extension 5](https://www.barcodebakery.com/en/docs/react/barcode/upcext5/api)
- [UPC-A](https://www.barcodebakery.com/en/docs/react/barcode/upca/api)
- [UPC-E](https://www.barcodebakery.com/en/docs/react/barcode/upce/api)

### 2D

- [Aztec](https://www.barcodebakery.com/en/docs/react/barcode/aztec/api)
- [Databar Expanded](https://www.barcodebakery.com/en/docs/react/barcode/databarexpanded/api)
- [DataMatrix](https://www.barcodebakery.com/en/docs/react/barcode/datamatrix/api)
- [MaxiCode](https://www.barcodebakery.com/en/docs/react/barcode/maxicode/api)
- [PDF417](https://www.barcodebakery.com/en/docs/react/barcode/pdf417/api)
- [QRCode](https://www.barcodebakery.com/en/docs/react/barcode/qrcode/api)
