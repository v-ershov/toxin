import helpers from '~/ts/helpers';

interface IDropdownElements {
  input: HTMLInputElement;
  content: HTMLElement;
  items: NodeListOf<HTMLElement>;
  numbers: NodeListOf<HTMLInputElement>;
  increments: NodeListOf<HTMLButtonElement>;
  decrements: NodeListOf<HTMLButtonElement>;
  buttons: HTMLElement;
  buttonResetWrapper: HTMLElement;
  buttonReset: HTMLButtonElement;
  buttonApply: HTMLButtonElement;
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
    this._elements = this._getElements();

    this._initDropdown();
    this._addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы дропдауна
  private _getElements(): IDropdownElements {
    return {
      input: this._root.querySelector('.field__input') as HTMLInputElement,
      content: this._root.querySelector('.dropdown__content') as HTMLElement,
      items: this._root.querySelectorAll('.dropdown__item') as NodeListOf<HTMLElement>,
      numbers: this._root.querySelectorAll('.dropdown__number') as NodeListOf<HTMLInputElement>,
      increments: this._root.querySelectorAll('.dropdown__spinner[name="increment"]') as NodeListOf<HTMLButtonElement>,
      decrements: this._root.querySelectorAll('.dropdown__spinner[name="decrement"]') as NodeListOf<HTMLButtonElement>,
      buttons: this._root.querySelector('.dropdown__buttons') as HTMLElement,
      buttonResetWrapper: this._root.querySelector('.dropdown__button--reset') as HTMLElement,
      buttonReset: this._root.querySelector('.button[name="reset"]') as HTMLButtonElement,
      buttonApply: this._root.querySelector('.button[name="apply"]') as HTMLButtonElement,
    };
  }

  // инициализирует дропдаун
  private _initDropdown(): void {
    const { items, buttons } = this._elements;

    this._setHeight();
    this._setText();

    items.forEach((_item, i) => {
      this._switchSpinners(i);
    });

    if (buttons) {
      this._switchButtonReset();
    }
  }

  // регистрирует обработчики событий
  private _addEventListeners(): void {
    const {
      input, items, numbers, increments, decrements, buttons, buttonReset, buttonApply,
    } = this._elements;

    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.dropdown') !== this._root) {
        this._hideDropdown();
      }
    });

    input.addEventListener('click', () => {
      this._switchDropdown();
    });

    items.forEach((_item, i) => {
      numbers[i].addEventListener('input', () => {
        this._switchSpinners(i);

        if (buttons) {
          this._switchButtonReset();
        } else {
          this._setText();
        }
      });

      increments[i].addEventListener('click', () => {
        this._setNumber(i, +numbers[i].value + 1);
      });

      decrements[i].addEventListener('click', () => {
        this._setNumber(i, +numbers[i].value - 1);
      });
    });

    if (buttons) {
      buttonReset.addEventListener('click', () => {
        this._resetDropdown();
      });

      buttonApply.addEventListener('click', () => {
        this._setText();
        this._hideDropdown();
      });
    }
  }

  // устанавливает максимальную высоту контейнера для контента
  private _setHeight(): void {
    this._elements.content.style.setProperty('--height', helpers.getHeight(this._elements.content));
  }

  // устанавливает текст в поле дропдауна
  private _setText(): void {
    const text = [];
    let sum = 0;

    this._elements.items.forEach((item, i) => {
      const num = +this._elements.numbers[i].value;

      if (num !== 0) {
        const { words } = item.dataset;

        if (words) {
          const split = words.split(', ') as [string, string, string];

          text.push(`${num} ${helpers.getWord(num, split)}`);
        } else {
          sum += num;
        }
      }
    });

    if (sum > 0) {
      const words = this._elements.input.dataset.words as string;
      const split = words.split(', ') as [string, string, string];

      text.unshift(`${sum} ${helpers.getWord(sum, split)}`);
    }

    this._elements.input.value = `${text.join(', ')}`;
  }

  // переключает состояния кнопок указанного пункта меню в зависимости от текущего количества
  private _switchSpinners(i: number): void {
    const number = this._elements.numbers[i];
    const increment = this._elements.increments[i];
    const decrement = this._elements.decrements[i];

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

  // переключает состояние кнопки "Очистить" в зависимости от общего количества всех пунктов меню
  private _switchButtonReset(): void {
    const bcl = this._elements.buttonResetWrapper.classList;

    if (this._getSum() === 0) {
      bcl.add('dropdown__button--hidden');
    } else {
      bcl.remove('dropdown__button--hidden');
    }
  }

  // скрывает дропдаун
  private _hideDropdown(): void {
    this._root.classList.remove('dropdown--active');
  }

  // переключает состояние дропдауна
  private _switchDropdown(): void {
    this._root.classList.toggle('dropdown--active');
  }

  // сбрасывает дропдаун
  private _resetDropdown(): void {
    this._elements.items.forEach((_item, i) => {
      this._setNumber(i, 0);
    });

    this._elements.input.value = '';
  }

  // устанавливает значение количества указанного пункта меню
  private _setNumber(i: number, value: number): void {
    const number = this._elements.numbers[i];

    number.value = `${value}`;
    number.dispatchEvent(new Event('input'));
  }

  // возвращает сумму значений всех пунктов меню
  private _getSum(): number {
    let sum = 0;

    this._elements.numbers.forEach((number) => {
      sum += +number.value;
    });

    return sum;
  }
}

document.querySelectorAll('.dropdown').forEach((el) => new Dropdown(el as HTMLElement));
