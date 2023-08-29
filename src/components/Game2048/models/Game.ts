import eventBus from '../eventbus';
import { GameEvents } from '../types';
import { Board } from './Board';
import { SwipeEventListener } from 'swipe-event-listener';

export class Game {
  board: Board;
  private score = 0;
  private totalScore = 0;
  private swipeArea?: HTMLElement

  constructor(board: Board = new Board()) {
    this.board = board;

    this.processKeyDown = this.processKeyDown.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.notifyWinner = this.notifyWinner.bind(this);
    this.notifyLooser = this.notifyLooser.bind(this);
  }

  private registerEvents() {
    eventBus.on(GameEvents.SCORE, this.updateScore);
    eventBus.on(GameEvents.REACHED2048, this.notifyWinner);
    eventBus.on(GameEvents.BOARDFULL, this.notifyLooser);
  }

  private unregisterEvents() {
    eventBus.un(GameEvents.SCORE, this.updateScore);
    eventBus.un(GameEvents.REACHED2048, this.notifyWinner);
    eventBus.un(GameEvents.BOARDFULL, this.notifyLooser);
  }

  private updateScore(score: number) {
    this.score += score;
    this.totalScore = Math.max(this.score, this.totalScore);

    eventBus.emit(GameEvents.TOTALSCORE, this.totalScore);
  }

  private notifyWinner() {
    this.removeKeyboardListener();
    eventBus.emit(GameEvents.WIN, this.score);
  }

  private notifyLooser() {
    this.removeKeyboardListener();
    eventBus.emit(GameEvents.FAIL, this.score);
  }

  public init() {
    this.registerEvents();
    this.listenForKeyboard();
  }

  public newGame() {
    this.board.reset();
    this.score = 0;
    this.totalScore = 0;
    eventBus.emit(GameEvents.SCORE, this.score);
    eventBus.emit(GameEvents.NEWGAME);
    this.listenForKeyboard();
  }

  public destroy() {
    this.board.reset();
    this.score = 0;
    this.unregisterEvents();
    this.removeKeyboardListener();
  }

  private listenForKeyboard() {
    document.addEventListener('keydown', this.processKeyDown);

    if (!this.swipeArea) {
      this.swipeArea = SwipeEventListener({
        swipeArea: document.querySelector('body') as HTMLElement,
      }).swipeArea;
    }

    this.swipeArea.addEventListener('swipeDown', this.processKeyDown as EventListener);
    this.swipeArea.addEventListener('swipeUp', this.processKeyDown as EventListener);
    this.swipeArea.addEventListener('swipeLeft', this.processKeyDown as EventListener);
    this.swipeArea.addEventListener('swipeRight', this.processKeyDown as EventListener);
  }

  private removeKeyboardListener() {
    document.removeEventListener('keydown', this.processKeyDown);

    if (!this.swipeArea) {
      return;
    }

    this.swipeArea.removeEventListener('swipeDown', this.processKeyDown as EventListener);
    this.swipeArea.removeEventListener('swipeUp', this.processKeyDown as EventListener);
    this.swipeArea.removeEventListener('swipeLeft', this.processKeyDown as EventListener);
    this.swipeArea.removeEventListener('swipeRight', this.processKeyDown as EventListener);
  }

  private processKeyDown(event: KeyboardEvent) {

    if (
      !['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'].find(
        (e) => e === event.key || e === event.type
      )
    ) {
      return;
    }

    // влево
    if (event.key === 'ArrowLeft' || event.type === 'swipeLeft') {
      this.board.mergeLeft();
    }
    // вверх
    else if (event.key === 'ArrowUp' || event.type === 'swipeUp') {
      this.board.mergeUp();
    }
    // вправо
    else if (event.key === 'ArrowRight' || event.type === 'swipeRight') {
      this.board.mergeRight();
    }
    // вниз
    else if (event.key === 'ArrowDown' || event.type === 'swipeDown') {
      this.board.mergeDown();
    }

    this.board.fillRandomCell();
  }
}
