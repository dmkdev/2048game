import getRandom from '@/utils/getRandom';

export class Tile {
  value: number;
  needRender = true;
  textStyleSet = false;

  constructor(value = 2) {
    this.value = value;
  }

  get color() {
    return `rgb(${getRandom(255)}, ${getRandom(255)}, ${getRandom(255)})`;
  }

  setTextStyle(ctx: CanvasRenderingContext2D){
    ctx.font = '36px Comic Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this.textStyleSet = true;
  }
  
}
