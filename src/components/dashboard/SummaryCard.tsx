import { Card, CardHeader, CardContent } from '../ui/Card';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useIncidentSummary, useRefreshSummary } from '@/lib/supabase/hooks';

interface SummaryCardProps {
  userId: string;
  title: string;
  value: number | string;
  description: string;
}

export function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <Card className="bg-white transition-all hover:shadow-md">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-primary-600 mb-2">{value}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SummaryGrid({ userId }: { userId: string }) {
  const { data: summary, isLoading } = useIncidentSummary(userId);
  const { mutate: refreshSummary, isLoading: isRefreshing } = useRefreshSummary();

  if (isLoading) {
    return <div>Loading summary...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-neutral-900">Monthly Summary</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshSummary()}
          disabled={isRefreshing}
          className="text-neutral-600 hover:text-primary-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          userId={userId}
          title="Total Incidents"
          value={summary?.total_incidents || 0}
          description="Recorded this month"
        />
        <SummaryCard
          userId={userId}
          title="Unique Types"
          value={summary?.unique_types || 0}
          description="Different categories"
        />
        <SummaryCard
          userId={userId}
          title="Average Sentiment"
          value={(summary?.avg_sentiment || 0).toFixed(2)}
          description="Overall mood"
        />
        <SummaryCard
          userId={userId}
          title="High Priority"
          value={summary?.high_priority_count || 0}
          description="Critical incidents"
        />
      </div>
    </div>
  );
}