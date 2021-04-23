interface IElements {
  slideshow: HTMLDivElement;
  slides: NodeListOf<HTMLDivElement>;
}

class MainLanding {
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
      slideshow: r.querySelector('.js-main-landing__slideshow') as HTMLDivElement,
      slides: r.querySelectorAll('.js-main-landing__slide'),
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    window.addEventListener('load', this._handleWindowLoad.bind(this));
    window.addEventListener('scroll', this._handleWindowScroll.bind(this));
  }

  // включает слайды слайдшоу
  private _enableSlides(): void {
    this._elements.slides.forEach((slide) => {
      slide.classList.remove('main-landing__slide--disabled');
    });
  }

  // создаёт параллакс-эффект для слайдшоу
  private _makeParallax(): void {
    this._elements.slideshow.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowLoad(): void {
    this._enableSlides();
  }

  private _handleWindowScroll(): void {
    this._makeParallax();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-main-landing').forEach((el) => new MainLanding(el as HTMLElement));
}

render();
