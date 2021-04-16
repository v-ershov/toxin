import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';

interface IMainRoomElements {
  links: NodeListOf<HTMLAnchorElement>;
}

class MainRoom {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IMainRoomElements; // элементы блока

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._initFancybox();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IMainRoomElements {
    return {
      links: this._root.querySelectorAll('[data-fancybox="gallery"]'),
    };
  }

  // инициализирует экземпляр плагина fancybox
  private _initFancybox(): void {
    $(this._elements.links).fancybox({
      animationEffect: 'fade',
      loop: true,
      transitionEffect: 'slide',
    });
  }
}

export default function render(): void {
  document.querySelectorAll('.js-main-room').forEach((el) => new MainRoom(el as HTMLElement));
}

render();
