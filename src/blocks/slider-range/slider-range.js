import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/slider.css';

class SliderRange {
  constructor($node) {
    this.$node = $node;
    this._createSlider();
  }

  // создаёт слайдер
  _createSlider() {
    const label = this.$node.find('.label__secondary');
    const input = this.$node.find('.slider-range__input');
    const slider = this.$node.find('.slider-range__slider');
    const unit = slider.data('unit');

    slider.slider({
      animate: 'fast',
      classes: {
        'ui-slider': '',
        'ui-slider-handle': '',
        'ui-slider-range': '',
      },
      max: slider.data('max'),
      min: slider.data('min'),
      range: true,
      step: slider.data('step'),
      values: [slider.data('start'), slider.data('end')],

      slide(_e, ui) {
        const value = `${ui.values[0].toLocaleString('ru')}${unit} - ${ui.values[1].toLocaleString('ru')}${unit}`;
        label.text(value);
        input.val(value);
      },
    });
  }
}

$('.slider-range').each((_i, node) => new SliderRange($(node)));
