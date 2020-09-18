class MainLanding {
  constructor(node) {
    this._initNodes(node);
    this._addEventListeners();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      slideshow: node.querySelector('.main-landing__slideshow'),
    };
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    window.addEventListener('scroll', () => {
      this._createParallax();
    });
  }

  // создаёт параллакс-эффект для фонового изображения
  _createParallax() {
    this.nodes.slideshow.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }
}

document.querySelectorAll('.main-landing').forEach((node) => new MainLanding(node));
