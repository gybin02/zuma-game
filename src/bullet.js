// 子弹管理
import { BALL_RADIUS, COLORS } from './ball.js';
import log from './logger.js';

export class BulletManager {
  constructor() {
    this.bullets = [];
  }

  add(bullet) {
    this.bullets.push(bullet);
    log.debug('bullet', `发射子弹`, { color: bullet.colorIndex, x: bullet.x.toFixed(0), y: bullet.y.toFixed(0) });
  }

  update(dt, canvasWidth, canvasHeight) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // 超出画布则移除
      if (b.x < -50 || b.x > canvasWidth + 50 || b.y < -50 || b.y > canvasHeight + 50) {
        log.debug('bullet', `子弹飞出画布，移除`);
        this.bullets.splice(i, 1);
      }
    }
  }

  // 检测与链的碰撞
  checkCollision(chain) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      const hitIdx = chain.findHitBall(b, b.radius);
      if (hitIdx >= 0) {
        // 命中！从子弹列表移除
        this.bullets.splice(i, 1);
        // 插入到链中
        const result = chain.insertBall(b, hitIdx);
        return { hitIdx, result };
      }
    }
    return null;
  }

  draw(ctx) {
    for (const b of this.bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[b.colorIndex].fill;
      ctx.fill();
      ctx.strokeStyle = COLORS[b.colorIndex].stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 拖尾效果
      ctx.beginPath();
      ctx.arc(b.x - b.vx * 0.02, b.y - b.vy * 0.02, BALL_RADIUS * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[b.colorIndex].highlight;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}
