import 'air-datepicker/dist/js/datepicker.min';
import 'air-datepicker/dist/css/datepicker.min.css';

import helpers from '~/ts/helpers';

interface IElements {
  input: HTMLInputElement;
  fields: NodeListOf<HTMLInputElement>;
  fake?: HTMLInputElement;
  container: HTMLDivElement;
  datepicker: HTMLDivElement;
  buttonApply: HTMLButtonElement;
  buttonReset: HTMLButtonElement;
}

class Calendar {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLDivElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  private _target: HTMLInputElement; // инпут, к которому будет привязан плагин air-datepicker

  private _inst: AirDatepickerInstance; // экземпляр плагина air-datepicker

  private _formattedDate = ''; // значение formattedDate события onSelect плагина air-datepicker

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLDivElement) {
    this._root = root;
    this._elements = this._findElements();
    this._target = this._initTarget();
    this._inst = this._initAirDatepicker();

    this._initDates();
    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      input: r.querySelector('.js-calendar__input') as HTMLInputElement,
      fields: r.querySelectorAll('.js-field__input'),
      fake: r.querySelector('.js-calendar__fake') as HTMLInputElement,
      container: r.querySelector('.js-calendar__container') as HTMLDivElement,
      datepicker: r.querySelector('.js-calendar__datepicker') as HTMLDivElement,
      buttonApply: r.querySelector('.js-button[name="apply"]') as HTMLButtonElement,
      buttonReset: r.querySelector('.js-button[name="reset"]') as HTMLButtonElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const {
      container,
      buttonApply,
      buttonReset,
    } = this._elements;

    this._root.addEventListener('focusout', this._handleRootFocusout.bind(this));
    this._target.addEventListener('keypress', Calendar._handleTargetKeypress.bind(this));
    container.addEventListener('mousedown', Calendar._handleContainerMousedown.bind(this));
    buttonApply.addEventListener('click', this._handleButtonApplyClick.bind(this));
    buttonReset.addEventListener('click', this._handleButtonResetClick.bind(this));
  }

  // инициализирует и возвращает инпут, к которому будет привязан плагин air-datepicker
  private _initTarget(): HTMLInputElement {
    return this._elements.fields[0] || this._elements.fake;
  }

  // инициализирует и возвращает экземпляр плагина air-datepicker
  private _initAirDatepicker(): AirDatepickerInstance {
    const $target = $(this._target);
    const $datepicker = $(this._elements.datepicker);

    $target.datepicker({
      dateFormat: 'd M',
      inline: true,
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      minDate: new Date(),
      multipleDatesSeparator: ' - ',
      navTitles: {
        days: 'MM yyyy',
      },
      nextHtml: '<i class="material-icons">arrow_forward</i>',
      prevHtml: '<i class="material-icons">arrow_back</i>',
      range: true,

      onSelect: (formattedDate) => {
        this._saveFormattedDate(formattedDate);
        this._setFields();
      },
    });

    $datepicker.append($target.next('.datepicker-inline'));

    return $target.data('datepicker');
  }

  // инициализирует начальный диапазон дат
  private _initDates(): void {
    const inst = this._inst;
    const dates = Calendar._getDates(this._root.dataset.dates || '');

    if (!dates) {
      return;
    }

    const isValidDates = inst.minDate ? dates[0] >= inst.minDate : true;

    if (isValidDates) {
      inst.selectDate(dates);
      this._update();
    }
  }

  // сохраняет значение formattedDate события onSelect плагина air-datepicker
  private _saveFormattedDate(formattedDate: string): void {
    this._formattedDate = formattedDate.toLowerCase();
  }

  // обновляет блок
  private _update(): void {
    this._setInput();
    this._setFields();
  }

  // устанавливает значение скрытого инпута
  private _setInput(): void {
    const { input } = this._elements;
    const { selectedDates } = this._inst;

    if (!selectedDates.length) {
      input.value = '';
      return;
    }

    if (selectedDates.length === 1) {
      return;
    }

    const from = selectedDates[0];
    const to = selectedDates[1];

    from.setHours(12);
    to.setHours(12);

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    input.value = `${fromStr}/${toStr}`;
  }

  // устанавливает значения полей
  private _setFields(): void {
    const {
      input,
      fields,
    } = this._elements;

    if (!fields.length) {
      return;
    }

    const dates = Calendar._getDates(input.value);

    if (!dates) {
      fields.forEach((_field, i) => {
        fields[i].value = '';
      });

      return;
    }

    if (fields[1]) {
      fields[0].value = `${dates[0].toLocaleDateString()}`;
      fields[1].value = `${dates[1].toLocaleDateString()}`;
    } else {
      fields[0].value = this._formattedDate;
    }
  }

  // устанавливает в плагине air-datepicker такой же диапазон дат, как в скрытом инпуте
  private _setAirDatepickerDates(): void {
    const inst = this._inst;
    const dates = Calendar._getDates(this._elements.input.value);

    inst.clear();

    if (dates) {
      inst.selectDate(dates);
    }
  }

  // снимает фокус с интерактивных элементов
  private _blurElements(): void {
    const {
      buttonApply,
      buttonReset,
    } = this._elements;

    this._target.blur();
    buttonApply.blur();
    buttonReset.blur();
  }

  // анимирует контейнер
  private _animateContainer(): void {
    const ccl = this._elements.container.classList;

    if (ccl.contains('calendar__container--animated')) {
      return;
    }

    ccl.add('calendar__container--animated');

    setTimeout(() => {
      ccl.remove('calendar__container--animated');
    }, this._getContainerDuration());
  }

  // возвращает продолжительность анимации контейнера
  private _getContainerDuration(): number {
    return parseFloat(getComputedStyle(this._elements.container).animationDuration) * 1000;
  }

  // возвращает диапазон дат из строки вида 'YYYY-MM-DD/YYYY-MM-DD'
  private static _getDates(text: string): [Date, Date] | null {
    if (text.length !== 21) {
      return null;
    }

    const split = text.split('/');

    if (split.length !== 2) {
      return null;
    }

    const from = new Date(split[0]);
    const to = new Date(split[1]);

    const isValidDates = helpers.isValidDate(from) && helpers.isValidDate(to);

    if (!isValidDates) {
      return null;
    }

    return [from, to];
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleRootFocusout(event: FocusEvent): void {
    if (!this._root.contains(event.relatedTarget as Node)) {
      this._setAirDatepickerDates();
    }
  }

  private static _handleTargetKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  private static _handleContainerMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  private _handleButtonApplyClick(): void {
    const { selectedDates } = this._inst;

    if (selectedDates.length === 1) {
      this._animateContainer();
      return;
    }

    if (!selectedDates.length) {
      this._inst.clear();
    }

    this._update();
    this._blurElements();
  }

  private _handleButtonResetClick(): void {
    this._inst.clear();
    this._update();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-calendar').forEach((el) => new Calendar(el as HTMLDivElement));
}

render();
