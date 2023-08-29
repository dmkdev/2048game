import { Board } from '../models/Board';
import { Tile } from '../models/Tile';

export interface BoardRenderer {
  render(board: Board): void;
}

export class CanvasBoardRenderer implements BoardRenderer {

  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  render(board: Board): void {
    this.clear();
    const SIZE_X = board.size;
    const SIZE_Y = board.size;
    const TILE_WIDTH = Math.floor(this.ctx.canvas.width / SIZE_X);
    const TILE_HEIGHT = Math.floor(this.ctx.canvas.height / SIZE_Y);
  
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        this.renderTile(
          board.tiles[i][j],
          Math.floor(i * TILE_WIDTH),
          Math.floor(j * TILE_HEIGHT),
          TILE_WIDTH - 1,
          TILE_HEIGHT - 1,
          board.tileColors[board.tiles[i][j].value]
        );
      }
    }
  }

  renderTile(
    tile: Tile,
    posX: number,
    posY: number,
    width: number,
    height: number,
    color: string
  ) {
    this.ctx.fillStyle = color || '#d8d8d8';
    this.ctx.fillRect(posX, posY, width, height);
    this.ctx.fillStyle = 'black';
  
    if (!tile.textStyleSet) {
      tile.setTextStyle(this.ctx);
    }
  
    const val = tile.value;
    const text = val ? `${val}`: '';
    const x = posX + Math.floor(width / 2);
    const y = posY + Math.floor(height / 2);
  
    this.ctx.fillText(text, x, y);
  }

}



