// 游戏日志系统
// 在浏览器控制台中输入 GameLog.enable() 开启，GameLog.disable() 关闭
// GameLog.level = 'debug' | 'info' | 'warn' | 'error'
// GameLog.filter = 'chain' 只看某个模块的日志

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const COLORS = {
  chain:   'color: #2ecc71; font-weight: bold',
  shooter: 'color: #3498db; font-weight: bold',
  bullet:  'color: #e67e22; font-weight: bold',
  game:    'color: #9b59b6; font-weight: bold',
  merge:   'color: #f1c40f; font-weight: bold',
  effect:  'color: #e74c3c; font-weight: bold',
};

class Logger {
  constructor() {
    this.enabled = false;
    this.level = 'info';
    this.filter = null;       // null = 全部，或指定模块名
    this._history = [];
    this._maxHistory = 200;
  }

  enable() {
    this.enabled = true;
    console.log('%c[GameLog] 日志已开启', 'color: #2ecc71; font-weight: bold');
    console.log('%c[GameLog] 可用命令: GameLog.level="debug" | GameLog.filter="chain" | GameLog.dump() | GameLog.disable()', 'color: #888');
  }

  disable() {
    this.enabled = false;
    console.log('%c[GameLog] 日志已关闭', 'color: #e74c3c');
  }

  _log(level, module, msg, data) {
    const entry = {
      time: performance.now().toFixed(1),
      level,
      module,
      msg,
      data: data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined,
    };

    // 始终写入历史（即使日志关闭）
    this._history.push(entry);
    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }

    if (!this.enabled) return;
    if (LEVELS[level] < LEVELS[this.level]) return;
    if (this.filter && module !== this.filter) return;

    const style = COLORS[module] || 'color: #ccc';
    const prefix = `%c[${module}]`;
    if (data !== undefined) {
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${prefix} ${msg}`, style, data
      );
    } else {
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${prefix} ${msg}`, style
      );
    }
  }

  debug(module, msg, data) { this._log('debug', module, msg, data); }
  info(module, msg, data)  { this._log('info', module, msg, data); }
  warn(module, msg, data)  { this._log('warn', module, msg, data); }
  error(module, msg, data) { this._log('error', module, msg, data); }

  // 导出最近的日志历史
  dump() {
    console.table(this._history.map(e => ({
      time: e.time + 'ms',
      level: e.level,
      module: e.module,
      msg: e.msg,
      data: e.data ? JSON.stringify(e.data) : '',
    })));
    return this._history;
  }

  // 清空历史
  clear() {
    this._history = [];
    console.log('%c[GameLog] 历史已清空', 'color: #888');
  }
}

const GameLog = new Logger();

// 挂到 window 上方便控制台使用
if (typeof window !== 'undefined') {
  window.GameLog = GameLog;
}

export default GameLog;
