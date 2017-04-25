export default {
  getLayout(el) {
    if (!this.isDOMElement(el) && !this.isDOMNode(el)) {
      return null;
    }
    return el.getBoundingClientRect();
  },

  getOpacity(el) {
    if (!this.isDOMElement(el) && !this.isDOMNode(el)) {
      return null;
    }
    return parseFloat(window.getComputedStyle(el).opacity);
  },

  /**
   * 判断对象是否是 DOM Element
   *
   * @param {object} o - 需要判断的对象
   * @return {boolean} 是否是 DOM Element
   */
  isDOMElement(o) {
    return (
      typeof HTMLElement === 'object' ? o instanceof HTMLElement : // DOM2
        o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
    );
  },

  /**
   * 判断对象是否是 DOM Node
   *
   * @param {object} o - 需要判断的对象
   * @return {boolean} 是否是 DOM Node
   */
  isDOMNode(o) {
    return (
      typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
  },
};
