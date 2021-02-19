import helpers from '~/ts/helpers';

interface IEclElements {
  button: HTMLButtonElement;
  list: HTMLUListElement;
}

class Ecl {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент списка

  private _elements: IEclElements; // элементы списка

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._bindEventListeners();
    this._setListHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // находит и возвращает элементы списка
  private _findElements(): IEclElements {
    return {
      button: this._root.querySelector('.ecl__button') as HTMLButtonElement,
      list: this._root.querySelector('.ecl__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    this._elements.button.addEventListener('click', this._handleButtonClick.bind(this));
  }

  // устанавливает максимальную высоту списка
  private _setListHeight(): void {
    const { list } = this._elements;

    list.style.setProperty('--height', helpers.getHeight(list));
  }

  // переключает состояние списка
  private _switchEcl(): void {
    this._root.classList.toggle('ecl--active');
  }

  // ----------------------
  // --- EVENT HANDLERS ---
  // ----------------------

  private _handleButtonClick(): void {
    this._switchEcl();
  }
}

export default function render(): void {
  document.querySelectorAll('.ecl').forEach((el) => new Ecl(el as HTMLElement));
}

render();
