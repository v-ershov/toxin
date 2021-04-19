class Body {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLBodyElement; // корневой html-элемент блока

  // ---------------------------------
  // ---------- CONSTRUCTOR ----------
  // ---------------------------------

  constructor(root: HTMLBodyElement) {
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

  // включает анимации на странице
  private _enableAnimations(): void {
    this._root.classList.remove('body--unanimated');
  }

  // ------------------------------------
  // ---------- EVENT HANDLERS ----------
  // ------------------------------------

  private _handleWindowLoad(): void {
    this._enableAnimations();
  }
}

export default function render(): void {
  document.querySelectorAll('.js-body').forEach((el) => new Body(el as HTMLBodyElement));
}

render();
