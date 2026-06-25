// 珠子类
export const BALL_RADIUS = 16;
export const BALL_DIAMETER = BALL_RADIUS * 2;

export const COLORS = [
  { name: 'red', fill: '#e74c3c', stroke: '#c0392b', highlight: '#ff6b6b' },
  { name: 'blue', fill: '#3498db', stroke: '#2980b9', highlight: '#74b9ff' },
  { name: 'green', fill: '#2ecc71', stroke: '#27ae60', highlight: '#55efc4' },
  { name: 'yellow', fill: '#f1c40f', stroke: '#f39c12', highlight: '#ffeaa7' },
  { name: 'purple', fill: '#9b59b6', stroke: '#8e44ad', highlight: '#d6a2e8' },
  { name: 'cyan', fill: '#00cec9', stroke: '#00b894', highlight: '#81ecec' },
];

let nextId = 0;

export class Ball {
  constructor(colorIndex) {
    this.id = nextId++;
    this.colorIndex = colorIndex;
    this.dist = 0;        // 轨道上的弧长位置
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scale = 1;       // 用于消除动画
    this.opacity = 1;
  }

  get color() {
    return COLORS[this.colorIndex];
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    // 主体
    ctx.beginPath();
    ctx.arc(0, 0, BALL_RADIUS - 1, 0, Math.PI * 2);
    ctx.fillStyle = this.color.fill;
    ctx.fill();
    ctx.strokeStyle = this.color.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(-4, -4, BALL_RADIUS * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = this.color.highlight;
    ctx.globalAlpha = this.opacity * 0.5;
    ctx.fill();

    ctx.restore();
  }
}

export function randomColorIndex(count) {
  return Math.floor(Math.random() * count);
}
