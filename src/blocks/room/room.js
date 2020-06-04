import $ from 'jquery';
import 'slick-carousel/slick/slick.min';
import 'slick-carousel/slick/slick.css';

class Room {
  constructor($node) {
    this.$node = $node;
    this._findNodes();
    this._createSlider();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.$slider = this.$node.find('.room__slider');
  }

  // создаёт слайдер
  _createSlider() {
    this.$slider.slick({
      arrows: this.$slider.data('arrows'),
      dots: true,
    });
  }
}

$('.room').each((_i, node) => new Room($(node)));
