module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "rules": {
    "no-console": 0
  },
  "env": {
    "browser": true,
    "node": true,
    "jasmine": true,
    "jest": true
  }
};
