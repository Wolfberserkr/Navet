/**
 * Keyboard state. Works with a laptop keyboard and with the Fire TV remote,
 * whose D-pad sends arrow keys and whose centre button sends Enter.
 */
export type Action = 'interact' | 'close' | 'toggleMask' | 'cycleTime' | 'save' | 'undo' | 'overview' | 'brushUp' | 'brushDown';

export class Input {
  private down = new Set<string>();
  private queue: Action[] = [];
  /** Analogue direction from the touch stick, -1..1 per axis. */
  stick = { x: 0, y: 0, active: false };
  /** Shift held (run, or paint "blocked" in the mask editor). */
  shift = false;

  constructor(private target: Window = window) {
    target.addEventListener('keydown', this.onDown);
    target.addEventListener('keyup', this.onUp);
    target.addEventListener('blur', this.onBlur);
  }

  dispose() {
    this.target.removeEventListener('keydown', this.onDown);
    this.target.removeEventListener('keyup', this.onUp);
    this.target.removeEventListener('blur', this.onBlur);
  }

  /** Movement vector from keys or the touch stick. */
  get move() {
    if (this.stick.active) return { x: this.stick.x, y: this.stick.y };
    let x = 0;
    let y = 0;
    if (this.down.has('ArrowLeft') || this.down.has('KeyA')) x -= 1;
    if (this.down.has('ArrowRight') || this.down.has('KeyD')) x += 1;
    if (this.down.has('ArrowUp') || this.down.has('KeyW')) y -= 1;
    if (this.down.has('ArrowDown') || this.down.has('KeyS')) y += 1;
    return { x, y };
  }

  get running() {
    return this.shift;
  }

  /** One-shot actions since the last frame. */
  takeActions(): Action[] {
    const q = this.queue;
    this.queue = [];
    return q;
  }

  push(a: Action) {
    this.queue.push(a);
  }

  private onDown = (e: KeyboardEvent) => {
    this.shift = e.shiftKey;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.code === 'KeyS') {
      e.preventDefault();
      this.queue.push('save');
      return;
    }
    if (mod && e.code === 'KeyZ') {
      e.preventDefault();
      this.queue.push('undo');
      return;
    }
    if (mod || e.altKey) return;

    // Keep arrows/space from scrolling the page (and the TV browser).
    if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
    this.down.add(e.code);
    if (e.repeat) return;

    switch (e.code) {
      case 'Enter':
      case 'NumpadEnter':
      case 'Space':
        this.queue.push('interact');
        break;
      case 'Escape':
      case 'Backspace':
      case 'BrowserBack':
        this.queue.push('close');
        break;
      case 'KeyM':
        this.queue.push('toggleMask');
        break;
      case 'KeyT':
        this.queue.push('cycleTime');
        break;
      case 'KeyZ':
        this.queue.push('overview');
        break;
      case 'BracketRight':
        this.queue.push('brushUp');
        break;
      case 'BracketLeft':
        this.queue.push('brushDown');
        break;
    }
    // Some TV remotes send the centre button as keyCode 23 (DPAD_CENTER) with no code.
    if (!e.code && (e.keyCode === 23 || e.keyCode === 13)) this.queue.push('interact');
  };

  private onUp = (e: KeyboardEvent) => {
    this.shift = e.shiftKey;
    this.down.delete(e.code);
  };

  private onBlur = () => {
    this.down.clear();
    this.shift = false;
  };
}
