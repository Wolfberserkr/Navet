import type { MaskEditorState } from '../game/mask-editor';

interface Props {
  state: MaskEditorState;
  onSave: () => void;
  onUndo: () => void;
  onClose: () => void;
}

export function MaskEditorHud({ state, onSave, onUndo, onClose }: Props) {
  if (!state.open) return null;
  return (
    <div className="editor-hud">
      <div className="editor-title">Mask editor</div>
      <ul>
        <li>
          <b>Left drag</b> walkable · <b>Right drag</b> / <b>Shift+drag</b> blocked
        </li>
        <li>
          <b>[</b> <b>]</b> brush size ({state.brush}px) · <b>Z</b> {state.overview ? 'zoom in' : 'whole map'} ·{' '}
          <b>Ctrl+Z</b> undo
        </li>
        <li>
          <b>Ctrl+S</b> save · <b>M</b> / <b>Esc</b> close
        </li>
        {!state.overview && <li>Arrows/WASD move the view (Shift = faster)</li>}
      </ul>
      <div className="editor-actions">
        <button onClick={onSave}>{state.dirty ? 'Save*' : 'Save'}</button>
        <button onClick={onUndo}>Undo</button>
        <button onClick={onClose}>Close</button>
      </div>
      {state.status && <div className="editor-status">{state.status}</div>}
    </div>
  );
}
