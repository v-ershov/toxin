import $ from 'jquery';
import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';

class MainRoom {
  constructor($node) {
    this.$node = $node;
    this._findNodes();
    this._createGallery();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.$images = this.$node.find('[data-fancybox="gallery"]');
  }

  // создаёт галлерею
  _createGallery() {
    this.$images.fancybox({
      loop: true,
      animationEffect: 'fade',
      transitionEffect: 'slide',
    });
  }
}

$('.main-room').each((_i, node) => new MainRoom($(node)));
