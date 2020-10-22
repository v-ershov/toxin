class MainLanding {
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
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы блока
  private getElements() {
    return {
      slideshow: this.root.querySelector('.main-landing__slideshow') as HTMLElement,
    };
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    window.addEventListener('scroll', () => {
      this.createParallax();
    });
  }

  // создаёт параллакс-эффект для слайдшоу
  private createParallax() {
    this.elements.slideshow.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }
}

document.querySelectorAll('.main-landing').forEach((el) => new MainLanding(el as HTMLElement));
