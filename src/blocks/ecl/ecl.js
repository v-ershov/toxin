import helpers from '~/js/helpers';

class Ecl {
  constructor(node) {
    this._initNodes(node);
    this._addEventListeners();
    this._setHeight();
  }

  // инициализирует узлы, необходимые для дальнейшей работы
  _initNodes(node) {
    this.nodes = {
      root: node,
      button: node.querySelector('.ecl__button'),
      list: node.querySelector('.ecl__list'),
    };
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.nodes.button.addEventListener('click', () => {
      this._switchEcl();
    });
  }

  // устанавливает максимальную высоту списка чекбоксов
  _setHeight() {
    this.nodes.list.style.setProperty('--height', helpers.getHeight(this.nodes.list));
  }

  // переключает состояние списка чекбоксов
  _switchEcl() {
    this.nodes.root.classList.toggle('ecl--active');
  }
}

document.querySelectorAll('.ecl').forEach((node) => new Ecl(node));
