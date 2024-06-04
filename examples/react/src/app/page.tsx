'use client';

import { Button } from '@/components/Button';
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-8">
      <ul>
        <li>
          <a href="/1d">1D</a>
        </li>
        <li>
          <a href="/aztec">Aztec</a>
        </li>
        <li>
          <a href="/databarexpanded">Databar Expanded</a>
        </li>
        <li>
          <a href="/datamatrix">DataMatrix</a>
        </li>
        <li>
          <a href="/maxicode">MaxiCode</a>
        </li>
        <li>
          <a href="/pdf417">PDF417</a>
        </li>
        <li>
          <a href="/qrcode">QRCode</a>
        </li>
      </ul>
    </main>
  );
}
