// возвращает размер шрифта на странице
function getDocumentFontSize(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// возвращает rem, полученные путём конвертации переданного значения в px
function getRem(pixels: number): number {
  return pixels / getDocumentFontSize();
}

// возвращает реальную высоту указанного элемента (в rem)
// https://bugs.chromium.org/p/chromium/issues/detail?id=411624
function getHeight(element: HTMLElement): string {
  element.style.setProperty('justify-content', 'flex-start');
  const height = getRem(element.scrollHeight);
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

// возвращает true, если ширина viewport'а больше указанного значения
function viewportIsWider(width: number): boolean {
  return window.innerWidth > width;
}

export default {
  getDocumentFontSize,
  getRem,
  getHeight,
  getScrollbarWidth,
  getWord,
  viewportIsWider,
};
