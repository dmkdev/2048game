import getRandom from '@/utils/getRandom';
import eventBus from '../eventbus';
import { GameEvents } from '../types';
import { Tile } from './Tile';

export class Board {
  tiles: Tile[][] = [];
  size: number;
  tileColors: Record<number, string> = {};

  constructor(size = 4) {
    this.size = size;
    this.initTileColors();
    this.reset();
  }

  private initTileColors() {
    for (let index = 2; index <= 2048; index = index + 2) {
      this.tileColors[index] = `rgb(${getRandom(255)}, ${getRandom(255)}, ${getRandom(255)})`;
    }
  }

  public reset() {
    this.initTiles();
    this.fillRandomCell(2);
  }

  private initTiles() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.tiles[i]) {
          this.tiles[i] = [];
        }
        this.tiles[i][j] = new Tile(0);
      }
    }
  }

  fillRandomCell(count = 1) {
    const randomX = getRandom(this.size),
      randomY = getRandom(this.size);

    let x = randomX,
      y = randomY,
      amount = 0;

    try {
      while (amount < count) {
        if (this.tiles[x][y].value === 0) {
          this.tiles[x][y].value = 2;
          amount++;
        } else {
          if (x + 1 < this.size) {
            x++;
          } else {
            x = 0;

            if (y + 1 < this.size) {
              y++;
            } else {
              y = 0;
            }
          }

          if (x == randomX && y == randomY) {
            throw new Error('Cannot place new tile');
          }
        }
      }
    } catch {
      eventBus.emit(GameEvents.BOARDFULL);
    }
  }

  mergeUp() {
    for (let x = 0; x < this.size; x++) {
      const col: number[] = [];

      for (let y = 0; y < this.size; y++) {
        if (this.tiles[x][y].value) {
          col.push(this.tiles[x][y].value);
        }
      }
      const calc = this.combineLeft(col);
      const notEnough = this.size - calc.length;
      const patch = Array(notEnough).fill(0);
      const filled = calc.concat(patch);

      for (let y = 0; y < this.size; y++) {
        this.tiles[x][y].value = filled[y];
        this.tiles[x][y].needRender = true;
      }
    }
  }

  mergeDown() {
    for (let x = 0; x < this.size; x++) {
      const col: number[] = [];

      for (let y = 0; y < this.size; y++) {
        if (this.tiles[x][y].value) {
          col.push(this.tiles[x][y].value);
        }
      }
      const calc = this.combineRight(col);
      const notEnough = this.size - calc.length;
      const patch = Array(notEnough).fill(0);
      const filled = patch.concat(calc);

      for (let y = 0; y < this.size; y++) {
        this.tiles[x][y].value = filled[y];
        this.tiles[x][y].needRender = true;
      }
    }
  }

  private combineLeft(arr: number[]) {
    return arr.reduce(
      (res: number[], curr: number, index: number, a: number[]) => {
        if (a[index + 1] && curr == a[index + 1]) {
          res.push(curr * 2);
          eventBus.emit(GameEvents.SCORE, curr);
          this.checkWin(curr);
          a[index + 1] = 0;

          return res;
        }

        if (curr) {
          res.push(curr);
        }

        return res;
      },
      []
    );
  }

  mergeLeft() {
    for (let y = 0; y < this.size; y++) {
      const row: number[] = [];

      for (let x = 0; x < this.size; x++) {
        if (this.tiles[x][y].value) {
          row.push(this.tiles[x][y].value);
        }
      }
      const calc = this.combineLeft(row);
      const notEnough = this.size - calc.length;
      const patch = Array(notEnough).fill(0);
      const filled = calc.concat(patch);

      for (let x = 0; x < this.size; x++) {
        this.tiles[x][y].value = filled[x];
        this.tiles[x][y].needRender = true;
      }
    }
  }

  private combineRight(arr: number[]) {
    return arr.reduceRight(
      (res: number[], curr: number, index: number, a: number[]) => {
        if (a[index - 1] && curr == a[index - 1]) {
          res.unshift(curr * 2);
          eventBus.emit(GameEvents.SCORE, curr);
          this.checkWin(curr);
          a[index - 1] = 0;

          return res;
        }

        if (curr) {
          res.unshift(curr);
        }

        return res;
      },
      []
    );
  }

  private checkWin(curr: number) {
    if (curr === 2048) {
      eventBus.emit(GameEvents.REACHED2048);
    }
  }

  mergeRight() {
    for (let y = 0; y < this.size; y++) {
      const row: number[] = [];

      for (let x = 0; x < this.size; x++) {
        if (this.tiles[x][y].value) {
          row.push(this.tiles[x][y].value);
        }
      }

      const calc = this.combineRight(row);
      const notEnough = this.size - calc.length;
      const patch = Array(notEnough).fill(0);
      const filled = patch.concat(calc);

      for (let x = 0; x < this.size; x++) {
        this.tiles[x][y].value = filled[x];
        this.tiles[x][y].needRender = true;
      }
    }
  }
    
}
