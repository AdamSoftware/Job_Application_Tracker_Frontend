export const initials = s => s.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

export function money(value, currency = 'USD') {
  if (!value || Number.isNaN(Number(value))) return 'Not added';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(value));
}
export const roleStage = entry => entry.workStatus || (entry.isCurrent ? 'Current' : 'Past');

export const historyEntryFromOffer = job => ({
  id: `offer-${job.id}`,
  sourceOfferId: job.id,
  company: job.company,
  role: job.role,
  location: job.location || '',
  startDate: '',
  endDate: '',
  workStatus: 'Upcoming',
  isCurrent: false,
  currency: job.currency || 'USD',
  salary: job.salary || '',
  healthCoverage: job.healthCoverage || '',
  paidTimeOff: job.paidTimeOff || '',
  retirement: job.retirement || '',
  parentalLeave: job.parentalLeave || '',
  benefits: job.benefits || '',
  notes: job.note || ''
});
