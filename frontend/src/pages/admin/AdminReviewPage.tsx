import { useEffect, useState } from 'react';
import { api } from '../../api/client';

type ReviewItem = {
  _id: string;
  student?: string;
  event?: string;
  status?: string;
  score?: number;
};

export function AdminReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api('/event-scores/pending');
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      }
    }

    load();
  }, []);

  async function updateStatus(id: string, status: 'Approved' | 'Rejected') {
    await api(`/event-scores/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    setItems((current) => current.filter((item) => item._id !== id));
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Review queue</h1>

      {items.length === 0 ? (
        <p className="mt-5 text-slate-400">No pending submissions.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div key={item._id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-slate-300">Student: {item.student ?? 'Unknown'}</p>
              <p className="mt-2 text-slate-300">Event: {item.event ?? 'Unknown'}</p>
              <p className="mt-2 text-slate-300">Score: {item.score ?? 'N/A'}</p>
              <div className="mt-4 flex gap-3">
                <button className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500" onClick={() => updateStatus(item._id, 'Approved')}>Approve</button>
                <button className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500" onClick={() => updateStatus(item._id, 'Rejected')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
