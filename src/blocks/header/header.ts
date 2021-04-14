import helpers from '~/ts/helpers';

interface IHeaderElements {
  hamburger: HTMLButtonElement;
  nav: HTMLElement;
  list: HTMLUListElement;
}

class Header {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент хедера

  private _elements: IHeaderElements; // элементы хедера

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._bindEventListeners();
    this._setNavHeight();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы хедера
  private _findElements(): IHeaderElements {
    return {
      hamburger: this._root.querySelector('.js-header__hamburger') as HTMLButtonElement,
      nav: this._root.querySelector('.js-header__nav') as HTMLElement,
      list: this._root.querySelector('.js-header__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    window.addEventListener('resize', this._handleWindowResize.bind(this));
    document.addEventListener('click', this._handleDocumentClick.bind(this));
    this._elements.hamburger.addEventListener('click', this._handleHamburgerClick.bind(this));
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

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowResize(): void {
    this._setNavHeight();
  }

  private _handleDocumentClick(event: MouseEvent): void {
    if (this._root.contains(event.target as HTMLElement)) {
      return;
    }

    this._hideHamburger();
  }

  private _handleHamburgerClick(): void {
    this._switchHamburger();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-header').forEach((el) => new Header(el as HTMLElement));
}

render();
