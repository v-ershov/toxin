class MainLanding {
  constructor(node) {
    this.node = node;
    this.parallaxSpeed = 2;
    this._findNodes();
    this._addEventListeners();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.slideshow = this.node.querySelector('.main-landing__slideshow');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    window.addEventListener('scroll', () => {
      this._createParallax();
    });
  }

  // создаёт параллакс-эффект для слайд-шоу
  _createParallax() {
    this.slideshow.style.transform = `translateY(${window.pageYOffset / this.parallaxSpeed}px)`;
  }
}

document.querySelectorAll('.main-landing').forEach((node) => new MainLanding(node));
