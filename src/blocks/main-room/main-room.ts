import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';

class MainRoom {
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

    this.initGallery();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы блока
  private getElements() {
    return {
      $images: $(this.root).find('[data-fancybox="gallery"]'),
    };
  }

  // инициализирует галлерею
  private initGallery() {
    this.elements.$images.fancybox({
      animationEffect: 'fade',
      loop: true,
      transitionEffect: 'slide',
    });
  }
}

document.querySelectorAll('.main-room').forEach((el) => new MainRoom(el as HTMLElement));
