import 'jquery-ui/ui/effect';

interface IChartElements {
  svg: HTMLElement;
  gradients: NodeListOf<HTMLElement>;
  circles: NodeListOf<HTMLElement>;
  sum: HTMLSpanElement;
  tooltip: HTMLDivElement;
  tooltipName: HTMLDivElement;
  tooltipDetails: HTMLDivElement;
  tooltipValue: HTMLSpanElement;
  buttons: NodeListOf<HTMLButtonElement>;
}

interface IChartSection {
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

  private _root: HTMLElement; // корневой html-элемент диаграммы

  private _elements: IChartElements; // элементы диаграммы

  private _gap: number; // размер пробела между секциями диаграммы

  private _duration: number; // продолжительность анимации диаграммы

  private _sections: IChartSection[]; // данные о каждой секции диаграммы

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;
    this._elements = this._findElements();
    this._gap = this._getGap();
    this._duration = this._getDuration();
    this._sections = this._getSections();

    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // находит и возвращает элементы диаграммы
  private _findElements(): IChartElements {
    return {
      svg: this._root.querySelector('.chart__svg') as HTMLElement,
      gradients: this._root.querySelectorAll('.chart__gradient'),
      circles: this._root.querySelectorAll('.chart__circle'),
      sum: this._root.querySelector('.chart__sum') as HTMLSpanElement,
      tooltip: this._root.querySelector('.chart__tooltip') as HTMLDivElement,
      tooltipName: this._root.querySelector('.chart__name') as HTMLDivElement,
      tooltipDetails: this._root.querySelector('.chart__details') as HTMLDivElement,
      tooltipValue: this._root.querySelector('.chart__value') as HTMLSpanElement,
      buttons: this._root.querySelectorAll('.chart__button'),
    };
  }

  // возвращает размер пробела между секциями диаграммы
  private _getGap(): number {
    return +(this._root.dataset.gap as string);
  }

  // возвращает продолжительность анимации диаграммы
  private _getDuration(): number {
    return parseInt(this._elements.circles[0].style.getPropertyValue('--duration'), 10);
  }

  // возвращает данные о каждой секции диаграммы
  private _getSections(): IChartSection[] {
    const {
      gradients,
      circles,
      buttons,
    } = this._elements;

    const sections: IChartSection[] = [];

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
      button.addEventListener('focus', this._handleButtonFocus.bind(this, i));
      button.addEventListener('blur', this._handleButtonBlur.bind(this));
      button.addEventListener('mouseover', this._handleButtonMouseOver.bind(this, i));
      button.addEventListener('mouseout', this._handleButtonMouseOut.bind(this));
      button.addEventListener('click', this._handleButtonClick.bind(this, i));
    });
  }

  // активирует диаграмму
  private _activateDiagram(): void {
    this._elements.svg.classList.add('chart__svg--active');
  }

  // анимирует сумму значений активных секций диаграммы в заголовке диаграммы
  private _animateSum(): void {
    const { sum } = this._elements;

    $({ num: +(sum.textContent as string) }).animate({ num: this._getSum() }, {
      duration: this._duration,
      easing: 'easeOutQuad', // from jquery-ui
      step() {
        sum.textContent = `${Math.floor(this.num)}`;
      },
      complete() {
        sum.textContent = `${this.num}`;
      },
    });
  }

  // выделяет указанную секцию диаграммы
  private _highlightCircle(i: number): void {
    if (!this._isButtonActive(i)) {
      return;
    }

    const { circles } = this._elements;

    circles.forEach((circle) => {
      circle.classList.add('chart__circle--semitransparent');
    });

    const ccl = circles[i].classList;

    ccl.remove('chart__circle--semitransparent');
    ccl.add('chart__circle--wide');
  }

  // снимает выделение со всех секций диаграммы
  private _dehighlightCircles(): void {
    this._elements.circles.forEach((circle) => {
      circle.classList.remove(
        'chart__circle--semitransparent',
        'chart__circle--wide',
      );
    });
  }

  // переключает состояние указанной кнопки диаграмммы
  private _switchButton(i: number): void {
    const button = this._elements.buttons[i];

    button.classList.toggle('chart__button--active');
    button.dispatchEvent(new Event(this._isButtonActive(i) ? 'mouseover' : 'mouseout'));
  }

  // перерисовывает диаграмму
  private _redrawDiagram(): void {
    const gap = this._gap;

    let offset = -100 - gap / 2;

    this._elements.circles.forEach((circle, i) => {
      if (this._isButtonActive(i)) {
        const percent = (this._sections[i].value / this._getSum()) * 100 || 0;
        const array = `${Math.max(0, percent - gap)} 100`;
        offset += percent;

        circle.style.setProperty('--array', array);
        circle.style.setProperty('--offset', `${offset}`);
      } else {
        circle.style.setProperty('--array', '0 100');
        circle.style.setProperty('--offset', `${offset + gap / 2}`);
      }
    });
  }

  // отображает всплывающую подсказку для указанной секции диаграммы
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

    tooltip.style.setProperty('--borderColor', `${color1}`);
    tooltipName.textContent = name;
    tooltipDetails.style.setProperty('--gradient', `linear-gradient(${color1}, ${color2})`);
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

  // возвращает сумму значений активных секций диаграммы
  private _getSum(): number {
    let sum = 0;

    this._elements.circles.forEach((circle, i) => {
      if (!this._isButtonActive(i)) {
        return;
      }

      sum += +(circle.dataset.value as string);
    });

    return sum;
  }

  // возвращает true, если указанная кнопка диаграммы активна
  private _isButtonActive(i: number): boolean {
    return this._elements.buttons[i].classList.contains('chart__button--active');
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowLoad(): void {
    this._activateDiagram();
    this._animateSum();
  }

  private _handleCircleMouseOver(index: number): void {
    this._highlightCircle(index);
    this._showTooltip(index);
  }

  private _handleCircleMouseMove(event: MouseEvent): void {
    this._setTooltipPosition(event);
  }

  private _handleCircleMouseOut(): void {
    this._dehighlightCircles();
    this._hideTooltip();
  }

  private _handleButtonFocus(index: number): void {
    this._highlightCircle(index);
  }

  private _handleButtonBlur(): void {
    this._dehighlightCircles();
  }

  private _handleButtonMouseOver(index: number): void {
    this._highlightCircle(index);
  }

  private _handleButtonMouseOut(): void {
    this._dehighlightCircles();
  }

  private _handleButtonClick(index: number): void {
    this._switchButton(index);
    this._animateSum();
    this._redrawDiagram();
  }
}

export default function render(): void {
  document.querySelectorAll('.chart').forEach((el) => new Chart(el as HTMLElement));
}

render();
