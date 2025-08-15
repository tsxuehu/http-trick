/**
 * When listening for an outside click, we set useCapture = true.
 * This way, we can prevent other click listeners from firing when performing the 'click-out'.
 * If useCapture is set to false, the handlers fire backwards
 */
export class BodyClickListener {
  private _isListening: boolean = false;
  private _listener: (event: MouseEvent | KeyboardEvent) => void;

  constructor(fn: (event: MouseEvent | KeyboardEvent) => void) {
    this._listener = fn;
  }
  get isListening() {
    return this._isListening;
  }

  start() {
    window.addEventListener('click', this._onclick, true);
    window.addEventListener('keyup', this._onescape, true);
    this._isListening = true;
  }

  stop() {
    window.removeEventListener('click', this._onclick, true);
    window.removeEventListener('keyup', this._onescape, true);
    this._isListening = false;
  }

  private _onclick = (e: MouseEvent) => {
    e.preventDefault();
    this._listener?.(e);
  };

  private _onescape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this._listener?.(e);
    }
  };
}
