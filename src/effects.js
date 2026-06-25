// 粒子特效 + 画面效果
import { FEEL } from './feel.js';

export class EffectsManager {
  constructor() {
    this.particles = [];
    this.scorePopups = [];
    this.screenShake = { x: 0, y: 0, timer: 0, power: 0 };
    this.flash = { alpha: 0, timer: 0 };
  }

  // 消除时产生粒子（增强版）
  addEliminateEffect(x, y, color) {
    const count = FEEL.eliminateParticleCount;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const speed = 120 + Math.random() * 200;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 2 + Math.random() * 5,
        type: 'burst',
      });
    }
    // 外圈光环粒子
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * 60,
        vy: Math.sin(angle) * 60,
        life: 0.6,
        color: '#fff',
        size: 6 + Math.random() * 3,
        type: 'ring',
      });
    }
  }

  // 插入涟漪
  addInsertRipple(x, y, color) {
    for (let i = 0; i < FEEL.insertRippleCount; i++) {
      const angle = (Math.PI * 2 * i) / FEEL.insertRippleCount;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * 50,
        vy: Math.sin(angle) * 50,
        life: 0.5,
        color,
        size: 2 + Math.random() * 2,
        type: 'ripple',
      });
    }
  }

  // 画面震动
  triggerShake(power) {
    this.screenShake.power = power || FEEL.screenShakePower;
    this.screenShake.timer = FEEL.screenShakeDuration;
  }

  // 画面闪白
  triggerFlash(alpha) {
    this.flash.alpha = alpha || FEEL.comboFlashAlpha;
    this.flash.timer = 0.1;
  }

  // 得分弹出（增强版：弧线运动）
  addScorePopup(x, y, score, combo) {
    const size = FEEL.comboScoreSize + (combo - 1) * FEEL.comboScoreSizePerLevel;
    this.scorePopups.push({
      x, y,
      originX: x,
      text: combo > 1 ? `+${score} x${combo}!` : `+${score}`,
      life: 1.2,
      vy: -70 - combo * 10,
      vx: (Math.random() - 0.5) * 40,
      color: combo > 3 ? '#ff6b6b' : combo > 2 ? '#fdcb6e' : combo > 1 ? '#ffeaa7' : '#fff',
      size,
      wobble: combo > 1 ? combo * 0.8 : 0,
    });
  }

  update(dt) {
    // 粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === 'burst') p.vy += 250 * dt;
      p.life -= dt * (p.type === 'ring' ? 3 : 2.2);
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // 分数弹出
    for (let i = this.scorePopups.length - 1; i >= 0; i--) {
      const s = this.scorePopups[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy *= 0.98;
      s.life -= dt;
      if (s.life <= 0) this.scorePopups.splice(i, 1);
    }

    // 画面震动衰减
    if (this.screenShake.timer > 0) {
      this.screenShake.timer -= dt;
      const intensity = this.screenShake.timer / FEEL.screenShakeDuration;
      this.screenShake.x = (Math.random() - 0.5) * 2 * this.screenShake.power * intensity;
      this.screenShake.y = (Math.random() - 0.5) * 2 * this.screenShake.power * intensity;
    } else {
      this.screenShake.x = 0;
      this.screenShake.y = 0;
    }

    // 闪白衰减
    if (this.flash.timer > 0) {
      this.flash.timer -= dt;
    }
  }

  // 在渲染开始时应用画面震动
  applyShake(ctx) {
    if (this.screenShake.x || this.screenShake.y) {
      ctx.translate(this.screenShake.x, this.screenShake.y);
    }
  }

  draw(ctx) {
    // 粒子
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      const r = p.type === 'ring' ? p.size : p.size * Math.max(0.2, p.life);
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 分数
    for (const s of this.scorePopups) {
      const alpha = Math.min(1, s.life * 2);
      ctx.globalAlpha = alpha;
      // 抖动效果
      const offsetX = s.wobble ? Math.sin(Date.now() / 50) * s.wobble : 0;
      ctx.font = `bold ${s.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(s.text, s.x + offsetX, s.y);
      ctx.fillStyle = s.color;
      ctx.fillText(s.text, s.x + offsetX, s.y);
    }
    ctx.globalAlpha = 1;

    // 闪白
    if (this.flash.timer > 0) {
      ctx.globalAlpha = this.flash.alpha * (this.flash.timer / 0.1);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-20, -20, ctx.canvas.width + 40, ctx.canvas.height + 40);
      ctx.globalAlpha = 1;
    }
  }
}
