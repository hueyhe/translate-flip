/**
 * 浏览器兼容性帮助工具
 */
export default {
  /**
   * transitionend 事件兼容
   * 获取当前浏览器下支持的 transitionend 事件处理
   *
   * @return {string} transitionend 事件对应字符串
   */
  transitionend() {
    const el = window.document.createElement('div');
    const transitions = {
      transition: 'transitionend',
      OTransition: 'otransitionend',  // oTransitionEnd in very old Opera
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
    };
    const transition = Object.keys(transitions).find(key => el.style[key] !== undefined);
    if (!transition) {
      throw new Error('Your browser do not support transitionend event. Please try it on other morden browsers.');
    }
    return transition;
  },
};
