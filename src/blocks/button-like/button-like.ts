interface IElements {
  numbers: HTMLSpanElement;
}

class ButtonLike {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLButtonElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  private _likes: number; // текущее количество лайков

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLButtonElement) {
    this._root = root;
    this._elements = this._findElements();
    this._likes = this._initLikes();

    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      numbers: r.querySelector('.js-button-like__numbers') as HTMLSpanElement,
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    this._root.addEventListener('click', this._handleRootClick.bind(this));
  }

  // инициализирует и возвращает текущее количество лайков
  private _initLikes(): number {
    return +((this._elements.numbers.firstChild as ChildNode).textContent as string);
  }

  // переключает состояние блока
  private _switch(): void {
    const rcl = this._root.classList;

    if (!rcl.contains('button-like--active')) {
      rcl.add('button-like--active');
      this._setLikes(this._likes + 1);
    } else {
      rcl.remove('button-like--active');
      this._setLikes(this._likes - 1);
    }
  }

  // устанавливает текущее количество лайков
  private _setLikes(value: number): void {
    if (value === this._likes) {
      return;
    }

    if (value > this._likes) {
      this._visualizeIncrease(value);
    } else {
      this._visualizeDecrease(value);
    }

    this._likes = value;
  }

  // визуализирует увеличение количества лайков
  private _visualizeIncrease(likes: number): void {
    const { numbers } = this._elements;
    const ncl = numbers.classList;

    numbers.prepend(ButtonLike._createNumber(likes));
    ncl.add('button-like__numbers--increase');

    setTimeout(() => {
      ncl.add('button-like__numbers--anim-increase');
    }, 25);

    setTimeout(() => {
      (numbers.lastChild as ChildNode).remove();
      ncl.remove(
        'button-like__numbers--increase',
        'button-like__numbers--anim-increase',
      );
    }, this._getDuration());
  }

  // визуализирует уменьшение количества лайков
  private _visualizeDecrease(likes: number): void {
    const { numbers } = this._elements;
    const ncl = numbers.classList;

    numbers.append(ButtonLike._createNumber(likes));

    setTimeout(() => {
      ncl.add('button-like__numbers--anim-decrease');
    }, 25);

    setTimeout(() => {
      (numbers.firstChild as ChildNode).remove();
      ncl.remove('button-like__numbers--anim-decrease');
    }, this._getDuration());
  }

  // возвращает продолжительность анимации блока
  private _getDuration(): number {
    return parseFloat(getComputedStyle(this._root).transitionDuration) * 1000;
  }

  // создаёт и возвращает элемент 'number' с указанным количеством лайков
  private static _createNumber(likes: number): HTMLSpanElement {
    const el = document.createElement('span');

    el.classList.add('button-like__number');
    el.textContent = `${likes}`;

    return el;
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleRootClick(): void {
    this._switch();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-button-like').forEach((el) => new ButtonLike(el as HTMLButtonElement));
}

render();
