import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui-touch-punch/jquery.ui.touch-punch.min';

class SliderRange {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент слайдера

  private elements; // элементы слайдера

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();

    this.initSlider();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы слайдера
  private getElements() {
    return {
      $label: $(this.root).find('.label__secondary'),
      $input: $(this.root).find('.slider-range__input'),
      $slider: $(this.root).find('.slider-range__slider'),
    };
  }

  // инициализирует слайдер
  private initSlider() {
    const { $label, $input, $slider } = this.elements;

    $slider.slider({
      animate: 'fast',
      classes: {
        'ui-slider': '',
        'ui-slider-handle': '',
        'ui-slider-range': '',
      },
      max: +$slider.data('max'),
      min: +$slider.data('min'),
      range: true,
      step: +$slider.data('step'),
      values: [+$slider.data('start'), +$slider.data('end')],

      slide(_e, ui) {
        const values = ui.values as number[];
        const unit = $slider.data('unit') as string;

        const start = `${values[0].toLocaleString('ru')}${unit}`;
        const end = `${values[1].toLocaleString('ru')}${unit}`;
        const value = `${start} - ${end}`;

        $label.text(value);
        $input.val(value);
      },
    });
  }
}

document.querySelectorAll('.slider-range').forEach((el) => new SliderRange(el as HTMLElement));
