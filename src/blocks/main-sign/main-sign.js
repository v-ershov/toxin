class MainSign {
  constructor(node) {
    this._initNodes(node);
    this._addEventListeners();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      background: node.querySelector('.main-sign__background'),
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
    this.nodes.background.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }
}

document.querySelectorAll('.main-sign').forEach((node) => new MainSign(node));
