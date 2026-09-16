import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    await api('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    navigate('/login');
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-black/20">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Create account</h1>

        <input
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
        />

        <input
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
        />

        <input
          type="email"
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Email address"
          value={form.emailAddress}
          onChange={(e) => setForm((prev) => ({ ...prev, emailAddress: e.target.value }))}
        />

        <input
          type="password"
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />

        <input
          type="password"
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
        />

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500">Register</button>
      </form>
    </div>
  );
}
