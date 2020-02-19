class Accordion {
  constructor(node) {
    this.content = node.querySelector('.accordion__content');
    this._setHeight();
  }

  // устанавливает максимальную высоту контейнера для контента
  _setHeight() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=411624
    this.content.style.setProperty('justify-content', 'flex-start');
    this.content.style.setProperty('--height', ` ${this.content.scrollHeight}px`);
    this.content.style.removeProperty('justify-content');
  }
}

document.querySelectorAll('.accordion').forEach((node) => new Accordion(node));
