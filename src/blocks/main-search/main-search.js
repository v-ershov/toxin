import helpers from '~/js/helpers';

class MainSearch {
  constructor(node) {
    this._initNodes(node);
    this._addEventListeners();
    this._observe();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      button: node.querySelector('.main-search__button'),
    };
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.nodes.button.addEventListener('click', () => {
      this._switchSidebar();
    });
  }

  // создаёт Intersection Observer для последующего скрытия / отображения кнопки «Фильтры»
  _observe() {
    const observer = new IntersectionObserver((entries) => {
      const bcl = this.nodes.button.classList;

      if (entries[0].isIntersecting) {
        bcl.remove('main-search__button--hidden');
      } else {
        bcl.add('main-search__button--hidden');
      }
    }, {
      rootMargin: '-100% 0px 0px',
    });

    observer.observe(this.nodes.root);
  }

  // переключает состояние сайдбара
  _switchSidebar() {
    const rcl = this.nodes.root.classList;
    const bcl = this.nodes.button.classList;

    if (!bcl.contains('main-search__button--hidden')) {
      rcl.toggle('main-search--filter');
      bcl.toggle('main-search__button--active');

      document.body.style = bcl.contains('main-search__button--active')
        ? `overflow-y: hidden; margin-right: ${helpers.getScrollbarWidth()}px;`
        : null;
    }
  }
}

document.querySelectorAll('.main-search').forEach((node) => new MainSearch(node));
