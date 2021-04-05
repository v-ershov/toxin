interface IMainLandingElements {
  slideshow: HTMLDivElement;
  slides: NodeListOf<HTMLDivElement>;
}

class MainLanding {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IMainLandingElements; // элементы блока

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
  private _findElements(): IMainLandingElements {
    return {
      slideshow: this._root.querySelector('.main-landing__slideshow') as HTMLDivElement,
      slides: this._root.querySelectorAll('.main-landing__slide'),
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    window.addEventListener('load', this._handleWindowLoad.bind(this));
    window.addEventListener('scroll', this._handleWindowScroll.bind(this));
  }

  // активирует слайды
  private _activateSlides(): void {
    this._elements.slides.forEach((slide) => {
      slide.classList.add('main-landing__slide--active');
    });
  }

  // создаёт параллакс-эффект для слайдшоу
  private _createParallax(): void {
    this._elements.slideshow.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowLoad(): void {
    this._activateSlides();
  }

  private _handleWindowScroll(): void {
    this._createParallax();
  }
}

export default function render(): void {
  document.querySelectorAll('.main-landing').forEach((el) => new MainLanding(el as HTMLElement));
}

render();
