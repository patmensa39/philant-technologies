'use client';
import { useRef, useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import { sendContact } from '@/app/contact/actions';
import { contactSchema, fieldErrors, type ContactField } from '@/lib/contact';

const empty = { name: '', email: '', subject: '', message: '', website: '' };
type Errors = Partial<Record<ContactField, string>>;
const ORDER: ContactField[] = ['name', 'email', 'subject', 'message'];

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<{ status: 'ok' | 'error'; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    if (errors[e.target.name as ContactField]) setErrors((x) => ({ ...x, [e.target.name]: undefined }));
  };

  const focusFirst = (errs: Errors) => {
    const first = ORDER.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return; // prevents duplicate submissions
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs); setResult({ status: 'error', message: 'Please fix the highlighted fields and try again.' }); focusFirst(errs);
      return;
    }
    setErrors({}); setResult(null);
    startTransition(async () => {
      try {
        const r = await sendContact(values);
        setResult({ status: r.status, message: r.message });
        if (r.status === 'ok') setValues(empty);
        else if (r.errors) { setErrors(r.errors); focusFirst(r.errors); }
      } catch {
        setResult({ status: 'error', message: 'Your message could not be sent. Please check your connection and try again.' });
      }
    });
  }

  const field = (name: ContactField, label: string, props: { type?: string; autoComplete?: string; multiline?: boolean }) => {
    const id = `c-${name}`;
    const common = { id, name, value: values[name], onChange, 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `${id}-err` : undefined, disabled: pending, required: true } as const;
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        {props.multiline ? <textarea {...common} rows={7} /> : <input {...common} type={props.type ?? 'text'} autoComplete={props.autoComplete} />}
        {errors[name] && <span id={`${id}-err`} className="field-error">{errors[name]}</span>}
      </div>
    );
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="form" noValidate aria-busy={pending}>
      {field('name', 'Full name', { autoComplete: 'name' })}
      {field('email', 'Email address', { type: 'email', autoComplete: 'email' })}
      {field('subject', 'Subject', {})}
      {field('message', 'Message', { multiline: true })}
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} /></label></div>
      <button className="btn" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send message'}</button>
      <div role="status" aria-live="polite">{result && <p className={result.status === 'ok' ? 'status-ok' : 'status-err'}>{result.message}</p>}</div>
    </form>
  );
}
