import { useState } from 'react';
import { api } from '../../api/client';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    await api('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ emailAddress: email }),
    });

    setMessage('Reset link sent. Check your email.');
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-black/20">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Reset password</h1>
        <input
          type="email"
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500">Send reset link</button>
        {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
      </form>
    </div>
  );
}
