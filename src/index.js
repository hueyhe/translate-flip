/**
 * Copyright 2017 hueyhe. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Easing from './easing';

import matrix from './matrix';
import polyfill from './polyfill';
import utils from './utils';

import { ERROR_PREFIX, INFO_PREFIX } from './constants';

/**
 * FLIP动画队列基础类
 *
 * @see https://aerotwist.com/blog/flip-your-animations
 * @author huey
 */
class FLIP {

  /**
   * FLIP 实例
   *
   * @private
   * @type {object}
   */
  static instance = null;

  /**
   * 获取 FLIP 实例
   *
   * @private
   * @static
   * @return {object} 返回 FLIP 实例
   */
  static getInstance() {
    if (FLIP.instance === null) {
      FLIP.instance = new FLIP();

      FLIP.instance.Easing = Easing;
    }

    return FLIP.instance;
  }

  constructor() {
    // 用于存储 flip 动画的元素
    this.flipUnits = {};
    // 默认配置
    this.default = {
      duration: 1000, // 动画时长
      options: {
        use3d: true,
      },
    };
  }

  /**
   * @typedef UnitStats - FLIP 动画单元的位置与样式数据对象
   *
   * @type object
   * @prop {object} layout - 节点根据 Web API element.getBoundingClientRect() 获取的数据对象
   * @prop {number} opacity - 节点透明度数据，类型为浮点数
   * @prop {object} styleRect - 节点样式中 top, left 数据
   * @prop {number} styleRect.left - 节点 left computed style，类型为浮点数
   * @prop {number} styleRect.top - 节点 top computed style，类型为浮点数
   */

  /**
   * @typedef FlipOptions - FLIP 动画单元配置项
   *
   * @type object
   * @prop {function} interrupt - 动画被中断时回调，参数为节点
   * @prop {boolean} [use3d=true] - 是否使用 translate3d 进行位移动画
   */

  /**
   * @typedef FlipUnit - FLIP 动画单元
   *
   * @type object
   * @prop {UnitStats} current - flip 单元施放魔法时的位置及样式信息对象
   * @prop {string} id - flip 单元唯一标识
   * @prop {boolean} preparing - 动画单元准备状态，即是否正在进行 FLIP 状态切换，若为准备中，那么下一个魔法将会失效
   * @prop {object} promise - flip 单元执行动画对应的 promise 对象
   * @prop {function} promise.reject - flip 单元执行动画的 promise reject 方法
   * @prop {function} promise.resolve - flip 单元执行动画的 promise resolve 方法
   * @prop {UnitStats} stats - flip 单元初始状态下的位置及样式信息对象
   */

  /**
   * FLIP 动画第一步
   * 记录节点初始对应的位置及样式信息等
   *
   * @private
   * @param {object} element - DOM 节点
   * @param {FlipOptions} options - 动画配置项
   * @return {FlipUnit} 节点对应的 FLIP 动画单元
   */
  first(element, options) {
    const el = element;

    // 存储节点信息
    // 节点信息一旦登录，就可以开始 FLIP 动画
    let flipUnit = this.getFlipUnit(el.dataset.flipId);
    if (flipUnit === null) {
      // 节点第一次注册 FLIP 动画
      // 保存节点的位置相关信息
      flipUnit = this.initFlipUnit(el);
    } else {
      // 节点注册过 FLIP 动画
      // 更新节点当前位置相关信息
      flipUnit = this.updateFlipUnit(el);
    }

    // 记录动画配置
    const { options: defaultOptions } = this.default;
    flipUnit.options = Object.assign({}, defaultOptions, options);

    // 关闭过渡动画
    el.style.transition = '';

    return flipUnit;
  }

  /**
   * 根据 flip id 获取对应的 flip 单元
   *
   * @private
   * @param {string} flipId - flip 单元的唯一标识
   * @return {FlipUnit} 一个包含节点做 flip 动画初始状态信息及唯一标识的对象
   */
  getFlipUnit(flipId) {
    return this.flipUnits[flipId] || null;
  }

  /**
   * 初始化 FLIP 动画单元
   * 记录节点的位置样式等信息
   *
   * @private
   * @param {object} element - DOM 节点
   * @param {boolean} [preparing=true] - 初始化完成是否马上进入准备动画状态
   * @return {FlipUnit} 一个包含节点做 flip 动画初始状态信息及唯一标识的对象
   */
  initFlipUnit(element, preparing = true) {
    const el = element;

    const flipId = `flip-${(new Date()).getTime()}`;
    el.dataset.flipId = flipId;

    // 若没有定义 position
    // 则默认是相对定位
    // 否则 LAST 步骤位移失效
    if (el.style.position === '') {
      el.style.position = 'relative';
    }

    const realTimeStyles = utils.getRealTimeStyles(el);
    const {
      layout,
      opacity,
      styleRect,
    } = realTimeStyles;

    this.flipUnits[flipId] = {
      id: flipId,
      el,
      stats: {
        layout,
        opacity,
        styleRect,
      },
      current: {
        layout,
        opacity,
        rotate: 0,
        styleRect,
      },
      preparing,
    };
    return this.flipUnits[flipId];
  }

  /**
   * FLIP 动画第三步
   * 魔术的本质 [障眼法]
   * 根据初始位置与结束位置，重置节点位置
   * 让节点从结束位置移动至初始位置，无动画
   * 看起来节点从未移动过
   *
   * @private
   * @param {object} element - DOM 节点
   * @return {FlipUnit} 节点对应的 FLIP 动画单元
   */
  invert(element) {
    const el = element;

    const flipUnit = this.getFlipUnit(el.dataset.flipId);
    const {
      current,
      last,
      options,
    } = flipUnit;

    const {
      layout: {
        top: originTop,
        left: originLeft,
        width: originWidth,
        height: originHeight,
      },
      rotate,
    } = current;

    const {
      layout: {
        top,
        left,
        width,
        height,
      },
    } = last;

    const invert = {
      x: originLeft - left,
      y: originTop - top,
      sx: originWidth / width,
      sy: originHeight / height,
    };

    el.style.transformOrigin = '0 0';
    const transformT = options.use3d ?
      `translate3d(${invert.x}px, ${invert.y}px, 0)` :
      `translate(${invert.x}px, ${invert.y}px)`;
    const transformS = `scale(${invert.sx}, ${invert.sy})`;
    const transformR = `rotate(${rotate}deg)`;

    const transform = [transformT, transformS, transformR].join(' ');

    // const transform = matrix.transformMatrix(
    //   1,
    //   [invert.x, invert.y],
    //   invert.sx,
    //   rotate,
    // );
    el.style.transform = transform;

    flipUnit.el = el;

    return flipUnit;
  }

  /**
   * FLIP 动画第二步
   * 移动节点至结束位置，无动画
   * 记录节点结束状态下对应的位置及样式信息等
   *
   * @private
   * @param {object} element - DOM 节点
   * @param {object} last - 结束状态信息
   * @param {number} last.scale - 节点缩放比例，1 为原始比例
   * @param {number} last.x - 节点 x 轴位移，单位像素 px
   * @param {number} last.y - 节点 y 轴位移，单位像素 px
   * @return {FlipUnit} 节点对应的 FLIP 动画单元
   */
  last(element, last) {
    const el = element;

    const flipUnit = this.getFlipUnit(el.dataset.flipId);
    const { stats } = flipUnit;

    const {
      layout,
      styleRect,
    } = stats;

    const {
      x,
      y,
      scale,
    } = last;

    if (utils.exists(x)) {
      el.style.left = `${styleRect.left + x}px`;
    }

    if (utils.exists(y)) {
      el.style.top = `${styleRect.top + y}px`;
    }

    if (utils.exists(scale)) {
      el.style.width = `${layout.width * scale}px`;
      el.style.height = `${layout.height * scale}px`;
    }

    const lastLayout = utils.getLayout(el);

    flipUnit.last = {
      layout: lastLayout,
    };

    flipUnit.el = el;

    return flipUnit;
  }

  /**
   * 将 FLIP 元素动画对应的 promise 注册到 FLIP 单元上
   *
   * @private
   * @param {string} flipId - flip 单元唯一标识
   * @param {function} resolve - 动画的 promise resolve 方法
   * @param {function} reject - 动画的 promise reject 方法
   * @return {FlipUnit} 一个包含节点做 flip 动画初始状态信息及唯一标识的对象
   */
  linkUnitPromise(flipId, resolve, reject) {
    const flipUnit = this.flipUnits[flipId];
    // 若存在上一次在进行中的动画，则中断上次的动画
    const promise = flipUnit.promise || {};
    if (typeof promise.reject === 'function') {
      // promise.reject(`${INFO_PREFIX} FLIP ${flipId} animation aborted.`);
      const { options } = flipUnit;
      if (typeof options.interrupt === 'function') {
        options.interrupt(flipUnit.el);
      }
      console.info(`${INFO_PREFIX} FLIP ${flipId} animation aborted.`);
    }
    flipUnit.promise = {
      resolve,
      reject,
    };
    return flipUnit;
  }

  /**
   * 为节点施加魔法
   * 让节点动起来
   *
   * @param {object} element - DOM 节点
   * @param {object} last - 结束状态相对初始状态的各项数据偏移量
   * @param {number} last.opacity - 节点透明度，[0,1] 的浮点数
   * @param {number} last.scale - 节点缩放比例，1 为原始比例
   * @param {number} last.x - 节点 x 轴位移，单位像素 px
   * @param {number} last.y - 节点 y 轴位移，单位像素 px
   * @param {number} duration - 过渡动画持续时间，单位毫秒 ms
   * @param {string} easing - 过渡函数
   * @param {FlipOptions} options - 动画配置项
   * @return {object} Promise 对象
   */
  magic(element, last, duration, easing, options) {
    // 本次动画动作的魔法棒
    // 每个 magic 调用都产生不同的魔法棒
    // 用于唯一识别一次 FLIP 动画调用
    const magicWand = `magic-wand-${Date.now()}`;

    const promise = new Promise((resolve, reject) => {
      const el = element;
      // 参数合法性检查
      if (!utils.isDOMElement(el) && !utils.isDOMNode(el)) {
        reject(`${ERROR_PREFIX} ${el} is not a dom element.`);
        return;
      }
      if (!utils.isObject(last)) {
        reject(`${ERROR_PREFIX} ${last} is not valid. Please check whether your usage of param 'last' is correct.`);
        return;
      }
      if (utils.exists(duration) && !utils.isNumber(duration)) {
        reject(`${ERROR_PREFIX} ${duration} is not valid. Param 'duration' should be number or float.`);
        return;
      }
      if (utils.exists(options) && !utils.isObject(options)) {
        reject(`${ERROR_PREFIX} ${options} is not valid. Please check whether your usage of param 'options' is correct.`);
        return;
      }

      let flipUnit = this.getFlipUnit(el.dataset.flipId);

      if (flipUnit !== null && flipUnit.preparing) {
        reject(`${ERROR_PREFIX} Magic will not display while time gap is too small.`);
        return;
      }

      // FIRST
      // FLIP 动画第一步
      flipUnit = this.first(el, options);
      // 无论是否在动画中
      // 都要更新单元的 promise
      // 从而实现中断旧动画，继续新动画
      flipUnit = this.linkUnitPromise(flipUnit.id, resolve, reject);

      const {
        duration: defaultDuration,
      } = this.default;

      requestAnimationFrame(() => {
        // LAST
        // FLIP 动画第二步
        flipUnit = this.last(el, last);

        // INVERT
        // FLIP 动画第三步
        flipUnit = this.invert(el);

        requestAnimationFrame(() => {
          // 结束准备动作
          flipUnit.preparing = false;

          // 注册本次动画的魔法棒
          flipUnit.magicWand = magicWand;

          // PLAY
          // FLIP 动画第四步
          this.play(el, last, duration || defaultDuration, easing);
        });

        function elTransitionEnd() {
          if (flipUnit.magicWand === magicWand) {
            el.style.transition = '';
            flipUnit.promise = null;
            resolve(this);
          }
        }

        el.addEventListener(polyfill.transitionend(), elTransitionEnd, {
          capture: false,
          once: true,
        });
      });
    });

    return promise;
  }

  /**
   * 播放 FLIP 动画单元从初始状态至结束状态之间的过渡动画
   *
   * @private
   * @param {object} element - DOM 节点
   * @param {object} last - 结束状态相对初始状态的各项数据偏移量
   * @param {number} last.opacity - 透明度
   * @param {number} duration - 动画时长，单位为毫秒 ms
   * @param {string} easing - 过渡函数
   * @return {FlipUnit} 一个包含节点做 flip 动画初始状态信息及唯一标识的对象
   */
  play(element, last, duration, easing = Easing.EaseInOut) {
    const el = element;

    const flipUnit = this.getFlipUnit(el.dataset.flipId);

    const {
      opacity,
      rotate,
    } = last;

    // 应用动画
    el.style.transition = `all ${duration}ms ${easing}`;
    // Play!
    let transform = '';
    if (utils.exists(opacity)) {
      el.style.opacity = opacity;
    }
    if (utils.exists(rotate)) {
      transform += `rotate(${rotate}deg)`;
    }
    el.style.transform = transform;

    flipUnit.el = el;

    return flipUnit;
  }

  /**
   * 重新加载节点
   * API 提供的位移与缩放等过渡变化都是针对节点第一次注册时的初始状态进行计算
   * 如果需要让节点按照变化后的位置进行相对位移过渡
   * 则需要进行重载 reload
   *
   * @param {object} element - DOM 节点
   * @return {object} FLIP 当前实例，供链式调用
   */
  reload(element) {
    const el = element;

    const flipUnit = this.getFlipUnit(el.dataset.flipId);

    if (flipUnit === null) {
      throw new Error(`${ERROR_PREFIX} element ${el} has never show its magic yet.`);
    }

    this.initFlipUnit(el, false);

    return this;
  }

  /**
   * 更新节点当前位置及样式信息
   * 用于动态计算节点距离结束状态的各项指标偏移量
   *
   * @private
   * @param {object} element - DOM 节点
   * @return {FlipUnit} 一个包含节点做 flip 动画初始状态信息及唯一标识的对象
   */
  updateFlipUnit(element) {
    const el = element;
    const flipUnit = this.getFlipUnit(el.dataset.flipId);

    const transform = utils.getTransform(el);

    // 获取到运行时 transform
    // 停止动画
    el.style.transition = '';

    // 去除 rotate 与 skew 的影响
    // translate & scale 组成的 transform matrix
    const transformInfo = matrix.getTransformInfo(transform);
    const tsTransform = matrix.transformMatrix(
      1,
      [transformInfo.translate.x, transformInfo.translate.y],
      transformInfo.scale,
    );

    // 应用并记录坐标
    el.style.transform = tsTransform;

    const realTimeStyles = utils.getRealTimeStyles(el);
    const {
      layout,
      opacity,
    } = realTimeStyles;

    el.style.transform = '';

    // 设置不需要 invert 的样式的当前值
    el.style.opacity = opacity;

    flipUnit.current.layout = layout;
    flipUnit.current.opacity = opacity;
    flipUnit.current.rotate = transformInfo.rotate;
    flipUnit.preparing = true;
    return flipUnit;
  }

}

module.exports = FLIP.getInstance();
