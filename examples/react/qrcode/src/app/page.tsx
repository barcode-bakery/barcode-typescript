'use client';

import { useState } from 'react';
import { BakeryQrcode } from '@barcode-bakery/barcode-react-qrcode';

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
            <td>QR Code</td>
            <td>
              <BakeryQrcode text="A12345B" scale={scale} />
            </td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => change()}>Change Scale</button>
    </main>
  );
}
