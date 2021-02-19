import helpers from '~/ts/helpers';

interface IMainSearchElements {
  button: HTMLButtonElement;
}

class MainSearch {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IMainSearchElements; // элементы блока

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._bindEventListeners();
    this._observe();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IMainSearchElements {
    return {
      button: this._root.querySelector('.main-search__button') as HTMLButtonElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    this._elements.button.addEventListener('click', this._handleButtonClick.bind(this));
  }

  // создаёт Intersection Observer для последующего переключения состояния кнопки «Фильтры»
  private _observe(): void {
    const observer = new IntersectionObserver((entries) => {
      const bcl = this._elements.button.classList;

      if (entries[0].isIntersecting) {
        bcl.remove('main-search__button--hidden');
      } else {
        bcl.add('main-search__button--hidden');
      }
    }, {
      rootMargin: '-100% 0px 0px',
    });

    observer.observe(this._root);
  }

  // переключает состояние сайдбара
  private _switchSidebar(): void {
    const rcl = this._root.classList;
    const bcl = this._elements.button.classList;

    if (bcl.contains('main-search__button--hidden')) {
      return;
    }

    rcl.toggle('main-search--filter');
    bcl.toggle('main-search__button--active');

    const body = document.body.style;

    if (bcl.contains('main-search__button--active')) {
      body.setProperty('margin-right', `${helpers.getScrollbarWidth()}px`);
      body.setProperty('overflow-y', 'hidden');
    } else {
      body.removeProperty('margin-right');
      body.removeProperty('overflow-y');
    }
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleButtonClick(): void {
    this._switchSidebar();
  }
}

export default function render(): void {
  document.querySelectorAll('.main-search').forEach((el) => new MainSearch(el as HTMLElement));
}

render();
