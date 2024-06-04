'use client';

import { Button } from '@/components/Button';
import { BakeryDatabarexpanded } from '@barcode-bakery/barcode-react/databarexpanded';
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
              <td>Databar Expanded</td>
              <td>
                <div>
                  <BakeryDatabarexpanded text="01900123456789083103001750" scale={scale} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
