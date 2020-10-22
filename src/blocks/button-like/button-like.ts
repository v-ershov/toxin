class ButtonLike {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент кнопки

  private elements; // элементы кнопки

  private duration; // продолжительность анимации кнопки

  private isReady; // если true, то кнопка доступна для изменений

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();
    this.duration = this.getDuration();
    this.isReady = true;

    this.addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы кнопки
  private getElements() {
    return {
      numbers: this.root.querySelector('.button-like__numbers') as HTMLElement,
    };
  }

  // возвращает продолжительность анимации кнопки
  private getDuration() {
    return parseFloat(getComputedStyle(this.root).transitionDuration) * 1000;
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    this.root.addEventListener('click', () => {
      this.switchButton();
    });
  }

  // переключает состояние кнопки
  private switchButton() {
    if (this.isReady) {
      this.isReady = false;

      const rcl = this.root.classList;

      const child = this.elements.numbers.firstChild as ChildNode;
      const num = +(child.textContent as string);

      rcl.toggle('button-like--active');
      this.setLikes(num + (rcl.contains('button-like--active') ? 1 : -1));

      setTimeout(() => {
        this.isReady = true;
      }, this.duration);
    }
  }

  // устанавливает заданное значение лайков в кнопке
  private setLikes(value: number) {
    const { numbers } = this.elements;

    const child = numbers.firstChild as ChildNode;
    const num = +(child.textContent as string);

    if (value === num) {
      return;
    }

    const isIncrease = value > num;
    const newChild = child.cloneNode(true);
    newChild.textContent = `${value}`;

    if (isIncrease) {
      numbers.prepend(newChild);
      numbers.classList.add('button-like__numbers--increase');
    } else {
      numbers.append(newChild);
    }

    setTimeout(() => {
      numbers.classList.add(isIncrease
        ? 'button-like__numbers--anim-increase'
        : 'button-like__numbers--anim-decrease');
    }, 25);

    setTimeout(() => {
      if (isIncrease) {
        (numbers.lastChild as ChildNode).remove();
        numbers.classList.remove(
          'button-like__numbers--increase',
          'button-like__numbers--anim-increase',
        );
      } else {
        (numbers.firstChild as ChildNode).remove();
        numbers.classList.remove('button-like__numbers--anim-decrease');
      }
    }, this.duration);
  }
}

document.querySelectorAll('.button-like').forEach((el) => new ButtonLike(el as HTMLElement));
