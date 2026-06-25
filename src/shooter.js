// 射手（青蛙）
import { Ball, BALL_RADIUS, COLORS, randomColorIndex } from './ball.js';
import { angleBetween } from './utils.js';
import log from './logger.js';

export class Shooter {
  constructor(x, y, colorCount) {
    this.x = x;
    this.y = y;
    this.angle = -Math.PI / 2; // 初始朝上
    this.colorCount = colorCount;
    this.currentColorIndex = randomColorIndex(colorCount);
    this.nextColorIndex = randomColorIndex(colorCount);
    this.radius = 28;
  }

  aimAt(mouseX, mouseY) {
    this.angle = angleBetween({ x: this.x, y: this.y }, { x: mouseX, y: mouseY });
  }

  shoot() {
    const bullet = {
      x: this.x + Math.cos(this.angle) * this.radius,
      y: this.y + Math.sin(this.angle) * this.radius,
      vx: Math.cos(this.angle) * 800,
      vy: Math.sin(this.angle) * 800,
      colorIndex: this.currentColorIndex,
      radius: BALL_RADIUS,
      active: true,
    };

    // 换球
    this.currentColorIndex = this.nextColorIndex;
    this.nextColorIndex = randomColorIndex(this.colorCount);
    log.debug('shooter', `射击`, { firedColor: bullet.colorIndex, nextColor: this.currentColorIndex });

    return bullet;
  }

  swap() {
    [this.currentColorIndex, this.nextColorIndex] = [this.nextColorIndex, this.currentColorIndex];
    log.debug('shooter', `换球`, { current: this.currentColorIndex, next: this.nextColorIndex });
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 底座
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = '#2d5016';
    ctx.fill();
    ctx.strokeStyle = '#1a3a0a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 身体
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#4CAF50';
    ctx.fill();

    // 旋转到瞄准方向
    ctx.rotate(this.angle);

    // 嘴巴/发射口
    ctx.beginPath();
    ctx.arc(this.radius - 5, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#1a3a0a';
    ctx.fill();

    // 当前球（显示在发射口）
    ctx.beginPath();
    ctx.arc(this.radius - 5, 0, BALL_RADIUS - 3, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[this.currentColorIndex].fill;
    ctx.fill();
    ctx.strokeStyle = COLORS[this.currentColorIndex].stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // 下一球（显示在底部）
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.radius + 20, BALL_RADIUS - 4, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[this.nextColorIndex].fill;
    ctx.fill();
    ctx.strokeStyle = COLORS[this.nextColorIndex].stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // "NEXT" 文字
    ctx.fillStyle = '#fff';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NEXT', this.x, this.y + this.radius + 36);
  }
}
