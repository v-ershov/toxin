import 'jquery-ui/ui/effect';

interface IElements {
  gradients: NodeListOf<HTMLElement>;
  circles: NodeListOf<HTMLElement>;
  sum: HTMLSpanElement;
  tooltip: HTMLDivElement;
  tooltipName: HTMLDivElement;
  tooltipDetails: HTMLDivElement;
  tooltipValue: HTMLSpanElement;
  buttons: NodeListOf<HTMLButtonElement>;
}

interface ISection {
  name: string;
  value: number;
  gradient: {
    color1: string;
    color2: string;
  };
}

class Chart {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLDivElement; // корневой html-элемент блока

  private _elements: IElements; // элементы блока

  private _sections: ISection[]; // секции блока

  private _gap: number; // размер пробела между секциями

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLDivElement) {
    this._root = root;
    this._elements = this._findElements();
    this._sections = this._initSections();
    this._gap = this._initGap();

    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы блока
  private _findElements(): IElements {
    const r = this._root;

    return {
      gradients: r.querySelectorAll('.js-chart__gradient'),
      circles: r.querySelectorAll('.js-chart__circle'),
      sum: r.querySelector('.js-chart__sum') as HTMLSpanElement,
      tooltip: r.querySelector('.js-chart__tooltip') as HTMLDivElement,
      tooltipName: r.querySelector('.js-chart__name') as HTMLDivElement,
      tooltipDetails: r.querySelector('.js-chart__details') as HTMLDivElement,
      tooltipValue: r.querySelector('.js-chart__value') as HTMLSpanElement,
      buttons: r.querySelectorAll('.js-chart__button'),
    };
  }

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    const {
      circles,
      buttons,
    } = this._elements;

    window.addEventListener('load', this._handleWindowLoad.bind(this));

    circles.forEach((circle, i) => {
      circle.addEventListener('mouseover', this._handleCircleMouseOver.bind(this, i));
      circle.addEventListener('mousemove', this._handleCircleMouseMove.bind(this));
      circle.addEventListener('mouseout', this._handleCircleMouseOut.bind(this));
    });

    buttons.forEach((button, i) => {
      button.addEventListener('mouseover', this._handleButtonMouseOver.bind(this, i));
      button.addEventListener('mouseout', this._handleButtonMouseOut.bind(this));
      button.addEventListener('click', this._handleButtonClick.bind(this, i));
      button.addEventListener('focus', this._handleButtonFocus.bind(this, i));
      button.addEventListener('blur', this._handleButtonBlur.bind(this));
    });
  }

  // инициализирует и возвращает секции блока
  private _initSections(): ISection[] {
    const {
      gradients,
      circles,
      buttons,
    } = this._elements;

    const sections: ISection[] = [];

    circles.forEach((_circle, i) => {
      sections.push({
        name: buttons[i].textContent as string,
        value: +(circles[i].dataset.value as string),
        gradient: {
          color1: gradients[i].children[0].getAttribute('stop-color') as string,
          color2: gradients[i].children[1].getAttribute('stop-color') as string,
        },
      });
    });

    return sections;
  }

  // инициализирует и возвращает размер пробела между секциями
  private _initGap(): number {
    return +(this._root.dataset.gap as string);
  }

  // включает круговые фигуры секций
  private _enableCircles(): void {
    this._elements.circles.forEach((circle) => {
      circle.classList.remove('chart__circle--disabled');
    });
  }

  // перерисовывает круговые фигуры секций
  private _redrawCircles(): void {
    const gap = this._gap;

    let offset = -100 - gap / 2;

    this._elements.circles.forEach((circle, i) => {
      if (!this._isActiveButton(i)) {
        circle.style.setProperty('--array', '0 100');
        circle.style.setProperty('--offset', `${offset + gap / 2}`);
        return;
      }

      const percent = (this._sections[i].value / this._getActiveSum()) * 100 || 0;
      const array = `${Math.max(0, percent - gap)} 100`;
      offset += percent;

      circle.style.setProperty('--array', array);
      circle.style.setProperty('--offset', `${offset}`);
    });
  }

  // добавляет выделение для круговой фигуры указанной секции
  private _highlightCircle(i: number): void {
    if (!this._isActiveButton(i)) {
      return;
    }

    const { circles } = this._elements;
    const ccl = circles[i].classList;

    circles.forEach((circle) => {
      circle.classList.add('chart__circle--semitransparent');
    });

    ccl.remove('chart__circle--semitransparent');
    ccl.add('chart__circle--wide');
  }

  // снимает выделение со всех круговых фигур секций
  private _dehighlightCircles(): void {
    this._elements.circles.forEach((circle) => {
      circle.classList.remove(
        'chart__circle--semitransparent',
        'chart__circle--wide',
      );
    });
  }

  // отображает всплывающую подсказку указанной секции
  private _showTooltip(i: number): void {
    const {
      tooltip,
      tooltipName,
      tooltipDetails,
      tooltipValue,
    } = this._elements;

    const {
      name,
      value,
    } = this._sections[i];

    const {
      color1,
      color2,
    } = this._sections[i].gradient;

    tooltip.classList.add('chart__tooltip--active');

    tooltip.style.setProperty('--border-color', `${color1}`);
    tooltipDetails.style.setProperty('--gradient', `linear-gradient(${color1}, ${color2})`);

    tooltipName.textContent = name;
    tooltipValue.textContent = `${value}`;
  }

  // устанавливает положение всплывающей подсказки
  // https://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
  private _setTooltipPosition(mousemove: MouseEvent): void {
    const { tooltip } = this._elements;
    const rect = (mousemove.target as HTMLElement).getBoundingClientRect();
    const offsetX = mousemove.clientX - rect.left;
    const offsetY = mousemove.clientY - rect.top;

    tooltip.style.setProperty('--top', `${offsetY}px`);
    tooltip.style.setProperty('--left', `${offsetX}px`);
  }

  // скрывает всплывающую подсказку
  private _hideTooltip(): void {
    this._elements.tooltip.classList.remove('chart__tooltip--active');
  }

  // переключает состояние указанной кнопки
  private _switchButton(i: number): void {
    this._elements.buttons[i].classList.toggle('chart__button--active');
  }

  // симулирует MouseEvent (mouseover | mouseout) на указанной кнопке
  private _simulateMouseEvent(i: number): void {
    this._elements.buttons[i].dispatchEvent(new Event(this._isActiveButton(i) ? 'mouseover' : 'mouseout'));
  }

  // перерисовывает сумму значений всех активных секций
  private _redrawActiveSum(): void {
    const { sum } = this._elements;

    $({ num: +(sum.textContent as string) }).animate({ num: this._getActiveSum() }, {
      duration: this._getDuration(),
      easing: 'easeOutQuad', // from jquery-ui

      step() {
        sum.textContent = `${Math.floor(this.num)}`;
      },
      complete() {
        sum.textContent = `${this.num}`;
      },
    });
  }

  // возвращает сумму значений всех активных секций
  private _getActiveSum(): number {
    let sum = 0;

    this._elements.circles.forEach((circle, i) => {
      if (this._isActiveButton(i)) {
        sum += +(circle.dataset.value as string);
      }
    });

    return sum;
  }

  // возвращает продолжительность анимации блока
  private _getDuration(): number {
    return parseInt(this._elements.circles[0].style.getPropertyValue('--duration'), 10);
  }

  // возвращает true, если указанная кнопка активна
  private _isActiveButton(i: number): boolean {
    return this._elements.buttons[i].classList.contains('chart__button--active');
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowLoad(): void {
    setTimeout(() => {
      this._enableCircles();
      this._redrawActiveSum();
    }, this._getDuration() / 2);
  }

  private _handleCircleMouseOver(i: number): void {
    this._highlightCircle(i);
    this._showTooltip(i);
  }

  private _handleCircleMouseMove(event: MouseEvent): void {
    this._setTooltipPosition(event);
  }

  private _handleCircleMouseOut(): void {
    this._dehighlightCircles();
    this._hideTooltip();
  }

  private _handleButtonMouseOver(i: number): void {
    this._highlightCircle(i);
  }

  private _handleButtonMouseOut(): void {
    this._dehighlightCircles();
  }

  private _handleButtonClick(i: number): void {
    this._switchButton(i);
    this._simulateMouseEvent(i);
    this._redrawCircles();
    this._redrawActiveSum();
  }

  private _handleButtonFocus(i: number): void {
    this._highlightCircle(i);
  }

  private _handleButtonBlur(): void {
    this._dehighlightCircles();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-chart').forEach((el) => new Chart(el as HTMLDivElement));
}

render();
