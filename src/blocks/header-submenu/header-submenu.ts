import helpers from '~/ts/helpers';

interface IElements {
  linkMain: HTMLAnchorElement;
  list: HTMLUListElement;
}

class HeaderSubmenu {
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
      linkMain: r.querySelector('.js-link--submenu') as HTMLAnchorElement,
      list: r.querySelector('.js-header-submenu__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const {
      linkMain,
      list,
    } = this._elements;

    window.addEventListener('resize', this._handleWindowResize.bind(this));
    linkMain.addEventListener('click', HeaderSubmenu._handleLinkMainClick.bind(this));
    list.addEventListener('mousedown', HeaderSubmenu._handleListMousedown.bind(this));
  }

  // устанавливает высоту списка
  private _setListHeight(): void {
    this._elements.list.style.setProperty('--height', helpers.getHeight(this._elements.list));
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowResize(): void {
    this._setListHeight();
  }

  private static _handleLinkMainClick(event: MouseEvent): void {
    if (helpers.isViewportWider(858)) {
      event.preventDefault();
    }
  }

  private static _handleListMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-header-submenu').forEach((el) => new HeaderSubmenu(el as HTMLDivElement));
}

render();
