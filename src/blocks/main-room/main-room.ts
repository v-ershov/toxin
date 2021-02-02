import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';

interface IMainRoomElements {
  images: NodeListOf<HTMLAnchorElement>;
}

class MainRoom {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент блока

  private _elements: IMainRoomElements; // элементы блока

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._initFancybox();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // находит и возвращает элементы блока
  private _findElements(): IMainRoomElements {
    return {
      images: this._root.querySelectorAll('[data-fancybox="gallery"]') as NodeListOf<HTMLAnchorElement>,
    };
  }

  // инициализирует экземпляр плагина fancybox
  private _initFancybox(): void {
    $(this._elements.images).fancybox({
      animationEffect: 'fade',
      loop: true,
      transitionEffect: 'slide',
    });
  }
}

export default function render(): void {
  document.querySelectorAll('.main-room').forEach((el) => new MainRoom(el as HTMLElement));
}

render();
