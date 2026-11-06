import { useEffect, useRef, useState } from 'react';
import { VillageEngine } from '../game/engine';
import { loadMap } from '../game/assets';

export function Village() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let engine: VillageEngine | null = null;
    let cancelled = false;
    const onResize = () => engine?.resize();

    loadMap()
      .then((map) => {
        if (cancelled || !canvasRef.current) return;
        engine = new VillageEngine(canvasRef.current, map);
        engine.start();
        setReady(true);
        window.addEventListener('resize', onResize);
      })
      .catch((e: Error) => setError(e.message));

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      engine?.stop();
    };
  }, []);

  return (
    <div className="village">
      <canvas ref={canvasRef} className="village-canvas" />
      {!ready && !error && <div className="village-loading">The village is waking up…</div>}
      {error && <div className="village-loading">{error}</div>}
    </div>
  );
}
