class MainSearch {
  constructor(node) {
    this.node = node;
    this._findNodes();
    this._addEventListeners();
  }

  // находит указанные дочерние элементы корневого элемента
  _findNodes() {
    this.button = this.node.querySelector('.main-search__button');
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.button.addEventListener('click', () => {
      this._switchFilter();
    });
  }

  // переключает состояние фильтра
  _switchFilter() {
    this.button.classList.toggle('main-search__button--active');
  }
}

document.querySelectorAll('.main-search').forEach((node) => new MainSearch(node));
