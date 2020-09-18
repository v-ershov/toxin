class ButtonLike {
  constructor(node) {
    this._initNodes(node);
    this._initData();
    this._addEventListeners();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      numbers: node.querySelector('.button-like__numbers'),
    };
  }

  // инициализирует данные кнопки
  _initData() {
    this.data = {
      duration: this._getDuration(),
    };

    this.isReady = true;
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.nodes.root.addEventListener('click', () => {
      this._switchButton();
    });
  }

  // возвращает продолжительность анимации кнопки
  _getDuration() {
    return parseFloat(getComputedStyle(this.nodes.root).transitionDuration, 10) * 1000;
  }

  // переключает состояние кнопки
  _switchButton() {
    if (this.isReady) {
      this.isReady = false;

      const rcl = this.nodes.root.classList;
      const num = +this.nodes.numbers.firstChild.textContent;

      rcl.toggle('button-like--active');
      this.setNumber(num + (rcl.contains('button-like--active') ? 1 : -1));

      setTimeout(() => {
        this.isReady = true;
      }, this.data.duration);
    }
  }

  // устанавливает заданное значение лайков в кнопке
  setNumber(value) {
    const { numbers } = this.nodes;

    if (value === +numbers.firstChild.textContent) {
      return;
    }

    const isIncrease = value > +numbers.firstChild.textContent;
    const newNum = numbers.firstChild.cloneNode(true);
    newNum.textContent = value;

    if (isIncrease) {
      numbers.prepend(newNum);
      numbers.classList.add('button-like__numbers--increase');
    } else {
      numbers.append(newNum);
    }

    setTimeout(() => {
      numbers.classList.add(isIncrease
        ? 'button-like__numbers--anim-increase'
        : 'button-like__numbers--anim-decrease');
    }, 25);

    setTimeout(() => {
      if (isIncrease) {
        numbers.lastChild.remove();
        numbers.classList.remove(
          'button-like__numbers--increase',
          'button-like__numbers--anim-increase',
        );
      } else {
        numbers.firstChild.remove();
        numbers.classList.remove('button-like__numbers--anim-decrease');
      }
    }, this.data.duration);
  }
}

document.querySelectorAll('.button-like').forEach((node) => new ButtonLike(node));
