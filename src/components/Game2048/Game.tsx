"use client";

import React, { useCallback, useEffect, useState } from 'react';

import { GameEvents, Props } from './types';
import { Game as Game2048 } from './models/Game';

import styles from './Game.module.css';
import ResultCard from './components/ResultCard';
import Canvas from './components/Canvas';
import eventBus from './eventbus';
import { BoardRenderer, CanvasBoardRenderer } from './utils/render';

const game = new Game2048();

const Game: Props = ({
  onFail = () => alert('Проиграл! Сыграй ещё разок!'),
  onWin = () => alert('Победа! Ты гений!') 
}) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    game.init();

    return () => {
      game.destroy();
    };
  }, []);

  const setGameOverTrue = useCallback(() => {
    setGameOver(true);
  }, []);

  const setGameOverFalse = useCallback(() => {
    setGameOver(false);
  }, []);

  useEffect(() => {
    eventBus.on(GameEvents.FAIL, setGameOverTrue);
    eventBus.on(GameEvents.FAIL, onFail);
    eventBus.on(GameEvents.WIN, setGameOverTrue);
    eventBus.on(GameEvents.WIN, onWin);
    eventBus.on(GameEvents.NEWGAME, setGameOverFalse);
    eventBus.on(GameEvents.TOTALSCORE, setScore);

    return () => {
      eventBus.un(GameEvents.FAIL, setGameOverTrue);
      eventBus.un(GameEvents.FAIL, onFail);
      eventBus.un(GameEvents.WIN, setGameOverTrue);
      eventBus.un(GameEvents.WIN, onWin);
      eventBus.un(GameEvents.NEWGAME, setGameOverFalse);
      eventBus.un(GameEvents.TOTALSCORE, setScore);
    };
  }, [setGameOverFalse, setGameOverTrue, onFail, onWin]);

  let canvasRenderer: BoardRenderer;

  const draw = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRenderer) {
      canvasRenderer = new CanvasBoardRenderer(ctx);
    }
    canvasRenderer.render(game.board);
  };

  const onNewGame = () => {
    game.newGame();
  }

  return (
    <div className={styles.game}>
      <div className={styles.score}>
        <ResultCard title={'Счёт'} value={score} />
      </div>
      <div className={styles.board}>

        {gameOver ? (
          <button className={styles.restart} onClick={onNewGame}>
            Повторить
          </button>
        ) : <Canvas draw={draw} fps={30} className={styles.canvas} style={{ opacity: gameOver ? 0 : 1 }} />}
      </div>
    </div>
  );
};

export default Game;
