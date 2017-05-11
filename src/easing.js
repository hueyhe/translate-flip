import utils from './utils';

import { WARNNING_PREFIX } from './constants';

// CSS Cubic 函数前缀
const CUBIC_PREFIX = 'cubic-bezier';

export default {
  /**
   * 贝塞尔曲线定义
   * 由 P0 P1 P2 P3 三个点决定
   * P0 坐标 (0, 0)
   * P3 坐标 (1, 1)
   * 参见 https://segmentfault.com/a/1190000004618375
   *
   * @param {number} x1 P1 横坐标
   * @param {number} y1 P1 纵坐标
   * @param {number} x2 P3 横坐标
   * @param {number} y2 P3 纵坐标
   */
  Cubic(x1, y1, x2, y2) {
    const prefix = 'cubic-bezier';
    const defaultCubic = `${prefix}(.17,.67,.83,.67)`;
    if (!utils.exists(x1) || !utils.exists(y1) || !utils.exists(x2) || !utils.exists(y2)) {
      console.warn(`${WARNNING_PREFIX} x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}. Cubic params missing. Using ${defaultCubic} by default.`);
      return defaultCubic;
    }
    return `${prefix}(${x1},${y1},${x2},${y2})`;
  },

  Ease: 'ease',

  EaseIn: 'ease-in',

  EaseOut: 'ease-out',

  EaseInOut: 'ease-in-out',

  Linear: 'linear',

  /**
   * Material Design 中使用的贝塞尔函数
   * 适用于 MD 规范的 UI 开发
   */
  MDCubic: `${CUBIC_PREFIX}(0.4,0,0.2,1)`,
};
