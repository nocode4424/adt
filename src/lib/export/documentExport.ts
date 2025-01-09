import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  types?: string[];
}

export async function exportDocuments(options: ExportOptions) {
  const supabase = createClientComponentClient();

  try {
    // Build query
    let query = supabase
      .from('incidents')
      .select('*')
      .order('occurred_at', { ascending: false });

    // Apply date range filter
    if (options.dateRange) {
      query = query
        .gte('occurred_at', options.dateRange.start.toISOString())
        .lte('occurred_at', options.dateRange.end.toISOString());
    }

    // Apply type filter
    if (options.types && options.types.length > 0) {
      query = query.in('type', options.types);
    }

    const { data, error } = await query;
    if (error) throw error;

    switch (options.format) {
      case 'csv':
        return exportToCsv(data);
      case 'json':
        return exportToJson(data);
      case 'pdf':
        return exportToPdf(data);
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

function exportToCsv(data: any[]) {
  if (data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  // Convert each row to CSV
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }

  // Create and download file
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aurora-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportToJson(data: any[]) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aurora-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function exportToPdf(data: any[]) {
  // Use browser's print functionality for PDF export
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Aurora Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2cm; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          h1 { color: #333; }
          .meta { color: #666; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Aurora Export</h1>
        <div class="meta">
          Generated on ${format(new Date(), 'PPP')}
        </div>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}