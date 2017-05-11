import FLIP from './index';
// const FLIP = require('./index');


const button = window.document.createElement('button');
document.body.appendChild(button);
button.innerHTML = 'Test';

const flipElement = window.document.createElement('div');
flipElement.style.position = '';
flipElement.style.width = '200px';
flipElement.style.height = '200px';
flipElement.style.backgroundColor = 'red';
// flipElement.style.marginLeft = '-200px';
document.body.appendChild(flipElement);

button.addEventListener('click', () => {
  // FLIP.magic(flipElement, {
  //   x: 500 * Math.random(),
  //   y: 500 * Math.random(),
  // }, 500).then((el) => {
  //   FLIP
  //     .reload(el)
  //     .magic(el, {
  //       x: 500 * Math.random(),
  //       y: 500 * Math.random(),
  //       scale: 1.6,
  //     }, 800);
  // });
  FLIP.magic(flipElement, {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    // opacity: 0,
    scale: 0.5,
  }, 1000, FLIP.Easing.MDCubic, {
    use3d: false,
  }).then(el => console.log(el));
});

flipElement.addEventListener('mousemove', () => {
  FLIP.magic(flipElement, {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
  }, 500).then(el => console.log(el, 'done'));
});

// const otherElement = window.document.createElement('div');
// otherElement.style.position = 'absolute';
// otherElement.style.width = '200px';
// otherElement.style.height = '200px';
// otherElement.style.backgroundColor = 'blue';
// document.body.appendChild(otherElement);
