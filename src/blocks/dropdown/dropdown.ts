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
  // ---------------
  // --- FIELDS ---
  // ---------------

  private _root: HTMLElement; // корневой html-элемент дропдауна

  private _elements: IDropdownElements; // элементы дропдауна

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();

    this._addEventListeners();
    this._initDropdown();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

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
  private _addEventListeners(): void {
    const {
      input,
      items,
      numbers,
      increments,
      decrements,
      buttonApply,
      buttonReset,
    } = this._elements;

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.closest('.dropdown') === this._root) {
        return;
      }

      this._hideDropdown();
    });

    input.addEventListener('click', () => {
      this._switchDropdown();
    });

    items.forEach((_item, i) => {
      if (buttonApply) {
        numbers[i].addEventListener('input', () => {
          this._switchSpinners(i);
          this._switchButtonReset();
        });
      } else {
        numbers[i].addEventListener('input', () => {
          this._switchSpinners(i);
          this._setText();
        });
      }

      increments[i].addEventListener('click', () => {
        this._setNumber(i, +numbers[i].value + 1);
      });

      decrements[i].addEventListener('click', () => {
        this._setNumber(i, +numbers[i].value - 1);
      });
    });

    if (buttonApply && buttonReset) {
      buttonApply.addEventListener('click', () => {
        this._setText();
        this._hideDropdown();
      });

      buttonReset.addEventListener('click', () => {
        this._resetNumbers();
      });
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

  // переключает состояние дропдауна
  private _switchDropdown(): void {
    this._root.classList.toggle('dropdown--active');
  }

  // скрывает дропдаун
  private _hideDropdown(): void {
    this._root.classList.remove('dropdown--active');
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

  // сбрасывает значения всех пунктов меню
  private _resetNumbers(): void {
    const {
      input,
      items,
    } = this._elements;

    input.value = '';

    items.forEach((_item, i) => {
      this._setNumber(i, 0);
    });
  }

  // возвращает сумму значений всех пунктов меню
  private _getNumbersSum(): number {
    let sum = 0;

    this._elements.numbers.forEach((number) => {
      sum += +number.value;
    });

    return sum;
  }
}

export default function render(): void {
  document.querySelectorAll('.dropdown').forEach((el) => new Dropdown(el as HTMLElement));
}

render();
