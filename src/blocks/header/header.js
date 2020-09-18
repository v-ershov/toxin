import helpers from '~/js/helpers';

class Header {
  constructor(node) {
    this._initNodes(node);
    this._addEventListeners();
    this._setNavHeight();
    this._setSublistsHeight();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      hamburger: node.querySelector('.header__hamburger'),
      nav: node.querySelector('.header__nav'),
      list: node.querySelector('.header__list'),
      sublists: node.querySelectorAll('.header__list--sublist'),
    };
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    window.addEventListener('resize', () => {
      this._setNavHeight();
      this._setSublistsHeight();
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('.header') !== this.nodes.root) {
        this._disableHamburger();
      }
    });

    this.nodes.hamburger.addEventListener('click', () => {
      this._switchHamburger();
    });
  }

  // устанавливает максимальную высоту навигационного меню
  _setNavHeight() {
    this.nodes.nav.style.setProperty('--height', helpers.getHeight(this.nodes.list));
  }

  // устанавливает максимальную высоту подсписков навигационного меню
  _setSublistsHeight() {
    this.nodes.sublists.forEach((sublist) => {
      sublist.style.setProperty('--height', helpers.getHeight(sublist));
    });
  }

  // выключает гамбургер-меню
  _disableHamburger() {
    this.nodes.hamburger.classList.remove('header__hamburger--active');
  }

  // переключает состояние гамбургер-меню
  _switchHamburger() {
    this.nodes.hamburger.classList.toggle('header__hamburger--active');
  }
}

document.querySelectorAll('.header').forEach((node) => new Header(node));
