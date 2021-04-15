import helpers from '~/ts/helpers';

interface IEclElements {
  button: HTMLButtonElement;
  list: HTMLUListElement;
}

class Ecl {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент списка

  private _elements: IEclElements; // элементы списка

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._bindEventListeners();
    this._setRootPadding();
    this._setListHeight();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы списка
  private _findElements(): IEclElements {
    const r = this._root;

    return {
      button: r.querySelector('.js-ecl__button') as HTMLButtonElement,
      list: r.querySelector('.js-ecl__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    this._elements.button.addEventListener('click', this._handleButtonClick.bind(this));
  }

  // устанавливает величину нижнего поля корневого html-элемент списка
  private _setRootPadding(): void {
    const root = this._root;

    if (root.classList.contains('ecl--absolute')) {
      root.style.setProperty('--padding', helpers.getHeight(this._root));
    }
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

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleButtonClick(): void {
    this._switchEcl();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-ecl').forEach((el) => new Ecl(el as HTMLElement));
}

render();
