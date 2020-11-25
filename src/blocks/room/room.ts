import 'slick-carousel/slick/slick.min';
import 'slick-carousel/slick/slick.css';

interface IRoomElements {
  $slider: JQuery<HTMLElement>;
}

class Room {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент слайдера

  private _elements: IRoomElements; // элементы слайдера

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._getElements();

    this._initSlider();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы слайдера
  private _getElements(): IRoomElements {
    return {
      $slider: $(this._root).find('.room__slider'),
    };
  }

  // инициализирует слайдер
  private _initSlider(): void {
    this._elements.$slider.slick({
      dots: true,
    });
  }
}

document.querySelectorAll('.room').forEach((el) => new Room(el as HTMLElement));
