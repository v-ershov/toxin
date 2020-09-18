import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui-touch-punch/jquery.ui.touch-punch.min';

class SliderRange {
  constructor(node) {
    this._initNodes(node);
    this._initSlider();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      $label: $(node).find('.label__secondary'),
      $input: $(node).find('.slider-range__input'),
      $slider: $(node).find('.slider-range__slider'),
    };
  }

  // инициализирует слайдер
  _initSlider() {
    const { $label, $input, $slider } = this.nodes;

    $slider.slider({
      animate: 'fast',
      classes: {
        'ui-slider': '',
        'ui-slider-handle': '',
        'ui-slider-range': '',
      },
      max: $slider.data('max'),
      min: $slider.data('min'),
      range: true,
      step: $slider.data('step'),
      values: [$slider.data('start'), $slider.data('end')],

      slide(_e, ui) {
        const unit = $slider.data('unit');
        const start = `${ui.values[0].toLocaleString('ru')}${unit}`;
        const end = `${ui.values[1].toLocaleString('ru')}${unit}`;
        const value = `${start} - ${end}`;

        $label.text(value);
        $input.val(value);
      },
    });
  }
}

document.querySelectorAll('.slider-range').forEach((node) => new SliderRange(node));
