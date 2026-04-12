export function formatINR(num) {
  if (num === 0) return '₹0';
  return '₹' + Number(num).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function generateId() {
  // Use crypto.randomUUID() to generate proper UUIDs that match Supabase's format.
  // This prevents optimistic ID mismatches during DB sync.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getDaysUntil(dateStr) {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return 0;
  const today = new Date();
  today.setHours(0,0,0,0);
  target.setHours(0,0,0,0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(l => l.trim() !== '');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    // simple split, does not handle commas inside quotes cleanly
    const currentline = lines[i].split(',');
    
    for (let j = 0; j < headers.length; j++) {
      let val = currentline[j] ? currentline[j].trim() : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      obj[headers[j]] = val;
    }
    results.push(obj);
  }
  return results;
}
