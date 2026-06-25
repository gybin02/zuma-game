// 轨道系统 — 贝塞尔曲线 + 弧长参数化
import { cubicBezierPoint, distance } from './utils.js';

export class Path {
  constructor(controlPointSets) {
    // controlPointSets: [[p0,p1,p2,p3], [p0,p1,p2,p3], ...]
    this.segments = controlPointSets;
    this.sampleCount = 1000;
    this.points = [];       // 采样点
    this.distances = [];    // 累计弧长
    this.totalLength = 0;
    this._sample();
  }

  _sample() {
    const pts = [];
    const segCount = this.segments.length;
    const samplesPerSeg = Math.ceil(this.sampleCount / segCount);

    for (let s = 0; s < segCount; s++) {
      const [p0, p1, p2, p3] = this.segments[s];
      const count = (s === segCount - 1) ? samplesPerSeg : samplesPerSeg;
      for (let i = 0; i <= count; i++) {
        // 避免重复端点
        if (s > 0 && i === 0) continue;
        const t = i / count;
        pts.push(cubicBezierPoint(p0, p1, p2, p3, t));
      }
    }

    this.points = pts;

    // 计算累计距离
    this.distances = [0];
    for (let i = 1; i < pts.length; i++) {
      this.distances[i] = this.distances[i - 1] + distance(pts[i - 1], pts[i]);
    }
    this.totalLength = this.distances[this.distances.length - 1];
  }

  // 根据弧长距离 d 获取路径上的点和方向
  getPointAtDistance(d) {
    d = Math.max(0, Math.min(this.totalLength, d));

    // 二分查找
    let lo = 0, hi = this.distances.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (this.distances[mid] <= d) lo = mid;
      else hi = mid;
    }

    const segLen = this.distances[hi] - this.distances[lo];
    const frac = segLen === 0 ? 0 : (d - this.distances[lo]) / segLen;

    const p = {
      x: this.points[lo].x + (this.points[hi].x - this.points[lo].x) * frac,
      y: this.points[lo].y + (this.points[hi].y - this.points[lo].y) * frac,
    };

    // 方向角
    const dx = this.points[hi].x - this.points[lo].x;
    const dy = this.points[hi].y - this.points[lo].y;
    const angle = Math.atan2(dy, dx);

    return { x: p.x, y: p.y, angle };
  }

  // 找最近路径点，返回对应弧长
  getNearestDistance(pos) {
    let minDist = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < this.points.length; i++) {
      const d = distance(pos, this.points[i]);
      if (d < minDist) {
        minDist = d;
        bestIdx = i;
      }
    }
    return this.distances[bestIdx];
  }

  // 绘制轨道（调试/装饰用）
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.strokeStyle = 'rgba(100, 80, 60, 0.3)';
    ctx.lineWidth = 28;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 轨道边缘
    ctx.strokeStyle = 'rgba(60, 40, 20, 0.5)';
    ctx.lineWidth = 30;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(139, 119, 101, 0.4)';
    ctx.lineWidth = 26;
    ctx.stroke();
  }
}
