import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 md:flex-row">
      <aside className="flex w-full flex-col gap-6 border-b border-slate-800 bg-slate-900/90 p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r md:p-6">
        <div className="text-xl font-bold tracking-tight">Science Olympiad</div>

        <nav className="flex flex-col gap-2">
          <NavLink className={({ isActive }) => `rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white ${isActive ? 'bg-blue-600/20 text-white' : 'text-slate-300'}`} to="/dashboard">Dashboard</NavLink>
          <NavLink className={({ isActive }) => `rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white ${isActive ? 'bg-blue-600/20 text-white' : 'text-slate-300'}`} to="/events">Events</NavLink>
          {(user?.role === 0 || user?.role === 1) && (
            <NavLink className={({ isActive }) => `rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white ${isActive ? 'bg-blue-600/20 text-white' : 'text-slate-300'}`} to="/admin/review">Review Queue</NavLink>
          )}
        </nav>

        <button onClick={logout} className="mt-auto rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500">
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
