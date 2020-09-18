import $ from 'jquery';
import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';

class MainRoom {
  constructor(node) {
    this._initNodes(node);
    this._initGallery();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      $images: $(node).find('[data-fancybox="gallery"]'),
    };
  }

  // инициализирует галлерею
  _initGallery() {
    this.nodes.$images.fancybox({
      animationEffect: 'fade',
      loop: true,
      transitionEffect: 'slide',
    });
  }
}

document.querySelectorAll('.main-room').forEach((node) => new MainRoom(node));
