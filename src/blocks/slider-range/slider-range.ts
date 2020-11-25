import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui-touch-punch/jquery.ui.touch-punch.min';

interface ISliderRangeElements {
  $label: JQuery<HTMLElement>;
  $input: JQuery<HTMLElement>;
  $slider: JQuery<HTMLElement>;
}

class SliderRange {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент слайдера

  private _elements: ISliderRangeElements; // элементы слайдера

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._getElements();

    this._initSlider();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы слайдера
  private _getElements(): ISliderRangeElements {
    return {
      $label: $(this._root).find('.label__secondary'),
      $input: $(this._root).find('.slider-range__input'),
      $slider: $(this._root).find('.slider-range__slider'),
    };
  }

  // инициализирует слайдер
  private _initSlider(): void {
    const { $label, $input, $slider } = this._elements;

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
