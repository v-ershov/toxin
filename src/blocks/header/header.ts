import helpers from '~/ts/helpers';

class Header {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент хедера

  private elements; // элементы хедера

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();

    this.addEventListeners();
    this.setNavHeight();
    this.setSublistsHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы хедера
  private getElements() {
    return {
      hamburger: this.root.querySelector('.header__hamburger') as HTMLElement,
      nav: this.root.querySelector('.header__nav') as HTMLElement,
      list: this.root.querySelector('.header__list') as HTMLElement,
      sublists: this.root.querySelectorAll('.header__list--sublist') as NodeListOf<HTMLElement>,
    };
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    window.addEventListener('resize', () => {
      this.setNavHeight();
      this.setSublistsHeight();
    });

    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.header') !== this.root) {
        this.disableHamburger();
      }
    });

    this.elements.hamburger.addEventListener('click', () => {
      this.switchHamburger();
    });
  }

  // устанавливает максимальную высоту навигационного меню
  private setNavHeight() {
    this.elements.nav.style.setProperty('--height', helpers.getHeight(this.elements.list));
  }

  // устанавливает максимальную высоту подсписков навигационного меню
  private setSublistsHeight() {
    this.elements.sublists.forEach((sublist) => {
      sublist.style.setProperty('--height', helpers.getHeight(sublist));
    });
  }

  // выключает гамбургер-меню
  private disableHamburger() {
    this.elements.hamburger.classList.remove('header__hamburger--active');
  }

  // переключает состояние гамбургер-меню
  private switchHamburger() {
    this.elements.hamburger.classList.toggle('header__hamburger--active');
  }
}

document.querySelectorAll('.header').forEach((el) => new Header(el as HTMLElement));
