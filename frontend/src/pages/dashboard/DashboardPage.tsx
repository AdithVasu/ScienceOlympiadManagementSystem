import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';

type DashboardSummary = {
  totalEvents: number;
  upcomingEvents: number;
  pendingReviews: number;
  approvedHours: number;
};

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary>({
    totalEvents: 0,
    upcomingEvents: 0,
    pendingReviews: 0,
    approvedHours: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const [eventData, reviewData] = await Promise.all([
          api('/events'),
          api('/event-scores/pending'),
        ]);

        const events = Array.isArray(eventData) ? eventData : [];
        const reviews = Array.isArray(reviewData) ? reviewData : [];

        setSummary({
          totalEvents: events.length,
          upcomingEvents: events.filter((event: any) => new Date(event.date) >= new Date()).length,
          pendingReviews: reviews.length,
          approvedHours: 0,
        });
      } catch {
        setSummary({ totalEvents: 0, upcomingEvents: 0, pendingReviews: 0, approvedHours: 0 });
      }
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.firstName ?? 'Volunteer'}</h1>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total events" value={summary.totalEvents} />
        <StatCard title="Upcoming" value={summary.upcomingEvents} />
        <StatCard title="Pending reviews" value={summary.pendingReviews} />
        <StatCard title="Approved hours" value={summary.approvedHours} />
      </div>
    </div>
  );
}
