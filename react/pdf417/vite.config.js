import { resolve } from 'path';
import dts from 'vite-plugin-dts';

/** @type {import('vite').UserConfig} */
export default {
  build: {
    manifest: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'barcode-bakery-react-pdf417'
    },
    build: {
      sourcemap: false
    },
    rollupOptions: {
      external: ['@barcode-bakery/barcode-common', '@barcode-bakery/barcode-pdf417', '@barcode-bakery/barcode-react-common'],
      output: {
        globals: {
          '@barcode-bakery/barcode-common': 'barcode-bakery-common',
          '@barcode-bakery/barcode-pdf417': 'barcode-bakery-pdf417',
          '@barcode-bakery/barcode-react-common': 'barcode-bakery-react-common'
        }
      }
    }
  },
  plugins: [dts()]
};
