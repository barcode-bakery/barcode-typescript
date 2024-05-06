# [Barcode Bakery](https://www.barcodebakery.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-CC%20BY--ND-blue.svg)](https://creativecommons.org/licenses/by-nd/4.0/deed.en)

<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

Barcode Bakery is an umbrella of many barcode symbologies.
We have been implementing the barcode specifications for decades and we are confident in our generated barcodes.

The TypeScript library includes:

- **React**: An easy tag can be included anywhere in a React application to generate any type of barcodes on the client.
- **NodeJS**: Generating barcodes on the server side and serving them as stream or saving them as images using a canvas library.

We support multiple types of symbologies:

- **1D**
  - Codabar
  - Code 11
  - Code 39
  - Code 39 Extended
  - Code 93
  - Code 128
  - EAN-8
  - EAN-13
  - Interleaved 2 of 5
  - ISBN
  - MSI Plessey
  - Other Code
  - Standard 2 of 5
  - UPC-A
  - UPC-E
  - UPC-E Extension 2
  - UPC-E Extension 5
- **Aztec**
- **Databar Expanded**
- **DataMatrix**
- **MaxiCode**
- **PDF417**
- **QRCode**

We also offer other programming languages such as [PHP](https://github.com/barcode-bakery/barcode-php-1d) and [.NET](https://github.com/barcode-bakery/barcode-dotnet-1d).

[Learn more about it on our website](https://www.barcodebakery.com).

## Installation

We are currently using a monorepo to handle all the packages. They are all pushed to NPM.
Navigate to the correct code above or click on the language you would like to use to continue:

- NodeJS
- React

## Documentation

You can find an extensive documentation [on the website](https://www.barcodebakery.com/en/docs/nodejs).

Check out the [Developer's Guide](https://www.barcodebakery.com/en/docs/nodejs/guide/choosing-barcodes) page for a quick overview.

## Examples

We have several examples [on the website](https://www.barcodebakery.com). Here is the first one to get you started:

### NodeJS

```js
import { BCGcode128 } from '@barcode-bakery/barcode-1d';
import { createSurface, save } from '@barcode-bakery/barcode-node-common';

const code = new BCGcode128();
code.setThickness(30);
code.parse('a123');

const drawing = new BCGDrawing(createSurface);
drawing.draw(code);

save(drawing, 'image.png', BCGDrawing.ImageFormat.Png);
```

This example will save the barcode Code 128 in a file.

### React

```jsx
import { BakeryCode128 } from '@barcode-bakery/barcode-react-1d';

export default function Home() {
  return <BakeryCode128 text="a123" scale={a} />;
}
```

This example will display the barcode Code 128 on the page.

### License

Barcode Bakery for TypeScript is [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/deed.en). Creative Commons Attribution-NoDerivatives 4.0 International.

Which means, you are allowed to use it in your projects, commercial or non-commercial, for free. However, you cannot change the copyrights or change the code and sell our library to others.
