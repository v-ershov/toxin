import 'air-datepicker/dist/js/datepicker.min';
import 'air-datepicker/dist/css/datepicker.min.css';

interface ICalendarElements {
  $root: JQuery<HTMLElement>;
  $labels: JQuery<HTMLElement>;
  $inputs: JQuery<HTMLElement>;
  $buttonReset: JQuery<HTMLElement>;
  $buttonApply: JQuery<HTMLElement>;
}

class Calendar {
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент календаря

  private _elements: ICalendarElements; // элементы календаря

  private _type: string; // тип календаря (fields | field | inline)

  private _inst: AirDatepickerInstance; // экземпляр плагина air-datepicker

  private _formattedDate: string; // форматированная дата календаря

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._getElements();
    this._type = this._getType();
    this._inst = this._getInst();
    this._formattedDate = '';

    this._initDates();
    this._initButtons();
    this._addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы календаря
  private _getElements(): ICalendarElements {
    return {
      $root: $(this._root),
      $labels: $(this._root).find('.label'),
      $inputs: $(this._root).find('.field__input'),
      $buttonReset: $('<button class="button button--bodyless button--text-gray">Очистить</button>'),
      $buttonApply: $('<button class="button button--bodyless">Применить</button>'),
    };
  }

  // возвращает тип календаря
  private _getType(): string {
    return this._elements.$root.data('type') as string;
  }

  // возвращает экземпляр плагина air-datepicker
  private _getInst(): AirDatepickerInstance {
    const { $root, $inputs } = this._elements;

    const target = (this._type === 'inline') ? $root : $inputs.first();

    target.datepicker({
      dateFormat: 'd M',
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
        this._resetFields();
        this._setFormattedDate(formattedDate);
      },
      onShow: (inst: AirDatepickerInstance) => this._setWidth(inst),
    });

    return target.data('datepicker');
  }

  // инициализирует даты календаря
  private _initDates(): void {
    const dates = this._elements.$root.data('selected-dates') as string;

    if (dates) {
      const split = dates.split('/');

      if (!this._inst.minDate || new Date(split[0]) >= this._inst.minDate) {
        this._inst.selectDate([new Date(split[0]), new Date(split[1])]);

        this._setFields();
      }
    }
  }

  // инициализирует кнопки календаря
  private _initButtons(): void {
    const reset = $('<div class="calendar__button">').append(this._elements.$buttonReset);
    const apply = $('<div class="calendar__button">').append(this._elements.$buttonApply);
    const buttons = $('<div class="calendar__buttons">').append(reset).append(apply);

    this._inst.$datepicker.append(buttons);
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    const {
      $labels, $inputs, $buttonReset, $buttonApply,
    } = this._elements;

    $labels.on('click mousedown', (e) => {
      e.preventDefault();
      $inputs[0].focus();
    });

    $buttonReset.on('click', () => {
      this._resetFields();
      this._resetDates();
    });

    $buttonApply.on('click', () => {
      if (this._inst.selectedDates.length !== 2) {
        return;
      }

      this._inst.hide();

      this._setFields();
    });
  }

  // сбрасывает поля календаря
  private _resetFields(): void {
    this._elements.$inputs.each((_i, input) => {
      $(input).val('');
    });
  }

  // сбрасывает активные даты календаря
  private _resetDates(): void {
    this._inst.clear();
  }

  // устанавливает форматированную дату календаря
  private _setFormattedDate(formattedDate: string): void {
    this._formattedDate = formattedDate;
  }

  // устанавливает ширину календаря
  private _setWidth(inst: AirDatepickerInstance): void {
    inst.$datepicker.css('width', `${this._elements.$root.width() as number}`);
  }

  // устанавливает активные даты в поля календаря
  private _setFields(): void {
    if (this._type === 'fields') {
      this._elements.$inputs.each((i, input) => {
        $(input).val(this._inst.selectedDates[i].toLocaleDateString());
      });
    } else if (this._type === 'field') {
      this._elements.$inputs.val(this._formattedDate.toLowerCase());
    }
  }
}

document.querySelectorAll('.calendar').forEach((el) => new Calendar(el as HTMLElement));
