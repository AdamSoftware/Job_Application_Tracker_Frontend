const dateAfter = days => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const demoJobs = [
  {
    id: 'demo-linear-research',
    company: 'Linear',
    role: 'Product Design Systems',
    date: dateAfter(-7),
    status: 'In review',
    location: 'Remote',
    note: 'Sample application showing how multiple roles at one company are grouped.',
    followUpDate: dateAfter(3),
    followUpAction: 'Sample reminder · check in with the design recruiter'
  },
  {
    id: 'demo-interview-role',
    company: 'Northstar Health',
    role: 'Senior Product Designer',
    date: dateAfter(-12),
    status: 'Interview',
    location: 'Chicago, IL · Hybrid',
    note: 'Sample interview application for previewing prep and calendar details.',
    interview: dateAfter(2),
    interviewer: 'Taylor Morgan · Design Director · video call',
    questionsToAsk: 'How does the team learn from patients and care teams?',
    prepNotes: 'Sample prep: bring a story about simplifying a complex workflow and the results it created.',
    followUpDate: dateAfter(1),
    followUpAction: 'Send Taylor a thank-you note and confirm next steps',
    interviews: [
      {
        id: 'demo-northstar-round-1',
        roundNumber: 1,
        label: 'Recruiter conversation',
        interviewType: 'Phone screen',
        date: dateAfter(-8),
        interviewer: 'Taylor Morgan · Design Director',
        description: 'A 30-minute introduction to my background, design experience, and interest in Northstar Health.',
        outcome: 'Went well',
        questionsAsked: 'What kind of product teams have I partnered with? What drew me to healthcare design?',
        questionsToAsk: 'How does the design team work with clinicians and patients?',
        prepNotes: 'Prepare a concise career overview and explain why patient-centered design matters to me.',
        reflection: 'The conversation felt warm. My example about simplifying appointment scheduling seemed to resonate.'
      },
      {
        id: 'demo-northstar-round-2',
        roundNumber: 2,
        label: 'Portfolio & product discussion',
        interviewType: 'Portfolio review',
        date: dateAfter(-2),
        interviewer: 'Taylor Morgan and a product designer · video call',
        meetingLink: 'https://example.com/demo-northstar-meeting',
        description: 'Walk through a patient intake project, explain key tradeoffs, and discuss collaboration with product and engineering.',
        outcome: 'Needs follow-up',
        questionsAsked: 'How did I validate the new intake flow? What would I change with more time?',
        questionsToAsk: 'What would success look like for this role in the first 90 days?',
        prepNotes: 'Bring the before-and-after flow and the usability findings.',
        reflection: 'Send a thank-you note with the accessibility case study I mentioned.'
      },
      {
        id: 'demo-northstar-round-3',
        roundNumber: 3,
        label: 'Cross-functional panel',
        interviewType: 'Panel interview',
        date: dateAfter(3),
        interviewer: 'Design, product, and engineering · video call',
        meetingLink: 'https://example.com/demo-northstar-panel',
        description: 'A panel conversation about working across disciplines, handling feedback, and measuring design impact.',
        outcome: 'Scheduled',
        questionsToAsk: 'How are product decisions made when clinical needs and business goals conflict?',
        prepNotes: 'Prepare examples about collaboration, difficult tradeoffs, and measurable outcomes.'
      }
    ]
  },
  {
    id: 'demo-offer-pending',
    company: 'Juniper Works',
    role: 'Lead Experience Designer',
    date: dateAfter(-25),
    status: 'Offer',
    location: 'Remote',
    note: 'Sample offer for trying the package comparison tools.',
    currency: 'USD',
    salary: '148000',
    signingBonus: '12000',
    equity: '18000',
    healthCoverage: 'Medical, dental, and vision with most premiums covered',
    paidTimeOff: 'Flexible PTO · 12 company holidays',
    retirement: '401(k) with 4% company match',
    parentalLeave: '12 weeks paid parental leave',
    benefits: '$1,500 annual learning budget · home office stipend',
    offerDeadline: dateAfter(12)
  },
  {
    id: 'demo-offer-alternative',
    company: 'Briar Labs',
    role: 'Product Research Lead',
    date: dateAfter(-19),
    status: 'Offer',
    location: 'Seattle, WA · Hybrid',
    note: 'Sample alternative offer with a different mix of salary, equity, and time off.',
    currency: 'USD',
    salary: '135000',
    signingBonus: '5000',
    equity: '25000',
    healthCoverage: 'Medical, dental, and vision · low employee premiums',
    paidTimeOff: '25 days PTO · flexible Fridays in summer',
    retirement: '401(k) with 3% company match',
    parentalLeave: '16 weeks paid parental leave',
    benefits: '$2,000 annual learning budget · wellness stipend',
    offerDeadline: dateAfter(9)
  },
  {
    id: 'demo-offer-accepted',
    company: 'Clover Creative',
    role: 'Senior Visual Designer',
    date: dateAfter(-40),
    status: 'Accepted',
    location: 'Austin, TX · Remote',
    note: 'Sample accepted offer. This creates an upcoming role in work history.',
    currency: 'USD',
    salary: '126000',
    signingBonus: '8000',
    equity: '10000',
    healthCoverage: 'Medical, dental, and vision · HSA contribution',
    paidTimeOff: '20 days PTO · 10 company holidays',
    retirement: '401(k) with 5% company match',
    parentalLeave: '16 weeks paid parental leave',
    benefits: '$1,000 creative equipment budget · annual conference stipend',
    offerDeadline: dateAfter(-3)
  }
];

export const demoWorkHistory = [
  {
    id: 'demo-work-past',
    company: 'Moss & Pine Studio',
    role: 'Visual Designer',
    location: 'Madison, WI',
    startDate: '2021-04-12',
    endDate: '2023-08-31',
    workStatus: 'Past',
    isCurrent: false,
    endReason: 'Role ended',
    currency: 'USD',
    salary: '76000',
    notes: 'Sample role · built campaign systems and helped onboard two junior designers.'
  },
  {
    id: 'demo-work-current',
    company: 'Moss & Pine Studio',
    role: 'Senior Visual Designer',
    location: 'Madison, WI · Hybrid',
    startDate: '2023-09-01',
    endDate: '',
    workStatus: 'Current',
    isCurrent: true,
    currency: 'USD',
    salary: '98000',
    notes: 'Sample role · leads product launches and brand collaborations.'
  }
];

export const demoContacts = [
  {
    id: 'demo-contact-linear',
    name: 'Maya Chen',
    title: 'Senior Design Recruiter',
    company: 'Linear',
    jobId: 1,
    email: 'maya.chen@example.com',
    phone: '(555) 014-2084',
    linkedin: 'https://www.linkedin.com/',
    notes: 'Sample contact · connected after a portfolio review. Prefers email for follow-ups.'
  },
  {
    id: 'demo-contact-northstar',
    name: 'Taylor Morgan',
    title: 'Design Director',
    company: 'Northstar Health',
    jobId: 'demo-interview-role',
    email: 'taylor.morgan@example.com',
    phone: '',
    linkedin: 'https://www.linkedin.com/',
    notes: 'Sample contact · interviewing manager. Ask about team collaboration and patient research.'
  },
  {
    id: 'demo-contact-clover',
    name: 'Jordan Rivera',
    title: 'People Partner',
    company: 'Clover Creative',
    jobId: 'demo-offer-accepted',
    email: 'jordan.rivera@example.com',
    phone: '',
    linkedin: '',
    notes: 'Sample contact · can answer questions about benefits and first-week onboarding.'
  }
];
