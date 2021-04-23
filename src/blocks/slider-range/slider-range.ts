import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui-touch-punch/jquery.ui.touch-punch.min';

interface IElements {
  label: HTMLSpanElement;
  input: HTMLInputElement;
  slider: HTMLDivElement;
}

class SliderRange {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLDivElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLDivElement) {
    this._root = root;
    this._elements = this._findElements();

    this._initJqueryUiSlider();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      label: r.querySelector('.js-label__secondary') as HTMLSpanElement,
      input: r.querySelector('.js-slider-range__input') as HTMLInputElement,
      slider: r.querySelector('.js-slider-range__slider') as HTMLDivElement,
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

      slide(_event, ui) {
        const values = ui.values as number[];
        const unit = data.unit as string;

        const start = `${values[0].toLocaleString('ru-RU')}${unit}`;
        const end = `${values[1].toLocaleString('ru-RU')}${unit}`;
        const value = `${start} - ${end}`;

        label.textContent = value;
        input.value = value;
      },
    });
  }
}

function render(): void {
  document.querySelectorAll('.js-slider-range').forEach((el) => new SliderRange(el as HTMLDivElement));
}

render();
