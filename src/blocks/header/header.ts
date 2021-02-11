import helpers from '~/ts/helpers';

interface IHeaderElements {
  hamburger: HTMLButtonElement;
  nav: HTMLElement;
  list: HTMLUListElement;
}

class Header {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент хедера

  private _elements: IHeaderElements; // элементы хедера

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._addEventListeners();
    this._setNavHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // находит и возвращает элементы хедера
  private _findElements(): IHeaderElements {
    return {
      hamburger: this._root.querySelector('.header__hamburger') as HTMLButtonElement,
      nav: this._root.querySelector('.header__nav') as HTMLElement,
      list: this._root.querySelector('.header__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    window.addEventListener('resize', () => {
      this._setNavHeight();
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.closest('.header') === this._root) {
        return;
      }

      this._hideHamburger();
    });

    this._elements.hamburger.addEventListener('click', () => {
      this._switchHamburger();
    });
  }

  // устанавливает максимальную высоту навигационного меню
  private _setNavHeight(): void {
    const {
      nav,
      list,
    } = this._elements;

    nav.style.setProperty('--height', helpers.getHeight(list));
  }

  // переключает состояние гамбургер-меню
  private _switchHamburger(): void {
    this._elements.hamburger.classList.toggle('header__hamburger--active');
  }

  // скрывает гамбургер-меню
  private _hideHamburger(): void {
    this._elements.hamburger.classList.remove('header__hamburger--active');
  }
}

export default function render(): void {
  document.querySelectorAll('.header').forEach((el) => new Header(el as HTMLElement));
}

render();
