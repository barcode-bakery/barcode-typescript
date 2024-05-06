<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

This example repository will allow you to generate any type of 1D barcodes. You can find more information on our [Barcode Bakery website][1].

This is based on the [barcode 1D][2] library.

The library is available for free for non-commercial use; however you must [purchase a license][3] if you plan to use it in a commercial environment.

## Installation

There are two ways to install our library:

- Run the following command:

```bash
$ npm install @barcode-bakery/barcode-1d @barcode-bakery/barcode-common
```

- Or, download the library on our [website][4], and follow our [developer's guide][5].

This repository is already setup to run the examples. You simply need to run:

```bash
$ npm install
```

Then call a file [app-code39.js][26] with Node:

```bash
node src/app-code39.js
```

TypeScript examples are also supplied:

```bash
npx ts-node --esm ts/app-code39.ts
```

## Supported types

- [Codabar][6]
- [Code 11][7]
- [Code 128][8]
- [Code 39][9]
- [Code 39 Extended][10]
- [Code 93][11]
- [EAN-13][12]
- [EAN-8][13]
- [Interleaved 2 of 5][16]
- [ISBN-10 / ISBN-13][17]
- [MSI Plessey][18]
- [Other (Custom)][19]
- [Standard 2 of 5][21]
- [UPC Extension 2][22]
- [UPC Extension 5][23]
- [UPC-A][24]
- [UPC-E][25]

[1]: https://www.barcodebakery.com
[2]: https://github.com/barcode-bakery/barcode-nodejs-1d/
[3]: https://www.barcodebakery.com/en/purchase
[4]: https://www.barcodebakery.com/en/download
[5]: https://www.barcodebakery.com/en/docs/nodejs/guide
[6]: https://www.barcodebakery.com/en/docs/nodejs/barcode/codabar/api
[7]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code11/api
[8]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code128/api
[9]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code39/api
[10]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code39extended/api
[11]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code93/api
[12]: https://www.barcodebakery.com/en/docs/nodejs/barcode/ean13/api
[13]: https://www.barcodebakery.com/en/docs/nodejs/barcode/ean8/api
[16]: https://www.barcodebakery.com/en/docs/nodejs/barcode/i25/api
[17]: https://www.barcodebakery.com/en/docs/nodejs/barcode/isbn/api
[18]: https://www.barcodebakery.com/en/docs/nodejs/barcode/msi/api
[19]: https://www.barcodebakery.com/en/docs/nodejs/barcode/othercode/api
[21]: https://www.barcodebakery.com/en/docs/nodejs/barcode/s25/api
[22]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upcext2/api
[23]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upcext5/api
[24]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upca/api
[25]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upce/api
[26]: https://github.com/barcode-bakery/example-nodejs-1d/blob/master/src/app-code39.js
