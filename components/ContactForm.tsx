'use client';
import { useActionState } from 'react';
import { sendContact } from '@/app/contact/actions';
import type { ContactState } from '@/lib/contact';

const initial: ContactState = { status: 'idle' };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  const e = state.errors ?? {};
  return (
    <form action={action} className="form" noValidate>
      <label>Name<input name="name" autoComplete="name" required aria-invalid={!!e.name} aria-describedby={e.name ? 'e-name' : undefined} />{e.name && <span id="e-name" className="field-error">{e.name}</span>}</label>
      <label>Email<input name="email" type="email" autoComplete="email" required aria-invalid={!!e.email} aria-describedby={e.email ? 'e-email' : undefined} />{e.email && <span id="e-email" className="field-error">{e.email}</span>}</label>
      <label>Message<textarea name="message" required aria-invalid={!!e.message} aria-describedby={e.message ? 'e-msg' : undefined} />{e.message && <span id="e-msg" className="field-error">{e.message}</span>}</label>
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="btn" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send message'}</button>
      <div aria-live="polite">{state.status !== 'idle' && <p className={state.status === 'ok' ? 'status-ok' : 'status-err'}>{state.message}</p>}</div>
    </form>
  );
}
