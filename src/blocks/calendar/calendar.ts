import 'air-datepicker/dist/js/datepicker.min';
import 'air-datepicker/dist/css/datepicker.min.css';

interface ICalendarElements {
  input: HTMLInputElement;
  fields: NodeListOf<HTMLInputElement>;
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

  private _duration: number; // продолжительность анимации контейнера

  private _inst: AirDatepickerInstance; // экземпляр плагина air-datepicker

  private _formattedDate: string; // выбранные в плагине air-datepicker даты

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();
    this._duration = this._getDuration();

    this._initAirDatepicker();

    this._inst = this._getAirDatepickerInst();
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
      container: this._root.querySelector('.calendar__container') as HTMLDivElement,
      datepicker: this._root.querySelector('.calendar__datepicker') as HTMLDivElement,
      buttonApply: this._root.querySelector('.button[name="apply"]') as HTMLButtonElement,
      buttonReset: this._root.querySelector('.button[name="reset"]') as HTMLButtonElement,
    };
  }

  // возвращает продолжительность анимации контейнера
  private _getDuration(): number {
    return parseFloat(getComputedStyle(this._elements.container).animationDuration) * 1000;
  }

  // инициализирует экземпляр плагина air-datepicker
  private _initAirDatepicker(): void {
    $(this._elements.datepicker).datepicker({
      dateFormat: 'd M',
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      minDate: new Date(),
      moveToOtherMonthsOnSelect: false,
      moveToOtherYearsOnSelect: false,
      multipleDatesSeparator: ' - ',
      navTitles: {
        days: 'MM yyyy',
      },
      nextHtml: '<i class="material-icons">arrow_forward</i>',
      prevHtml: '<i class="material-icons">arrow_back</i>',
      range: true,

      onSelect: (formattedDate) => {
        this._saveFormattedDate(formattedDate);
      },
    });
  }

  // возвращает экземпляр плагина air-datepicker
  private _getAirDatepickerInst(): AirDatepickerInstance {
    return $(this._elements.datepicker).data('datepicker');
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const {
      fields,
      buttonApply,
      buttonReset,
    } = this._elements;

    if (fields.length !== 0) {
      document.addEventListener('click', this._handleDocumentClick.bind(this));
      fields[0].addEventListener('click', this._handleFieldClick.bind(this));

      if (fields[1]) {
        fields[1].addEventListener('click', this._handleFieldClick.bind(this));
      }
    }

    buttonApply.addEventListener('click', this._handleButtonApplyClick.bind(this));
    buttonReset.addEventListener('click', this._handleButtonResetClick.bind(this));
  }

  // инициализирует начальный диапазон дат календаря
  private _initDates(): void {
    const { dates } = this._root.dataset;

    if (!dates) {
      return;
    }

    const inst = this._inst;
    const split = dates.split('/');
    const from = new Date(split[0]);
    const to = new Date(split[1]);

    if (!inst.minDate || inst.minDate <= from) {
      inst.selectDate([from, to]);
      this._setInput();
      this._setFields();
    }
  }

  // сохраняет выбранные в плагине air-datepicker даты
  private _saveFormattedDate(formattedDate: string): void {
    this._formattedDate = formattedDate;
  }

  // переключает состояние контейнера
  private _switchContainer(): void {
    this._elements.container.classList.toggle('calendar__container--active');
  }

  // скрывает контейнер
  private _hideContainer(): void {
    this._elements.container.classList.remove('calendar__container--active');
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
    }, this._duration);
  }

  // устанавливает даты в плагине air-datepicker
  private _setDatepickerDates(): void {
    const inputValue = this._elements.input.value;

    this._inst.clear();

    if (inputValue === '') {
      return;
    }

    const split = inputValue.split('/');

    this._inst.selectDate([new Date(split[0]), new Date(split[1])]);
  }

  // устанавливает выбранные в плагине air-datepicker даты в скрытое поле
  private _setInput(): void {
    const from = this._inst.selectedDates[0];
    const fromYear = from.getFullYear();
    const fromMonth = from.getMonth() + 1;
    const fromDay = from.getDate();

    const to = this._inst.selectedDates[1];
    const toYear = to.getFullYear();
    const toMonth = to.getMonth() + 1;
    const toDay = to.getDate();

    const fromStr = `${fromYear}-${fromMonth}-${fromDay}`;
    const toStr = `${toYear}-${toMonth}-${toDay}`;

    this._elements.input.value = `${fromStr}/${toStr}`;
  }

  // устанавливает выбранные в плагине air-datepicker даты в поля
  private _setFields(): void {
    const { fields } = this._elements;

    if (fields.length === 0) {
      return;
    }

    if (fields[1]) {
      fields[0].value = this._inst.selectedDates[0].toLocaleDateString();
      fields[1].value = this._inst.selectedDates[1].toLocaleDateString();
    } else {
      fields[0].value = this._formattedDate.toLowerCase();
    }
  }

  // сбрасывает календарь
  private _resetCalendar(): void {
    this._inst.clear();
    this._resetInput();
    this._resetFields();
  }

  // сбрасывает скрытое поле
  private _resetInput(): void {
    this._elements.input.value = '';
  }

  // сбрасывает поля
  private _resetFields(): void {
    const { fields } = this._elements;

    if (fields.length === 0) {
      return;
    }

    fields[0].value = '';

    if (fields[1]) {
      fields[1].value = '';
    }
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const tcl = target.classList;

    if (tcl.contains('datepicker--cell')
      || tcl.contains('datepicker--nav-title')
      || tcl.contains('material-icons')
      || this._root.contains(target)) {
      return;
    }

    this._setDatepickerDates();
    this._hideContainer();
  }

  private _handleFieldClick(): void {
    this._setDatepickerDates();
    this._switchContainer();
  }

  private _handleButtonApplyClick(): void {
    switch (this._inst.selectedDates.length) {
      case 0:
        this._resetCalendar();
        this._hideContainer();
        break;
      case 1:
        this._animateContainer();
        break;
      default:
        this._setInput();
        this._setFields();
        this._hideContainer();
        break;
    }
  }

  private _handleButtonResetClick(): void {
    this._resetCalendar();
  }
}

export default function render(): void {
  document.querySelectorAll('.calendar').forEach((el) => new Calendar(el as HTMLElement));
}

render();
