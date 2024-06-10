# [Barcode Bakery](https://www.barcodebakery.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-CC%20BY--ND-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0/deed.en)

<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

This example repository allows you to generate any type of 1D and 2D barcodes in NodeJS. You can find more information on our [Barcode Bakery website](https://www.barcodebakery.com).

The TypeScript library is under the [Creative Commons Attribution-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nd/4.0/deed.en).

Please consider doing a <a href="https://github.com/sponsors/barcode-bakery">donation</a>.

## Installation

- Run the following command:

```bash
$ npm install @barcode-bakery/barcode-nodejs
```

or

```bash
$ yarn add @barcode-bakery/barcode-nodejs
```

This repository is already setup to run the examples. You simply need to run:

```bash
$ npm install
```

You can follow our [developer's guide](https://www.barcodebakery.com/en/docs/nodejs/guide) on our website to learn how to use our library.

## Example

### Saving to a file

```js
import { BCGDrawing, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGcode128 } from '@barcode-bakery/barcode-nodejs/1d';

const code = new BCGcode128();
code.setThickness(30);
code.parse('a123');

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### Saving to a stream

```js
import { BCGDrawing, createSurface, toBuffer } from '@barcode-bakery/barcode-nodejs';
import { BCGcode128 } from '@barcode-bakery/barcode-nodejs/1d';
import { createServer } from 'http';

const code = new BCGcode128();
code.setThickness(30);
code.parse('a123');

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

createServer(function (request, response) {
  toBuffer(drawing, BCGDrawing.ImageFormat.Png, function (err: Error | null, buffer: Buffer) {
    // Do something with the buffer. Here we send it to a response.
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(buffer);
  });
}).listen(8124);
```

### From this repository

Have a look at the file [app-code128.js](https://github.com/barcode-bakery/barcode-typescript/blob/master/examples/nodejs/src/app-code128.js) then call:

```bash
node src/app-code128.js
```

TypeScript examples such as [app-code128.ts](https://github.com/barcode-bakery/barcode-typescript/blob/master/examples/nodejs/ts/app-code128.ts) are also supplied:

```bash
tsx ts/app-code128.ts
```

## Supported types

### 1D

- [Codabar](https://www.barcodebakery.com/en/docs/nodejs/barcode/codabar/api)
- [Code 11](https://www.barcodebakery.com/en/docs/nodejs/barcode/code11/api)
- [Code 128](https://www.barcodebakery.com/en/docs/nodejs/barcode/code128/api)
- [Code 39](https://www.barcodebakery.com/en/docs/nodejs/barcode/code39/api)
- [Code 39 Extended](https://www.barcodebakery.com/en/docs/nodejs/barcode/code39extended/api)
- [Code 93](https://www.barcodebakery.com/en/docs/nodejs/barcode/code93/api)
- [EAN-13](https://www.barcodebakery.com/en/docs/nodejs/barcode/ean13/api)
- [EAN-8](https://www.barcodebakery.com/en/docs/nodejs/barcode/ean8/api)
- [Interleaved 2 of 5](https://www.barcodebakery.com/en/docs/nodejs/barcode/i25/api)
- [ISBN-10 / ISBN-13](https://www.barcodebakery.com/en/docs/nodejs/barcode/isbn/api)
- [MSI Plessey](https://www.barcodebakery.com/en/docs/nodejs/barcode/msi/api)
- [Other (Custom)](https://www.barcodebakery.com/en/docs/nodejs/barcode/othercode/api)
- [Standard 2 of 5](https://www.barcodebakery.com/en/docs/nodejs/barcode/s25/api)
- [UPC Extension 2](https://www.barcodebakery.com/en/docs/nodejs/barcode/upcext2/api)
- [UPC Extension 5](https://www.barcodebakery.com/en/docs/nodejs/barcode/upcext5/api)
- [UPC-A](https://www.barcodebakery.com/en/docs/nodejs/barcode/upca/api)
- [UPC-E](https://www.barcodebakery.com/en/docs/nodejs/barcode/upce/api)

### 2D

- [Aztec](https://www.barcodebakery.com/en/docs/nodejs/barcode/aztec/api)
- [Databar Expanded](https://www.barcodebakery.com/en/docs/nodejs/barcode/databarexpanded/api)
- [DataMatrix](https://www.barcodebakery.com/en/docs/nodejs/barcode/datamatrix/api)
- [MaxiCode](https://www.barcodebakery.com/en/docs/nodejs/barcode/maxicode/api)
- [PDF417](https://www.barcodebakery.com/en/docs/nodejs/barcode/pdf417/api)
- [QRCode](https://www.barcodebakery.com/en/docs/nodejs/barcode/qrcode/api)
