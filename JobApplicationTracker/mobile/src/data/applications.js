export const SEED = [
  { id: '1', company: 'Linear', role: 'Product Designer', date: '2026-10-12', status: 'Interview', location: 'Remote', interview: '2026-10-20', note: 'Portfolio review with Maya went well. Next round with the design team.', color: '#25242d', logoInk: '#fff' },
  { id: '2', company: 'Vercel', role: 'Senior UX Designer', date: '2026-10-10', status: 'Applied', location: 'New York, NY', note: 'Applied through the careers page.', color: '#f0eff2', logoInk: '#393743' },
  { id: '3', company: 'Figma', role: 'Product Designer, Growth', date: '2026-10-08', status: 'In review', location: 'San Francisco, CA', note: 'Referred by Jordan. Follow up next week.', color: '#fff0ed', logoInk: '#c96f60' },
  { id: '4', company: 'Notion', role: 'Product Designer', date: '2026-10-06', status: 'Interview', location: 'Remote', interview: '2026-10-22', note: 'Recruiter screen completed. Team interview coming up.', color: '#edf0f4', logoInk: '#424651' },
  { id: '5', company: 'Stripe', role: 'Design Systems Designer', date: '2026-10-03', status: 'Rejected', location: 'Remote', note: 'Received a kind note from the hiring manager.', color: '#efedff', logoInk: '#6453c4' },
  { id: '6', company: 'Arc', role: 'Brand Designer', date: '2026-09-29', status: 'Offer', location: 'Remote', note: 'Offer received. Reviewing details.', color: '#e8f4f6', logoInk: '#4f8799' },
]
export const TABS = [
  { key: 'Home', icon: 'grid' },
  { key: 'Applications', icon: 'briefcase' },
  { key: 'Interviews', icon: 'calendar' },
  { key: 'More', icon: 'more' },
]

export const isoToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const shortDate = (value) => {
  if (!value) return 'Not set'
  const parsed = new Date(`${value}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
export const longDate = (value) => {
  if (!value) return 'Not set'
  const parsed = new Date(`${value}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
export const companyInitials = (company = '') => company.trim().split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase()
export const companyColor = (company) => SEED.find((item) => item.company.toLowerCase() === company?.toLowerCase()) || { color: '#eee8ff', logoInk: '#674db5' }

