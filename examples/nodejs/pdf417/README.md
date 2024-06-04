# [Barcode Bakery](https://www.barcodebakery.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-CC%20BY--ND-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0/deed.en)

<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

This example repository allows you to generate any type of PDF417 barcodes. You can find more information on our [Barcode Bakery website](https://www.barcodebakery.com).

This is based on the [barcode PDF417](https://github.com/barcode-bakery/barcode-typescript/tree/master/ts/pdf417) library.

The TypeScript library is under the [Creative Commons Attribution-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nd/4.0/deed.en).

Please consider doing a donation.

## Installation

- Run the following command:

```bash
$ npm install @barcode-bakery/barcode-pdf417 @barcode-bakery/barcode-common @barcode-bakery/barcode-nodejs-common
```

or

```bash
$ yarn add @barcode-bakery/barcode-pdf417 @barcode-bakery/barcode-common @barcode-bakery/barcode-nodejs-common
```

This repository is already setup to run the examples. You simply need to run:

```bash
$ npm install
```

You can follow our [developer's guide](https://www.barcodebakery.com/en/docs/nodejs/guide) on our website to learn how to use our library.

## Example

### Saving to a file

```js
import { BCGpdf417 } from '@barcode-bakery/barcode-pdf417';
import { BCGDrawing, BCGLabel } from '@barcode-bakery/barcode-common';
import { createSurface, save } from '@barcode-bakery/barcode-node-common';

const text = 'PDF417';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGpdf417();
code.addLabel(label);
code.parse(text);

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### Saving to a stream

```js
import { BCGpdf417 } from '@barcode-bakery/barcode-pdf417';
import { BCGDrawing, BCGLabel } from '@barcode-bakery/barcode-common';
import { createSurface, toBuffer } from '@barcode-bakery/barcode-node-common';

const text = 'PDF417';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGpdf417();
code.addLabel(label);
code.parse(text);

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

Have a look at the file [app-pdf417.js](https://github.com/barcode-bakery/barcode-typescript/blob/master/examples/nodejs/pdf417/src/app-pdf417.js) then call:

```bash
node src/app-pdf417.js
```

TypeScript examples such as [app-pdf417.ts](https://github.com/barcode-bakery/barcode-typescript/blob/master/examples/nodejs/pdf417/ts/app-pdf417.ts) are also supplied:

```bash
tsx ts/app-pdf417.ts
```

## Supported types

- [PDF417](https://www.barcodebakery.com/en/docs/nodejs/barcode/pdf417/api)

## Other libraries available

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
- [Aztec](https://www.barcodebakery.com/en/docs/nodejs/barcode/aztec/api)
- [Databar Expanded](https://www.barcodebakery.com/en/docs/nodejs/barcode/databarexpanded/api)
- [DataMatrix](https://www.barcodebakery.com/en/docs/nodejs/barcode/datamatrix/api)
- [MaxiCode](https://www.barcodebakery.com/en/docs/nodejs/barcode/maxicode/api)
- [QRCode](https://www.barcodebakery.com/en/docs/nodejs/barcode/qrcode/api)
