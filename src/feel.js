// 手感参数配置 — 集中管理所有游戏体验相关数值
export const FEEL = {
  // === 射击 ===
  bulletSpeed: 900,
  shootCooldown: 0.15,       // 射击冷却(秒)
  recoilDuration: 0.12,      // 后坐力时长
  recoilScale: 0.85,         // 后坐力最小缩放
  screenShakePower: 3,       // 画面震动幅度(px)
  screenShakeDuration: 0.08, // 画面震动时长

  // === 瞄准 ===
  aimLineLength: 120,        // 瞄准线最大长度
  aimLineDash: [4, 8],       // 虚线样式
  aimDotCount: 5,            // 瞄准点数量

  // === 插入 ===
  insertBounceScale: 1.25,   // 插入弹跳最大缩放
  insertBounceDuration: 0.18,// 弹跳时长
  insertRippleCount: 6,      // 涟漪粒子数

  // === 消除 ===
  eliminateFlashDuration: 0.06, // 消除前闪烁
  eliminateExpandScale: 1.35,   // 消除前膨胀
  eliminateExpandDuration: 0.1, // 膨胀时长
  eliminateParticleCount: 12,   // 爆裂粒子数
  eliminateShrinkSpeed: 5,      // 缩小速度

  // === Combo ===
  comboShakeBase: 2,         // combo 基础震动
  comboShakePerLevel: 1.5,   // 每级 combo 增加的震动
  comboFlashAlpha: 0.15,     // combo 闪白透明度
  comboScoreSize: 16,        // combo 分数基础字号
  comboScoreSizePerLevel: 3, // 每级增加字号

  // === 链移动 ===
  mergeAccelMultiplier: 6,   // 回退加速倍率
  dangerZoneThreshold: 0.82, // 轨道 82% 后为危险区
  dangerPulseSpeed: 8,       // 危险脉动频率
  dangerTintColor: '#e74c3c',// 危险着色

  // === 生成策略 ===
  spawnSameColorChance: 0.35,  // 连续同色概率
  spawnChainColorBias: 0.6,    // 优先链上已有颜色的概率
  spawnMinSameStreak: 2,       // 同色连续最少个数
  spawnMaxSameStreak: 4,       // 同色连续最多个数
};
