import 'slick-carousel/slick/slick.min';
import 'slick-carousel/slick/slick.css';

class Room {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент слайдера

  private elements; // элементы слайдера

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();

    this.initSlider();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы слайдера
  private getElements() {
    return {
      $slider: $(this.root).find('.room__slider'),
    };
  }

  // инициализирует слайдер
  private initSlider() {
    this.elements.$slider.slick({
      dots: true,
    });
  }
}

document.querySelectorAll('.room').forEach((el) => new Room(el as HTMLElement));
