import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

type EventItem = {
  _id: string;
  name: string;
  description: string;
  date: string;
  timeBlock: string;
  location?: string;
};

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api('/events');
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setEvents([]);
      }
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Events</h1>

      <div className="mt-6 grid gap-4">
        {events.map((event) => (
          <div key={event._id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="text-xl font-semibold">{event.name}</h3>
            <p className="mt-2 text-slate-300">{event.description}</p>
            <small className="mt-3 block text-slate-400">
              {event.date} • {event.timeBlock}
            </small>
            <Link className="mt-4 inline-block text-blue-300 hover:text-blue-200" to={`/events/${event._id}`}>View details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
