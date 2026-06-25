// 关卡数据
export const LEVELS = [
  {
    id: 1,
    name: '螺旋入门',
    colorCount: 4,
    ballSpeed: 40,
    spawnInterval: 0.6,
    totalBalls: 50,
    // 螺旋形轨道控制点
    getPath(w, h) {
      return [
        // 从左上角开始螺旋
        [
          { x: -30, y: h * 0.3 },
          { x: w * 0.2, y: h * 0.05 },
          { x: w * 0.7, y: h * 0.05 },
          { x: w * 0.9, y: h * 0.25 },
        ],
        [
          { x: w * 0.9, y: h * 0.25 },
          { x: w * 1.05, y: h * 0.45 },
          { x: w * 0.7, y: h * 0.5 },
          { x: w * 0.5, y: h * 0.4 },
        ],
        [
          { x: w * 0.5, y: h * 0.4 },
          { x: w * 0.3, y: h * 0.3 },
          { x: w * 0.1, y: h * 0.5 },
          { x: w * 0.2, y: h * 0.65 },
        ],
        [
          { x: w * 0.2, y: h * 0.65 },
          { x: w * 0.35, y: h * 0.8 },
          { x: w * 0.65, y: h * 0.75 },
          { x: w * 0.75, y: h * 0.65 },
        ],
        [
          { x: w * 0.75, y: h * 0.65 },
          { x: w * 0.85, y: h * 0.55 },
          { x: w * 0.6, y: h * 0.55 },
          { x: w * 0.5, y: h * 0.6 },
        ],
      ];
    },
  },
  {
    id: 2,
    name: 'S形挑战',
    colorCount: 5,
    ballSpeed: 50,
    spawnInterval: 0.5,
    totalBalls: 70,
    getPath(w, h) {
      return [
        [
          { x: -30, y: h * 0.2 },
          { x: w * 0.3, y: h * 0.1 },
          { x: w * 0.7, y: h * 0.1 },
          { x: w + 20, y: h * 0.25 },
        ],
        [
          { x: w + 20, y: h * 0.25 },
          { x: w * 0.7, y: h * 0.4 },
          { x: w * 0.3, y: h * 0.4 },
          { x: -20, y: h * 0.55 },
        ],
        [
          { x: -20, y: h * 0.55 },
          { x: w * 0.3, y: h * 0.7 },
          { x: w * 0.7, y: h * 0.7 },
          { x: w * 0.85, y: h * 0.85 },
        ],
      ];
    },
  },
  {
    id: 3,
    name: '旋涡地狱',
    colorCount: 6,
    ballSpeed: 60,
    spawnInterval: 0.4,
    totalBalls: 100,
    getPath(w, h) {
      const cx = w * 0.5, cy = h * 0.5;
      return [
        [
          { x: -30, y: cy - 100 },
          { x: w * 0.2, y: cy - 200 },
          { x: w * 0.8, y: cy - 180 },
          { x: w * 0.9, y: cy - 50 },
        ],
        [
          { x: w * 0.9, y: cy - 50 },
          { x: w * 0.95, y: cy + 100 },
          { x: w * 0.6, y: cy + 150 },
          { x: w * 0.4, y: cy + 80 },
        ],
        [
          { x: w * 0.4, y: cy + 80 },
          { x: w * 0.2, y: cy },
          { x: w * 0.4, y: cy - 60 },
          { x: cx, y: cy },
        ],
      ];
    },
  },
];
