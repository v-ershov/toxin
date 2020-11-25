interface IMainLandingElements {
  slideshow: HTMLElement;
}

class MainLanding {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IMainLandingElements; // элементы блока

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._getElements();

    this._addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы блока
  private _getElements(): IMainLandingElements {
    return {
      slideshow: this._root.querySelector('.main-landing__slideshow') as HTMLElement,
    };
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    window.addEventListener('scroll', () => {
      this._createParallax();
    });
  }

  // создаёт параллакс-эффект для слайдшоу
  private _createParallax(): void {
    this._elements.slideshow.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }
}

document.querySelectorAll('.main-landing').forEach((el) => new MainLanding(el as HTMLElement));
