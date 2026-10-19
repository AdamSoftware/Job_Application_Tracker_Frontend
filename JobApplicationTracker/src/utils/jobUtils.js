export const initials = s => s.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

export function money(value, currency = 'USD') {
  if (!value || Number.isNaN(Number(value))) return 'Not added';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(value));
}

export function convertCurrencyAmount(value, sourceCurrency, displayCurrency, rates = {}) {
  const amount = Number(value);
  const source = sourceCurrency || 'USD';
  const target = displayCurrency || source;
  if (!Number.isFinite(amount)) return null;
  if (source === target) return amount;
  const sourceRate = source === 'USD' ? 1 : rates[source];
  const targetRate = target === 'USD' ? 1 : rates[target];
  if (!sourceRate || !targetRate) return null;
  return amount / sourceRate * targetRate;
}

export function moneyInCurrency(value, sourceCurrency, displayCurrency, rates = {}) {
  const converted = convertCurrencyAmount(value, sourceCurrency, displayCurrency, rates);
  return converted === null
    ? money(value, sourceCurrency || 'USD')
    : money(converted, displayCurrency || sourceCurrency || 'USD');
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
