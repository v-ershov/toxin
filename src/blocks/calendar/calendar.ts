import 'air-datepicker/dist/js/datepicker.min';
import 'air-datepicker/dist/css/datepicker.min.css';

class Calendar {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент календаря

  private elements; // элементы календаря

  private type; // тип календаря (fields | field | inline)

  private inst; // экземпляр плагина air-datepicker

  private formattedDate; // форматированная дата календаря

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();
    this.type = this.getType();
    this.inst = this.getInst();
    this.formattedDate = '';

    this.initDates();
    this.initButtons();
    this.addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы календаря
  private getElements() {
    return {
      $root: $(this.root),
      $labels: $(this.root).find('.label'),
      $inputs: $(this.root).find('.field__input'),
      $buttonReset: $('<button class="button button--bodyless button--text-gray">Очистить</button>'),
      $buttonApply: $('<button class="button button--bodyless">Применить</button>'),
    };
  }

  // возвращает тип календаря
  private getType() {
    return this.elements.$root.data('type') as string;
  }

  // возвращает экземпляр плагина air-datepicker
  private getInst() {
    const { $root, $inputs } = this.elements;

    const target = (this.type === 'inline') ? $root : $inputs.first();

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
        this.resetFields();
        this.setFormattedDate(formattedDate);
      },
      onShow: (inst: AirDatepickerInstance) => this.setWidth(inst),
    });

    return target.data('datepicker');
  }

  // инициализирует даты календаря
  private initDates() {
    const dates = this.elements.$root.data('selected-dates') as string;

    if (dates) {
      const split = dates.split('/');

      if (!this.inst.minDate || new Date(split[0]) >= this.inst.minDate) {
        this.inst.selectDate([new Date(split[0]), new Date(split[1])]);

        this.setFields();
      }
    }
  }

  // инициализирует кнопки календаря
  private initButtons() {
    const reset = $('<div class="calendar__button">').append(this.elements.$buttonReset);
    const apply = $('<div class="calendar__button">').append(this.elements.$buttonApply);
    const buttons = $('<div class="calendar__buttons">').append(reset).append(apply);

    this.inst.$datepicker.append(buttons);
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    const {
      $labels, $inputs, $buttonReset, $buttonApply,
    } = this.elements;

    $labels.on('click mousedown', (e) => {
      e.preventDefault();
      $inputs[0].focus();
    });

    $buttonReset.on('click', () => {
      this.resetFields();
      this.resetDates();
    });

    $buttonApply.on('click', () => {
      if (this.inst.selectedDates.length !== 2) {
        return;
      }

      this.inst.hide();

      this.setFields();
    });
  }

  // сбрасывает поля календаря
  private resetFields() {
    this.elements.$inputs.each((_i, input) => {
      $(input).val('');
    });
  }

  // сбрасывает активные даты календаря
  private resetDates() {
    this.inst.clear();
  }

  // устанавливает форматированную дату календаря
  private setFormattedDate(formattedDate: string) {
    this.formattedDate = formattedDate;
  }

  // устанавливает ширину календаря
  private setWidth(inst: AirDatepickerInstance) {
    inst.$datepicker.css('width', `${this.elements.$root.width() as number}`);
  }

  // устанавливает активные даты в поля календаря
  private setFields() {
    if (this.type === 'fields') {
      this.elements.$inputs.each((i, input) => {
        $(input).val(this.inst.selectedDates[i].toLocaleDateString());
      });
    } else if (this.type === 'field') {
      this.elements.$inputs.val(this.formattedDate.toLowerCase());
    }
  }
}

document.querySelectorAll('.calendar').forEach((el) => new Calendar(el as HTMLElement));
