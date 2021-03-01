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
      linkMain: this._root.querySelector('.link--submenu') as HTMLAnchorElement,
      list: this._root.querySelector('.header-submenu__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    window.addEventListener('resize', this._handleWindowResize.bind(this));
    document.addEventListener('click', this._handleDocumentClick.bind(this));
    this._elements.linkMain.addEventListener('click', this._handleLinkMainClick.bind(this));
  }

  // устанавливает максимальную высоту списка
  private _setListHeight(): void {
    const { list } = this._elements;

    list.style.setProperty('--height', helpers.getHeight(list));
  }

  // переключает состояние списка
  private _switchList(): void {
    this._root.classList.toggle('header-submenu--active');
  }

  // скрывает список
  private _hideList(): void {
    this._root.classList.remove('header-submenu--active');
  }

  // возвращает true, если ширина viewport'а больше 858px
  private static _isLargeScreen(): boolean {
    return window.innerWidth > 858;
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowResize(): void {
    this._setListHeight();
  }

  private _handleDocumentClick(event: MouseEvent): void {
    if (this._root.contains(event.target as HTMLElement)) {
      return;
    }

    this._hideList();
  }

  private _handleLinkMainClick(event: MouseEvent): void {
    if (!HeaderSubmenu._isLargeScreen()) {
      return;
    }

    event.preventDefault();
    this._switchList();
  }
}

export default function render(): void {
  document.querySelectorAll('.header-submenu').forEach((el) => new HeaderSubmenu(el as HTMLElement));
}

render();
