interface IElements {
  background: HTMLDivElement;
}

class MainSign {
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

    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      background: r.querySelector('.js-main-sign__background') as HTMLDivElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    window.addEventListener('scroll', this._handleWindowScroll.bind(this));
  }

  // создаёт параллакс-эффект для фонового изображения
  private _makeParallax(): void {
    this._elements.background.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowScroll(): void {
    this._makeParallax();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-main-sign').forEach((el) => new MainSign(el as HTMLElement));
}

render();
