class ButtonLike {
  constructor(node) {
    this.node = node;
    this.animTime = 300;
    this.isReady = true;
    this._findNodes();
    this._addEventListeners();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.numbers = this.node.querySelector('.button-like__numbers');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.node.addEventListener('click', () => {
      this._switchState();
    });
  }

  // устанавливает заданное значение лайков в кнопке
  _setNumber(value) {
    if (value === parseInt(this.numbers.firstChild.textContent, 10)) {
      return;
    }

    const isIncrease = value > this.numbers.firstChild.textContent;
    const newNumber = this.numbers.firstChild.cloneNode(true);
    newNumber.textContent = value;

    if (isIncrease) {
      this.numbers.prepend(newNumber);
      this.numbers.classList.add('button-like__numbers--increase');
    } else {
      this.numbers.append(newNumber);
    }

    setTimeout(() => {
      if (isIncrease) {
        this.numbers.classList.add('button-like__numbers--anim-increase');
      } else {
        this.numbers.classList.add('button-like__numbers--anim-decrease');
      }
    }, 25);

    setTimeout(() => {
      if (isIncrease) {
        this.numbers.classList.remove(
          'button-like__numbers--increase',
          'button-like__numbers--anim-increase',
        );
        this.numbers.lastChild.remove();
      } else {
        this.numbers.classList.remove('button-like__numbers--anim-decrease');
        this.numbers.firstChild.remove();
      }
    }, this.animTime);
  }

  // переключает состояние кнопки
  _switchState() {
    if (this.isReady) {
      this.isReady = false;

      if (!this.node.classList.contains('button-like--active')) {
        this.node.classList.add('button-like--active');
        this._setNumber(parseInt(this.numbers.firstChild.textContent, 10) + 1);
      } else {
        this.node.classList.remove('button-like--active');
        this._setNumber(parseInt(this.numbers.firstChild.textContent, 10) - 1);
      }

      setTimeout(() => {
        this.isReady = true;
      }, this.animTime);
    }
  }
}

document.querySelectorAll('.button-like').forEach((node) => new ButtonLike(node));
