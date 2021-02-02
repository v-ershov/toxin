interface IMainSignElements {
  background: HTMLDivElement;
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
    this._elements = this._findElements();

    this._addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // находит и возвращает элементы блока
  private _findElements(): IMainSignElements {
    return {
      background: this._root.querySelector('.main-sign__background') as HTMLDivElement,
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

export default function render(): void {
  document.querySelectorAll('.main-sign').forEach((el) => new MainSign(el as HTMLElement));
}

render();
