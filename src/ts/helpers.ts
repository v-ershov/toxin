// возвращает реальную высоту указанного элемента (в rem)
// https://bugs.chromium.org/p/chromium/issues/detail?id=411624
function getHeight(element: HTMLElement): string {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  element.style.setProperty('justify-content', 'flex-start');
  const height = element.scrollHeight / fontSize;
  element.style.removeProperty('justify-content');

  return `${height}rem`;
}

// возвращает ширину вертикальной полосы прокрутки главного окна
function getScrollbarWidth(): number {
  return window.innerWidth - document.body.clientWidth;
}

// возвращает одно из указанных слов в зависимости от последней
// цифры указанного числа для правильного склонения слова
function getWord(value: number, words: [string, string, string]): string {
  const lastDigit = value % 10;
  const lastTwoDigits = value % 100;

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
