'use client';
import { useState } from 'react';

export function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  async function copy() {
    try { await navigator.clipboard.writeText(code); setState('copied'); } catch { setState('failed'); }
    setTimeout(() => setState('idle'), 2000);
  }
  return (
    <button type="button" className="copy-btn no-print" onClick={copy} aria-label="Copy code to clipboard">
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}</span>
    </button>
  );
}
