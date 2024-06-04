# [Barcode Bakery](https://www.barcodebakery.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-CC%20BY--ND-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0/deed.en)

<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

This repository allows you to generate 1D barcodes in Node. You can find more information on our [Barcode Bakery website](https://www.barcodebakery.com).

The TypeScript library is under the [Creative Commons Attribution-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nd/4.0/deed.en).

Please consider doing a donation.

## Installation

- Run the following command:

```bash
$ npm install @barcode-bakery/barcode-nodejs
```

or

```bash
$ yarn add @barcode-bakery/barcode-nodejs
```

You can follow our [developer's guide](https://www.barcodebakery.com/en/docs/nodejs/guide) on our website to learn how to use our library.

## Example

### 1D Barcode

```jsx
import { BCGDrawing, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGcode128 } from '@barcode-bakery/barcode-nodejs/1d';

const code = new BCGcode128();
code.setThickness(30);
code.parse('a123');

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### Aztec

```jsx
import { BCGDrawing, BCGLabel, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGaztec } from '@barcode-bakery/barcode-nodejs/aztec';

const text = 'Aztec';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGaztec();
code.parse(text);

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### Databar Expanded

```jsx
import { BCGDrawing, BCGLabel, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGdatabarexpanded } from '@barcode-bakery/barcode-nodejs/databarexpanded';

const text = '01900123456789083103001750';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGdatabarexpanded();
code.parse(text);

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### DataMatrix

```jsx
import { BCGDrawing, BCGLabel, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGdatamatrix } from '@barcode-bakery/barcode-nodejs/datamatrix';

const text = 'DataMatrix';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGdatamatrix();
code.parse(text);

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### MaxiCode

```jsx
import { BCGDrawing, BCGLabel, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGmaxicode } from '@barcode-bakery/barcode-nodejs/maxicode';

const text = 'MaxiCode';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGmaxicode();
code.parse(text);

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### PDF417

```jsx
import { BCGDrawing, BCGLabel, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGpdf417 } from '@barcode-bakery/barcode-nodejs/pdf417';

const text = 'PDF417';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGpdf417();
code.parse(text);

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### QRCode

```jsx
import { BCGDrawing, BCGLabel, createSurface, save } from '@barcode-bakery/barcode-nodejs';
import { BCGqrcode } from '@barcode-bakery/barcode-nodejs/qrcode';

const text = 'QRCode';

// Label, this part is optional
const label = new BCGLabel();
label.setFont(font);
label.setPosition(BCGLabel.Position.Bottom);
label.setAlignment(BCGLabel.Alignment.Center);
label.setText(text);

const code = new BCGqrcode();
code.addLabel(label);
code.parse(text);

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

### Save to Stream

```jsx
import { BCGDrawing, createSurface, toBuffer } from '@barcode-bakery/barcode-nodejs';
import { BCGcode128 } from '@barcode-bakery/barcode-nodejs/1d';

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
