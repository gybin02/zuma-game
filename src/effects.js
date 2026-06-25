// 粒子特效
export class EffectsManager {
  constructor() {
    this.particles = [];
    this.scorePopups = [];
  }

  // 消除时产生粒子
  addEliminateEffect(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
      const speed = 100 + Math.random() * 150;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: color,
        size: 3 + Math.random() * 4,
      });
    }
  }

  // 得分弹出
  addScorePopup(x, y, score, combo) {
    this.scorePopups.push({
      x, y,
      text: combo > 1 ? `+${score} x${combo}!` : `+${score}`,
      life: 1,
      vy: -60,
      color: combo > 2 ? '#ff6b6b' : combo > 1 ? '#ffeaa7' : '#fff',
      size: combo > 2 ? 20 : combo > 1 ? 16 : 14,
    });
  }

  update(dt) {
    // 粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // 重力
      p.life -= dt * 2;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 分数弹出
    for (let i = this.scorePopups.length - 1; i >= 0; i--) {
      const s = this.scorePopups[i];
      s.y += s.vy * dt;
      s.life -= dt * 1.5;
      if (s.life <= 0) {
        this.scorePopups.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // 粒子
    for (const p of this.particles) {
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 分数
    for (const s of this.scorePopups) {
      ctx.globalAlpha = s.life;
      ctx.font = `bold ${s.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillStyle = s.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeText(s.text, s.x, s.y);
      ctx.fillText(s.text, s.x, s.y);
    }
    ctx.globalAlpha = 1;
  }
}
