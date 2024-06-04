import { BCGBarcode, BCGDrawing } from '@barcode-bakery/barcode-common';
import { DependencyList, useEffect, useMemo, useRef, useState } from 'react';

const createSurface = (width: number, height: number) => {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = width;
  newCanvas.height = height;
  return {
    context: newCanvas.getContext('2d')!,
    createSurface
  };
};

export const useCanvasDisplay = <T extends BCGBarcode>(type: { new (): T }, configure: (code: T) => void, deps?: DependencyList) => {
  const [code, setCode] = useState<T>();
  const [exception, setException] = useState<unknown>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const surface = useMemo(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      return {
        context: canvas.getContext('2d')!,
        createSurface
      };
    }

    return null;
  }, [canvasRef.current]);

  useEffect(() => {
    if (code && surface) {
      const drawing = new BCGDrawing(surface);
      drawing.draw(code);
    }
  }, [code, surface]);

  useEffect(
    () => {
      try {
        setCode(undefined);
        setException(undefined);
        const internalCode = new type();
        configure(internalCode);
        setCode(internalCode);
      } catch (ex) {
        setException(ex);
      }
    },
    deps?.concat([setCode, surface])
  );

  useEffect(() => {
    if (exception && surface) {
      const drawing = new BCGDrawing(surface);
      drawing.drawException(exception);
    }
  }, [exception, surface]);

  return {
    component: <canvas width={1} height={1} ref={canvasRef} />
  };
};
