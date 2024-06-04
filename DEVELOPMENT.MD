# Working on Barcode Bakery

## Publishing

In order to publish to the repository do the following.
Make sure to always set the `dependencies` to the correct version. Not a path.
Everything should be compiled properly before publishing. We are using `prepublishOnly` which should alleviate the problem.

First time you publish a package, you must call
`npm publish --access=public`

Otherwise, afterwards this will do:
`npm publish`

## Development

When working locally, you can change the package.json dependencies from
`"@barcode-bakery/barcode-common": "^3"`
to
`"@barcode-bakery/barcode-common": "../barcode-bakery-common/src"`
for nodes, don't include the `src`:
`"@barcode-bakery/barcode-common": "../barcode-bakery-commom"`

Delete the `/node_modules/@barcode-bakery/barcode-common`
then Run
`yarn install --force`

## Run Example

Run a node JS example
`node src\app-codabar.js`

Run a node TS example
`tsx ts\app-codabar.ts`
