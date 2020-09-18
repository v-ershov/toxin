// ############################################################################################################
// https://bugs.chromium.org/p/chromium/issues/detail?id=411624
function getHeight(node) {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  node.style.setProperty('justify-content', 'flex-start');
  const height = node.scrollHeight / fontSize;
  node.style.removeProperty('justify-content');

  return `${height}rem`;
}

// возвращает ширину вертикальной полосы прокрутки главного окна
function getScrollbarWidth() {
  return window.innerWidth - document.body.clientWidth;
}

// https://webpack.js.org/guides/dependency-management/
function importAll(r) {
  r.keys().forEach(r);
}

// ############################################################################################################
function shit(value, word1, word2, word3) {
  const lastDigit = value % 10;
  const lastTwoDigits = value % 100;

  if (lastDigit === 0
    || (lastDigit >= 5 && lastDigit <= 9)
    || (lastTwoDigits >= 10 && lastTwoDigits <= 19)) {
    return word3;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return word2;
  }

  return word1;
}

export default {
  getHeight,
  getScrollbarWidth,
  importAll,
  shit,
};
