import helpers from '~/ts/helpers';

interface IHeaderSubmenuElements {
  linkMain: HTMLAnchorElement;
  list: HTMLUListElement;
}

class HeaderSubmenu {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент подменю

  private _elements: IHeaderSubmenuElements; // элементы подменю

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._addEventListeners();
    this._setListHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // находит и возвращает элементы подменю
  private _findElements(): IHeaderSubmenuElements {
    return {
      linkMain: this._root.querySelector('.header-submenu__link--main') as HTMLAnchorElement,
      list: this._root.querySelector('.header-submenu__list') as HTMLUListElement,
    };
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    window.addEventListener('resize', () => {
      this._setListHeight();
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.closest('.header-submenu') === this._root) {
        return;
      }

      this._hideList();
    });

    this._elements.linkMain.addEventListener('click', (e) => {
      if (!HeaderSubmenu._isLargeScreen()) {
        return;
      }

      e.preventDefault();
      this._switchList();
    });
  }

  // устанавливает максимальную высоту списка
  private _setListHeight(): void {
    const { list } = this._elements;

    list.style.setProperty('--height', helpers.getHeight(list));
  }

  // переключает состояние списка
  private _switchList(): void {
    this._elements.linkMain.classList.toggle('header-submenu__link--active');
  }

  // скрывает список
  private _hideList(): void {
    this._elements.linkMain.classList.remove('header-submenu__link--active');
  }

  // возвращает true, если ширина viewport'а больше 858px
  private static _isLargeScreen(): boolean {
    return window.innerWidth > 858;
  }
}

export default function render(): void {
  document.querySelectorAll('.header-submenu').forEach((el) => new HeaderSubmenu(el as HTMLElement));
}

render();
