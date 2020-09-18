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
        this._setTooltipPosition(e);
      });

      circle.addEventListener('mouseout', () => {
        this._dehighlightCircles();
        this._hideTooltip();
      });
    });
  }

  // возвращает продолжительность анимации диаграммы
  _getDuration() {
    return parseInt(this.nodes.circles[0].style.getPropertyValue('--duration'), 10);
  }

  // возвращает размер пробела между секциями диаграммы
  _getGap() {
    return Math.abs(+this.nodes.circles[0].style.getPropertyValue('--offset') * 2);
  }

  // возвращает данные о каждой секции диаграммы
  _getSections() {
    const { gradients, circles, buttons } = this.nodes;

    const sections = [];

    circles.forEach((_circle, i) => {
      sections.push({
        gradient: {
          color1: gradients[i].children[0].getAttribute('stop-color'),
          color2: gradients[i].children[1].getAttribute('stop-color'),
        },
        name: buttons[i].textContent,
        value: +circles[i].dataset.value,
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

  // анимирует сумму значений активных секций диаграммы в заголовке диаграммы
  _animateSum() {
    const { $sum } = this.nodes;
    const { duration, sum } = this.data;

    $({ num: $sum.text() }).animate({ num: sum }, {
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
  _highlightCircle(i) {
    if (this._isButtonActive(i)) {
      const ccl = this.nodes.circles[i].classList;

      this.nodes.circles.forEach((circle) => {
        circle.classList.add('chart__circle--translucent');
      });

      ccl.remove('chart__circle--translucent');
      ccl.add('chart__circle--wide');
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
    const { value } = this.data.sections[i];

    this.data.sum += this._isButtonActive(i) ? value : -value;
  }

  // перерисовывает диаграмму
  _redrawDiagram() {
    const { gap, sum } = this.data;

    let offset = -this.data.gap / 2;

    this.nodes.circles.forEach((circle, i) => {
      if (this._isButtonActive(i)) {
        const percent = (this.data.sections[i].value / sum) * 100 || 0;
        const array = `${Math.max(0, percent - gap)} 100`;

        circle.style.setProperty('--array', array);
        circle.style.setProperty('--offset', offset);

        offset -= percent;
      } else {
        circle.style.setProperty('--array', '0 100');
        circle.style.setProperty('--offset', offset + gap / 2);
      }
    });
  }

  // отображает всплывающую подсказку для указанной секции диаграммы
  _showTooltip(i) {
    const {
      tooltip, tooltipDetails, tooltipName, tooltipValue,
    } = this.nodes;

    const { color1, color2 } = this.data.sections[i].gradient;
    const { name, value } = this.data.sections[i];

    tooltip.classList.add('chart__tooltip--active');

    tooltip.style.setProperty('--borderColor', `${color1}`);
    tooltipDetails.style.setProperty('--gradient', `linear-gradient(${color1}, ${color2})`);

    tooltipName.textContent = name;
    tooltipValue.textContent = value;
  }

  // устанавливает положение всплывающей подсказки диаграммы
  // https://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
  _setTooltipPosition(mousemoveEvent) {
    const { tooltip } = this.nodes;

    const target = mousemoveEvent.target || mousemoveEvent.srcElement;
    const rect = target.getBoundingClientRect();
    const offsetX = mousemoveEvent.clientX - rect.left;
    const offsetY = mousemoveEvent.clientY - rect.top;

    tooltip.style.setProperty('--top', `${offsetY}px`);
    tooltip.style.setProperty('--left', `${offsetX}px`);
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
