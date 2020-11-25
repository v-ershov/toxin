import helpers from '~/ts/helpers';

interface IHeaderElements {
  hamburger: HTMLElement;
  nav: HTMLElement;
  list: HTMLElement;
  sublists: NodeListOf<HTMLElement>;
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
    this._elements = this._getElements();

    this._addEventListeners();
    this._setNavHeight();
    this._setSublistsHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы хедера
  private _getElements(): IHeaderElements {
    return {
      hamburger: this._root.querySelector('.header__hamburger') as HTMLElement,
      nav: this._root.querySelector('.header__nav') as HTMLElement,
      list: this._root.querySelector('.header__list') as HTMLElement,
      sublists: this._root.querySelectorAll('.header__list--sublist') as NodeListOf<HTMLElement>,
    };
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    window.addEventListener('resize', () => {
      this._setNavHeight();
      this._setSublistsHeight();
    });

    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.header') !== this._root) {
        this._disableHamburger();
      }
    });

    this._elements.hamburger.addEventListener('click', () => {
      this._switchHamburger();
    });
  }

  // устанавливает максимальную высоту навигационного меню
  private _setNavHeight(): void {
    this._elements.nav.style.setProperty('--height', helpers.getHeight(this._elements.list));
  }

  // устанавливает максимальную высоту подсписков навигационного меню
  private _setSublistsHeight(): void {
    this._elements.sublists.forEach((sublist) => {
      sublist.style.setProperty('--height', helpers.getHeight(sublist));
    });
  }

  // выключает гамбургер-меню
  private _disableHamburger(): void {
    this._elements.hamburger.classList.remove('header__hamburger--active');
  }

  // переключает состояние гамбургер-меню
  private _switchHamburger(): void {
    this._elements.hamburger.classList.toggle('header__hamburger--active');
  }
}

document.querySelectorAll('.header').forEach((el) => new Header(el as HTMLElement));
