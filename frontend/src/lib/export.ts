export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  // Get all unique headers just in case
  const headers = Array.from(new Set(data.flatMap(Object.keys)));
  
  const csvData = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      let cell = row[header];
      if (cell === null || cell === undefined) cell = '';
      if (typeof cell === 'object') cell = JSON.stringify(cell);
      return `"${String(cell).replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
