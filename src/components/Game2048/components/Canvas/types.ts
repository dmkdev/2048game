import { CanvasHTMLAttributes, DetailedHTMLProps, FC } from 'react';

export type CanvasOptionsType = {
  context: string;
  fps: number;
};

export type CanvasProps = DetailedHTMLProps<
  CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
> & {
  draw?: (ctx: CanvasRenderingContext2D) => void;
  fps?: number;
};

export type Props = FC<CanvasProps>;
