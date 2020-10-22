class MainSign {
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
      background: this.root.querySelector('.main-sign__background') as HTMLElement,
    };
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    window.addEventListener('scroll', () => {
      this.createParallax();
    });
  }

  // создаёт параллакс-эффект для фонового изображения
  private createParallax() {
    this.elements.background.style.setProperty('--translateY', `${window.pageYOffset / 2}px`);
  }
}

document.querySelectorAll('.main-sign').forEach((el) => new MainSign(el as HTMLElement));
