// lib/formatIndianDate.ts
export const getIndianFormattedDate = (date: Date = new Date()) => {
  return date.toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false, // Ensures 24-hour format
    timeZone: 'Asia/Kolkata',
  })
}


export function formatDateOnly(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}