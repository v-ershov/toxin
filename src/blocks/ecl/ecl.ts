import helpers from '~/ts/helpers';

interface IEclElements {
  button: HTMLElement;
  list: HTMLElement;
}

class Ecl {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент списка чекбоксов

  private _elements: IEclElements; // элементы списка чекбоксов

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._getElements();

    this._addEventListeners();
    this._setHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы списка чекбоксов
  private _getElements(): IEclElements {
    return {
      button: this._root.querySelector('.ecl__button') as HTMLElement,
      list: this._root.querySelector('.ecl__list') as HTMLElement,
    };
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    this._elements.button.addEventListener('click', () => {
      this._switchEcl();
    });
  }

  // устанавливает максимальную высоту списка чекбоксов
  private _setHeight(): void {
    this._elements.list.style.setProperty('--height', helpers.getHeight(this._elements.list));
  }

  // переключает состояние списка чекбоксов
  private _switchEcl(): void {
    this._root.classList.toggle('ecl--active');
  }
}

document.querySelectorAll('.ecl').forEach((el) => new Ecl(el as HTMLElement));
