import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

/** @type {import('vite').UserConfig} */
export default {
  build: {
    manifest: true,
    lib: {
      entry: {
        '1d': resolve(__dirname, 'src/1d/index.ts'),
        aztec: resolve(__dirname, 'src/aztec/index.ts'),
        databarexpanded: resolve(__dirname, 'src/databarexpanded/index.ts'),
        datamatrix: resolve(__dirname, 'src/datamatrix/index.ts'),
        maxicode: resolve(__dirname, 'src/maxicode/index.ts'),
        pdf417: resolve(__dirname, 'src/pdf417/index.ts'),
        qrcode: resolve(__dirname, 'src/qrcode/index.ts')
      },
      name: 'barcode-bakery-react'
    },
    build: {
      sourcemap: false
    },
    rollupOptions: {
      external: [
        '@barcode-bakery/barcode-common',
        '@barcode-bakery/barcode-1d',
        '@barcode-bakery/barcode-aztec',
        '@barcode-bakery/barcode-databarexpanded',
        '@barcode-bakery/barcode-datamatrix',
        '@barcode-bakery/barcode-maxicode',
        '@barcode-bakery/barcode-pdf417',
        '@barcode-bakery/barcode-qrcode',
        'react',
        'react-dom'
      ],
      output: {
        globals: {
          '@barcode-bakery/barcode-common': 'barcode-bakery-common',
          '@barcode-bakery/barcode-1d': 'barcode-bakery-1d',
          '@barcode-bakery/barcode-aztec': 'barcode-bakery-aztec',
          '@barcode-bakery/barcode-databarexpanded': 'barcode-bakery-databarexpanded',
          '@barcode-bakery/barcode-datamatrix': 'barcode-bakery-datamatrix',
          '@barcode-bakery/barcode-maxicode': 'barcode-bakery-maxicode',
          '@barcode-bakery/barcode-pdf417': 'barcode-bakery-pdf417',
          '@barcode-bakery/barcode-qrcode': 'barcode-bakery-qrcode'
        }
      },
      onLog(level, log, handler) {
        if (log.cause && log.cause.message === `Can't resolve original location of error.`) {
          return;
        }
        handler(level, log);
      }
    }
  },
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    dts()
  ]
};
