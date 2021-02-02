import 'slick-carousel/slick/slick.min';
import 'slick-carousel/slick/slick.css';

interface IRoomElements {
  slider: HTMLDivElement;
}

class Room {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент карточки

  private _elements: IRoomElements; // элементы карточки

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._initSlickCarousel();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // находит и возвращает элементы карточки
  private _findElements(): IRoomElements {
    return {
      slider: this._root.querySelector('.room__slider') as HTMLDivElement,
    };
  }

  // инициализирует экземпляр плагина slick-carousel
  private _initSlickCarousel(): void {
    $(this._elements.slider).slick({
      dots: true,
    });
  }
}

export default function render(): void {
  document.querySelectorAll('.room').forEach((el) => new Room(el as HTMLElement));
}

render();
