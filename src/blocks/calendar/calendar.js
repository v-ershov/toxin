import $ from 'jquery';
import 'air-datepicker/dist/js/datepicker.min';
import 'air-datepicker/dist/css/datepicker.min.css';

class Calendar {
  constructor($node) {
    this.$node = $node;
    this.type = $node.data('type');
    this._findNodes();
    this._createDatepicker();
    this._addEventListeners();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.$labels = this.$node.find('.label');
    this.$inputs = this.$node.find('.field__input');
  }

  // создаёт календарь
  _createDatepicker() {
    const options = {
      dateFormat: this.type === 'field' ? 'd M' : '',
      minDate: new Date(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      multipleDatesSeparator: ' - ',
      range: true,
      prevHtml: '<i class="material-icons">arrow_back</i>',
      nextHtml: '<i class="material-icons">arrow_forward</i>',
      navTitles: {
        days: 'MM yyyy',
      },
      onSelect: (formattedDate) => {
        this.formattedDate = formattedDate;
        this._resetInputs();
      },
      onShow: (inst) => this._setWidth(inst),
    };

    this.$inst = this.type === 'field' || this.type === 'fields'
      ? this.$inputs.first().datepicker(options).data('datepicker')
      : this.$node.datepicker(options).data('datepicker');

    if (this.$node.data('selected-dates')) {
      const dates = this.$node.data('selected-dates').split('/');

      if (new Date(dates[0]) > this.$inst.minDate) {
        this.$inst.selectDate([new Date(dates[0]), new Date(dates[1])]);

        if (this.type === 'field') {
          this._setDatesForField();
        } else if (this.type === 'fields') {
          this._setDatesForFields();
        }
      }
    }

    this.$buttonReset = $('<button class="button button--bodyless button--text-gray">Очистить</button>');
    this.$buttonApply = $('<button class="button button--bodyless">Применить</button>');

    const reset = $('<div class="calendar__button">').append(this.$buttonReset);
    const apply = $('<div class="calendar__button">').append(this.$buttonApply);
    const buttons = $('<div class="calendar__buttons">').append(reset).append(apply);

    this.$inst.$datepicker.append(buttons);
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.$labels.on('mousedown click', (e) => {
      e.preventDefault();
      this.$inputs.first().focus();
    });

    if (this.type === 'fields') {
      this.$inputs.last().on('mousedown click', (e) => {
        e.preventDefault();
        this.$inputs.first().focus();
      });
    }

    this.$buttonReset.on('click', () => {
      this.$inst.clear();
      this._resetInputs();
    });

    if (this.type === 'field') {
      this.$buttonApply.on('click', () => {
        if (this.$inst.selectedDates.length === 1) {
          return;
        }

        this.$inst.hide();
        this._setDatesForField();
      });
    } else if (this.type === 'fields') {
      this.$buttonApply.on('click', () => {
        if (this.$inst.selectedDates.length === 1) {
          return;
        }

        this.$inst.hide();
        this._setDatesForFields();
      });
    }
  }

  // сбрасывает инпуты полей в состояние по умолчанию
  _resetInputs() {
    this.$inputs.each((_i, input) => {
      $(input).val('');
    });
  }

  // устанавливает ширину календаря
  _setWidth(inst) {
    inst.$datepicker.css('width', `${this.$node.width()}`);
  }

  // устанавливает выбранные даты в инпут поля, если тип календаря — 'field'
  _setDatesForField() {
    this.$inputs.val(this.formattedDate.toLowerCase());
  }

  // устанавливает выбранные даты в инпуты полей, если тип календаря — 'fields'
  _setDatesForFields() {
    this.$inputs.each((i, input) => {
      $(input).val(this.$inst.selectedDates[i].toLocaleDateString());
    });
  }
}

$('.calendar').each((_i, node) => new Calendar($(node)));
