class Dropdown {
  constructor(node) {
    this.node = node;
    this._findNodes();
    this._addEventListeners();
    this._setHeight();
    this._setText();

    this.items.forEach((_item, i) => {
      this._switchSpinners(i);
    });

    if (this.buttonReset) {
      this._switchButtonReset();
    }
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.input = this.node.querySelector('.field__input');
    this.content = this.node.querySelector('.dropdown__content');
    this.items = this.node.querySelectorAll('.dropdown__item');
    this.increments = this.node.querySelectorAll('.dropdown__spinner[name="increment"]');
    this.decrements = this.node.querySelectorAll('.dropdown__spinner[name="decrement"]');
    this.numbers = this.node.querySelectorAll('.dropdown__number');
    this.buttonResetWrapper = this.node.querySelector('.dropdown__button--reset');
    this.buttonReset = this.node.querySelector('.button[name="reset"]');
    this.buttonApply = this.node.querySelector('.button[name="apply"]');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.dropdown') !== this.node) {
        this._collapseDropdown();
      }
    });

    this.input.addEventListener('click', () => {
      this._switchDropdown();
    });

    this.items.forEach((_item, i) => {
      this.increments[i].addEventListener('click', () => {
        this._setNumber(i, parseInt(this.numbers[i].value, 10) + 1);
      });

      this.decrements[i].addEventListener('click', () => {
        this._setNumber(i, parseInt(this.numbers[i].value, 10) - 1);
      });

      this.numbers[i].addEventListener('input', () => {
        this._switchSpinners(i);

        if (this.buttonReset) {
          this._switchButtonReset();
        } else {
          this._setText();
        }
      });
    });

    if (this.buttonReset) {
      this.buttonReset.addEventListener('click', () => {
        this._resetDropdown();
      });

      this.buttonApply.addEventListener('click', () => {
        this._setText();
        this._collapseDropdown();
      });
    }
  }

  // устанавливает максимальную высоту контейнера для контента
  // https://bugs.chromium.org/p/chromium/issues/detail?id=411624
  _setHeight() {
    this.content.style.setProperty('justify-content', 'flex-start');

    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const heightRem = this.content.scrollHeight / fontSize;

    this.content.style.setProperty('--height', ` ${heightRem}rem`);
    this.content.style.removeProperty('justify-content');
  }

  // устанавливает текст для поля дропдауна
  _setText() {
    this.input.value = this.input.dataset.words
      ? this._getTextForAllItems()
      : this._getTextForEachItem();
  }

  // переключает состояния кнопок указанного пункта меню в зависимости от текущего количества
  _switchSpinners(itemIndex) {
    const number = this.numbers[itemIndex];
    const increment = this.increments[itemIndex];
    const decrement = this.decrements[itemIndex];

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
    if (this._getTotalNumber() === 0) {
      this.buttonResetWrapper.classList.add('dropdown__button--hidden');
    } else {
      this.buttonResetWrapper.classList.remove('dropdown__button--hidden');
    }
  }

  // схлопывает дропдаун
  _collapseDropdown() {
    this.node.classList.remove('dropdown--active');
  }

  // переключает состояние дропдауна
  _switchDropdown() {
    this.node.classList.toggle('dropdown--active');
  }

  // устанавливает количество указанного пункта меню
  _setNumber(itemIndex, value) {
    this.numbers[itemIndex].value = value;
    this.numbers[itemIndex].dispatchEvent(new Event('input'));
  }

  // возвращает общее количество всех пунктов меню
  _getTotalNumber() {
    let total = 0;

    this.numbers.forEach((number) => {
      total += parseInt(number.value, 10);
    });

    return total;
  }

  // возвращает текст для поля дропдауна, если требуется описать все пункты меню общим обозначением
  _getTextForAllItems() {
    let text = '';

    const totalNumber = this._getTotalNumber();
    const lastDigit = parseInt(totalNumber, 10) % 10;
    const lastTwoDigits = parseInt(totalNumber, 10) % 100;
    const words = this.input.dataset.words.split(', ');

    if (lastDigit === 0
      || (lastDigit >= 5 && lastDigit <= 9)
      || (lastTwoDigits >= 10 && lastTwoDigits <= 19)) {
      text = `${totalNumber} ${words[2]}`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      text = `${totalNumber} ${words[1]}`;
    } else {
      text = `${totalNumber} ${words[0]}`;
    }

    return totalNumber !== 0 ? text : '';
  }

  // возвращает текст для поля дропдауна, если требуется описать все пункты меню по отдельности
  _getTextForEachItem() {
    const text = [];

    this.items.forEach((item, i) => {
      const number = this.numbers[i];

      if (number.value === '0') {
        return;
      }

      const lastDigit = parseInt(number.value, 10) % 10;
      const lastTwoDigits = parseInt(number.value, 10) % 100;
      const words = item.dataset.words.split(', ');

      if (lastDigit === 0
        || (lastDigit >= 5 && lastDigit <= 9)
        || (lastTwoDigits >= 10 && lastTwoDigits <= 19)) {
        text.push(`${number.value} ${words[2]}`);
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        text.push(`${number.value} ${words[1]}`);
      } else {
        text.push(`${number.value} ${words[0]}`);
      }
    });

    return text.length !== 0 ? text.join(', ') : '';
  }

  // сбрасывает дропдаун в состояние по умолчанию
  _resetDropdown() {
    this.items.forEach((_item, i) => {
      this._setNumber(i, 0);
    });

    this.input.value = '';
  }
}

document.querySelectorAll('.dropdown').forEach((node) => new Dropdown(node));
