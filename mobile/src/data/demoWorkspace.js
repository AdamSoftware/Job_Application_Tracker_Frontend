import { isoToday } from './applications'

const relativeDate = (offset) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const createDemoWorkspace = () => {
  const today = isoToday()
  const applications = [
    { id: 'linear-product', company: 'Linear', role: 'Product Designer', date: relativeDate(-7), status: 'Interview', location: 'Remote', interview: relativeDate(2), note: 'Portfolio review with Maya went well. Next round with the design team.', interviews: [{ id: 'linear-round-1', roundNumber: 1, label: 'Portfolio review', interviewType: 'Portfolio review', date: relativeDate(2), interviewer: 'Maya Chen · Senior Design Recruiter', meetingLink: 'https://example.com/meeting', description: 'Walk through two product design projects and discuss tradeoffs.', outcome: 'Scheduled', questionsToAsk: 'How does design partner with product and engineering?', questionsAsked: '', prepNotes: 'Choose two projects and prepare impact, tradeoffs, and what I learned.', reflection: '' }] },
    { id: 'linear-systems', company: 'Linear', role: 'Product Design Systems', date: relativeDate(-10), status: 'In review', location: 'Remote', note: 'A second role at Linear, grouped beneath the same company.' },
    { id: 'vercel-senior-ux', company: 'Vercel', role: 'Senior UX Designer', date: relativeDate(-9), status: 'Applied', location: 'New York, NY', note: 'Applied through the careers page.', followUpDate: relativeDate(4), followUpAction: 'Check in about the application timeline' },
    { id: 'figma-growth', company: 'Figma', role: 'Product Designer, Growth', date: relativeDate(-12), status: 'Pending', location: 'San Francisco, CA', note: 'Waiting to hear after the first conversation.', followUpDate: relativeDate(-1), followUpAction: 'Email recruiter about the application timeline', interviews: [{ id: 'figma-round-1', roundNumber: 1, label: 'Recruiter conversation', interviewType: 'Recruiter screen', date: relativeDate(-5), interviewer: 'Jordan Lee · Recruiter', description: 'Talked through experience and the product design role.', outcome: 'Waiting to hear back', questionsAsked: 'What product areas have I worked on?', questionsToAsk: 'How is the growth team structured?', prepNotes: 'Review recent product launches.', reflection: 'Send a thank-you note and wait for next steps.' }] },
    { id: 'notion-product', company: 'Notion', role: 'Product Designer', date: relativeDate(-15), status: 'Interview', location: 'Remote', interview: relativeDate(5), note: 'Recruiter screen completed. Team interview coming up.', interviews: [{ id: 'notion-round-2', roundNumber: 2, label: 'Product team conversation', interviewType: 'Video interview', date: relativeDate(5), interviewer: 'Product design team · video call', description: 'Discuss a cross-functional product project and collaboration style.', outcome: 'Scheduled', questionsToAsk: 'What does success look like in the first six months?', prepNotes: 'Review product principles and prepare a cross-functional example.' }] },
    { id: 'northstar-health', company: 'Northstar Health', role: 'Senior Product Designer', date: relativeDate(-20), status: 'Interview', location: 'Chicago, IL · Hybrid', interview: relativeDate(3), note: 'Interview process with three rounds. Follow up with Taylor after the panel.', followUpDate: relativeDate(1), followUpAction: 'Send Taylor a thank-you note and confirm next steps', interviews: [
      { id: 'northstar-1', roundNumber: 1, label: 'Recruiter conversation', interviewType: 'Phone screen', date: relativeDate(-8), interviewer: 'Taylor Morgan · Design Director', description: 'Introduction to my background and interest in healthcare design.', outcome: 'Went well', questionsAsked: 'What drew me to healthcare design?', questionsToAsk: 'How does the design team work with clinicians?', prepNotes: 'Prepare a concise career overview.', reflection: 'The conversation felt warm.' },
      { id: 'northstar-2', roundNumber: 2, label: 'Portfolio discussion', interviewType: 'Portfolio review', date: relativeDate(-2), interviewer: 'Taylor Morgan and a product designer', meetingLink: 'https://example.com/northstar', description: 'Walk through a patient intake project and key tradeoffs.', outcome: 'Needs follow-up', questionsAsked: 'How did I validate the new intake flow?', questionsToAsk: 'What would success look like in the first 90 days?', prepNotes: 'Bring the before-and-after flow.', reflection: 'Send a thank-you note with the accessibility case study.' },
      { id: 'northstar-3', roundNumber: 3, label: 'Cross-functional panel', interviewType: 'Panel interview', date: relativeDate(3), interviewer: 'Design, product, and engineering', description: 'Discuss collaboration, feedback, and measuring design impact.', outcome: 'Scheduled', questionsToAsk: 'How are decisions made when clinical needs and business goals conflict?', prepNotes: 'Prepare examples about collaboration and tradeoffs.' },
    ] },
    { id: 'stripe-design-systems', company: 'Stripe', role: 'Design Systems Designer', date: relativeDate(-24), status: 'Rejected', location: 'Remote', note: 'Received a kind note from the hiring manager.' },
    { id: 'arc-brand', company: 'Arc', role: 'Brand Designer', date: relativeDate(-30), status: 'Offer', location: 'Remote', note: 'Offer received. Reviewing details.', currency: 'USD', salary: '132000', signingBonus: '10000', equity: '15000', healthCoverage: 'Medical, dental, and vision', paidTimeOff: '20 days paid time off', retirement: '401(k) match', benefits: 'Learning and development stipend', offerDeadline: relativeDate(7) },
    { id: 'juniper-lead', company: 'Juniper Works', role: 'Lead Experience Designer', date: relativeDate(-35), status: 'Offer', location: 'Remote', note: 'Sample offer package for comparison.', currency: 'USD', salary: '148000', signingBonus: '12000', equity: '18000', healthCoverage: 'Medical, dental, and vision with most premiums covered', paidTimeOff: 'Flexible PTO · 12 company holidays', retirement: '401(k) with 4% company match', parentalLeave: '12 weeks paid parental leave', benefits: '$1,500 annual learning budget · home office stipend', offerDeadline: relativeDate(12) },
    { id: 'briar-research', company: 'Briar Labs', role: 'Product Research Lead', date: relativeDate(-40), status: 'Offer', location: 'Seattle, WA · Hybrid', note: 'Alternative package with a different mix of salary, equity, and time off.', currency: 'USD', salary: '135000', signingBonus: '5000', equity: '25000', healthCoverage: 'Medical, dental, and vision · low employee premiums', paidTimeOff: '25 days PTO · flexible Fridays in summer', retirement: '401(k) with 3% company match', parentalLeave: '16 weeks paid parental leave', benefits: '$2,000 annual learning budget · wellness stipend', offerDeadline: relativeDate(9) },
    { id: 'clover-visual', company: 'Clover Creative', role: 'Senior Visual Designer', date: relativeDate(-50), status: 'Accepted', location: 'Austin, TX · Remote', note: 'Sample accepted offer. This is shown in work history.', currency: 'USD', salary: '126000', signingBonus: '8000', equity: '10000', healthCoverage: 'Medical, dental, and vision · HSA contribution', paidTimeOff: '20 days PTO · 10 company holidays', retirement: '401(k) with 5% company match', parentalLeave: '16 weeks paid parental leave', benefits: '$1,000 creative equipment budget', offerDeadline: relativeDate(-3) },
  ]

  const workHistory = [
    { id: 'moss-past', company: 'Moss & Pine Studio', role: 'Visual Designer', location: 'Madison, WI', startDate: '2021-04-12', endDate: '2023-08-31', workStatus: 'Past', isCurrent: false, endReason: 'Role ended', currency: 'USD', salary: '76000', notes: 'Built campaign systems and helped onboard two junior designers.' },
    { id: 'moss-current', company: 'Moss & Pine Studio', role: 'Senior Visual Designer', location: 'Madison, WI · Hybrid', startDate: '2023-09-01', endDate: '', workStatus: 'Current', isCurrent: true, currency: 'USD', salary: '98000', notes: 'Leads product launches and brand collaborations.' },
    { id: 'clover-upcoming', company: 'Clover Creative', role: 'Senior Visual Designer', location: 'Austin, TX · Remote', startDate: relativeDate(14), endDate: '', workStatus: 'Upcoming', isCurrent: false, sourceOfferId: 'clover-visual', currency: 'USD', salary: '126000' },
  ]
  const contacts = [
    { id: 'maya-chen', name: 'Maya Chen', title: 'Senior Design Recruiter', company: 'Linear', jobId: 'linear-product', email: 'maya.chen@example.com', phone: '(555) 014-2084', linkedin: 'https://www.linkedin.com/', notes: 'Connected after a portfolio review. Prefers email for follow-ups.' },
    { id: 'taylor-morgan', name: 'Taylor Morgan', title: 'Design Director', company: 'Northstar Health', jobId: 'northstar-health', email: 'taylor.morgan@example.com', linkedin: 'https://www.linkedin.com/', notes: 'Ask about team collaboration and patient research.' },
    { id: 'jordan-rivera', name: 'Jordan Rivera', title: 'People Partner', company: 'Clover Creative', jobId: 'clover-visual', email: 'jordan.rivera@example.com', notes: 'Can answer questions about benefits and onboarding.' },
  ]
  const portfolio = [
    { id: 'portrait-series', title: 'Golden Hour Portraits', context: 'Photography · Sample project', description: 'An editorial portrait series focused on natural light, relaxed direction, and warm color.', images: [], imageAlts: [], skills: ['Portrait photography', 'Natural lighting', 'Photo editing'], links: [], isDemo: true },
    { id: 'community-finder', title: 'Community Resource Finder', context: 'Web development · Sample project', description: 'A responsive directory concept that helps people find nearby community services.', images: [], imageAlts: [], skills: ['React', 'Accessible UI', 'Responsive design'], links: [{ label: 'Live demo', url: 'https://example.com/' }, { label: 'Source code', url: 'https://github.com/' }], isDemo: true },
    { id: 'arts-campaign', title: 'Neighborhood Arts Campaign', context: 'Visual design · Sample project', description: 'A sample campaign system for a local arts event with a consistent visual identity.', images: [], imageAlts: [], skills: ['Visual design', 'Brand systems'], links: [], isDemo: true },
  ]
  const studyNotes = [
    { id: 'study-questions', title: 'Questions worth asking the team', category: 'Study notes', content: 'What would success look like in the first 90 days?\nHow does the team share feedback?\nWhat challenge could someone in this role help solve?', linkedInterviewId: '', createdAt: today, updatedAt: today, isExample: true },
    { id: 'study-story', title: 'A clearer project story', category: 'Questions to practice', content: 'Practice a short story with four parts: the problem, my role, the choices I made, and the result. Keep one specific measure ready to explain the impact.', linkedInterviewId: 'linear-round-1', createdAt: today, updatedAt: today, isExample: true },
    { id: 'study-well', title: 'Remember what went well', category: 'What went well', content: 'I explained the tradeoffs clearly and gave the interviewer room to ask follow-up questions. Bring that same calm pace into the next conversation.', linkedInterviewId: 'northstar-2', createdAt: today, updatedAt: today, isExample: true },
  ]
  return {
    schemaVersion: 1,
    applications,
    contacts,
    workHistory,
    portfolio,
    studyNotes,
    profile: { name: 'Alex Steinberg', email: 'alex@example.com', targetRoles: ['Product design'], currency: 'USD' },
    preferences: { darkMode: true, largeText: true, showStats: true, showQuotes: true },
    lastSyncedAt: null,
  }
}
