class Body {
  // ----------------------------
  // ---------- FIELDS ----------
  // ----------------------------

  private _root: HTMLElement; // корневой html-элемент тела

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

  // включает анимации
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
  document.querySelectorAll('.body').forEach((el) => new Body(el as HTMLElement));
}

render();
