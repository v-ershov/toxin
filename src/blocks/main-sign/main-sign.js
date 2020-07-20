class MainSign {
  constructor(node) {
    this.node = node;
    this.parallaxSpeed = 2.5;
    this._findNodes();
    this._addEventListeners();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.background = this.node.querySelector('.sign__background');
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

document.querySelectorAll('.sign').forEach((node) => new MainSign(node));
