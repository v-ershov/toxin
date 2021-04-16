class Preloader {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLDivElement; // корневой html-элемент прелоадера

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLDivElement) {
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

  // отключает прелоадер
  private _disablePreloader(): void {
    this._root.classList.add('preloader--disabled');
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowLoad(): void {
    this._disablePreloader();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-preloader').forEach((el) => new Preloader(el as HTMLDivElement));
}

render();
