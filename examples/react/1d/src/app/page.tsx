'use client';

import {
  BakeryCodabar,
  BakeryCode11,
  BakeryCode128,
  BakeryCode39,
  BakeryCode39Extended,
  BakeryCode93,
  BakeryEan13,
  BakeryEan8,
  BakeryI25,
  BakeryIsbn,
  BakeryMsi,
  BakeryOthercode,
  BakeryS25,
  BakeryUpca,
  BakeryUpce,
  BakeryUpcext2,
  BakeryUpcext5
} from '@barcode-bakery/barcode-react-1d';
import { useState } from 'react';

export default function Home() {
  const [scale, setScale] = useState(1);
  const change = () => {
    if (scale === 5) {
      setScale(1);
    } else {
      setScale(scale + 1);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <table className="table-auto">
        <thead>
          <tr>
            <th>Code</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Codabar</td>
            <td>
              <BakeryCodabar text="A12345B" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Code11</td>
            <td>
              <BakeryCode11 text="123-45" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Code39</td>
            <td>
              <BakeryCode39 text="A123" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Code39Extended</td>
            <td>
              <BakeryCode39Extended text="Ab39" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Code93</td>
            <td>
              <BakeryCode93 text="A123" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Code128</td>
            <td>
              <BakeryCode128 text="a123" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>EAN-8</td>
            <td>
              <BakeryEan8 text="9871545" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>EAN-13</td>
            <td>
              <BakeryEan13 text="578124871412" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Interleaved 2 of 5</td>
            <td>
              <BakeryI25 text="1234" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>ISBN-10 / ISBN-13</td>
            <td>
              <BakeryIsbn text="9780672326970" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>MSI Plessey</td>
            <td>
              <BakeryMsi text="12345" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Other</td>
            <td>
              <BakeryOthercode text="11199999111" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>Standard 2 of 5</td>
            <td>
              <BakeryS25 text="1234" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>UPC-A</td>
            <td>
              <BakeryUpca text="78951545548" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>UPC-E</td>
            <td>
              <BakeryUpce text="548154" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>UPC Extension 2</td>
            <td>
              <BakeryUpcext2 text="56" scale={scale} />
            </td>
          </tr>
          <tr>
            <td>UPC Extension 5</td>
            <td>
              <BakeryUpcext5 text="55499" scale={scale} />
            </td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => change()}>Change Scale</button>
    </main>
  );
}
