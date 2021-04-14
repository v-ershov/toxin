import helpers from '~/ts/helpers';

interface IHeaderSubmenuElements {
  linkMain: HTMLAnchorElement;
  list: HTMLUListElement;
}

class HeaderSubmenu {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент подменю

  private _elements: IHeaderSubmenuElements; // элементы подменю

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._bindEventListeners();
    this._setListHeight();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы подменю
  private _findElements(): IHeaderSubmenuElements {
    return {
      linkMain: this._root.querySelector('.js-link--submenu') as HTMLAnchorElement,
      list: this._root.querySelector('.js-header-submenu__list') as HTMLUListElement,
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
    list.addEventListener('mousedown', (e) => e.preventDefault());
  }

  // устанавливает максимальную высоту списка
  private _setListHeight(): void {
    const { list } = this._elements;

    list.style.setProperty('--height', helpers.getHeight(list));
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowResize(): void {
    this._setListHeight();
  }

  private static _handleLinkMainClick(event: MouseEvent): void {
    if (!helpers.isViewportWider(858)) {
      return;
    }

    event.preventDefault();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-header-submenu').forEach((el) => new HeaderSubmenu(el as HTMLElement));
}

render();
