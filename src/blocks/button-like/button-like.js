class ButtonLike {
  constructor(node) {
    this.node = node;
    this.numbers = node.querySelector('.button-like__numbers');
    this.number = node.querySelector('.button-like__number');
    this.classActive = 'button-like--active';
    this.classIncrease = 'button-like__numbers--increase';
    this.classAnimIncrease = 'button-like__numbers--anim-increase';
    this.classAnimDecrease = 'button-like__numbers--anim-decrease';
    this.animTime = 300;
    this.isClickable = true;
    this._addEventListeners();
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.node.addEventListener('click', () => {
      this._switchState();
    });
  }

  // уменьшает количество лайков на единицу
  _decrease() {
    const newNumber = this.numbers.lastChild.cloneNode(true);
    newNumber.textContent = parseInt(newNumber.textContent, 10) - 1;

    this.numbers.appendChild(newNumber);

    setTimeout(() => {
      this.numbers.classList.add(this.classAnimDecrease);
    }, 1);

    setTimeout(() => {
      this.numbers.classList.remove(this.classAnimDecrease);
      this.numbers.firstChild.remove();
    }, this.animTime);
  }

  // увеличивает количество лайков на единицу
  _increase() {
    const newNumber = this.numbers.firstChild.cloneNode(true);
    newNumber.textContent = parseInt(newNumber.textContent, 10) + 1;

    this.numbers.insertBefore(newNumber, this.numbers.firstChild);
    this.numbers.classList.add(this.classIncrease);

    setTimeout(() => {
      this.numbers.classList.add(this.classAnimIncrease);
    }, 1);

    setTimeout(() => {
      this.numbers.classList.remove(this.classIncrease, this.classAnimIncrease);
      this.numbers.lastChild.remove();
    }, this.animTime);
  }

  // активирует или деактивирует кнопку в зависимости от текущего состояния
  _switchState() {
    if (this.isClickable) {
      this.isClickable = false;

      if (this.node.classList.contains(this.classActive)) {
        this.node.classList.remove(this.classActive);
        this._decrease();
      } else {
        this.node.classList.add(this.classActive);
        this._increase();
      }

      setTimeout(() => {
        this.isClickable = true;
      }, this.animTime);
    }
  }
}

document.querySelectorAll('.button-like').forEach((node) => new ButtonLike(node));
