import 'air-datepicker/dist/js/datepicker.min';
import 'air-datepicker/dist/css/datepicker.min.css';

interface ICalendarElements {
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

  private _root: HTMLElement; // корневой html-элемент календаря

  private _elements: ICalendarElements; // элементы календаря

  private _duration: number; // продолжительность анимации контейнера календаря

  private _currentRange: string; // активный диапазон дат календаря в виде отформатированного текста

  private _target: HTMLInputElement; // инпут, к которому будет привязан плагин air-datepicker

  private _inst: AirDatepickerInstance; // экземпляр плагина air-datepicker

  private _formattedDate: string; // значение formattedDate события onSelect плагина air-datepicker

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();
    this._duration = this._getDuration();
    this._currentRange = '';

    this._target = this._getTarget();
    this._inst = this._initDatepicker();
    this._formattedDate = '';

    this._bindEventListeners();
    this._initDates();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы календаря
  private _findElements(): ICalendarElements {
    return {
      input: this._root.querySelector('.calendar__input') as HTMLInputElement,
      fields: this._root.querySelectorAll('.field__input') as NodeListOf<HTMLInputElement>,
      fake: this._root.querySelector('.calendar__fake') as HTMLInputElement,
      container: this._root.querySelector('.calendar__container') as HTMLDivElement,
      datepicker: this._root.querySelector('.calendar__datepicker') as HTMLDivElement,
      buttonApply: this._root.querySelector('.button[name="apply"]') as HTMLButtonElement,
      buttonReset: this._root.querySelector('.button[name="reset"]') as HTMLButtonElement,
    };
  }

  // возвращает продолжительность анимации контейнера календаря
  private _getDuration(): number {
    return parseFloat(getComputedStyle(this._elements.container).animationDuration) * 1000;
  }

  // возвращает инпут, к которому будет привязан плагин air-datepicker
  private _getTarget(): HTMLInputElement {
    const {
      fields,
      fake,
    } = this._elements;

    return fields[0] || fake;
  }

  // инициализирует и возвращает экземпляр плагина air-datepicker
  private _initDatepicker(): AirDatepickerInstance {
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

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const {
      container,
      buttonApply,
      buttonReset,
    } = this._elements;

    this._root.addEventListener('focusout', this._handleRootFocusout.bind(this));
    container.addEventListener('mousedown', (e) => e.preventDefault());
    buttonApply.addEventListener('click', this._handleButtonApplyClick.bind(this));
    buttonReset.addEventListener('click', this._handleButtonResetClick.bind(this));
  }

  // инициализирует начальный диапазон дат календаря
  private _initDates(): void {
    const { dates } = this._root.dataset;

    if (!dates || dates.length !== 21) {
      return;
    }

    const inst = this._inst;
    const range = Calendar._getRange(dates);

    if (inst.minDate && inst.minDate > range[0]) {
      return;
    }

    inst.selectDate(range);
    this._updateCalendar();
  }

  // сохраняет значение formattedDate события onSelect плагина air-datepicker
  private _saveFormattedDate(formattedDate: string): void {
    this._formattedDate = formattedDate.toLowerCase();
  }

  // обновляет календарь
  private _updateCalendar(): void {
    this._setInput();
    this._setCurrentRange();
    this._setFields();
  }

  // устанавливает значение скрытого инпута календаря
  private _setInput(): void {
    const { input } = this._elements;
    const { selectedDates } = this._inst;

    if (selectedDates.length === 1) {
      return;
    }

    if (!selectedDates.length) {
      input.value = '';
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

  // устанавливает активный диапазон дат календаря в виде отформатированного текста
  private _setCurrentRange(): void {
    const {
      input,
      fields,
    } = this._elements;

    if (!fields.length) {
      return;
    }

    if (!input.value) {
      this._currentRange = '';
      return;
    }

    if (fields[1]) {
      const range = Calendar._getRange(input.value);

      this._currentRange = `${range[0].toLocaleDateString()}/${range[1].toLocaleDateString()}`;
    } else {
      this._currentRange = this._formattedDate;
    }
  }

  // устанавливает значения полей календаря
  private _setFields(): void {
    const { fields } = this._elements;

    if (!fields.length) {
      return;
    }

    const range = this._currentRange;

    if (!range) {
      fields.forEach((_field, i) => {
        fields[i].value = '';
      });

      return;
    }

    if (fields[1]) {
      const split = range.split('/');

      fields.forEach((_field, i) => {
        fields[i].value = split[i];
      });
    } else {
      fields[0].value = range;
    }
  }

  // устанавливает в плагине air-datepicker такой же диапазон дат, как и в скрытом инпуте календаря
  private _setDatepickerRange(): void {
    const { value } = this._elements.input;

    this._inst.clear();

    if (!value) {
      return;
    }

    this._inst.selectDate(Calendar._getRange(value));
  }

  // снимает фокус с интерактивных элементов календаря
  private _blurCalendar(): void {
    if (!this._elements.fields.length) {
      return;
    }

    this._target.blur();
    this._elements.buttonApply.blur();
    this._elements.buttonReset.blur();
  }

  // анимирует контейнер календаря
  private _animateContainer(): void {
    const ccl = this._elements.container.classList;

    if (ccl.contains('calendar__container--animated')) {
      return;
    }

    ccl.add('calendar__container--animated');

    setTimeout(() => {
      ccl.remove('calendar__container--animated');
    }, this._duration);
  }

  // возвращает диапазон дат из строки вида 'YYYY-MM-DD/YYYY-MM-DD'
  private static _getRange(range: string): [Date, Date] {
    const split = range.split('/');
    const from = new Date(split[0]);
    const to = new Date(split[1]);

    return [from, to];
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleRootFocusout(event: FocusEvent): void {
    if (this._root.contains(event.relatedTarget as HTMLElement)) {
      return;
    }

    this._setDatepickerRange();
  }

  private _handleButtonApplyClick(): void {
    const { length } = this._inst.selectedDates;

    if (length === 1) {
      this._animateContainer();
      return;
    }

    if (!length) {
      this._inst.clear();
    }

    this._updateCalendar();
    this._blurCalendar();
  }

  private _handleButtonResetClick(): void {
    this._inst.clear();
    this._updateCalendar();
  }
}

export default function render(): void {
  document.querySelectorAll('.calendar').forEach((el) => new Calendar(el as HTMLElement));
}

render();
