import $ from 'jquery';
import 'air-datepicker/dist/js/datepicker.min';
import 'air-datepicker/dist/css/datepicker.min.css';

class Calendar {
  constructor(node) {
    this._initNodes(node);
    this._initData();
    this._initCalendar();
    this._addEventListeners();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      $root: $(node),
      $labels: $(node).find('.label'),
      $inputs: $(node).find('.field__input'),
    };
  }

  // инициализирует данные календаря
  _initData() {
    this.data = {
      type: this._getType(),
    };
  }

  // инициализирует календарь
  _initCalendar() {
    const { $root, $inputs } = this.nodes;

    const options = {
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
      onShow: (inst) => this._setWidth(inst),
    };

    const target = (this.data.type === 'inline') ? $root : $inputs.first();

    this.inst = target.datepicker(options).data('datepicker');

    this._initDates();
    this._initButtons();
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    const {
      $labels, $inputs, $buttonReset, $buttonApply,
    } = this.nodes;

    $labels.on('click mousedown', (e) => {
      e.preventDefault();
      $inputs[0].focus();
    });

    $buttonReset.on('click', () => {
      this._resetFields();
      this._resetDates();
    });

    $buttonApply.on('click', () => {
      if (this.inst.selectedDates.length !== 2) {
        return;
      }

      this._hideCalendar();

      if (this.data.type === 'field') {
        this._setField();
      } else if (this.data.type === 'fields') {
        this._setFields();
      }
    });
  }

  // возвращает тип календаря
  _getType() {
    return this.nodes.$root.data('type');
  }

  // скрывает календарь
  _hideCalendar() {
    this.inst.hide();
  }

  // инициализирует кнопки календаря
  _initButtons() {
    this.nodes.$buttonReset = $('<button class="button button--bodyless button--text-gray">Очистить</button>');
    this.nodes.$buttonApply = $('<button class="button button--bodyless">Применить</button>');

    const reset = $('<div class="calendar__button">').append(this.nodes.$buttonReset);
    const apply = $('<div class="calendar__button">').append(this.nodes.$buttonApply);
    const buttons = $('<div class="calendar__buttons">').append(reset).append(apply);

    this.inst.$datepicker.append(buttons);
  }

  // инициализирует даты календаря
  _initDates() {
    const dataDates = this.nodes.$root.data('selected-dates');

    if (dataDates) {
      const dates = dataDates.split('/');

      if (new Date(dates[0]) >= this.inst.minDate) {
        this.inst.selectDate([new Date(dates[0]), new Date(dates[1])]);

        if (this.data.type === 'field') {
          this._setField();
        } else if (this.data.type === 'fields') {
          this._setFields();
        }
      }
    }
  }

  // сбрасывает активные даты календаря
  _resetDates() {
    this.inst.clear();
  }

  // сбрасывает поля в состояние по умолчанию
  _resetFields() {
    this.nodes.$inputs.each((_i, input) => {
      $(input).val('');
    });
  }

  // устанавливает выбранные даты в поле, если тип календаря — 'field'
  _setField() {
    this.nodes.$inputs.val(this.data.formattedDate.toLowerCase());
  }

  // устанавливает выбранные даты в поля, если тип календаря — 'fields'
  _setFields() {
    this.nodes.$inputs.each((i, input) => {
      $(input).val(this.inst.selectedDates[i].toLocaleDateString());
    });
  }

  // устанавливает форматированную дату
  _setFormattedDate(formattedDate) {
    this.data.formattedDate = formattedDate;
  }

  // устанавливает ширину календаря
  _setWidth(inst) {
    inst.$datepicker.css('width', `${this.nodes.$root.width()}`);
  }
}

document.querySelectorAll('.calendar').forEach((node) => new Calendar(node));
