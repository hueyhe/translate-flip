import FLIP from './index';

const flipElement = window.document.createElement('div');
flipElement.style.width = '200px';
flipElement.style.height = '200px';
flipElement.style.backgroundColor = 'red';
document.body.appendChild(flipElement);

FLIP
  .magic(flipElement, {
    x: 160,
    y: 50,
  })
  .then((flip) => {
    console.log(flip);
  });
