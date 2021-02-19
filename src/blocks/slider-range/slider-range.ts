import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui-touch-punch/jquery.ui.touch-punch.min';

interface ISliderRangeElements {
  label?: HTMLLabelElement;
  input: HTMLInputElement;
  slider: HTMLDivElement;
}

class SliderRange {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент слайдера

  private _elements: ISliderRangeElements; // элементы слайдера

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._initJqueryUiSlider();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы слайдера
  private _findElements(): ISliderRangeElements {
    return {
      label: this._root.querySelector('.label__secondary') as HTMLLabelElement,
      input: this._root.querySelector('.slider-range__input') as HTMLInputElement,
      slider: this._root.querySelector('.slider-range__slider') as HTMLDivElement,
    };
  }

  // инициализирует экземпляр плагина jquery-ui-slider
  private _initJqueryUiSlider(): void {
    const {
      label,
      input,
      slider,
    } = this._elements;

    const data = slider.dataset;

    $(slider).slider({
      animate: 'fast',
      classes: {
        'ui-slider': '',
        'ui-slider-handle': '',
        'ui-slider-range': '',
      },
      max: +(data.max as string),
      min: +(data.min as string),
      range: true,
      step: +(data.step as string),
      values: [+(data.start as string), +(data.end as string)],

      slide(_e, ui) {
        const values = ui.values as number[];
        const unit = data.unit as string;

        const start = `${values[0].toLocaleString('ru-RU')}${unit}`;
        const end = `${values[1].toLocaleString('ru-RU')}${unit}`;
        const value = `${start} - ${end}`;

        input.value = value;

        if (label) {
          label.textContent = value;
        }
      },
    });
  }
}

export default function render(): void {
  document.querySelectorAll('.slider-range').forEach((el) => new SliderRange(el as HTMLElement));
}

render();
