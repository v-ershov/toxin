import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';

interface IMainRoomElements {
  $images: JQuery<HTMLElement>;
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
    this._elements = this._getElements();

    this._initGallery();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы блока
  private _getElements(): IMainRoomElements {
    return {
      $images: $(this._root).find('[data-fancybox="gallery"]'),
    };
  }

  // инициализирует галлерею
  private _initGallery(): void {
    this._elements.$images.fancybox({
      animationEffect: 'fade',
      loop: true,
      transitionEffect: 'slide',
    });
  }
}

document.querySelectorAll('.main-room').forEach((el) => new MainRoom(el as HTMLElement));
