import helpers from '~/ts/helpers';

interface IHeaderElements {
  hamburger: HTMLButtonElement;
  nav: HTMLElement;
  list: HTMLUListElement;
  sublists: NodeListOf<HTMLUListElement>;
}

class Header {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент хедера

  private _elements: IHeaderElements; // элементы хедера

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._addEventListeners();
    this._setNavHeight();
    this._setSublistsHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // находит и возвращает элементы хедера
  private _findElements(): IHeaderElements {
    return {
      hamburger: this._root.querySelector('.header__hamburger') as HTMLButtonElement,
      nav: this._root.querySelector('.header__nav') as HTMLElement,
      list: this._root.querySelector('.header__list') as HTMLUListElement,
      sublists: this._root.querySelectorAll('.header__list--sublist') as NodeListOf<HTMLUListElement>,
    };
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    window.addEventListener('resize', () => {
      this._setNavHeight();
      this._setSublistsHeight();
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.closest('.header') === this._root) {
        return;
      }

      this._hideHamburgerMenu();
    });

    this._elements.hamburger.addEventListener('click', () => {
      this._switchHamburgerMenu();
    });
  }

  // устанавливает максимальную высоту навигационного меню
  private _setNavHeight(): void {
    const {
      nav,
      list,
    } = this._elements;

    nav.style.setProperty('--height', helpers.getHeight(list));
  }

  // устанавливает максимальную высоту подсписков навигационного меню
  private _setSublistsHeight(): void {
    this._elements.sublists.forEach((sublist) => {
      sublist.style.setProperty('--height', helpers.getHeight(sublist));
    });
  }

  // переключает состояние гамбургер-меню
  private _switchHamburgerMenu(): void {
    this._elements.hamburger.classList.toggle('header__hamburger--active');
  }

  // скрывает гамбургер-меню
  private _hideHamburgerMenu(): void {
    this._elements.hamburger.classList.remove('header__hamburger--active');
  }
}

export default function render(): void {
  document.querySelectorAll('.header').forEach((el) => new Header(el as HTMLElement));
}

render();
