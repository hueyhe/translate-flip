<!-- TITLE/ -->

<h1>translate-flip</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/translate-flip" title="View this project on NPM"><img src="https://img.shields.io/npm/v/translate-flip.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/translate-flip" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/translate-flip.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/hueyhe/translate-flip" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/hueyhe/translate-flip.svg" alt="Dependency Status" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

FLIP 高性能动画库

<!-- /DESCRIPTION -->


## 安装

通过 npm
```bash
$ npm install translate-flip --save
```

通过 yarn
```bash
$ yarn add translate-flip
```

## 特点
### 极致轻量
translate-flip 是一个十分轻量的动画库，打包后大小仅为 6.83 kb

### 高性能
采用 FLIP 动画思想，确保动画的性能开销最小。如有兴趣请参考 [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/)

### 动画过程中中断？随时都可以
translate-flip 执行的动画可以在任何一帧中断，并从该帧开始进行下一个动画，需要做的仅仅只是再次调用 `FLIP.magic`

## 基本使用

基本 API 为 `FLIP.magic(el, last, duration, easing, options)`，返回值为 `Promise` 对象

以下代码采用 es6 语法

```javascript
import FLIP from 'translate-flip';

const { Easing } = FLIP;

FLIP.magic(element, {
  x: 10,
  y: 20,
  opacity: 0.4,
  scale: 0.5,
}, 1000, Easing.Ease).then(el => {
  // 动画结束 callback
  // 回调函数参数为执行动画的节点
}).catch(error => {
  // catch error
});
```

## 进阶使用

### 断点续播

如何中断动画，在中断的那一帧改变动画结束状态，继续动画？很简单！你只需要再次调用 `FLIP.magic` 就可以了
```javascript
FLIP.magic(element, {
  x: 100,
  y: 200,
}, 1000);

// 100ms 后，让节点改变移动轨迹
// 只需要再次施加魔法
// 上面的动画就会被打断
// 并且平滑地完成下面的动画
window.setTimeout(() => {
  FLIP.magic(element, {
    x: 300,
    y: 50,
  }, 500);
}, 100);
```

### 连续相对动画

translate-flip 中执行动画的位移等参数，都是相对节点第一次动画前时状态的偏移，如果你希望相对于节点当前的状态进行动画，那么就需要为节点重新注册 FLIP 动画。

不改变节点的初始位置:

```javascript
// 节点初始位置为 x = 0, y = 0
FLIP
  .magic(element, {
    x: 100,
    y: 200,
  }, 1000)
  .then(el => {
    // 此时节点当前位置为 x = 100, y = 200
    // 初始位置仍为 x = 0, y = 0
    FLIP.magic(el, {
      x: 100,
      y: 200,
    }, 1000);
    // 动画结束后 x = 100, y = 200
  });


```

动画结束后更新节点的初始位置:

```javascript
// 节点初始位置为 x = 0, y = 0
FLIP
  .magic(element, {
    x: 100,
    y: 200,
  }, 1000)
  .then(el => {
    // 重新注册 FLIP
    FLIP.reload(el);
    // 此时节点的初始状态变更为 x = 100, y = 200
    FLIP.magic(el, {
      x: 100,
      y: 200,
    }, 1000);
    // 动画结束后 x = 200, y = 400
  });
```

### 过渡函数

#### 内置过渡函数

translate-flip 提供了几个内置的过渡函数

- Ease
- EaseIn
- EaseOut
- EaseInOut
- Linear
- MDCubic: 符合 Material Design 过渡规范的贝塞尔曲线

基本使用方式: 

```javascript
const { Easing } = FLIP;

FLIP.magic(element, {
  x: 100,
  y: 200,
}, 1000, Easing.Linear);
```

#### 自定义过渡函数

基于 CSS 提供的 `cubic-bezier` 函数，translate-flip 支持自定义贝塞尔曲线过渡函数，具体可以参考 [Cubic Bezier](http://cubic-bezier.com/)

```javascript
const customizeEasing = Easing.Cubic(x1, y1, x2, y2);
```

### 可配置动画参数

`options` 拥有可配置参数如下

```javascript
options: {
  /**
   * 是否使用 translate3d 进行位移动画，默认下为 true
   * 需要注意的是，在一些特定情况下，例如 transform 的参数是一个位数较多的浮点数
   * 使用 translate3d 可能会导致节点元素显示失真
   */
  use3d: true,
}
```

## 需要注意的问题

### 节点定位方式

translate-flip 仅支持 **相对定位** (position: relative) 且 **不依赖 margin 进行定位** 的元素进行动画。

若你想进行动画的元素包含任一如下样式，则建议在元素外包裹一层容器 (container)，将以下定位样式应用至容器上，再对元素进行 FLIP 动画

FLIP 不支持的定位样式
- `position: absolute`
- `position: fixed`
- `margin-*: <number>px`
- `margin: auto`

FLIP 不支持且未来也不会支持包含这些样式元素的动画。

### 目前支持的动画属性

- **x**: x 轴平移量
- **y**: y 轴平移量
- **scale**: 放大与缩小，1 为原始大小
- **opacity**: 透明度，[0, 1] 浮点数


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="http://hueyhe.com">hueyhe</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?



<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://hueyhe.com">hueyhe</a></li></ul>



<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://hueyhe.com">hueyhe</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
