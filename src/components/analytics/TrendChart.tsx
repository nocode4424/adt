import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { IncidentTrend } from '@/lib/types/analytics';
import { format } from 'date-fns';

interface TrendChartProps {
  trends: IncidentTrend[];
}

export function TrendChart({ trends }: TrendChartProps) {
  const data = {
    labels: trends.map(trend => format(new Date(trend.week), 'MMM d')),
    datasets: [
      {
        label: 'Incident Count',
        data: trends.map(trend => trend.incident_count),
        borderColor: 'rgb(var(--primary-500))',
        backgroundColor: 'rgba(var(--primary-500), 0.1)',
        fill: true,
      },
      {
        label: 'High Severity',
        data: trends.map(trend => trend.high_severity_count),
        borderColor: 'rgb(var(--accent-error))',
        backgroundColor: 'rgba(var(--accent-error), 0.1)',
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Incident Trends</h3>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
}