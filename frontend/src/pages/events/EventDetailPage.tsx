import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api/client';

type EventDetail = {
  _id: string;
  name: string;
  description: string;
  date: string;
  timeBlock: string;
  location?: string;
  rsvps?: string[];
};

export function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventDetail | null>(null);

  useEffect(() => {
    async function load() {
      if (!eventId) return;

      try {
        const data = await api<EventDetail>(`/events/${eventId}`);
        setEvent(data as EventDetail);
      } catch {
        setEvent(null);
      }
    }

    load();
  }, [eventId]);

  if (!event) {
    return <p className="text-slate-400">Loading event...</p>;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
      <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
      <p className="mt-3 text-slate-300">{event.description}</p>
      <p className="mt-5 text-slate-300">
        <strong>Date:</strong> {event.date}
      </p>
      <p className="mt-2 text-slate-300">
        <strong>Time block:</strong> {event.timeBlock}
      </p>
      <p className="mt-2 text-slate-300">
        <strong>RSVPs:</strong> {event.rsvps?.length ?? 0}
      </p>
    </div>
  );
}
