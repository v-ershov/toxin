import helpers from '~/ts/helpers';

interface IDropdownElements {
  input: HTMLInputElement;
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

  private _root: HTMLElement; // корневой html-элемент дропдауна

  private _elements: IDropdownElements; // элементы дропдауна

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._bindEventListeners();
    this._initDropdown();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы дропдауна
  private _findElements(): IDropdownElements {
    return {
      input: this._root.querySelector('.field__input') as HTMLInputElement,
      menu: this._root.querySelector('.dropdown__menu') as HTMLDivElement,
      items: this._root.querySelectorAll('.dropdown__item') as NodeListOf<HTMLLIElement>,
      numbers: this._root.querySelectorAll('.dropdown__number') as NodeListOf<HTMLInputElement>,
      increments: this._root.querySelectorAll('.dropdown__spinner[name="increment"]') as NodeListOf<HTMLButtonElement>,
      decrements: this._root.querySelectorAll('.dropdown__spinner[name="decrement"]') as NodeListOf<HTMLButtonElement>,
      buttonApply: this._root.querySelector('.button[name="apply"]') as HTMLButtonElement,
      buttonReset: this._root.querySelector('.button[name="reset"]') as HTMLButtonElement,
      buttonResetWrapper: this._root.querySelector('.dropdown__button--reset') as HTMLDivElement,
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

  // инициализирует дропдаун
  private _initDropdown(): void {
    this._setMenuHeight();
    this._setText();

    this._elements.items.forEach((_item, i) => {
      this._switchSpinners(i);
    });

    this._switchButtonReset();
  }

  // устанавливает максимальную высоту меню
  private _setMenuHeight(): void {
    const { menu } = this._elements;

    menu.style.setProperty('--height', helpers.getHeight(menu));
  }

  // устанавливает новое значение для указанного пункта меню
  private _setNumber(i: number, value: number): void {
    const number = this._elements.numbers[i];

    if (value < +number.min || value > +number.max) {
      return;
    }

    number.value = `${value}`;
    number.dispatchEvent(new Event('input'));
  }

  // устанавливает текст в поле
  private _setText(): void {
    const {
      input,
      items,
      numbers,
    } = this._elements;

    const text = [];
    let sum = 0;

    items.forEach((item, i) => {
      const num = +numbers[i].value;

      if (num === 0) {
        return;
      }

      const { words } = item.dataset;

      if (words) {
        const split = words.split(', ') as [string, string, string];

        text.push(`${num} ${helpers.getWord(num, split)}`);
      } else {
        sum += num;
      }
    });

    if (sum > 0) {
      const split = (input.dataset.words as string).split(', ') as [string, string, string];

      text.unshift(`${sum} ${helpers.getWord(sum, split)}`);
    }

    input.value = text.join(', ');
  }

  // переключает состояния кнопок указанного пункта меню в зависимости от текущего значения
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

  // переключает состояние кнопки "Очистить" в зависимости от суммы значений всех пунктов меню
  private _switchButtonReset(): void {
    const { buttonResetWrapper } = this._elements;

    if (!buttonResetWrapper) {
      return;
    }

    const bcl = buttonResetWrapper.classList;

    if (this._getNumbersSum() === 0) {
      bcl.add('dropdown__button--hidden');
    } else {
      bcl.remove('dropdown__button--hidden');
    }
  }

  // сбрасывает дропдаун
  private _resetDropdown(): void {
    const {
      input,
      items,
    } = this._elements;

    input.value = '';

    items.forEach((_item, i) => {
      this._setNumber(i, 0);
    });
  }

  // снимает фокус с интерактивных элементов дропдауна
  private _blurDropdown(): void {
    const {
      input,
      buttonApply,
      buttonReset,
    } = this._elements;

    input.blur();

    if (buttonApply && buttonReset) {
      buttonApply.blur();
      buttonReset.blur();
    }
  }

  // возвращает сумму значений всех пунктов меню
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

  private _handleNumberInput(index: number): void {
    this._switchSpinners(index);
    this._setText();
  }

  private _handleNumberInputWithButtons(index: number): void {
    this._switchSpinners(index);
    this._switchButtonReset();
  }

  private _handleNumberKeydown(index: number, event: KeyboardEvent): void {
    const { numbers } = this._elements;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this._setNumber(index, +numbers[index].value - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this._setNumber(index, +numbers[index].value + 1);
        break;
      default:
        break;
    }
  }

  private _handleIncrementClick(index: number): void {
    this._setNumber(index, +this._elements.numbers[index].value + 1);
  }

  private _handleDecrementClick(index: number): void {
    this._setNumber(index, +this._elements.numbers[index].value - 1);
  }

  private _handleButtonApplyClick(): void {
    this._setText();
    this._blurDropdown();
  }

  private _handleButtonResetClick(): void {
    this._resetDropdown();
    this._blurDropdown();
    this._elements.input.focus();
  }
}

export default function render(): void {
  document.querySelectorAll('.dropdown').forEach((el) => new Dropdown(el as HTMLElement));
}

render();
