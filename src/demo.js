import FLIP from './index';

const button = window.document.createElement('button');
document.body.appendChild(button);
button.innerHTML = 'Test';

const flipElement = window.document.createElement('div');
flipElement.style.position = '';
flipElement.style.width = '200px';
flipElement.style.height = '200px';
flipElement.style.backgroundColor = 'red';
document.body.appendChild(flipElement);

button.addEventListener('click', () => {
  FLIP.magic(flipElement, {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
  }, 500).then(flip => console.log(flip, 'done'));
});

flipElement.addEventListener('mouseenter', () => {
  FLIP.magic(flipElement, {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
  }, 500).then(flip => console.log(flip, 'done'));
});

// const otherElement = window.document.createElement('div');
// otherElement.style.position = 'absolute';
// otherElement.style.width = '200px';
// otherElement.style.height = '200px';
// otherElement.style.backgroundColor = 'blue';
// document.body.appendChild(otherElement);

FLIP.magic(flipElement, {
  x: 200,
  y: 50,
}, 500).then(flip => console.log(flip, 'done'));
