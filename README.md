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
translate-flip 是一个十分轻量的动画库，打包后大小不超过 5kb

### 高性能
采用 FLIP 动画思想，确保动画的性能开销最小。如有兴趣请参考 [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/)

### 动画过程中中断？随时都可以
translate-flip 执行的动画可以在任何一帧中断，并从该帧开始进行下一个动画

## 基本使用
```javascript
import FLIP from 'translate-flip';

FLIP.magic(element, {
  x: 10,
  y: 20,
  opacity: 0.4,
}).then(el => {
  // 动画结束 callback
}).catch(error => {
  // catch error
});
```

## 进阶使用

## 需要注意的问题
- translate-flip 不完全支持通过 `margin-*: <number>px` 定位的元素进行动画，不支持以 `margin: auto` 定位的元素进行动画，且将来也不会支持。如有需要，则可以选择在元素外包裹一层容器 (container)，对容器进行动画。
- 目前仅支持 x, y, opacity 三个属性的动画

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
