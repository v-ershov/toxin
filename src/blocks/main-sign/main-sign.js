class MainSign {
  constructor(node) {
    this.node = node;
    this.parallaxSpeed = 2;
    this._findNodes();
    this._addEventListeners();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.background = this.node.querySelector('.main-sign__background');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    window.addEventListener('scroll', () => {
      this._createParallax();
    });
  }

  // создаёт параллакс-эффект для фонового изображения
  _createParallax() {
    this.background.style.transform = `translateY(${window.pageYOffset / this.parallaxSpeed}px)`;
  }
}

document.querySelectorAll('.main-sign').forEach((node) => new MainSign(node));
