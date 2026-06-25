// 射手（青蛙）— 含后坐力、冷却
import { Ball, BALL_RADIUS, COLORS, randomColorIndex } from './ball.js';
import { angleBetween } from './utils.js';
import { FEEL } from './feel.js';
import log from './logger.js';

export class Shooter {
  constructor(x, y, colorCount) {
    this.x = x;
    this.y = y;
    this.angle = -Math.PI / 2;
    this.colorCount = colorCount;
    this.currentColorIndex = randomColorIndex(colorCount);
    this.nextColorIndex = randomColorIndex(colorCount);
    this.radius = 28;

    // 手感状态
    this.recoilTimer = 0;
    this.cooldownTimer = 0;
    this.scale = 1;
    this.swapAnim = 0; // 换球动画
  }

  aimAt(mouseX, mouseY) {
    this.angle = angleBetween({ x: this.x, y: this.y }, { x: mouseX, y: mouseY });
  }

  get canShoot() {
    return this.cooldownTimer <= 0;
  }

  update(dt) {
    // 后坐力动画
    if (this.recoilTimer > 0) {
      this.recoilTimer -= dt;
      const t = 1 - this.recoilTimer / FEEL.recoilDuration;
      // 弹性回弹：先缩后弹
      if (t < 0.4) {
        this.scale = 1 - (1 - FEEL.recoilScale) * (t / 0.4);
      } else {
        const bounce = (t - 0.4) / 0.6;
        this.scale = FEEL.recoilScale + (1 - FEEL.recoilScale) * bounce;
        // 轻微过冲
        if (bounce > 0.7 && bounce < 0.9) {
          this.scale = 1 + 0.03;
        }
      }
    } else {
      this.scale = 1;
    }

    // 冷却
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= dt;
    }

    // 换球动画
    if (this.swapAnim > 0) {
      this.swapAnim -= dt * 8;
    }
  }

  shoot() {
    if (!this.canShoot) return null;

    const bullet = {
      x: this.x + Math.cos(this.angle) * this.radius,
      y: this.y + Math.sin(this.angle) * this.radius,
      vx: Math.cos(this.angle) * FEEL.bulletSpeed,
      vy: Math.sin(this.angle) * FEEL.bulletSpeed,
      colorIndex: this.currentColorIndex,
      radius: BALL_RADIUS,
      active: true,
    };

    // 触发后坐力和冷却
    this.recoilTimer = FEEL.recoilDuration;
    this.cooldownTimer = FEEL.shootCooldown;

    // 换球
    this.currentColorIndex = this.nextColorIndex;
    this.nextColorIndex = randomColorIndex(this.colorCount);
    log.debug('shooter', `射击`, { firedColor: bullet.colorIndex, nextColor: this.currentColorIndex });

    return bullet;
  }

  swap() {
    [this.currentColorIndex, this.nextColorIndex] = [this.nextColorIndex, this.currentColorIndex];
    this.swapAnim = 1;
    log.debug('shooter', `换球`, { current: this.currentColorIndex, next: this.nextColorIndex });
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

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

    // 眼睛
    ctx.save();
    ctx.rotate(this.angle);
    // 左眼
    ctx.beginPath();
    ctx.arc(8, -10, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -10, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    // 右眼
    ctx.beginPath();
    ctx.arc(8, 10, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, 10, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();

    // 嘴巴/发射口
    ctx.beginPath();
    ctx.arc(this.radius - 5, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#1a3a0a';
    ctx.fill();

    // 当前球
    ctx.beginPath();
    ctx.arc(this.radius - 5, 0, BALL_RADIUS - 3, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[this.currentColorIndex].fill;
    ctx.fill();
    ctx.strokeStyle = COLORS[this.currentColorIndex].stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore(); // 恢复 rotate

    ctx.restore(); // 恢复 translate + scale

    // 下一球（带换球动画）
    const nextY = this.y + this.radius + 20;
    const swapOffset = this.swapAnim > 0 ? Math.sin(this.swapAnim * Math.PI) * 5 : 0;
    const nextScale = 1 + swapOffset * 0.02;
    ctx.save();
    ctx.translate(this.x, nextY + swapOffset);
    ctx.scale(nextScale, nextScale);
    ctx.beginPath();
    ctx.arc(0, 0, BALL_RADIUS - 4, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[this.nextColorIndex].fill;
    ctx.fill();
    ctx.strokeStyle = COLORS[this.nextColorIndex].stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#888';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NEXT', this.x, nextY + 16);
  }
}
