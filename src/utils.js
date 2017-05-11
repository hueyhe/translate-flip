export default {
  exists(o) {
    return o !== null && o !== undefined;
  },

  getComputedStyle(el) {
    // TODO polyfill
    return window.getComputedStyle(el);
  },

  getLayout(el) {
    if (!this.isDOMElement(el) && !this.isDOMNode(el)) {
      return null;
    }
    return el.getBoundingClientRect();
  },

  getMargin(el) {
    if (!this.isDOMElement(el) && !this.isDOMNode(el)) {
      return null;
    }
    const computedStyle = this.getComputedStyle(el);
    return {
      left: parseFloat(computedStyle.marginLeft),
      top: parseFloat(computedStyle.marginTop),
    };
  },

  getOpacity(el) {
    if (!this.isDOMElement(el) && !this.isDOMNode(el)) {
      return null;
    }
    return parseFloat(this.getComputedStyle(el).opacity);
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

  isNumber(o) {
    return typeof o === 'number';
  },

  isObject(o) {
    return this.exists(o) && typeof o === 'object' && !Array.isArray(o);
  },
};
