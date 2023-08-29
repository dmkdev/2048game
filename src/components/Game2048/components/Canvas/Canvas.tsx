import React from 'react';
import { Props } from './types';
import useCanvas from './useCanvas';

const Canvas: Props = (props) => {
  const { draw, fps, ...rest } = props;

  const canvasRef = useCanvas(draw, { fps });

  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
