'use client';

import { Button } from '@/components/Button';
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
} from '@barcode-bakery/barcode-react/1d';
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
    <div className="m-8">
      <a href="/">Back</a>
      <main className="flex flex-col items-center p-24 gap-8">
        <Button onClick={() => change()}>Change Scale</Button>

        <table className="magic-table">
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
                <div>
                  <BakeryCodabar text="A12345B" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Code11</td>
              <td>
                <div>
                  <BakeryCode11 text="123-45" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Code39</td>
              <td>
                <div>
                  <BakeryCode39 text="A123" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Code39Extended</td>
              <td>
                <div>
                  <BakeryCode39Extended text="Ab39" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Code93</td>
              <td>
                <div>
                  <BakeryCode93 text="A123" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Code128</td>
              <td>
                <div>
                  <BakeryCode128 text="a123" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>EAN-8</td>
              <td>
                <div>
                  <BakeryEan8 text="9871545" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>EAN-13</td>
              <td>
                <div>
                  <BakeryEan13 text="578124871412" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Interleaved 2 of 5</td>
              <td>
                <div>
                  <BakeryI25 text="1234" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>ISBN-10 / ISBN-13</td>
              <td>
                <div>
                  <BakeryIsbn text="9780672326970" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>MSI Plessey</td>
              <td>
                <div>
                  <BakeryMsi text="12345" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Other</td>
              <td>
                <div>
                  <BakeryOthercode text="11199999111" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Standard 2 of 5</td>
              <td>
                <div>
                  <BakeryS25 text="1234" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>UPC-A</td>
              <td>
                <div>
                  <BakeryUpca text="78951545548" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>UPC-E</td>
              <td>
                <div>
                  <BakeryUpce text="548154" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>UPC Extension 2</td>
              <td>
                <div>
                  <BakeryUpcext2 text="56" scale={scale} />
                </div>
              </td>
            </tr>
            <tr>
              <td>UPC Extension 5</td>
              <td>
                <div>
                  <BakeryUpcext5 text="55499" scale={scale} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
