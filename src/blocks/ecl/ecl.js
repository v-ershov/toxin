class Ecl {
  constructor(node) {
    this.node = node;
    this._findNodes();
    this._addEventListeners();
    this._setHeight();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.button = this.node.querySelector('.ecl__button');
    this.content = this.node.querySelector('.ecl__content');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.button.addEventListener('click', () => {
      this._switchEcl();
    });
  }

  // устанавливает максимальную высоту контейнера для контента
  // https://bugs.chromium.org/p/chromium/issues/detail?id=411624
  _setHeight() {
    this.content.style.setProperty('justify-content', 'flex-start');

    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const heightRem = this.content.scrollHeight / fontSize;

    this.content.style.setProperty('--height', ` ${heightRem}rem`);
    this.content.style.removeProperty('justify-content');
  }

  // переключает состояние списка чекбоксов
  _switchEcl() {
    this.node.classList.toggle('ecl--active');
  }
}

document.querySelectorAll('.ecl').forEach((node) => new Ecl(node));
