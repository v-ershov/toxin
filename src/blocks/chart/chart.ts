import 'jquery-ui/ui/effect';

class Chart {
  // ------------------
  // --- PROPERTIES ---
  // ------------------

  private root; // корневой html-элемент диаграммы

  private elements; // элементы диаграммы

  private duration; // продолжительность анимации диаграммы

  private gap; // размер пробела между секциями диаграммы

  private sections; // данные о каждой секции диаграммы

  private sum; // сумма значений активных секций диаграммы

  // -------------------
  // --- CONSTRUCTOR ---
  // -------------------

  constructor(root: HTMLElement) {
    this.root = root;
    this.elements = this.getElements();
    this.duration = this.getDuration();
    this.gap = this.getGap();
    this.sections = this.getSections();
    this.sum = this.getSum();

    this.addEventListeners();
  }

  // -----------------------
  // --- PRIVATE METHODS ---
  // -----------------------

  // возвращает элементы диаграммы
  private getElements() {
    return {
      svg: this.root.querySelector('.chart__svg') as HTMLElement,
      gradients: this.root.querySelectorAll('.chart__gradient') as NodeListOf<HTMLElement>,
      circles: this.root.querySelectorAll('.chart__circle') as NodeListOf<HTMLElement>,
      buttons: this.root.querySelectorAll('.chart__button') as NodeListOf<HTMLElement>,
      tooltip: this.root.querySelector('.chart__tooltip') as HTMLElement,
      tooltipName: this.root.querySelector('.chart__name') as HTMLElement,
      tooltipDetails: this.root.querySelector('.chart__details') as HTMLElement,
      tooltipValue: this.root.querySelector('.chart__value') as HTMLElement,
      $sum: $(this.root).find('.chart__sum'),
    };
  }

  // возвращает продолжительность анимации диаграммы
  private getDuration() {
    return parseInt(this.elements.circles[0].style.getPropertyValue('--duration'), 10);
  }

  // возвращает размер пробела между секциями диаграммы
  private getGap() {
    return Math.abs(+this.elements.circles[0].style.getPropertyValue('--offset') * 2);
  }

  // возвращает данные о каждой секции диаграммы
  private getSections() {
    const { gradients, circles, buttons } = this.elements;

    const sections: {
      gradient: {
        color1: string;
        color2: string;
      };
      name: string;
      value: number;
    }[] = [];

    circles.forEach((_circle, i) => {
      sections.push({
        gradient: {
          color1: gradients[i].children[0].getAttribute('stop-color') as string,
          color2: gradients[i].children[1].getAttribute('stop-color') as string,
        },
        name: buttons[i].textContent as string,
        value: +(circles[i].dataset.value as string),
      });
    });

    return sections;
  }

  // возвращает сумму значений активных секций диаграммы
  private getSum() {
    let sum = 0;

    this.elements.circles.forEach((circle, i) => {
      if (this.isButtonActive(i)) {
        sum += +(circle.dataset.value as string);
      }
    });

    return sum;
  }

  // регистрирует обработчики событий
  private addEventListeners() {
    window.addEventListener('load', () => {
      this.activeDiagram();
      this.animateSum();
    });

    this.elements.buttons.forEach((button, i) => {
      button.addEventListener('mouseover', () => {
        this.highlightCircle(i);
      });

      button.addEventListener('mouseout', () => {
        this.dehighlightCircles();
      });

      button.addEventListener('click', () => {
        this.switchButton(i);
        this.changeSum(i);
        this.animateSum();
        this.redrawDiagram();
      });
    });

    this.elements.circles.forEach((circle, i) => {
      circle.addEventListener('mouseover', () => {
        this.highlightCircle(i);
        this.showTooltip(i);
      });

      circle.addEventListener('mousemove', (e) => {
        this.setTooltipPosition(e);
      });

      circle.addEventListener('mouseout', () => {
        this.dehighlightCircles();
        this.hideTooltip();
      });
    });
  }

  // активирует диаграмму
  private activeDiagram() {
    this.elements.svg.classList.add('chart__svg--active');
  }

  // анимирует сумму значений активных секций диаграммы в заголовке диаграммы
  private animateSum() {
    const { $sum } = this.elements;
    const { duration, sum } = this;

    $({ num: +$sum.text() }).animate({ num: sum }, {
      duration,
      easing: 'easeOutQuad', // from jquery-ui
      step() {
        $sum.text(Math.floor(this.num));
      },
      complete() {
        $sum.text(this.num);
      },
    });
  }

  // выделяет указанную секцию диаграммы
  private highlightCircle(i: number) {
    if (this.isButtonActive(i)) {
      this.elements.circles.forEach((circle) => {
        circle.classList.add('chart__circle--translucent');
      });

      const ccl = this.elements.circles[i].classList;

      ccl.remove('chart__circle--translucent');
      ccl.add('chart__circle--wide');
    }
  }

  // снимает выделение со всех секций диаграммы
  private dehighlightCircles() {
    this.elements.circles.forEach((circle) => {
      circle.classList.remove(
        'chart__circle--translucent',
        'chart__circle--wide',
      );
    });
  }

  // переключает состояние указанной кнопки диаграмммы
  private switchButton(i: number) {
    const button = this.elements.buttons[i];

    button.classList.toggle('chart__button--active');
    button.dispatchEvent(new Event(this.isButtonActive(i) ? 'mouseover' : 'mouseout'));
  }

  // изменяет сумму значений активных секций диаграммы в зависимости от нажатой кнопки
  private changeSum(i: number) {
    const { value } = this.sections[i];

    this.sum += this.isButtonActive(i) ? value : -value;
  }

  // перерисовывает диаграмму
  private redrawDiagram() {
    const { gap, sum } = this;

    let offset = -this.gap / 2;

    this.elements.circles.forEach((circle, i) => {
      if (this.isButtonActive(i)) {
        const percent = (this.sections[i].value / sum) * 100 || 0;
        const array = `${Math.max(0, percent - gap)} 100`;

        circle.style.setProperty('--array', array);
        circle.style.setProperty('--offset', `${offset}`);

        offset -= percent;
      } else {
        circle.style.setProperty('--array', '0 100');
        circle.style.setProperty('--offset', `${offset + gap / 2}`);
      }
    });
  }

  // отображает всплывающую подсказку для указанной секции диаграммы
  private showTooltip(i: number) {
    const {
      tooltip, tooltipDetails, tooltipName, tooltipValue,
    } = this.elements;

    const { color1, color2 } = this.sections[i].gradient;
    const { name, value } = this.sections[i];

    tooltip.classList.add('chart__tooltip--active');

    tooltip.style.setProperty('--borderColor', `${color1}`);
    tooltipDetails.style.setProperty('--gradient', `linear-gradient(${color1}, ${color2})`);

    tooltipName.textContent = name;
    tooltipValue.textContent = `${value}`;
  }

  // устанавливает положение всплывающей подсказки диаграммы
  // https://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
  private setTooltipPosition(mousemove: MouseEvent) {
    const { tooltip } = this.elements;

    const rect = (mousemove.target as Element).getBoundingClientRect();
    const offsetX = mousemove.clientX - rect.left;
    const offsetY = mousemove.clientY - rect.top;

    tooltip.style.setProperty('--top', `${offsetY}px`);
    tooltip.style.setProperty('--left', `${offsetX}px`);
  }

  // скрывает всплывающую подсказку диаграммы
  private hideTooltip() {
    this.elements.tooltip.classList.remove('chart__tooltip--active');
  }

  // возвращает true, если указанная кнопка диаграммы активна
  private isButtonActive(i: number) {
    return this.elements.buttons[i].classList.contains('chart__button--active');
  }
}

document.querySelectorAll('.chart').forEach((el) => new Chart(el as HTMLElement));
