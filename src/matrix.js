/**
 * CSS Transform matrix tool.
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
      return math.eye(3);
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

  /**
   * 将给定 transform 去除 translate 与 scale，保留剩下的 transform info 并返回 transform
   */
  excludeTSTransform(transform, translate = [0, 0], scale = 1) {
    const transformMatrix = this.convertTransformToMatrix(transform);
    const translateMatrix = this.getTranslateMatrix(translate);
    const scaleMatrix = this.getScaleMatrix(scale);

    const tsMatrix = math.multiply(translateMatrix, scaleMatrix);

    const excludedMatrix = math.multiply(transformMatrix, math.inv(tsMatrix));

    return this.convertMatrixToTransform(excludedMatrix);
  },

  getRotateMatrix(rotate) {
    const angle = (rotate / 180) * Math.PI;
    return math.matrix([
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 1],
    ]);
  },

  getTransformInfo(transform) {
    const transformMatrix = this.convertTransformToMatrix(transform);

    // transform matrix
    // | a  c  e |
    // | b  d  f |
    // | 0  0  1 |
    const matrixInfo = {};
    transformMatrix.forEach((value, index) => {
      const indexRow = index[0];
      const indexColumn = index[1];
      if (indexRow === 0 && indexColumn === 0) matrixInfo.a = value;
      if (indexRow === 1 && indexColumn === 0) matrixInfo.b = value;
      if (indexRow === 0 && indexColumn === 1) matrixInfo.c = value;
      if (indexRow === 1 && indexColumn === 1) matrixInfo.d = value;
      if (indexRow === 0 && indexColumn === 2) matrixInfo.e = value;
      if (indexRow === 1 && indexColumn === 2) matrixInfo.f = value;
    });
    let rotate = Math.atan(matrixInfo.b / matrixInfo.a);
    if (matrixInfo.b > 0 && matrixInfo.a < 0) rotate = Math.PI + rotate;
    if (matrixInfo.b < 0 && matrixInfo.a < 0) rotate = Math.PI + rotate;
    if (matrixInfo.b < 0 && matrixInfo.a > 0) rotate = (2 * Math.PI) + rotate;
    const angle = (rotate / Math.PI) * 180;
    const scale = matrixInfo.a / Math.cos(rotate);
    const x = matrixInfo.e;
    const y = matrixInfo.f;
    return {
      rotate: angle,
      scale,
      translate: {
        x,
        y,
      },
    };
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

  /**
   * rotate 与 skew 对应的 matrix
   */
  rsMatrix(rotate = 0) {
    const rotateMatrix = this.getRotateMatrix(rotate);
    return rotateMatrix;
  },

  rotateTransform(rotate = 0) {
    const rotateMatrix = this.getRotateMatrix(rotate);

    return this.convertMatrixToTransform(rotateMatrix);
  },

  transformMatrix(matrix = 1, translate = [0, 0], scale = 1, rotate = 0) {
    const translateMatrix = this.getTranslateMatrix(translate);
    const scaleMatrix = this.getScaleMatrix(scale);
    const rotateMatrix = this.getRotateMatrix(rotate);

    const transformMatrix = math.multiply(
      math.multiply(translateMatrix, scaleMatrix),
      rotateMatrix,
    );

    const resultMatrix = math.multiply(matrix, transformMatrix);

    return this.convertMatrixToTransform(resultMatrix);
  },
};
