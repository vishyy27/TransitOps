import toast from 'react-hot-toast';

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    toast.error('No records found to export');
    return;
  }
  
  toast.loading('Generating CSV download...', { id: 'csv-export' });
  
  try {
    // Get all unique headers
    const headers = Array.from(new Set(data.flatMap(Object.keys)));
    
    const csvData = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        let cell = row[header];
        if (cell === null || cell === undefined) cell = '';
        if (typeof cell === 'object') {
          try {
            cell = JSON.stringify(cell);
          } catch {
            cell = String(cell);
          }
        }
        return `"${String(cell).replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    // Add UTF-8 BOM prefix for Excel compatibility
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast.success('Download started!', { id: 'csv-export' });
  } catch (e: any) {
    toast.error(`Export failed: ${e.message}`, { id: 'csv-export' });
  }
}
