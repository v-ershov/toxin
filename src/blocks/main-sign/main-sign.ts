interface IMainSignElements {
  background: HTMLElement;
}

class MainSign {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IMainSignElements; // элементы блока

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
  private _getElements(): IMainSignElements {
    return {
      background: this._root.querySelector('.main-sign__background') as HTMLElement,
    };
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    window.addEventListener('scroll', () => {
      this._createParallax();
    });
  }

  // создаёт параллакс-эффект для фонового изображения
  private _createParallax(): void {
    this._elements.background.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }
}

document.querySelectorAll('.main-sign').forEach((el) => new MainSign(el as HTMLElement));
