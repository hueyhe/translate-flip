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

  magic(element, last) {
    return new Promise((resolve, reject) => {
      const {
        duration: defaultDuration,
      } = this.default;

      const el = element;

      const {
        x,
        y,
      } = last;

      // 参数合法性检查
      if (!utils.isDOMElement(el) && !utils.isDOMNode(el)) {
        reject(new Error(`${el} is not a dom element.`));
      }

      // 存储节点信息
      // 节点信息一旦登录，就可以开始 FLIP 动画
      let flipUnit = this.getFlipUnit(el.dataset.flipId);
      if (!flipUnit) {
        flipUnit = this.saveFlipUnit(el);
      }
      flipUnit = this.updateFlipUnit(el.dataset.flipId, el);

      const {
        stats: {
          layout: originLayout,
          // opacity: originOpacity,
        },
      } = flipUnit;

      // 关闭动画
      el.style.transition = '';

      requestAnimationFrame(() => {
        if (utils.exists(x)) {
          el.style.marginLeft = `${x}px`;
        }
        if (utils.exists(y)) {
          el.style.marginTop = `${y}px`;
        }

        const layout = utils.getLayout(el);
        // const opacity = utils.getOpacity(el);

        // Invert
        el.style.transform = `translate3d(${originLayout.left - layout.left}px, ${originLayout.top - layout.top}px, 0)`;

        requestAnimationFrame(() => {
          // 应用动画
          el.style.transition = `transform ${defaultDuration}ms ease`;
          // Play!
          el.style.transform = '';
        });

        el.addEventListener('transitionend', () => {
          el.style.transition = '';
          resolve(this);
        }, {
          capture: false,
          once: true,
        });
      });
    });
  }

  /**
   * @typedef FlipUnit
   * @type object
   * @prop {string} id - flip 单元唯一标识
   * @prop {object} stats - flip 单元初始状态下的位置及样式信息对象
   * @prop {object} stats.layout - 节点根据 Web API element.getBoundingClientRect() 获取的数据对象
   * @prop {object} stats.opacity - 节点透明度信息
   */

  /**
   * 根据 flip id 获取对应的 flip 单元
   *
   * @param {string} flipId - flip 单元的唯一标识
   * @return {FlipUnit} 一个包含节点做 flip 动画初始状态信息及唯一标识的对象
   */
  getFlipUnit(flipId) {
    return this.flipUnits[flipId];
  }

  isFliping(element) {
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

  saveFlipUnit(element) {
    const el = element;

    const flipId = `flip-${(new Date()).getTime()}`;
    el.dataset.flipId = flipId;
    this.flipUnits[flipId] = {
      el,
      id: flipId,
      stats: {
        layout: utils.getLayout(el),
        opacity: utils.getOpacity(el),
      },
    };
    return this.flipUnits[flipId];
  }

  updateFlipUnit(flipId, element) {
    this.flipUnits[flipId] = {
      el: element,
      id: flipId,
      stats: {
        layout: utils.getLayout(element),
        opacity: utils.getOpacity(element),
      },
    };
    return this.flipUnits[flipId];
  }

}

export default FLIP.getInstance();
