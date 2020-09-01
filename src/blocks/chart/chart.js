import $ from 'jquery';
import 'jquery-ui/ui/effect';

class Chart {
  constructor(node) {
    this._initNodes(node);
    this._initData();
    this._addEventListeners();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      svg: node.querySelector('.chart__svg'),
      gradients: node.querySelectorAll('.chart__gradient'),
      circles: node.querySelectorAll('.chart__circle'),
      buttons: node.querySelectorAll('.chart__button'),
      tooltip: node.querySelector('.chart__tooltip'),
      tooltipName: node.querySelector('.chart__name'),
      tooltipDetails: node.querySelector('.chart__details'),
      tooltipValue: node.querySelector('.chart__value'),
      $sum: $(node).find('.chart__sum'),
    };
  }

  // инициализирует данные диаграммы
  _initData() {
    this.data = {
      duration: this._getDuration(),
      gap: this._getGap(),
      sections: this._getSections(),
      sum: this._getSum(),
    };
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    window.addEventListener('load', () => {
      this._activeDiagram();
      this._animateSum();
    });

    this.nodes.buttons.forEach((button, i) => {
      button.addEventListener('mouseover', () => {
        this._highlightCircle(i);
      });

      button.addEventListener('mouseout', () => {
        this._dehighlightCircles();
      });

      button.addEventListener('click', () => {
        this._switchButton(i);
        this._changeSum(i);
        this._animateSum();
        this._redrawDiagram();
      });
    });

    this.nodes.circles.forEach((circle, i) => {
      circle.addEventListener('mouseover', () => {
        this._highlightCircle(i);
        this._showTooltip(i);
      });

      circle.addEventListener('mousemove', (e) => {
        this._changeTooltipPosition(e);
      });

      circle.addEventListener('mouseout', () => {
        this._dehighlightCircles();
        this._hideTooltip();
      });
    });
  }

  // возвращает продолжительность анимации диаграммы
  _getDuration() {
    return +this.nodes.circles[0].style.getPropertyValue('--duration').slice(0, -2);
  }

  // возвращает размер пробела между секциями диаграммы
  _getGap() {
    return Math.abs(+this.nodes.circles[0].style.getPropertyValue('--offset') * 2);
  }

  // возвращает данные о каждой секции диаграммы
  _getSections() {
    const sections = [];

    this.nodes.circles.forEach((circle, i) => {
      sections.push({
        gradient: {
          color1: this.nodes.gradients[i].children[0].getAttribute('stop-color'),
          color2: this.nodes.gradients[i].children[1].getAttribute('stop-color'),
        },
        name: this.nodes.buttons[i].textContent,
        value: +circle.dataset.value,
      });
    });

    return sections;
  }

  // возвращает сумму значений активных секций диаграммы
  _getSum() {
    let sum = 0;

    this.nodes.circles.forEach((circle, i) => {
      if (this._isButtonActive(i)) {
        sum += +circle.dataset.value;
      }
    });

    return sum;
  }

  // активирует диаграмму
  _activeDiagram() {
    this.nodes.svg.classList.add('chart__svg--active');
  }

  // анимирует сумму активных секций в заголовке диаграммы
  _animateSum() {
    const self = this;

    $({ countNum: self.nodes.$sum.text() }).animate({ countNum: self.data.sum }, {
      duration: self.data.duration,
      easing: 'easeOutQuad',
      step() {
        self.nodes.$sum.text(Math.floor(this.countNum));
      },
      complete() {
        self.nodes.$sum.text(this.countNum);
      },
    });
  }

  // выделяет указанную секцию диаграммы
  _highlightCircle(i) {
    if (this._isButtonActive(i)) {
      this.nodes.circles.forEach((circle) => {
        circle.classList.add('chart__circle--translucent');
      });

      this.nodes.circles[i].classList.remove('chart__circle--translucent');
      this.nodes.circles[i].classList.add('chart__circle--wide');
    }
  }

  // снимает выделение со всех секций диаграммы
  _dehighlightCircles() {
    this.nodes.circles.forEach((circle) => {
      circle.classList.remove(
        'chart__circle--translucent',
        'chart__circle--wide',
      );
    });
  }

  // переключает состояние указанной кнопки диаграмммы
  _switchButton(i) {
    const button = this.nodes.buttons[i];

    button.classList.toggle('chart__button--active');
    button.dispatchEvent(new Event(this._isButtonActive(i) ? 'mouseover' : 'mouseout'));
  }

  // изменяет сумму значений активных секций диаграммы в зависимости от нажатой кнопки
  _changeSum(i) {
    if (this._isButtonActive(i)) {
      this.data.sum += this.data.sections[i].value;
    } else {
      this.data.sum -= this.data.sections[i].value;
    }
  }

  // перерисовывает диаграмму
  _redrawDiagram() {
    let offset = -this.data.gap / 2;

    this.nodes.circles.forEach((circle, i) => {
      if (this._isButtonActive(i)) {
        const percent = (this.data.sections[i].value / this.data.sum) * 100 || 0;
        const array = `${Math.max(0, percent - this.data.gap)} 100`;

        circle.style.setProperty('--array', array);
        circle.style.setProperty('--offset', offset);

        offset -= percent;
      } else {
        circle.style.setProperty('--array', '0 100');
        circle.style.setProperty('--offset', offset + this.data.gap / 2);
      }
    });
  }

  // отображает всплывающую подсказку для указанной секции диаграммы
  _showTooltip(i) {
    this.nodes.tooltip.classList.add('chart__tooltip--active');

    const { color1, color2 } = this.data.sections[i].gradient;

    this.nodes.tooltip.style.setProperty('--borderColor', `${color1}`);
    this.nodes.tooltipDetails.style.setProperty('--gradient', `linear-gradient(${color1}, ${color2})`);

    this.nodes.tooltipName.textContent = this.data.sections[i].name;
    this.nodes.tooltipValue.textContent = this.data.sections[i].value;
  }

  // изменяет положение всплывающей подсказки диаграммы
  // https://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
  _changeTooltipPosition(mousemoveEvent) {
    const target = mousemoveEvent.target || mousemoveEvent.srcElement;
    const rect = target.getBoundingClientRect();
    const offsetX = mousemoveEvent.clientX - rect.left;
    const offsetY = mousemoveEvent.clientY - rect.top;

    this.nodes.tooltip.style.setProperty('--top', `${offsetY}px`);
    this.nodes.tooltip.style.setProperty('--left', `${offsetX}px`);
  }

  // скрывает всплывающую подсказку диаграммы
  _hideTooltip() {
    this.nodes.tooltip.classList.remove('chart__tooltip--active');
  }

  // возвращает true, если указанная кнопка диаграммы активна
  _isButtonActive(i) {
    return this.nodes.buttons[i].classList.contains('chart__button--active');
  }
}

document.querySelectorAll('.chart').forEach((node) => new Chart(node));
