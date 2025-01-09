import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Download, FileJson, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

type ExportFormat = 'json' | 'csv';
type DataType = 'incidents' | 'expenses' | 'assets' | 'all';

export function DataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('json');
  const [dataType, setDataType] = useState<DataType>('all');
  const supabase = createClientComponentClient();

  const exportData = async () => {
    try {
      setIsExporting(true);

      const tables = dataType === 'all' 
        ? ['incidents', 'expenses', 'assets']
        : [dataType];

      const data: Record<string, any> = {};

      for (const table of tables) {
        const { data: tableData, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        data[table] = tableData;
      }

      if (format === 'json') {
        downloadJson(data);
      } else {
        downloadCsv(data);
      }

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadJson = (data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, 'aurora-export.json');
  };

  const downloadCsv = (data: Record<string, any[]>) => {
    const csvContent = Object.entries(data).map(([table, records]) => {
      if (records.length === 0) return '';

      const headers = Object.keys(records[0]).join(',');
      const rows = records.map(record => 
        Object.values(record).map(value => 
          typeof value === 'string' ? `"${value}"` : value
        ).join(',')
      );

      return `# ${table}\n${headers}\n${rows.join('\n')}\n`;
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, 'aurora-export.csv');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Export Data</h3>
        <div className="flex items-center space-x-2">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="rounded-md border-neutral-300"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
            className="rounded-md border-neutral-300"
          >
            <option value="all">All Data</option>
            <option value="incidents">Incidents Only</option>
            <option value="expenses">Expenses Only</option>
            <option value="assets">Assets Only</option>
          </select>
          <Button
            onClick={exportData}
            disabled={isExporting}
          >
            {isExporting ? (
              'Exporting...'
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-lg p-4 text-sm text-neutral-600">
        <h4 className="font-medium mb-2">Export Format Details:</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <FileJson className="h-4 w-4 mr-2 text-primary-500" />
            <span>JSON: Full data export with nested structures</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-primary-500" />
            <span>CSV: Flattened data format, ideal for spreadsheets</span>
          </div>
        </div>
      </div>
    </div>
  );
}