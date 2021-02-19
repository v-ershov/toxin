interface IButtonLikeElements {
  numbers: HTMLSpanElement;
}

class ButtonLike {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент кнопки

  private _elements: IButtonLikeElements; // элементы кнопки

  private _duration: number; // продолжительность анимации кнопки

  private _isReady: boolean; // если true, то кнопка доступна для изменений

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();
    this._duration = this._getDuration();
    this._isReady = true;

    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы кнопки
  private _findElements(): IButtonLikeElements {
    return {
      numbers: this._root.querySelector('.button-like__numbers') as HTMLSpanElement,
    };
  }

  // возвращает продолжительность анимации кнопки
  private _getDuration(): number {
    return parseFloat(getComputedStyle(this._root).transitionDuration) * 1000;
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    this._root.addEventListener('click', this._handleRootClick.bind(this));
  }

  // переключает состояние кнопки
  private _switchButton(): void {
    if (!this._isReady) {
      return;
    }

    this._isReady = false;

    const rcl = this._root.classList;
    const child = this._elements.numbers.firstChild as ChildNode;
    const num = +(child.textContent as string);

    rcl.toggle('button-like--active');

    const newNum = rcl.contains('button-like--active')
      ? num + 1
      : num - 1;

    this._setLikes(newNum);

    setTimeout(() => {
      this._isReady = true;
    }, this._duration);
  }

  // устанавливает значение лайков в кнопке
  private _setLikes(value: number): void {
    const { numbers } = this._elements;

    const ncl = numbers.classList;
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
      ncl.add('button-like__numbers--increase');
    } else {
      numbers.append(newChild);
    }

    setTimeout(() => {
      ncl.add(isIncrease
        ? 'button-like__numbers--anim-increase'
        : 'button-like__numbers--anim-decrease');
    }, 25);

    setTimeout(() => {
      if (isIncrease) {
        (numbers.lastChild as ChildNode).remove();
        ncl.remove(
          'button-like__numbers--increase',
          'button-like__numbers--anim-increase',
        );
      } else {
        (numbers.firstChild as ChildNode).remove();
        ncl.remove('button-like__numbers--anim-decrease');
      }
    }, this._duration);
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleRootClick(): void {
    this._switchButton();
  }
}

export default function render(): void {
  document.querySelectorAll('.button-like').forEach((el) => new ButtonLike(el as HTMLElement));
}

render();
