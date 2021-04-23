import helpers from '~/ts/helpers';

interface IElements {
  button: HTMLButtonElement;
  list: HTMLUListElement;
}

class Ecl {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLDivElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLDivElement) {
    this._root = root;
    this._elements = this._findElements();

    this._setListHeight();
    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      button: r.querySelector('.js-ecl__button') as HTMLButtonElement,
      list: r.querySelector('.js-ecl__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const { button } = this._elements;

    button.addEventListener('click', this._handleButtonClick.bind(this));
  }

  // переключает состояние блока
  private _switch(): void {
    this._root.classList.toggle('ecl--active');
  }

  // устанавливает высоту списка
  private _setListHeight(): void {
    this._elements.list.style.setProperty('--height', helpers.getHeight(this._elements.list));
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleButtonClick(): void {
    this._switch();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-ecl').forEach((el) => new Ecl(el as HTMLDivElement));
}

render();
