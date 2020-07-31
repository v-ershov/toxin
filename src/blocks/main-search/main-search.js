class MainSearch {
  constructor(node) {
    this.node = node;
    this._defineClasses();
    this._findNodes();
    this._addEventListeners();
    this._observe();
  }

  // определяет классы элементов, с которыми предстоит работать
  _defineClasses() {
    const classMain = this.node.classList[0];

    this.classes = {
      main: classMain,
      mainFilter: `${classMain}--filter`,
      button: `${classMain}__button`,
      buttonActive: `${classMain}__button--active`,
      buttonHidden: `${classMain}__button--hidden`,
    };
  }

  // находит указанные элементы корневого элемента
  _findNodes() {
    this.button = this.node.querySelector(`.${this.classes.button}`);
  }

  // регистрирует обработчики событий
  _addEventListeners() {
    this.button.addEventListener('click', () => {
      this._switchSidebar();
    });
  }

  // переключает состояние боковой панели
  _switchSidebar() {
    if (!this.button.classList.contains(this.classes.buttonHidden)) {
      this.button.classList.toggle(this.classes.buttonActive);

      if (this.button.classList.contains(this.classes.buttonActive)) {
        document.body.style.overflowY = 'hidden';
        this.node.classList.add(this.classes.mainFilter);
      } else {
        document.body.removeAttribute('style');
        this.node.classList.remove(this.classes.mainFilter);
      }
    }
  }

  // создаёт Intersection Observer для последующего скрытия / отображения кнопки «Фильтры»
  _observe() {
    const options = {
      rootMargin: '-100% 0px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.button.classList.remove(this.classes.buttonHidden);
      } else {
        this.button.classList.add(this.classes.buttonHidden);
      }
    }, options);

    observer.observe(this.node);
  }
}

document.querySelectorAll('.main-search').forEach((node) => new MainSearch(node));
