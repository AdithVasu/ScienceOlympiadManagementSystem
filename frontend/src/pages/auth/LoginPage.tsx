import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../types';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ emailAddress: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const result = await api<{ accessToken: string; role: Role }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      login(result.accessToken, result.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-black/20">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Sign in</h1>
        {error && <div className="mb-4 rounded-lg border border-red-400/40 bg-red-950/40 px-3 py-2 text-red-200">{error}</div>}

        <input
          type="email"
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Email address"
          value={form.emailAddress}
          onChange={(e) => setForm((prev) => ({ ...prev, emailAddress: e.target.value }))}
        />

        <input
          type="password"
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500">Login</button>

        <div className="mt-5 flex justify-between gap-3 text-sm">
          <Link className="text-blue-300 hover:text-blue-200" to="/forgot-password">Forgot password?</Link>
          <Link className="text-blue-300 hover:text-blue-200" to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
