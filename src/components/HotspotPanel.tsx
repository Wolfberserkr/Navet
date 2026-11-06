import { useEffect, useState } from 'react';
import type { Hotspot } from '../data/residents';
import { keyedPortrait } from '../game/portrait';

interface Props {
  spot: Hotspot;
  onClose: () => void;
}

/** Placeholder panel for a building: who lives there and what they do. */
export function HotspotPanel({ spot, onClose }: Props) {
  const [portrait, setPortrait] = useState<string | null>(null);
  const r = spot.resident;

  useEffect(() => {
    setPortrait(null);
    if (!r) return;
    let live = true;
    keyedPortrait(r.portrait)
      .then((u) => live && setPortrait(u))
      .catch(() => live && setPortrait(null));
    return () => {
      live = false;
    };
  }, [r]);

  return (
    <div className="panel-backdrop" onPointerDown={onClose}>
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {r ? (
          <>
            <div className="panel-portrait">{portrait ? <img src={portrait} alt={r.name} /> : <div className="portrait-wait" />}</div>
            <div className="panel-body">
              <h2 id="panel-title">{r.name}</h2>
              <div className="panel-role">{r.role}</div>
              <p className="panel-house">{r.house}</p>
              <p className="panel-personality">“{r.personality}”</p>
              <p className="panel-note">Moving in soon — the desk, notebook and tray arrive with the next phases.</p>
            </div>
          </>
        ) : (
          <div className="panel-body">
            <h2 id="panel-title">{spot.label}</h2>
            <p>{spot.blurb}</p>
          </div>
        )}
        <button className="panel-close" onClick={onClose}>
          Close <span>(Enter / Esc)</span>
        </button>
      </div>
    </div>
  );
}
