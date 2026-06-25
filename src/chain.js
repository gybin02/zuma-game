// 珠子链管理 — 移动、插入、消除、连锁
import { Ball, BALL_DIAMETER, COLORS, randomColorIndex } from './ball.js';
import { distance } from './utils.js';
import { FEEL } from './feel.js';
import log from './logger.js';

export class Chain {
  constructor(path, level) {
    this.path = path;
    this.level = level;
    this.balls = [];
    this.speed = level.ballSpeed;
    this.spawnTimer = 0;
    this.spawnedCount = 0;
    this.totalBalls = level.totalBalls;
    this.colorCount = level.colorCount;
    this.paused = false;

    // 消除动画相关
    this.eliminating = [];
    this.merging = false;
    this.mergeGaps = [];

    this.comboCount = 0;
    this.lastEliminateTime = 0;
    this.lastEliminateResult = null;

    // 生成策略状态
    this._lastSpawnColor = -1;
    this._sameColorStreak = 0;
  }

  get allSpawned() {
    return this.spawnedCount >= this.totalBalls;
  }

  get isEmpty() {
    return this.balls.length === 0 && this.eliminating.length === 0;
  }

  get reachedEnd() {
    if (this.balls.length === 0) return false;
    return this.balls[this.balls.length - 1].dist >= this.path.totalLength;
  }

  update(dt) {
    if (this.paused) return;

    // 生成新球
    this._spawnBalls(dt);

    // 移动球链
    this._moveBalls(dt);

    // 处理回退接合
    this._processMerges(dt);

    // 更新消除动画
    this._updateEliminating(dt);

    // 更新球动画（弹跳、危险区着色）
    this._updateBallAnims(dt);

    // 更新球的屏幕坐标
    this._updatePositions();
  }

  _spawnBalls(dt) {
    if (this.allSpawned) return;

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.level.spawnInterval) {
      this.spawnTimer = 0;
      const colorIdx = this._pickSpawnColor();
      const ball = new Ball(colorIdx);
      ball.dist = 0;
      this.balls.unshift(ball);
      this.spawnedCount++;
      log.debug('chain', `生成珠子 #${ball.id}`, { color: ball.colorIndex, spawned: this.spawnedCount, total: this.totalBalls });
    }
  }

  // 智能颜色选取：成段生成 + 偏向链上已有颜色
  _pickSpawnColor() {
    // 连续同色：有概率延续前一个颜色
    if (this._lastSpawnColor >= 0 &&
        this._sameColorStreak < FEEL.spawnMaxSameStreak &&
        Math.random() < FEEL.spawnSameColorChance) {
      this._sameColorStreak++;
      return this._lastSpawnColor;
    }

    let color;
    // 偏向链上已有颜色，增加可匹配性
    if (this.balls.length > 0 && Math.random() < FEEL.spawnChainColorBias) {
      const chainColors = [...new Set(this.balls.slice(0, 30).map(b => b.colorIndex))];
      color = chainColors[Math.floor(Math.random() * chainColors.length)];
    } else {
      color = randomColorIndex(this.colorCount);
    }

    this._lastSpawnColor = color;
    this._sameColorStreak = 1;
    return color;
  }

  _moveBalls(dt) {
    if (this.balls.length === 0) return;

    // 找到所有链段的头部，推动整段前进
    // 链段由间隙分隔：如果 balls[i].dist - balls[i-1].dist > BALL_DIAMETER * 1.1 则有间隙
    const segments = this._getSegments();

    for (const seg of segments) {
      // 检查这段是否在 merge gap 的后部（后段不主动前进）
      if (this._isBackSegment(seg)) continue;

      // 推动链段头部
      const headBall = this.balls[seg.end];
      const advance = this.speed * dt;
      for (let i = seg.start; i <= seg.end; i++) {
        this.balls[i].dist += advance;
      }
    }

    // 确保同段内球紧密排列
    this._enforceSpacing();
  }

  _getSegments() {
    const segments = [];
    if (this.balls.length === 0) return segments;

    let start = 0;
    for (let i = 1; i < this.balls.length; i++) {
      if (this.balls[i].dist - this.balls[i - 1].dist > BALL_DIAMETER * 1.5) {
        segments.push({ start, end: i - 1 });
        start = i;
      }
    }
    segments.push({ start, end: this.balls.length - 1 });
    return segments;
  }

  _isBackSegment(seg) {
    for (const gap of this.mergeGaps) {
      // 通过球 ID 修正索引
      this._fixGapIndex(gap);
      if (gap.backStart >= 0 && seg.start === gap.backStart) return true;
    }
    return false;
  }

  _fixGapIndex(gap) {
    // 根据 backBallId 重新定位索引
    if (gap.backBallId !== undefined) {
      const idx = this.balls.findIndex(b => b.id === gap.backBallId);
      if (idx >= 0) {
        gap.backStart = idx;
      } else {
        gap.backStart = -1; // 球已被移除，标记无效
      }
    }
  }

  _enforceSpacing() {
    // 从前往后，确保同一段内每个球和前一个球间距 = BALL_DIAMETER
    const segments = this._getSegments();
    for (const seg of segments) {
      for (let i = seg.start + 1; i <= seg.end; i++) {
        const gap = this.balls[i].dist - this.balls[i - 1].dist;
        if (gap < 0) {
          log.warn('chain', `球间距为负！`, { ballA: this.balls[i-1].id, ballB: this.balls[i].id, gap: gap.toFixed(1) });
        }
        if (gap < BALL_DIAMETER) {
          this.balls[i].dist = this.balls[i - 1].dist + BALL_DIAMETER;
        }
      }
    }
  }

  _processMerges(dt) {
    const mergeSpeed = this.speed * FEEL.mergeAccelMultiplier;
    const toRemove = [];

    for (let g = 0; g < this.mergeGaps.length; g++) {
      const gap = this.mergeGaps[g];

      // 通过球 ID 修正索引
      this._fixGapIndex(gap);

      // 边界检查：索引失效则移除
      if (gap.backStart <= 0 || gap.backStart >= this.balls.length) {
        log.warn('merge', `gap 索引失效，移除`, { backStart: gap.backStart, backBallId: gap.backBallId, ballCount: this.balls.length });
        toRemove.push(g);
        continue;
      }

      const frontBall = this.balls[gap.backStart - 1];
      const backBall = this.balls[gap.backStart];

      // 计算当前间距
      const currentGap = backBall.dist - frontBall.dist;

      // 如果已经接合
      if (currentGap <= BALL_DIAMETER) {
        log.info('merge', `链段接合`, { frontBall: frontBall.id, backBall: backBall.id, gap: currentGap.toFixed(1) });
        // 对齐
        backBall.dist = frontBall.dist + BALL_DIAMETER;
        for (let i = gap.backStart + 1; i < this.balls.length; i++) {
          if (this.balls[i].dist - this.balls[i - 1].dist < BALL_DIAMETER) {
            this.balls[i].dist = this.balls[i - 1].dist + BALL_DIAMETER;
          }
        }
        toRemove.push(g);

        // 接合后检查消除（连锁！）
        this._checkEliminate(gap.backStart - 1);
      } else {
        // 后段向前回退（dist 减小方向）
        const advance = Math.min(mergeSpeed * dt, currentGap - BALL_DIAMETER);
        log.debug('merge', `后段回退中`, { gap: currentGap.toFixed(1), advance: advance.toFixed(2), backBallId: backBall.id });
        for (let i = gap.backStart; i < this.balls.length; i++) {
          this.balls[i].dist -= advance;
        }
      }
    }

    // 移除已完成的 gap
    for (let i = toRemove.length - 1; i >= 0; i--) {
      this.mergeGaps.splice(toRemove[i], 1);
    }
  }

  _updateEliminating(dt) {
    for (let i = this.eliminating.length - 1; i >= 0; i--) {
      const ball = this.eliminating[i];
      ball.scale -= dt * FEEL.eliminateShrinkSpeed;
      ball.opacity -= dt * FEEL.eliminateShrinkSpeed;
      if (ball.scale <= 0) {
        this.eliminating.splice(i, 1);
      }
    }
  }

  _updateBallAnims(dt) {
    const dangerStart = this.path.totalLength * FEEL.dangerZoneThreshold;
    for (const ball of this.balls) {
      ball.updateAnim(dt);
      // 危险区着色
      if (ball.dist > dangerStart) {
        ball.dangerTint = Math.min(1, (ball.dist - dangerStart) / (this.path.totalLength - dangerStart));
      } else {
        ball.dangerTint = 0;
      }
    }
  }

  _updatePositions() {
    for (const ball of this.balls) {
      const p = this.path.getPointAtDistance(ball.dist);
      ball.x = p.x;
      ball.y = p.y;
      ball.angle = p.angle;
    }
    for (const ball of this.eliminating) {
      // 位置保持不变，只是缩放
    }
  }

  // 射击命中后插入球
  insertBall(bullet, hitIndex) {
    const hitBall = this.balls[hitIndex];
    log.info('chain', `子弹命中`, { hitBallId: hitBall.id, hitIndex, bulletColor: bullet.colorIndex, hitColor: hitBall.colorIndex });

    // 确定插入位置（前或后）
    const bulletDist = this.path.getNearestDistance({ x: bullet.x, y: bullet.y });
    let insertIdx;
    if (bulletDist <= hitBall.dist) {
      insertIdx = hitIndex;
    } else {
      insertIdx = hitIndex + 1;
    }

    // 创建新球并插入
    const newBall = new Ball(bullet.colorIndex);
    if (insertIdx === 0) {
      newBall.dist = this.balls[0].dist - BALL_DIAMETER;
    } else if (insertIdx >= this.balls.length) {
      newBall.dist = this.balls[this.balls.length - 1].dist + BALL_DIAMETER;
    } else {
      newBall.dist = (this.balls[insertIdx - 1].dist + this.balls[insertIdx].dist) / 2;
    }

    this.balls.splice(insertIdx, 0, newBall);
    newBall.bounceTimer = FEEL.insertBounceDuration; // 弹跳动画
    log.info('chain', `插入珠子 #${newBall.id}`, { insertIdx, dist: newBall.dist.toFixed(1), color: newBall.colorIndex, chainLen: this.balls.length });

    // 推开后方球
    for (let i = insertIdx + 1; i < this.balls.length; i++) {
      const minDist = this.balls[i - 1].dist + BALL_DIAMETER;
      if (this.balls[i].dist < minDist) {
        this.balls[i].dist = minDist;
      }
    }

    // 更新位置后检查消除
    this._updatePositions();
    this._checkEliminate(insertIdx);

    return newBall;
  }

  _checkEliminate(index) {
    if (index < 0 || index >= this.balls.length) return;

    const color = this.balls[index].colorIndex;
    let left = index, right = index;

    while (left > 0 && this.balls[left - 1].colorIndex === color) left--;
    while (right < this.balls.length - 1 && this.balls[right + 1].colorIndex === color) right++;

    const matchCount = right - left + 1;
    if (matchCount >= 3) {
      const matchIds = this.balls.slice(left, right + 1).map(b => b.id);
      log.info('chain', `消除 ${matchCount} 个珠子`, { color, matchIds, left, right, combo: this.comboCount + 1 });

      // 消除前闪烁
      for (let i = left; i <= right; i++) {
        this.balls[i].flashTimer = FEEL.eliminateExpandDuration;
      }

      // 消除
      const removed = this.balls.splice(left, matchCount);
      for (const ball of removed) {
        this.eliminating.push(ball);
      }

      // combo
      const now = Date.now();
      if (now - this.lastEliminateTime < 1500) {
        this.comboCount++;
      } else {
        this.comboCount = 1;
      }
      this.lastEliminateTime = now;

      // 记录消除结果供外部使用
      const centerBall = removed[Math.floor(removed.length / 2)];
      this.lastEliminateResult = {
        count: matchCount,
        combo: this.comboCount,
        x: centerBall.x,
        y: centerBall.y,
        color: centerBall.color.fill,
      };

      // 如果消除后还有前后段，设置 merge gap（用球 ID 追踪）
      if (left > 0 && left < this.balls.length) {
        log.info('merge', `创建 merge gap`, { backStart: left, backBallId: this.balls[left].id, frontBallId: this.balls[left - 1].id, gap: (this.balls[left].dist - this.balls[left - 1].dist).toFixed(1) });
        this.mergeGaps.push({
          backStart: left,
          backBallId: this.balls[left].id,
        });
      }

      return { count: matchCount, combo: this.comboCount };
    }
    return null;
  }

  // 碰撞检测：找到最近的球
  findHitBall(pos, radius) {
    let minDist = Infinity;
    let hitIdx = -1;
    for (let i = 0; i < this.balls.length; i++) {
      const d = distance(pos, this.balls[i]);
      if (d < minDist && d < BALL_DIAMETER + radius) {
        minDist = d;
        hitIdx = i;
      }
    }
    return hitIdx;
  }

  draw(ctx) {
    // 画链上的球
    for (const ball of this.balls) {
      ball.draw(ctx);
    }
    // 画消除中的球
    for (const ball of this.eliminating) {
      ball.draw(ctx);
    }
  }
}
