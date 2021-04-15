class Preloader {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент прелоадера

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLElement) {
    this._root = root;

    this._bindEventListeners();
  }

  // -------------------------------------
  // ---------- PRIVATE METHODS ----------
  // -------------------------------------

  // регистрирует обработчики событий
  private _bindEventListeners(): void {
    window.addEventListener('load', this._handleWindowLoad.bind(this));
  }

  // переключает состояние прелоадера
  private _switchPreloader(): void {
    this._root.classList.toggle('preloader--hidden');
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowLoad(): void {
    this._switchPreloader();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-preloader').forEach((el) => new Preloader(el as HTMLElement));
}

render();
