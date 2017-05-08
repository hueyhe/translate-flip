/**
 * Copyright 2017 CAFUE Inc. All rights reserved.
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

import utils from './utils';

/**
 * FLIP动画队列基础类
 *
 * @see https://aerotwist.com/blog/flip-your-animations
 * @author huey
 */
class FLIP {

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
    }
    return FLIP.instance;
  }

  constructor() {
    // 用于存储 flip 动画的元素
    this.flipUnits = {};
    // 默认配置
    this.default = {
      duration: 1000, // 动画时长
    };
  }

  /**
   * @typedef FlipUnit - FLIP 动画单元
   * @type object
   * @prop {string} id - flip 单元唯一标识
   * @prop {object} promise - flip 单元执行动画对应的 promise 对象
   * @prop {function} promise.reject - flip 单元执行动画的 promise reject 方法
   * @prop {function} promise.resolve - flip 单元执行动画的 promise resolve 方法
   * @prop {object} stats - flip 单元初始状态下的位置及样式信息对象
   * @prop {object} stats.layout - 节点根据 Web API element.getBoundingClientRect() 获取的数据对象
   * @prop {object} stats.opacity - 节点透明度信息
   */

  first(element) {
    const el = element;
    // 存储节点信息
    // 节点信息一旦登录，就可以开始 FLIP 动画
    let flipUnit = this.getFlipUnit(el.dataset.flipId);
    if (flipUnit === null) {
      // 节点第一次注册 FLIP 动画
      // 保存节点的位置相关信息
      flipUnit = this.saveFlipUnit(el);
    } else {
      // 节点注册过 FLIP 动画
      // 更新节点当前位置相关信息
      flipUnit = this.updateFlipUnit(el);
    }
    // 关闭过渡动画
    el.style.transition = '';
    return flipUnit;
  }

  invert(element) {
    const el = element;

    const flipUnit = this.getFlipUnit(el.dataset.flipId);
    const { current } = flipUnit;

    const {
      layout: {
        top: originTop,
        left: originLeft,
        width: originWidth,
        height: originHeight,
      },
    } = current;

    const last = {
      layout: utils.getLayout(el),
    };

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
    el.style.transform =
      `translate3d(${invert.x}px, ${invert.y}px, 0)
       scale(${invert.sx}, ${invert.sy})`;

    flipUnit.el = el;

    return flipUnit;
  }

  last(element, last) {
    const el = element;

    const {
      x,
      y,
      scale,
    } = last;

    const flipUnit = this.getFlipUnit(el.dataset.flipId);
    const { stats } = flipUnit;

    if (utils.exists(x)) {
      el.style.marginLeft = `${x}px`;
    }

    if (utils.exists(y)) {
      el.style.marginTop = `${y}px`;
    }

    if (utils.exists(scale)) {
      el.style.width = `${stats.layout.width * scale}px`;
      el.style.height = `${stats.layout.height * scale}px`;
    }

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
      promise.reject(`FLIP ${flipId} animation aborted.`);
    }
    flipUnit.promise = {
      resolve,
      reject,
    };
    return flipUnit;
  }

  magic(element, last, duration) {
    return new Promise((resolve, reject) => {
      const el = element;
      // 参数合法性检查
      if (!utils.isDOMElement(el) && !utils.isDOMNode(el)) {
        reject(new Error(`${el} is not a dom element.`));
      }

      // FIRST
      // FLIP 动画第一步
      let flipUnit = this.first(el);
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
          // PLAY
          // FLIP 动画第四步
          this.play(el, duration || defaultDuration);
        });

        el.addEventListener('transitionend', () => {
          el.style.transition = '';
          el.style.transformOrigin = '';
          flipUnit.promise = null;
          resolve(this);
        }, {
          capture: false,
          once: true,
        });
      });
    });
  }

  magicBundle(flips) {
    const promises = flips.map((flip) => {
      const {
        element,
        last,
        duration,
      } = flip;
      return this.magic(element, last, duration);
    });
    return Promise.all(promises);
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

  isSaved(element) {
    const flipId = element.dataset.flipId;
    // 节点无 flip id，不在 flip 动画中
    if (!flipId) {
      return false;
    }

    const flipUnit = this.getFlipUnit(flipId);
    // 不存在对应的 flip unit
    if (!flipUnit) {
      return false;
    }

    return true;
  }

  play(element, duration) {
    const el = element;

    const flipUnit = this.getFlipUnit(el.dataset.flipId);

    // 应用动画
    el.style.transition = `transform ${duration}ms ease`;
    // Play!
    el.style.transform = '';

    flipUnit.el = el;

    return flipUnit;
  }

  saveFlipUnit(element) {
    const el = element;

    const flipId = `flip-${(new Date()).getTime()}`;
    el.dataset.flipId = flipId;

    const layout = utils.getLayout(el);
    const opacity = utils.getOpacity(el);
    this.flipUnits[flipId] = {
      el,
      id: flipId,
      stats: {
        layout,
        opacity,
      },
      current: {
        layout,
        opacity,
      },
    };
    return this.flipUnits[flipId];
  }

  updateFlipUnit(element) {
    const el = element;
    const flipUnit = this.getFlipUnit(el.dataset.flipId);

    const layout = utils.getLayout(el);
    const opacity = utils.getOpacity(el);
    flipUnit.current = {
      layout,
      opacity,
    };
    return flipUnit;
  }

}

export default FLIP.getInstance();
