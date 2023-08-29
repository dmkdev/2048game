import { useRef, useEffect } from 'react';
import { CanvasOptionsType } from './types';

const useCanvas = (
  draw: ((ctx: CanvasRenderingContext2D) => void) | undefined,
  options: Partial<CanvasOptionsType>
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const { fps = 60 } = options;

  const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect();

    if (Math.abs(canvas.width - width) > 50 || Math.abs(canvas.height - height) > 50) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');

      const context = canvasCtxRef.current;

      if (!context) return;

      let last = performance.now();
      let animationFrameId: number;

      const render = (now: DOMHighResTimeStamp) => {
        const delay = now - last;

        if (delay > 1000 / fps) {
          last = now;
          draw ? draw(context) : null;
        }
        animationFrameId = window.requestAnimationFrame(render);
      };

      resizeCanvasToDisplaySize(canvasRef.current);
      render(performance.now());

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }
  }, [draw, fps]);

  return canvasRef;
};

export default useCanvas;
