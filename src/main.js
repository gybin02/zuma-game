// 主入口 — 游戏循环与状态管理
import { Path } from './path.js';
import { Chain } from './chain.js';
import { Shooter } from './shooter.js';
import { BulletManager } from './bullet.js';
import { EffectsManager } from './effects.js';
import { LEVELS } from './level.js';
import { BALL_RADIUS, COLORS } from './ball.js';
import { FEEL } from './feel.js';
import log from './logger.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 适配屏幕
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth, 900);
  canvas.height = Math.min(window.innerHeight, 650);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 游戏状态
const STATE = { MENU: 0, PLAYING: 1, WIN: 2, LOSE: 3, PAUSED: 4 };
let state = STATE.MENU;
let currentLevel = 0;
let score = 0;

// 游戏对象
let path, chain, shooter, bullets, effects;
let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
let lastTime = 0;

function initLevel(levelIdx) {
  const levelData = LEVELS[levelIdx];
  const w = canvas.width, h = canvas.height;
  const controlPoints = levelData.getPath(w, h);

  path = new Path(controlPoints);
  chain = new Chain(path, levelData);

  // 支持自定义射手位置
  const sp = levelData.shooterPos;
  const sx = sp ? w * sp.xRatio : w / 2;
  const sy = sp ? h * sp.yRatio : h / 2;
  shooter = new Shooter(sx, sy, levelData.colorCount);

  bullets = new BulletManager();
  effects = new EffectsManager();
  score = 0;
  state = STATE.PLAYING;
  log.info('game', `关卡初始化`, { level: levelData.id, name: levelData.name, colors: levelData.colorCount, speed: levelData.ballSpeed, totalBalls: levelData.totalBalls });
}

// 游戏主循环
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // 限制最大 dt
  lastTime = timestamp;

  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  if (state !== STATE.PLAYING) return;

  chain.update(dt);
  bullets.update(dt, canvas.width, canvas.height);
  effects.update(dt);
  shooter.update(dt);
  shooter.aimAt(mouseX, mouseY);

  // 子弹碰撞检测
  const hitResult = bullets.checkCollision(chain);
  if (hitResult) {
    // 插入涟漪特效
    const insertedBall = hitResult.result;
    if (insertedBall) {
      effects.addInsertRipple(insertedBall.x, insertedBall.y, insertedBall.color.fill);
    }
  }

  // 检查消除结果（包括连锁消除）
  if (chain.lastEliminateResult) {
    const { count, combo, x, y, color } = chain.lastEliminateResult;
    const points = count * 10 * combo;
    score += points;
    log.info('game', `得分 +${points}`, { count, combo, totalScore: score });
    effects.addEliminateEffect(x, y, color);
    effects.addScorePopup(x, y, points, combo);
    // 消除画面震动（combo越高震动越大）
    effects.triggerShake(FEEL.comboShakeBase + combo * FEEL.comboShakePerLevel);
    // combo ≥ 2 时闪白
    if (combo >= 2) {
      effects.triggerFlash(FEEL.comboFlashAlpha * Math.min(combo, 5));
    }
    chain.lastEliminateResult = null;
  }

  // 胜利条件
  if (chain.allSpawned && chain.isEmpty) {
    state = STATE.WIN;
    log.info('game', `🎉 关卡通过！`, { score, level: currentLevel + 1 });
  }

  // 失败条件
  if (chain.reachedEnd) {
    state = STATE.LOSE;
    log.info('game', `💀 游戏失败`, { score, level: currentLevel + 1, ballsRemaining: chain.balls.length });
  }
}

function render() {
  // 背景（在震动前绘制，覆盖全屏）
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 背景装饰
  drawBackground();

  if (state === STATE.MENU) {
    drawMenu();
    return;
  }

  // 应用画面震动
  ctx.save();
  effects.applyShake(ctx);

  // 轨道
  path.draw(ctx);

  // 轨道终点标记
  drawEndPoint();

  // 珠子链
  chain.draw(ctx);

  // 子弹
  bullets.draw(ctx);

  // 射手
  shooter.draw(ctx);

  // 瞄准线
  drawAimLine();

  // 特效
  effects.draw(ctx);

  // 恢复画面震动变换
  ctx.restore();

  // HUD（不受震动影响）
  drawHUD();

  // 胜利/失败画面
  if (state === STATE.WIN) drawWin();
  if (state === STATE.LOSE) drawLose();
}

function drawBackground() {
  // 简单星空背景
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let i = 0; i < 50; i++) {
    const x = (i * 137.5) % canvas.width;
    const y = (i * 97.3) % canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEndPoint() {
  const end = path.getPointAtDistance(path.totalLength);
  ctx.beginPath();
  ctx.arc(end.x, end.y, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#e74c3c';
  ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 300) * 0.3;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText('☠', end.x, end.y + 6);
}

function drawAimLine() {
  if (state !== STATE.PLAYING) return;

  const color = COLORS[shooter.currentColorIndex];
  const cos = Math.cos(shooter.angle);
  const sin = Math.sin(shooter.angle);
  const startDist = shooter.radius + 15;

  // 渐变点状瞄准线
  for (let i = 0; i < FEEL.aimDotCount; i++) {
    const t = (i + 1) / FEEL.aimDotCount;
    const d = startDist + t * FEEL.aimLineLength;
    const x = shooter.x + cos * d;
    const y = shooter.y + sin * d;
    const alpha = 0.5 * (1 - t);
    const size = 3 * (1 - t * 0.5);

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color.fill;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`分数: ${score}`, 10, 25);
  ctx.fillText(`关卡: ${LEVELS[currentLevel].name}`, 10, 48);

  // 剩余球数
  const remaining = chain.totalBalls - chain.spawnedCount + chain.balls.length;
  ctx.textAlign = 'right';
  ctx.fillText(`剩余: ${remaining}`, canvas.width - 10, 25);

  // combo 显示
  if (chain.comboCount > 1) {
    ctx.textAlign = 'center';
    ctx.font = `bold ${16 + chain.comboCount * 2}px Arial`;
    ctx.fillStyle = '#ffeaa7';
    ctx.fillText(`COMBO x${chain.comboCount}!`, canvas.width / 2, 30);
  }
}

function drawMenu() {
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🐸 祖 玛', canvas.width / 2, canvas.height / 2 - 100);

  ctx.font = '18px Arial';
  ctx.fillStyle = '#aaa';
  ctx.fillText('选择关卡开始游戏', canvas.width / 2, canvas.height / 2 - 55);

  ctx.font = '13px Arial';
  ctx.fillStyle = '#666';
  ctx.fillText('鼠标瞄准 | 左键射击 | 右键/空格换球', canvas.width / 2, canvas.height / 2 - 30);

  // 关卡选择（双列布局）
  ctx.font = '14px Arial';
  const cols = 2;
  const colW = 180;
  const startX = canvas.width / 2 - colW * (cols / 2) + colW / 2;
  const startY = canvas.height / 2 - 5;
  for (let i = 0; i < LEVELS.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * colW;
    const y = startY + row * 26;
    const level = LEVELS[i];
    const stars = '★'.repeat(Math.min(level.colorCount - 2, 4));
    ctx.fillStyle = '#74b9ff';
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}. ${level.name}  ${stars}`, x, y);
  }
}

function drawWin() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2ecc71';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 关卡通过!', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '18px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('点击继续', canvas.width / 2, canvas.height / 2 + 55);
}

function drawLose() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#e74c3c';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('💀 游戏结束', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '18px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('点击重试', canvas.width / 2, canvas.height / 2 + 55);
}

// 输入处理
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
  if (state === STATE.MENU) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const cols = 2, colW = 180;
    const startX = canvas.width / 2 - colW * (cols / 2) + colW / 2;
    const startY = canvas.height / 2 - 5;
    for (let i = 0; i < LEVELS.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const lx = startX + col * colW;
      const ly = startY + row * 26;
      if (Math.abs(clickX - lx) < colW / 2 && Math.abs(clickY - ly) < 13) {
        currentLevel = i;
        initLevel(currentLevel);
        return;
      }
    }
    // 默认开始第一关
    currentLevel = 0;
    initLevel(currentLevel);
    return;
  }

  if (state === STATE.WIN) {
    currentLevel = (currentLevel + 1) % LEVELS.length;
    initLevel(currentLevel);
    return;
  }

  if (state === STATE.LOSE) {
    initLevel(currentLevel);
    return;
  }

  if (state === STATE.PLAYING) {
    const bullet = shooter.shoot();
    if (bullet) {
      bullets.add(bullet);
      effects.triggerShake(FEEL.screenShakePower);
    }
  }
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (state === STATE.PLAYING) {
    shooter.swap();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && state === STATE.PLAYING) {
    e.preventDefault();
    shooter.swap();
  }
});

// 启动
requestAnimationFrame(gameLoop);
