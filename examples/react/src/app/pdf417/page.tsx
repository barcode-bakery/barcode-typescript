'use client';

import { Button } from '@/components/Button';
import { BakeryPdf417 } from '@barcode-bakery/barcode-react/pdf417';
import { useState } from 'react';

export default function Home() {
  const [scale, setScale] = useState(3);
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
              <td>PDF417</td>
              <td>
                <div>
                  <BakeryPdf417 text="PDF417" scale={scale} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
