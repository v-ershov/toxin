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
    this.list = this.node.querySelector('.ecl__list');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.button.addEventListener('click', () => {
      this._switchEcl();
    });
  }

  // устанавливает максимальную высоту списка чекбоксов
  _setHeight() {
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    this.list.style.setProperty('--height', ` ${this.list.scrollHeight / fontSize}rem`);
  }

  // переключает состояние списка чекбоксов
  _switchEcl() {
    this.node.classList.toggle('ecl--active');
  }
}

document.querySelectorAll('.ecl').forEach((node) => new Ecl(node));
