import helpers from '~/ts/helpers';

class MainSearch {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент блока

  private elements; // элементы блока

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();

    this.addEventListeners();
    this.observe();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы блока
  private getElements() {
    return {
      button: this.root.querySelector('.main-search__button') as HTMLElement,
    };
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    this.elements.button.addEventListener('click', () => {
      this.switchSidebar();
    });
  }

  // создаёт Intersection Observer для последующего скрытия / отображения кнопки «Фильтры»
  private observe() {
    const observer = new IntersectionObserver((entries) => {
      const bcl = this.elements.button.classList;

      if (entries[0].isIntersecting) {
        bcl.remove('main-search__button--hidden');
      } else {
        bcl.add('main-search__button--hidden');
      }
    }, {
      rootMargin: '-100% 0px 0px',
    });

    observer.observe(this.root);
  }

  // переключает состояние сайдбара
  private switchSidebar() {
    const rcl = this.root.classList;
    const bcl = this.elements.button.classList;

    if (!bcl.contains('main-search__button--hidden')) {
      rcl.toggle('main-search--filter');
      bcl.toggle('main-search__button--active');

      const body = document.body.style;

      if (bcl.contains('main-search__button--active')) {
        body.setProperty('margin-right', `${helpers.getScrollbarWidth()}px`);
        body.setProperty('overflow-y', 'hidden');
      } else {
        body.removeProperty('margin-right');
        body.removeProperty('overflow-y');
      }
    }
  }
}

document.querySelectorAll('.main-search').forEach((el) => new MainSearch(el as HTMLElement));
