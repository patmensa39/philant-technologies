'use client';
import { useState } from 'react';

/** Shows the feed address to paste into a feed reader. Visitors never need to open the raw XML. */
export function CopyFeedAddress({ url }: { url: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  async function copy() {
    try { await navigator.clipboard.writeText(url); setState('copied'); } catch { setState('failed'); }
    setTimeout(() => setState('idle'), 2500);
  }
  return (
    <div className="subscribe no-print">
      <label>Subscribe with a feed reader<input readOnly value={url} onFocus={(e) => e.currentTarget.select()} /></label>
      <button type="button" className="btn ghost" onClick={copy}>{state === 'copied' ? 'Copied' : state === 'failed' ? 'Select and copy manually' : 'Copy feed address'}</button>
    </div>
  );
}
