import $ from 'jquery';
import 'slick-carousel/slick/slick.min';
import 'slick-carousel/slick/slick.css';

class Room {
  constructor(node) {
    this._initNodes(node);
    this._initSlider();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      $slider: $(node).find('.room__slider'),
    };
  }

  // инициализирует слайдер
  _initSlider() {
    this.nodes.$slider.slick({
      dots: true,
    });
  }
}

document.querySelectorAll('.room').forEach((node) => new Room(node));
