import helpers from '~/ts/helpers';

interface IElements {
  button: HTMLButtonElement;
  section: HTMLElement;
  asideLastChild: HTMLButtonElement;
}

class MainSearch {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  private _isButtonActive = false; // если true, то кнопка 'Фильтры' активна

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._observe();
    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      button: r.querySelector('.js-main-search__button') as HTMLButtonElement,
      section: r.querySelector('.js-main-search__section') as HTMLElement,
      asideLastChild: r.querySelector('.js-main-search__aside .js-ecl__button') as HTMLButtonElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const {
      button,
      section,
    } = this._elements;

    const header = document.querySelector('.js-header') as HTMLElement;

    button.addEventListener('click', this._handleButtonClick.bind(this));
    section.addEventListener('focusin', this._handleSectionFocusin.bind(this));
    header.addEventListener('focusin', this._handleHeaderFocusin.bind(this));
  }

  // создаёт IntersectionObserver для последующего переключения состояния кнопки 'Фильтры'
  private _observe(): void {
    const { button } = this._elements;
    const bcl = button.classList;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        button.disabled = true;
        bcl.add('main-search__button--hidden');
      } else {
        button.disabled = false;
        bcl.remove('main-search__button--hidden');
      }
    }, {
      rootMargin: '-100% 0px 0px',
    });

    observer.observe(this._root);
  }

  // отображает фильтры
  private _showFilters(): void {
    this._root.classList.add('main-search--filter');
    this._elements.button.classList.add('main-search__button--active');

    document.body.style.setProperty('padding-right', `${helpers.getScrollbarWidth()}px`);
    document.body.style.setProperty('overflow-y', 'hidden');
  }

  // скрывает фильтры
  private _hideFilters(): void {
    this._root.classList.remove('main-search--filter');
    this._elements.button.classList.remove('main-search__button--active');

    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow-y');
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleButtonClick(): void {
    this._isButtonActive = !this._isButtonActive;

    if (this._isButtonActive) {
      this._showFilters();
    } else {
      this._hideFilters();
    }
  }

  private _handleSectionFocusin(): void {
    if (this._isButtonActive) {
      this._elements.button.focus();
    }
  }

  private _handleHeaderFocusin(): void {
    if (this._isButtonActive) {
      this._elements.asideLastChild.focus();
    }
  }
}

export default function render(): void {
  document.querySelectorAll('.js-main-search').forEach((el) => new MainSearch(el as HTMLElement));
}

render();
