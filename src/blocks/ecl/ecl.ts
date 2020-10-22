import helpers from '~/ts/helpers';

class Ecl {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент списка чекбоксов

  private elements; // элементы списка чекбоксов

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();

    this.addEventListeners();
    this.setHeight();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы списка чекбоксов
  private getElements() {
    return {
      button: this.root.querySelector('.ecl__button') as HTMLElement,
      list: this.root.querySelector('.ecl__list') as HTMLElement,
    };
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    this.elements.button.addEventListener('click', () => {
      this.switchEcl();
    });
  }

  // устанавливает максимальную высоту списка чекбоксов
  private setHeight() {
    this.elements.list.style.setProperty('--height', helpers.getHeight(this.elements.list));
  }

  // переключает состояние списка чекбоксов
  private switchEcl() {
    this.root.classList.toggle('ecl--active');
  }
}

document.querySelectorAll('.ecl').forEach((el) => new Ecl(el as HTMLElement));
