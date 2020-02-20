class Dropdown {
  constructor(node) {
    this.node = node;
    this.input = node.querySelector('.dropdown__input');
    this.label = node.querySelector('.dropdown__label');
    this.content = node.querySelector('.dropdown__content');
    this.items = node.querySelectorAll('.dropdown__item');
    this.increments = node.querySelectorAll('.dropdown__spinner[name="increment"]');
    this.decrements = node.querySelectorAll('.dropdown__spinner[name="decrement"]');
    this.quantityAll = node.querySelectorAll('.dropdown__quantity');
    this.buttons = node.querySelector('.dropdown__buttons');
    this.buttonResetContainer = node.querySelector('.dropdown__button--reset');
    this.buttonReset = node.querySelector('.button[name="reset"]');
    this.buttonApply = node.querySelector('.button[name="apply"]');
    this.classButtonHide = 'dropdown__button--hide';
    this._addEventListeners();
    this._setHeight();
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    document.addEventListener('click', (event) => {
      if (event.target.closest('.dropdown') !== this.node) {
        this._collapse();
      }
    });

    this.items.forEach((_item, i) => {
      this.increments[i].addEventListener('click', () => {
        this._setQuantity(i, parseInt(this.quantityAll[i].value, 10) + 1);
      });

      this.decrements[i].addEventListener('click', () => {
        this._setQuantity(i, parseInt(this.quantityAll[i].value, 10) - 1);
      });

      this.quantityAll[i].addEventListener('input', () => {
        this._switchSpinners(i);

        if (this.buttons) {
          this._switchButtonReset();
        } else {
          this._setText();
        }
      });
    });

    if (this.buttons) {
      this.buttonReset.addEventListener('click', () => {
        this._reset();
      });

      this.buttonApply.addEventListener('click', () => {
        this._setText();
        this._collapse();
      });
    }
  }

  // схлопывает контейнер для контента
  _collapse() {
    this.input.checked = false;
  }

  // возвращает текст дропдауна, если требуется описать все пункты меню общим обозначением
  _getTextForAllItems() {
    let text = '';

    const quantityTotal = this._getQuantityTotal();
    const lastDigit = parseInt(quantityTotal, 10) % 10;
    const lastTwoDigits = parseInt(quantityTotal, 10) % 100;
    const words = this.label.dataset.words.split(', ');

    if (lastDigit === 0
      || (lastDigit >= 5 && lastDigit <= 9)
      || (lastTwoDigits >= 10 && lastTwoDigits <= 19)) {
      text = `${quantityTotal} ${words[2]}`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      text = `${quantityTotal} ${words[1]}`;
    } else {
      text = `${quantityTotal} ${words[0]}`;
    }

    return quantityTotal !== 0
      ? text
      : this.label.dataset.text;
  }

  // возвращает текст дропдауна, если требуется описать все пункты меню по отдельности
  _getTextForEachItem() {
    const text = [];

    this.items.forEach((item, i) => {
      const quantity = this.quantityAll[i];

      if (quantity.value === '0') {
        return;
      }

      const lastDigit = parseInt(quantity.value, 10) % 10;
      const lastTwoDigits = parseInt(quantity.value, 10) % 100;
      const words = item.dataset.words.split(', ');

      if (lastDigit === 0
        || (lastDigit >= 5 && lastDigit <= 9)
        || (lastTwoDigits >= 10 && lastTwoDigits <= 19)) {
        text.push(`${quantity.value} ${words[2]}`);
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        text.push(`${quantity.value} ${words[1]}`);
      } else {
        text.push(`${quantity.value} ${words[0]}`);
      }
    });

    return text.length !== 0
      ? text.join(', ')
      : this.label.dataset.text;
  }

  // возвращает общее количество всех пунктов меню
  _getQuantityTotal() {
    let quantityTotal = 0;

    this.quantityAll.forEach((quantity) => {
      quantityTotal += parseInt(quantity.value, 10);
    });

    return quantityTotal;
  }

  // сбрасывает дропдаун в состояние по умолчанию
  _reset() {
    this.items.forEach((_item, i) => {
      this._setQuantity(i, 0);
    });

    this.label.textContent = this.label.dataset.text;
  }

  // устанавливает максимальную высоту контейнера для контента
  _setHeight() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=411624
    this.content.style.setProperty('justify-content', 'flex-start');
    this.content.style.setProperty('--height', ` ${this.content.scrollHeight}px`);
    this.content.style.removeProperty('justify-content');
  }

  // устанавливает количество указанного пункта меню
  _setQuantity(itemNumber, value) {
    this.quantityAll[itemNumber].value = value;
    this.quantityAll[itemNumber].dispatchEvent(new Event('input'));
  }

  // устанавливает текст дропдауна
  _setText() {
    this.label.textContent = this.label.dataset.words
      ? this._getTextForAllItems()
      : this._getTextForEachItem();
  }

  // отображает или скрывает кнопку "Очистить" в зависимости от общего количества
  _switchButtonReset() {
    if (this._getQuantityTotal() === 0) {
      this.buttonResetContainer.classList.add(this.classButtonHide);
    } else {
      this.buttonResetContainer.classList.remove(this.classButtonHide);
    }
  }

  // включает или выключает кнопки указанного пункта меню в зависимости от количества
  _switchSpinners(itemNumber) {
    const quantity = this.quantityAll[itemNumber];
    const increment = this.increments[itemNumber];
    const decrement = this.decrements[itemNumber];

    switch (quantity.value) {
      case quantity.min:
        increment.disabled = false;
        decrement.disabled = true;
        break;
      case quantity.max:
        increment.disabled = true;
        decrement.disabled = false;
        break;
      default:
        increment.disabled = false;
        decrement.disabled = false;
        break;
    }
  }
}

document.querySelectorAll('.dropdown').forEach((node) => new Dropdown(node));
