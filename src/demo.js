import FLIP from './index';

const flipElement = window.document.createElement('div');
flipElement.style.position = 'absolute';
flipElement.style.width = '200px';
flipElement.style.height = '200px';
flipElement.style.backgroundColor = 'red';
document.body.appendChild(flipElement);

const otherElement = window.document.createElement('div');
otherElement.style.position = 'absolute';
otherElement.style.width = '200px';
otherElement.style.height = '200px';
otherElement.style.backgroundColor = 'blue';
document.body.appendChild(otherElement);

// FLIP
//   .magic(flipElement, {
//     x: 160,
//     y: 50,
//   })
//   .then(flip => flip.magic(flipElement, {
//     x: 0,
//     y: 70,
//   }));

FLIP
  .magicBundle([
    {
      element: flipElement,
      last: {
        x: 160,
        y: 50,
      },
      duration: 500,
    },
    {
      element: otherElement,
      last: {
        x: 34,
        y: 70,
      },
      duration: 800,
    },
  ])
  .then(flip => console.log(flip));
