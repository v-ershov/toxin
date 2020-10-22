import helpers from '~/ts/helpers';

class Dropdown {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент дропдауна

  private elements; // элементы дропдауна

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();

    this.initDropdown();
    this.addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы дропдауна
  private getElements() {
    return {
      input: this.root.querySelector('.field__input') as HTMLInputElement,
      content: this.root.querySelector('.dropdown__content') as HTMLElement,
      items: this.root.querySelectorAll('.dropdown__item') as NodeListOf<HTMLElement>,
      numbers: this.root.querySelectorAll('.dropdown__number') as NodeListOf<HTMLInputElement>,
      increments: this.root.querySelectorAll('.dropdown__spinner[name="increment"]') as NodeListOf<HTMLButtonElement>,
      decrements: this.root.querySelectorAll('.dropdown__spinner[name="decrement"]') as NodeListOf<HTMLButtonElement>,
      buttons: this.root.querySelector('.dropdown__buttons') as HTMLElement,
      buttonResetWrapper: this.root.querySelector('.dropdown__button--reset') as HTMLElement,
      buttonReset: this.root.querySelector('.button[name="reset"]') as HTMLButtonElement,
      buttonApply: this.root.querySelector('.button[name="apply"]') as HTMLButtonElement,
    };
  }

  // инициализирует дропдаун
  private initDropdown() {
    const { items, buttons } = this.elements;

    this.setHeight();
    this.setText();

    items.forEach((_item, i) => {
      this.switchSpinners(i);
    });

    if (buttons) {
      this.switchButtonReset();
    }
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    const {
      input, items, numbers, increments, decrements, buttons, buttonReset, buttonApply,
    } = this.elements;

    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.dropdown') !== this.root) {
        this.hideDropdown();
      }
    });

    input.addEventListener('click', () => {
      this.switchDropdown();
    });

    items.forEach((_item, i) => {
      numbers[i].addEventListener('input', () => {
        this.switchSpinners(i);

        if (buttons) {
          this.switchButtonReset();
        } else {
          this.setText();
        }
      });

      increments[i].addEventListener('click', () => {
        this.setNumber(i, +numbers[i].value + 1);
      });

      decrements[i].addEventListener('click', () => {
        this.setNumber(i, +numbers[i].value - 1);
      });
    });

    if (buttons) {
      buttonReset.addEventListener('click', () => {
        this.resetDropdown();
      });

      buttonApply.addEventListener('click', () => {
        this.setText();
        this.hideDropdown();
      });
    }
  }

  // устанавливает максимальную высоту контейнера для контента
  private setHeight() {
    this.elements.content.style.setProperty('--height', helpers.getHeight(this.elements.content));
  }

  // устанавливает текст в поле дропдауна
  private setText() {
    const text = [];
    let sum = 0;

    this.elements.items.forEach((item, i) => {
      const num = +this.elements.numbers[i].value;

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
      const words = this.elements.input.dataset.words as string;
      const split = words.split(', ') as [string, string, string];

      text.unshift(`${sum} ${helpers.getWord(sum, split)}`);
    }

    this.elements.input.value = `${text.join(', ')}`;
  }

  // переключает состояния кнопок указанного пункта меню в зависимости от текущего количества
  private switchSpinners(i: number) {
    const number = this.elements.numbers[i];
    const increment = this.elements.increments[i];
    const decrement = this.elements.decrements[i];

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
  private switchButtonReset() {
    const bcl = this.elements.buttonResetWrapper.classList;

    if (this.getSum() === 0) {
      bcl.add('dropdown__button--hidden');
    } else {
      bcl.remove('dropdown__button--hidden');
    }
  }

  // скрывает дропдаун
  private hideDropdown() {
    this.root.classList.remove('dropdown--active');
  }

  // переключает состояние дропдауна
  private switchDropdown() {
    this.root.classList.toggle('dropdown--active');
  }

  // сбрасывает дропдаун
  private resetDropdown() {
    this.elements.items.forEach((_item, i) => {
      this.setNumber(i, 0);
    });

    this.elements.input.value = '';
  }

  // устанавливает значение количества указанного пункта меню
  private setNumber(i: number, value: number) {
    const number = this.elements.numbers[i];

    number.value = `${value}`;
    number.dispatchEvent(new Event('input'));
  }

  // возвращает сумму значений всех пунктов меню
  private getSum() {
    let sum = 0;

    this.elements.numbers.forEach((number) => {
      sum += +number.value;
    });

    return sum;
  }
}

document.querySelectorAll('.dropdown').forEach((el) => new Dropdown(el as HTMLElement));
