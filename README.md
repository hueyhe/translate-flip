<!-- TITLE/ -->

<h1>translate-flip</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/translate-flip" title="View this project on NPM"><img src="https://img.shields.io/npm/v/translate-flip.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/translate-flip" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/translate-flip.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/hueyhe/translate-flip" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/hueyhe/translate-flip.svg" alt="Dependency Status" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

FLIP high performace CSS3 transformations & transitions

<!-- /DESCRIPTION -->


## Installation

Via npm
```bash
$ npm install translate-flip --save
```

Via yarn
```bash
$ yarn add translate-flip
```

## Features
### Extremely light weight
translate-flip is an extremely light weight transformation helper tool. It's only 10.8 kb after minimize.

### High performance
Inspired by FLIP animation. Guarantee the least cost of making things move. If you are interested how FLIP works, please refer to [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/).

### Interrupt during animation? Anytime!
translate-flip can interrupt the animation in any frame you want. It will start the next animation right after the frame you interrupted. All you need to do is simply call `FLIP.magic`.

## Basic usage

Basic API is as below:

`FLIP.magic(el, last, duration, easing, options)`

It returns a `Promise` object.

Code below uses es6 feature:

```javascript
import FLIP from 'translate-flip';

const { Easing } = FLIP;

FLIP.magic(element, {
  x: 10,
  y: 20,
  opacity: 0.4,
  scale: 0.5,
}, 1000, Easing.Ease).then(el => {
  // Animation end callback
  // parameter is the element which is just animated
}).catch(error => {
  // catch error
});
```

## Advance usage

### Interrupt then play

It is possible for you to interrupt an animation and then play another animation right after that frame. All you need to do is just call `FLIP.magic` whenever you want to interrupt.

```javascript
FLIP.magic(element, {
  x: 100,
  y: 200,
}, 1000);

// 100ms later, change the moving destination of the element
// all you need to do is applying the magic again
// previous animation would be interrupted
// then smoothly play the lastest animation
window.setTimeout(() => {
  FLIP.magic(element, {
    x: 300,
    y: 50,
  }, 500);
}, 100);
```

### Animation routine

Params including x, y, etc in translate-flip is relative to the element's initial position and status. If you want to transform the element according to the element's current position or status, you need to reload your element for translate-flip.

Not reloading:

```javascript
// initial position of the element is x = 0, y = 0
FLIP
  .magic(element, {
    x: 100,
    y: 200,
  }, 1000)
  .then(el => {
    // now the position of element is x = 100, y = 200
    // but initial position is still x = 0, y = 0
    FLIP.magic(el, {
      x: 100,
      y: 200,
    }, 1000);
    // after second animation, position of the element will be x = 100, y = 200
  });


```

Reload after the first animation:

```javascript
// initial position of the element is x = 0, y = 0
FLIP
  .magic(element, {
    x: 100,
    y: 200,
  }, 1000)
  .then(el => {
    // reload element for translate-flip
    FLIP.reload(el);
    // the initial position changed to x = 100, y = 200
    FLIP.magic(el, {
      x: 100,
      y: 200,
    }, 1000);
    // after second animation, position of the element will be x = 200, y = 400
  });
```

### Easing functions

#### Built-in easing functions

translate-flip provides some built-in easing functions

- Ease
- EaseIn
- EaseOut
- EaseInOut
- Linear
- MDCubic: Conform to the standard bezier curve in Material Design

basic usage of easing functions: 

```javascript
const { Easing } = FLIP;

FLIP.magic(element, {
  x: 100,
  y: 200,
}, 1000, Easing.Linear);
```

#### Customize easing functions

Based on the `cubic-bezier` function supported by CSS, translate-flip allow you to customize your own easing function. For more details you can refer to [Cubic Bezier](http://cubic-bezier.com/).

```javascript
const customizeEasing = Easing.Cubic(x1, y1, x2, y2);
```

### Configure your animation

There are several configurable options as below

```javascript
// took effect since v0.4.1
options: {
  /**
   * whether or not to use translate3d while animating the element, true by default
   * Please pay attention, under some specific circumstances, using translate3d may cause distortion.
   * For instance a param in transform is a decimal of many places, in this case the element may be distortion while using translate3d
   */
  use3d: true,
}
```

## Something you need to know

### Way for translate-flip to locate an element

Implementation of moving element from original place to target place is via **left** & **right** in css. Therefore elements with self-adaption, such as `margin: auto`, may not be animated correctly while using translate-flip.

If you want to animate element which contains any properties below, we suggest wrapping the element with a container and apply such css properties to it. And then FLIP with the element.

CSS properties FLIP not supporting
- `margin: auto`
- `left: 50%`
- `top: 30%`

translate-flip does not support and also would not support elements with these css properties.

### Supported animation params

Attention: rotate is partly supported. In animation routine, if interrupted, rotation can only perform angle less than 360°. If not rotation can perform angle larger than 360°. It is restricted by [Interpolation of Matrices](https://www.w3.org/TR/css-transforms-1/#matrix-interpolation) & [Mathematical Description of Transform Functions](https://www.w3.org/TR/css-transforms-1/#mathematical-description).

- **x**: translation along the X axis
- **y**: translation along the Y axis
- **scale**: scaling size, 1 for primitive size
- **opacity**: opacity, [0, 1] float
- **rotate**: angle of rotation [-360, 360]

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
