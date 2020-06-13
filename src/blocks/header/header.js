class Header {
  constructor(node) {
    this.node = node;
    this._findNodes();
    this._addEventListeners();
    this._setHeight();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.hamburger = this.node.querySelector('.header__hamburger');
    this.nav = this.node.querySelector('.header__nav');
    this.list = this.node.querySelector('.header__list');
    this.sublists = this.node.querySelectorAll('.header__list--sublist');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    window.addEventListener('resize', () => {
      this._setHeight();
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('.header') !== this.node) {
        this._collapseHamburger();
      }
    });

    this.hamburger.addEventListener('click', () => {
      this._switchHamburger();
    });
  }

  // устанавливает максимальную высоту подсписков и навигационного меню
  // https://bugs.chromium.org/p/chromium/issues/detail?id=411624
  _setHeight() {
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    this.sublists.forEach((sublist) => {
      sublist.style.setProperty('justify-content', 'flex-start');
      sublist.style.setProperty('--height', ` ${sublist.scrollHeight / fontSize}rem`);
      sublist.style.removeProperty('justify-content');
    });

    this.nav.style.setProperty('--height', ` ${this.list.scrollHeight / fontSize}rem`);
  }

  // схлопывает гамбургер-меню
  _collapseHamburger() {
    this.hamburger.classList.remove('header__hamburger--active');
  }

  // переключает состояние гамбургер-меню
  _switchHamburger() {
    this.hamburger.classList.toggle('header__hamburger--active');
  }
}

document.querySelectorAll('.header').forEach((node) => new Header(node));
