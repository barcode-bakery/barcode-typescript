import { resolve } from 'path';
import dts from 'vite-plugin-dts';

/** @type {import('vite').UserConfig} */
export default {
  build: {
    sourcemap: false,
    manifest: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'barcode-bakery-1d'
    },
    rollupOptions: {
      external: ['@barcode-bakery/barcode-common'],
      output: {
        globals: {
          '@barcode-bakery/barcode-common': 'barcode-bakery-common'
        }
      }
    }
  },
  plugins: [dts()]
};
