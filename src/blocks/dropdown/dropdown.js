import helpers from '~/js/helpers';

class Dropdown {
  constructor(node) {
    this._initNodes(node);
    this._initDropdown();
    this._addEventListeners();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      input: node.querySelector('.field__input'),
      content: node.querySelector('.dropdown__content'),
      items: node.querySelectorAll('.dropdown__item'),
      numbers: node.querySelectorAll('.dropdown__number'),
      increments: node.querySelectorAll('.dropdown__spinner[name="increment"]'),
      decrements: node.querySelectorAll('.dropdown__spinner[name="decrement"]'),
      buttonResetWrapper: node.querySelector('.dropdown__button--reset'),
      buttonReset: node.querySelector('.button[name="reset"]'),
      buttonApply: node.querySelector('.button[name="apply"]'),
    };
  }

  // инициализирует дропдаун
  _initDropdown() {
    this._setHeight();
    this._setText();

    this.nodes.items.forEach((_item, i) => {
      this._switchSpinners(i);
    });

    if (this.nodes.buttonReset) {
      this._switchButtonReset();
    }
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    const {
      root, input, items, increments, decrements, numbers, buttonReset, buttonApply,
    } = this.nodes;

    document.addEventListener('click', (e) => {
      if (e.target.closest('.dropdown') !== root) {
        this._hideDropdown();
      }
    });

    input.addEventListener('click', () => {
      this._switchDropdown();
    });

    items.forEach((_item, i) => {
      numbers[i].addEventListener('input', () => {
        this._switchSpinners(i);

        if (buttonReset) {
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

    if (buttonReset) {
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
  _setHeight() {
    this.nodes.content.style.setProperty('--height', helpers.getHeight(this.nodes.content));
  }

  // устанавливает текст в поле дропдауна
  _setText() {
    const text = [];
    let sum = 0;

    this.nodes.items.forEach((item, i) => {
      const num = +this.nodes.numbers[i].value;

      if (num !== 0) {
        let { words } = item.dataset;

        if (words) {
          words = words.split(', ');

          text.push(`${num} ${helpers.getWord(num, words)}`);
        } else {
          sum += num;
        }
      }
    });

    if (sum > 0) {
      const words = this.nodes.input.dataset.words.split(', ');

      text.unshift(`${sum} ${helpers.getWord(sum, words)}`);
    }

    this.nodes.input.value = `${text.join(', ')}`;
  }

  // переключает состояния кнопок указанного пункта меню в зависимости от текущего количества
  _switchSpinners(i) {
    const number = this.nodes.numbers[i];
    const increment = this.nodes.increments[i];
    const decrement = this.nodes.decrements[i];

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
  _switchButtonReset() {
    const bcl = this.nodes.buttonResetWrapper.classList;

    if (this._getSum() === 0) {
      bcl.add('dropdown__button--hidden');
    } else {
      bcl.remove('dropdown__button--hidden');
    }
  }

  // скрывает дропдаун
  _hideDropdown() {
    this.nodes.root.classList.remove('dropdown--active');
  }

  // переключает состояние дропдауна
  _switchDropdown() {
    this.nodes.root.classList.toggle('dropdown--active');
  }

  // устанавливает значение количества указанного пункта меню
  _setNumber(i, value) {
    const number = this.nodes.numbers[i];

    number.value = value;
    number.dispatchEvent(new Event('input'));
  }

  // сбрасывает дропдаун в состояние по умолчанию
  _resetDropdown() {
    this.nodes.items.forEach((_item, i) => {
      this._setNumber(i, 0);
    });

    this.nodes.input.value = '';
  }

  // возвращает сумму значений всех пунктов меню
  _getSum() {
    let sum = 0;

    this.nodes.numbers.forEach((number) => {
      sum += +number.value;
    });

    return sum;
  }
}

document.querySelectorAll('.dropdown').forEach((node) => new Dropdown(node));
