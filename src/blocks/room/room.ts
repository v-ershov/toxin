import 'slick-carousel/slick/slick.min';
import 'slick-carousel/slick/slick.css';

interface IElements {
  slider: HTMLDivElement;
  link: HTMLAnchorElement;
}

class Room {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLDivElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLDivElement) {
    this._root = root;
    this._elements = this._findElements();

    this._initSlickCarousel();
    this._disableTabing();
    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      slider: r.querySelector('.js-room__slider') as HTMLDivElement,
      link: r.querySelector('.js-room__link') as HTMLAnchorElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const { link } = this._elements;

    link.addEventListener('keydown', this._handleLinkKeydown.bind(this));
  }

  // инициализирует экземпляр плагина slick-carousel
  private _initSlickCarousel(): void {
    $(this._elements.slider).slick({
      accessibility: false,
      dots: true,
    });
  }

  // отключает табулирование для интерактивных элементов плагина slick-carousel
  private _disableTabing(): void {
    this._elements.slider.querySelectorAll('.slick-arrow, .slick-dots button').forEach((el) => {
      el.setAttribute('tabindex', '-1');
    });
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleLinkKeydown(event: KeyboardEvent): void {
    const $slider = $(this._elements.slider);

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        $slider.slick('slickNext');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        $slider.slick('slickPrev');
        break;
      default:
        break;
    }
  }
}

export default function render(): void {
  document.querySelectorAll('.js-room').forEach((el) => new Room(el as HTMLDivElement));
}

render();
