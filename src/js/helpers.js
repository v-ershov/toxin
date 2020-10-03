// возвращает реальную высоту указанного узла (в rem)
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

// возвращает одно из указанных слов в зависимости от последней цифры
// указанного числа для правильного склонения слов
function getWord(num, words) {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastDigit === 0
    || (lastDigit >= 5 && lastDigit <= 9)
    || (lastTwoDigits >= 10 && lastTwoDigits <= 19)) {
    return words[2];
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return words[1];
  }

  return words[0];
}

export default {
  getHeight,
  getScrollbarWidth,
  getWord,
};
