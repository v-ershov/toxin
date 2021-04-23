import helpers from '~/ts/helpers';

interface IElements {
  field: HTMLInputElement;
  menu: HTMLDivElement;
  items: NodeListOf<HTMLLIElement>;
  numbers: NodeListOf<HTMLInputElement>;
  increments: NodeListOf<HTMLButtonElement>;
  decrements: NodeListOf<HTMLButtonElement>;
  buttonApply?: HTMLButtonElement;
  buttonReset?: HTMLButtonElement;
  buttonResetWrapper?: HTMLDivElement;
}

class Dropdown {
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

    this._init();
    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      field: r.querySelector('.js-field__input') as HTMLInputElement,
      menu: r.querySelector('.js-dropdown__menu') as HTMLDivElement,
      items: r.querySelectorAll('.js-dropdown__item'),
      numbers: r.querySelectorAll('.js-dropdown__number'),
      increments: r.querySelectorAll('.js-dropdown__spinner[name="increment"]'),
      decrements: r.querySelectorAll('.js-dropdown__spinner[name="decrement"]'),
      buttonApply: r.querySelector('.js-button[name="apply"]') as HTMLButtonElement,
      buttonReset: r.querySelector('.js-button[name="reset"]') as HTMLButtonElement,
      buttonResetWrapper: r.querySelector('.js-dropdown__button--reset') as HTMLDivElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const {
      menu,
      items,
      numbers,
      increments,
      decrements,
      buttonApply,
      buttonReset,
    } = this._elements;

    menu.addEventListener('mousedown', (e) => e.preventDefault());

    items.forEach((_item, i) => {
      if (buttonApply && buttonReset) {
        numbers[i].addEventListener('input', this._handleNumberInputWithButtons.bind(this, i));
      } else {
        numbers[i].addEventListener('input', this._handleNumberInput.bind(this, i));
      }

      numbers[i].addEventListener('keydown', this._handleNumberKeydown.bind(this, i));
      increments[i].addEventListener('click', this._handleIncrementClick.bind(this, i));
      decrements[i].addEventListener('click', this._handleDecrementClick.bind(this, i));
    });

    if (buttonApply && buttonReset) {
      buttonApply.addEventListener('click', this._handleButtonApplyClick.bind(this));
      buttonReset.addEventListener('click', this._handleButtonResetClick.bind(this));
    }
  }

  // инициализирует блок
  private _init(): void {
    this._setMenuHeight();
    this._setField();

    this._elements.items.forEach((_item, i) => {
      this._switchSpinners(i);
    });

    this._switchButtonReset();
  }

  // сбрасывает блок в состояние по умолчанию
  private _reset(): void {
    const {
      field,
      items,
    } = this._elements;

    field.value = '';

    items.forEach((_item, i) => {
      this._setNumber(i, 0);
    });
  }

  // устанавливает высоту меню
  private _setMenuHeight(): void {
    this._elements.menu.style.setProperty('--height', helpers.getHeight(this._elements.menu));
  }

  // устанавливает значение поля
  private _setField(): void {
    const {
      field,
      items,
      numbers,
    } = this._elements;

    const text = [];

    let sum = 0;

    items.forEach((item, i) => {
      const value = +numbers[i].value;

      if (!value) {
        return;
      }

      const { words } = item.dataset;

      if (words) {
        const split = words.split(', ') as [string, string, string];

        text.push(`${value} ${helpers.getWord(value, split)}`);
      } else {
        sum += value;
      }
    });

    if (sum > 0) {
      const split = (field.dataset.words as string).split(', ') as [string, string, string];

      text.unshift(`${sum} ${helpers.getWord(sum, split)}`);
    }

    field.value = text.join(', ');
  }

  // увеличивает значение указанного числового инпута на 1
  private _increaseNumberByOne(i: number): void {
    this._setNumber(i, +this._elements.numbers[i].value + 1);
  }

  // уменьшает значение указанного числового инпута на 1
  private _decreaseNumberByOne(i: number): void {
    this._setNumber(i, +this._elements.numbers[i].value - 1);
  }

  // устанавливает значение указанного числового инпута
  private _setNumber(i: number, value: number): void {
    const number = this._elements.numbers[i];
    const isValueValid = value >= +number.min && value <= +number.max;

    if (isValueValid) {
      number.value = `${value}`;
      number.dispatchEvent(new Event('input'));
    }
  }

  // переключает состояния кнопок указанного пункта меню в зависимости от значения числового инпута
  private _switchSpinners(i: number): void {
    const number = this._elements.numbers[i];
    const increment = this._elements.increments[i];
    const decrement = this._elements.decrements[i];

    if (number.min === number.max) {
      increment.disabled = true;
      decrement.disabled = true;
      return;
    }

    switch (number.value) {
      case number.min:
        increment.disabled = false;
        decrement.disabled = true;
        break;
      case number.max:
        increment.disabled = true;
        decrement.disabled = false;
        break;
      default:
        increment.disabled = false;
        decrement.disabled = false;
        break;
    }
  }

  // переключает состояние кнопки 'Очистить' в зависимости от суммы значений всех числовых инпутов
  private _switchButtonReset(): void {
    const { buttonResetWrapper } = this._elements;

    if (!buttonResetWrapper) {
      return;
    }

    const bcl = buttonResetWrapper.classList;

    if (!this._getNumbersSum()) {
      bcl.add('dropdown__button--hidden');
    } else {
      bcl.remove('dropdown__button--hidden');
    }
  }

  // снимает фокус с интерактивных элементов
  private _blurElements(): void {
    const {
      field,
      buttonApply,
      buttonReset,
    } = this._elements;

    field.blur();

    if (buttonApply && buttonReset) {
      buttonApply.blur();
      buttonReset.blur();
    }
  }

  // возвращает сумму значений всех числовых инпутов
  private _getNumbersSum(): number {
    let sum = 0;

    this._elements.numbers.forEach((number) => {
      sum += +number.value;
    });

    return sum;
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleNumberInput(i: number): void {
    this._switchSpinners(i);
    this._setField();
  }

  private _handleNumberInputWithButtons(i: number): void {
    this._switchSpinners(i);
    this._switchButtonReset();
  }

  private _handleNumberKeydown(i: number, event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this._increaseNumberByOne(i);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this._decreaseNumberByOne(i);
        break;
      default:
        break;
    }
  }

  private _handleIncrementClick(i: number): void {
    this._increaseNumberByOne(i);
  }

  private _handleDecrementClick(i: number): void {
    this._decreaseNumberByOne(i);
  }

  private _handleButtonApplyClick(): void {
    this._setField();
    this._blurElements();
  }

  private _handleButtonResetClick(): void {
    this._reset();
    this._elements.field.focus();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-dropdown').forEach((el) => new Dropdown(el as HTMLDivElement));
}

render();
