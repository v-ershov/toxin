import helpers from '~/ts/helpers';

interface IElements {
  hamburger: HTMLButtonElement;
  nav: HTMLElement;
  list: HTMLUListElement;
}

class Header {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._setNavHeight();
    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      hamburger: r.querySelector('.js-header__hamburger') as HTMLButtonElement,
      nav: r.querySelector('.js-header__nav') as HTMLElement,
      list: r.querySelector('.js-header__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const { hamburger } = this._elements;

    window.addEventListener('resize', this._handleWindowResize.bind(this));
    document.addEventListener('click', this._handleDocumentClick.bind(this));
    hamburger.addEventListener('click', this._handleHamburgerClick.bind(this));
  }

  // устанавливает высоту навигационного меню
  private _setNavHeight(): void {
    this._elements.nav.style.setProperty('--height', helpers.getHeight(this._elements.list));
  }

  // переключает состояние гамбургер-меню
  private _switchHamburgerMenu(): void {
    this._elements.hamburger.classList.toggle('header__hamburger--active');
  }

  // скрывает гамбургер-меню
  private _hideHamburgerMenu(): void {
    this._elements.hamburger.classList.remove('header__hamburger--active');
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowResize(): void {
    this._setNavHeight();
  }

  private _handleDocumentClick(event: MouseEvent): void {
    if (!this._root.contains(event.target as Node)) {
      this._hideHamburgerMenu();
    }
  }

  private _handleHamburgerClick(): void {
    this._switchHamburgerMenu();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-header').forEach((el) => new Header(el as HTMLElement));
}

render();
