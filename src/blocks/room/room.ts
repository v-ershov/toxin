import 'slick-carousel/slick/slick.min';
import 'slick-carousel/slick/slick.css';

interface IRoomElements {
  slider: HTMLDivElement;
  link: HTMLAnchorElement;
}

class Room {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент карточки

  private _elements: IRoomElements; // элементы карточки

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._bindEventListeners();
    this._initSlickCarousel();
    this._disableTabing();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы карточки
  private _findElements(): IRoomElements {
    return {
      slider: this._root.querySelector('.room__slider') as HTMLDivElement,
      link: this._root.querySelector('.room__link') as HTMLAnchorElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    this._root.addEventListener('keydown', this._handleRootKeydown.bind(this));
  }

  // инициализирует экземпляр плагина slick-carousel
  private _initSlickCarousel(): void {
    $(this._elements.slider).slick({
      accessibility: false,
      dots: true,
    });
  }

  // устанавливает атрибут tabindex со значением '-1' для внутренних элементов карточки
  private _disableTabing(): void {
    this._elements.slider.querySelectorAll('.slick-arrow, .slick-dots button').forEach((el) => {
      el.setAttribute('tabindex', '-1');
    });
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleRootKeydown(event: KeyboardEvent): void {
    const {
      slider,
      link,
    } = this._elements;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        link.click();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        $(slider).slick('slickPrev');
        break;
      case 'ArrowRight':
        event.preventDefault();
        $(slider).slick('slickNext');
        break;
      default:
        break;
    }
  }
}

export default function render(): void {
  document.querySelectorAll('.room').forEach((el) => new Room(el as HTMLElement));
}

render();
