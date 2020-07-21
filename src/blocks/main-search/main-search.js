class MainSearch {
  constructor(node) {
    this.node = node;
    this._findNodes();
    this._addEventListeners();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.button = this.node.querySelector('.search__button');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.button.addEventListener('click', () => {
      this._switchFilter();
    });
  }

  // переключает состояние фильтра
  _switchFilter() {
    this.button.classList.toggle('search__button--active');
  }
}

document.querySelectorAll('.search').forEach((node) => new MainSearch(node));
