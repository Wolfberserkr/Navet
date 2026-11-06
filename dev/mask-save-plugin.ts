// Node-side file: Vite compiles it; `tsc` only checks src/.
import type { Plugin } from 'vite';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Dev-only endpoint used by the mask editor (key M).
 * POST /__village/mask with a PNG body writes src/data/walkable-mask.png.
 * Only exists while `npm run dev` runs; nothing like it ships in the build.
 */
export function maskSavePlugin(): Plugin {
  const target = fileURLToPath(new URL('../src/data/walkable-mask.png', import.meta.url));
  return {
    name: 'village-mask-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__village/mask', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        const chunks: Buffer[] = [];
        req.on('data', (c: Buffer) => chunks.push(c));
        req.on('end', () => {
          const body = Buffer.concat(chunks);
          const isPng = body.length > 8 && body.readUInt32BE(0) === 0x89504e47;
          if (!isPng) {
            res.statusCode = 400;
            res.end('not a png');
            return;
          }
          writeFileSync(target, body);
          res.statusCode = 200;
          res.end('saved');
        });
      });
    },
    // Saving the mask must not reload the page mid-edit.
    handleHotUpdate({ file }) {
      if (file.endsWith('walkable-mask.png')) return [];
    },
  };
}
