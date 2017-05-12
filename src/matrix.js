/**
 * CSS Transform matrix tools.
 *
 * @author hueyhe
 * Depends on mathjs.
 * https://www.npmjs.com/package/mathjs
 */

import math from 'mathjs';

const transformMatrixReg = /(matrix\()([\d.\s,-]+)(\))/;
const trimReg = /\s+/g;

export default {
  convertMatrixToTransform(matrix) {
    const transformValues = [];
    matrix.forEach((value, index) => {
      const rowIndex = index[0];
      const columnIndex = index[1];

      if (rowIndex >= 2) {
        return;
      }

      transformValues.splice(((rowIndex + 1) * columnIndex) + rowIndex, 0, value);
    });
    return `matrix(${transformValues.join(', ')})`;
  },

  convertTransformToMatrix(transform) {
    if (transform === 'none' || transform === '') {
      return 1;
    }
    // 提取矩阵数值
    let matrixStr = transform.replace(transformMatrixReg, '$2');
    // 去除多余空格
    matrixStr = matrixStr.replace(trimReg, '');
    const matrixArr = matrixStr.split(',').map(num => num - 0);
    return math.matrix([
      [matrixArr[0], matrixArr[2], matrixArr[4]],
      [matrixArr[1], matrixArr[3], matrixArr[5]],
      [0, 0, 1],
    ]);
  },

  excludeTSMatrix(matrix = 1, translate = [0, 0], scale = 1) {
    const translateArr = translate.map(dimension => dimension - 0);
    const translateMatrix = this.getTranslateMatrix(translateArr);
    const scaleMatrix = this.getScaleMatrix(scale - 0);
    const tsMatrix = math.multiply(translateMatrix, scaleMatrix);
    return math.multiply(matrix, math.inv(tsMatrix));
  },

  excludeScaleMatrix(matrix = 1, scale = 1) {
    const scaleMatrix = this.getScaleMatrix(scale - 0);
    return math.multiply(matrix, math.inv(scaleMatrix));
  },

  excludeTranslateMatrix(matrix = 1, translate = [0, 0]) {
    const translateArr = translate.map(dimension => dimension - 0);
    const translateMatrix = this.getTranslateMatrix(translateArr);
    return math.multiply(matrix, math.inv(translateMatrix));
  },

  getRotateMatrix(rotate) {
    const angle = (rotate / 180) * Math.PI;
    return math.matrix([
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 1],
    ]);
  },

  getTranslateMatrix(translate) {
    return math.matrix([
      [1, 0, translate[0]],
      [0, 1, translate[1]],
      [0, 0, 1],
    ]);
  },

  getScaleMatrix(scale) {
    return math.matrix([
      [scale, 0, 0],
      [0, scale, 0],
      [0, 0, 1],
    ]);
  },

  transformMatrix(matrix = 1, translate = [0, 0], scale = 1, rotate = 0) {
    const translateMatrix = this.getTranslateMatrix(translate);
    const scaleMatrix = this.getScaleMatrix(scale);
    const rotateMatrix = this.getRotateMatrix(rotate);

    const transformMatrix = math.multiply(
      math.multiply(translateMatrix, rotateMatrix),
      scaleMatrix,
    );
    const resultMatrix = math.multiply(matrix, transformMatrix);
    return this.convertMatrixToTransform(resultMatrix);
  },
};
