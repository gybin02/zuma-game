// 珠子类
import { FEEL } from './feel.js';

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
    this.dist = 0;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scale = 1;
    this.opacity = 1;

    // 动画状态
    this.bounceTimer = 0;   // 插入弹跳
    this.flashTimer = 0;    // 消除前闪烁
    this.dangerTint = 0;    // 危险区着色 0~1
  }

  get color() {
    return COLORS[this.colorIndex];
  }

  updateAnim(dt) {
    if (this.bounceTimer > 0) {
      this.bounceTimer -= dt;
      const t = 1 - this.bounceTimer / FEEL.insertBounceDuration;
      if (t < 0.5) {
        this.scale = 1 + (FEEL.insertBounceScale - 1) * (t / 0.5);
      } else {
        this.scale = FEEL.insertBounceScale - (FEEL.insertBounceScale - 1) * ((t - 0.5) / 0.5);
      }
    }

    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      const t = 1 - this.flashTimer / FEEL.eliminateExpandDuration;
      this.scale = 1 + (FEEL.eliminateExpandScale - 1) * Math.sin(t * Math.PI);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    // 主体
    ctx.beginPath();
    ctx.arc(0, 0, BALL_RADIUS - 1, 0, Math.PI * 2);
    // 危险区着色混合
    if (this.dangerTint > 0) {
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() / (1000 / FEEL.dangerPulseSpeed));
      ctx.fillStyle = this.color.fill;
      ctx.fill();
      ctx.globalAlpha = this.opacity * this.dangerTint * pulse * 0.4;
      ctx.fillStyle = FEEL.dangerTintColor;
      ctx.fill();
      ctx.globalAlpha = this.opacity;
    } else {
      ctx.fillStyle = this.color.fill;
      ctx.fill();
    }
    ctx.strokeStyle = this.color.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(-4, -4, BALL_RADIUS * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = this.color.highlight;
    ctx.globalAlpha = this.opacity * 0.5;
    ctx.fill();

    // 闪烁白光
    if (this.flashTimer > 0) {
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }

    ctx.restore();
  }
}

export function randomColorIndex(count) {
  return Math.floor(Math.random() * count);
}
