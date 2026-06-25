// 关卡数据
export const LEVELS = [
  {
    id: 1,
    name: '新手村',
    colorCount: 3,
    ballSpeed: 30,
    spawnInterval: 0.7,
    totalBalls: 35,
    getPath(w, h) {
      return [
        [
          { x: -30, y: h * 0.3 },
          { x: w * 0.3, y: h * 0.15 },
          { x: w * 0.7, y: h * 0.15 },
          { x: w + 20, y: h * 0.35 },
        ],
        [
          { x: w + 20, y: h * 0.35 },
          { x: w * 0.7, y: h * 0.55 },
          { x: w * 0.3, y: h * 0.55 },
          { x: -20, y: h * 0.75 },
        ],
        [
          { x: -20, y: h * 0.75 },
          { x: w * 0.3, y: h * 0.9 },
          { x: w * 0.6, y: h * 0.85 },
          { x: w * 0.7, y: h * 0.78 },
        ],
      ];
    },
  },
  {
    id: 2,
    name: '初识祖玛',
    colorCount: 3,
    ballSpeed: 35,
    spawnInterval: 0.6,
    totalBalls: 45,
    getPath(w, h) {
      return [
        [
          { x: -30, y: h * 0.2 },
          { x: w * 0.2, y: h * 0.05 },
          { x: w * 0.8, y: h * 0.1 },
          { x: w * 0.9, y: h * 0.3 },
        ],
        [
          { x: w * 0.9, y: h * 0.3 },
          { x: w * 0.95, y: h * 0.55 },
          { x: w * 0.6, y: h * 0.6 },
          { x: w * 0.4, y: h * 0.5 },
        ],
        [
          { x: w * 0.4, y: h * 0.5 },
          { x: w * 0.2, y: h * 0.4 },
          { x: w * 0.15, y: h * 0.6 },
          { x: w * 0.3, y: h * 0.75 },
        ],
        [
          { x: w * 0.3, y: h * 0.75 },
          { x: w * 0.5, y: h * 0.9 },
          { x: w * 0.7, y: h * 0.8 },
          { x: w * 0.65, y: h * 0.65 },
        ],
      ];
    },
  },
  {
    id: 3,
    name: '四色挑战',
    colorCount: 4,
    ballSpeed: 40,
    spawnInterval: 0.55,
    totalBalls: 55,
    getPath(w, h) {
      return [
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
    id: 4,
    name: 'S形弯道',
    colorCount: 4,
    ballSpeed: 42,
    spawnInterval: 0.5,
    totalBalls: 60,
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
    id: 5,
    name: '偏角射击',
    colorCount: 4,
    ballSpeed: 45,
    spawnInterval: 0.5,
    totalBalls: 60,
    shooterPos: { xRatio: 0.7, yRatio: 0.5 },
    getPath(w, h) {
      return [
        [
          { x: -30, y: h * 0.15 },
          { x: w * 0.15, y: h * 0.05 },
          { x: w * 0.4, y: h * 0.08 },
          { x: w * 0.45, y: h * 0.25 },
        ],
        [
          { x: w * 0.45, y: h * 0.25 },
          { x: w * 0.5, y: h * 0.45 },
          { x: w * 0.3, y: h * 0.5 },
          { x: w * 0.15, y: h * 0.4 },
        ],
        [
          { x: w * 0.15, y: h * 0.4 },
          { x: w * 0.0, y: h * 0.3 },
          { x: -10, y: h * 0.55 },
          { x: w * 0.1, y: h * 0.7 },
        ],
        [
          { x: w * 0.1, y: h * 0.7 },
          { x: w * 0.25, y: h * 0.85 },
          { x: w * 0.45, y: h * 0.8 },
          { x: w * 0.5, y: h * 0.65 },
        ],
      ];
    },
  },
  {
    id: 6,
    name: '五色漩涡',
    colorCount: 5,
    ballSpeed: 45,
    spawnInterval: 0.5,
    totalBalls: 70,
    getPath(w, h) {
      const cx = w * 0.5, cy = h * 0.5;
      return [
        [
          { x: -30, y: cy - 150 },
          { x: w * 0.2, y: cy - 250 },
          { x: w * 0.8, y: cy - 200 },
          { x: w * 0.95, y: cy - 50 },
        ],
        [
          { x: w * 0.95, y: cy - 50 },
          { x: w * 1.0, y: cy + 120 },
          { x: w * 0.7, y: cy + 180 },
          { x: w * 0.45, y: cy + 100 },
        ],
        [
          { x: w * 0.45, y: cy + 100 },
          { x: w * 0.2, y: cy + 20 },
          { x: w * 0.3, y: cy - 80 },
          { x: w * 0.5, y: cy - 30 },
        ],
        [
          { x: w * 0.5, y: cy - 30 },
          { x: w * 0.65, y: cy + 10 },
          { x: w * 0.55, y: cy + 50 },
          { x: cx, y: cy },
        ],
      ];
    },
  },
  {
    id: 7,
    name: '急速通道',
    colorCount: 5,
    ballSpeed: 55,
    spawnInterval: 0.45,
    totalBalls: 75,
    getPath(w, h) {
      return [
        [
          { x: -30, y: h * 0.5 },
          { x: w * 0.15, y: h * 0.15 },
          { x: w * 0.5, y: h * 0.1 },
          { x: w * 0.8, y: h * 0.2 },
        ],
        [
          { x: w * 0.8, y: h * 0.2 },
          { x: w * 1.0, y: h * 0.3 },
          { x: w * 0.9, y: h * 0.5 },
          { x: w * 0.65, y: h * 0.45 },
        ],
        [
          { x: w * 0.65, y: h * 0.45 },
          { x: w * 0.4, y: h * 0.4 },
          { x: w * 0.2, y: h * 0.6 },
          { x: w * 0.35, y: h * 0.8 },
        ],
        [
          { x: w * 0.35, y: h * 0.8 },
          { x: w * 0.55, y: h * 0.95 },
          { x: w * 0.75, y: h * 0.8 },
          { x: w * 0.65, y: h * 0.65 },
        ],
      ];
    },
  },
  {
    id: 8,
    name: '短线冲刺',
    colorCount: 5,
    ballSpeed: 50,
    spawnInterval: 0.4,
    totalBalls: 65,
    getPath(w, h) {
      return [
        [
          { x: -30, y: h * 0.4 },
          { x: w * 0.2, y: h * 0.2 },
          { x: w * 0.6, y: h * 0.15 },
          { x: w * 0.8, y: h * 0.35 },
        ],
        [
          { x: w * 0.8, y: h * 0.35 },
          { x: w * 0.9, y: h * 0.55 },
          { x: w * 0.6, y: h * 0.7 },
          { x: w * 0.5, y: h * 0.6 },
        ],
      ];
    },
  },
  {
    id: 9,
    name: '六色风暴',
    colorCount: 6,
    ballSpeed: 55,
    spawnInterval: 0.4,
    totalBalls: 90,
    getPath(w, h) {
      return [
        [
          { x: -30, y: h * 0.15 },
          { x: w * 0.25, y: h * 0.05 },
          { x: w * 0.75, y: h * 0.08 },
          { x: w + 20, y: h * 0.2 },
        ],
        [
          { x: w + 20, y: h * 0.2 },
          { x: w * 0.8, y: h * 0.35 },
          { x: w * 0.2, y: h * 0.32 },
          { x: -20, y: h * 0.48 },
        ],
        [
          { x: -20, y: h * 0.48 },
          { x: w * 0.25, y: h * 0.62 },
          { x: w * 0.75, y: h * 0.6 },
          { x: w + 10, y: h * 0.72 },
        ],
        [
          { x: w + 10, y: h * 0.72 },
          { x: w * 0.7, y: h * 0.85 },
          { x: w * 0.4, y: h * 0.9 },
          { x: w * 0.5, y: h * 0.75 },
        ],
      ];
    },
  },
  {
    id: 10,
    name: '终极试炼',
    colorCount: 6,
    ballSpeed: 60,
    spawnInterval: 0.35,
    totalBalls: 100,
    shooterPos: { xRatio: 0.5, yRatio: 0.55 },
    getPath(w, h) {
      const cx = w * 0.5, cy = h * 0.5;
      return [
        [
          { x: -30, y: h * 0.1 },
          { x: w * 0.15, y: -20 },
          { x: w * 0.85, y: -10 },
          { x: w + 20, y: h * 0.15 },
        ],
        [
          { x: w + 20, y: h * 0.15 },
          { x: w * 0.9, y: h * 0.35 },
          { x: w * 0.65, y: h * 0.3 },
          { x: w * 0.55, y: h * 0.2 },
        ],
        [
          { x: w * 0.55, y: h * 0.2 },
          { x: w * 0.4, y: h * 0.08 },
          { x: w * 0.2, y: h * 0.25 },
          { x: w * 0.25, y: h * 0.45 },
        ],
        [
          { x: w * 0.25, y: h * 0.45 },
          { x: w * 0.3, y: h * 0.65 },
          { x: w * 0.6, y: h * 0.75 },
          { x: w * 0.8, y: h * 0.6 },
        ],
        [
          { x: w * 0.8, y: h * 0.6 },
          { x: w * 0.95, y: h * 0.5 },
          { x: w * 0.85, y: h * 0.8 },
          { x: w * 0.7, y: h * 0.9 },
        ],
        [
          { x: w * 0.7, y: h * 0.9 },
          { x: w * 0.55, y: h * 0.98 },
          { x: w * 0.45, y: h * 0.85 },
          { x: cx, y: cy + 40 },
        ],
      ];
    },
  },
];
