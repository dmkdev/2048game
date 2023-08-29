import { FC } from 'react';

export enum GameEvents {
  FAIL = 'fail',
  WIN = 'win',
  SCORE = 'score',
  TOTALSCORE = 'totalscore',
  NEWGAME = 'newgame',
  REACHED2048 = 'reached2048',
  BOARDFULL = 'boardfull',
}

type GameProps = {
  onFail?: () => void,
  onWin?: () => void,
};

export type Props = FC<GameProps>;
