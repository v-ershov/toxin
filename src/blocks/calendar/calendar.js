import $ from 'jquery';
import 'air-datepicker/dist/js/datepicker';
import 'air-datepicker/dist/css/datepicker.css';

class Calendar {
  constructor($node) {
    this.$node = $node;
    this._findNodes();
    this._addEventListeners();
    this._createCalendar();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.$datepicker = this.$node.find('.calendar__datepicker');
    this.$buttonReset = this.$node.find('.button[name="reset"]');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.$buttonReset.on('click', () => {
      this.$datepicker.data('datepicker').destroy();
      this._createCalendar();
    });
  }

  // создаёт календарь
  _createCalendar() {
    this.$datepicker.datepicker({
      inline: true,
      minDate: new Date(),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      range: true,
      prevHtml: '<i class="material-icons">arrow_back</i>',
      nextHtml: '<i class="material-icons">arrow_forward</i>',
      navTitles: {
        days: 'MM yyyy',
      },
    });
  }
}

$('.calendar').each((_i, node) => new Calendar($(node)));
