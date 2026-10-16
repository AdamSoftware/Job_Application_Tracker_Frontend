export const initialJobs = [{
  id: 1,
  company: 'Linear',
  role: 'Product Designer',
  date: '2026-10-12',
  status: 'Interview',
  location: 'Remote',
  note: 'Portfolio review with Maya went well. Next round with the design team.',
  interview: '2026-10-20',
  interviewer: 'Design team · portfolio review',
  questionsToAsk: 'How does design partner with product and engineering?',
  prepNotes: 'Choose two portfolio projects and prepare the impact, tradeoffs, and what you learned.'
}, {
  id: 2,
  company: 'Vercel',
  role: 'Senior UX Designer',
  date: '2026-10-10',
  status: 'Applied',
  location: 'New York, NY',
  note: 'Applied through careers page.'
}, {
  id: 3,
  company: 'Figma',
  role: 'Product Designer, Growth',
  date: '2026-10-08',
  status: 'In review',
  location: 'San Francisco, CA',
  note: 'Referred by Jordan. Follow up next week.',
  followUpDate: '2026-10-19',
  followUpAction: 'Email recruiter about the application timeline'
}, {
  id: 4,
  company: 'Notion',
  role: 'Product Designer',
  date: '2026-10-06',
  status: 'Interview',
  location: 'Remote',
  note: 'Recruiter screen completed. Team interview coming up.',
  interview: '2026-10-22',
  interviewer: 'Product team · video call',
  questionsToAsk: 'What does success look like in the first six months?',
  prepNotes: 'Review the product principles and prepare one example of a cross-functional project.'
}, {
  id: 5,
  company: 'Stripe',
  role: 'Design Systems Designer',
  date: '2026-10-03',
  status: 'Rejected',
  location: 'Remote',
  note: 'Received a kind note from the hiring manager.'
}, {
  id: 6,
  company: 'Arc',
  role: 'Brand Designer',
  date: '2026-09-29',
  status: 'Offer',
  location: 'Remote',
  note: 'Offer received. Reviewing details.',
  currency: 'USD',
  salary: '132000',
  signingBonus: '10000',
  equity: '15000',
  healthCoverage: 'Medical, dental, and vision',
  paidTimeOff: '20 days paid time off',
  retirement: '401(k) match',
  parentalLeave: '',
  benefits: 'Learning and development stipend',
  offerDeadline: '2026-10-30'
}];

export const statuses = ['Applied', 'In review', 'Interview', 'Offer', 'Accepted', 'Rejected'];

export const isOfferStatus = status => status === 'Offer' || status === 'Accepted';

export const reminderQuotes = ['You don’t have to see the whole staircase. Just take the first step.', 'Progress can be as simple as showing up again today.', 'Your experience has value, even when the search takes time.', 'Every conversation helps you learn what the right fit feels like.', 'One thoughtful application can open an unexpected door.'];
