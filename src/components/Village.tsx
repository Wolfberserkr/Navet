import { useEffect, useRef, useState } from 'react';
import { VillageEngine, type UiState } from '../game/engine';
import { loadMap } from '../game/assets';
import { WalkMask } from '../game/mask';
import { MaskEditorHud } from './MaskEditorHud';
import { HotspotPanel } from './HotspotPanel';

export function Village() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<VillageEngine | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ui, setUi] = useState<UiState | null>(null);

  useEffect(() => {
    let cancelled = false;
    const onResize = () => engineRef.current?.resize();

    Promise.all([loadMap(), WalkMask.load()])
      .then(([map, mask]) => {
        if (cancelled || !canvasRef.current) return;
        const engine = new VillageEngine(canvasRef.current, map, mask, setUi);
        engineRef.current = engine;
        engine.start();
        window.addEventListener('resize', onResize);
      })
      .catch((e: Error) => setError(e.message));

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, []);

  const engine = engineRef.current;

  return (
    <div className="village">
      <canvas ref={canvasRef} className="village-canvas" />
      {!ui && !error && <div className="village-loading">The village is waking up…</div>}
      {error && <div className="village-loading">{error}</div>}
      {ui?.open && engine && <HotspotPanel spot={ui.open} onClose={() => engine.closePanel()} />}
      {ui && engine && (
        <MaskEditorHud
          state={ui.editor}
          onSave={() => engine.input.push('save')}
          onUndo={() => engine.input.push('undo')}
          onClose={() => engine.input.push('toggleMask')}
        />
      )}
    </div>
  );
}
