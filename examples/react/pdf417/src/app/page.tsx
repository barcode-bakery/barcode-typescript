'use client';

import { useState } from 'react';
import { BakeryPdf417 } from '@barcode-bakery/barcode-react-pdf417';

export default function Home() {
  const [text, setText] = useState('A12345B');
  const [scale, setScale] = useState(1);
  const change = () => {
    if (scale === 5) {
      setScale(1);
    } else {
      setScale(scale + 1);
    }
  };

  const handleChange = (newText: string) => {
    setText(newText);
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
            <td>PDF417</td>
            <td>
              <BakeryPdf417 text={text} scale={scale} />
            </td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => change()}>Change Scale</button>
      <input type="text" value={text} onChange={e => handleChange(e.target.value)} />
    </main>
  );
}
