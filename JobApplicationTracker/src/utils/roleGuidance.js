const roleGuidance = [
  {
    match: /developer|engineer|programmer|software|frontend|front-end|backend|back-end|full.stack|data scientist|qa engineer|devops|it specialist/i,
    name: 'technology',
    label: 'Technology',
    focus: 'Keep technical roles, recruiter conversations, and interview stages organized.',
    prep: 'Review the role requirements, prepare examples of your work, and note questions about the team and tools.'
  },
  {
    match: /photograph|videograph|cinematograph|camera operator|photo editor/i,
    name: 'photography',
    label: 'Photography & media',
    focus: 'Keep creative roles, client conversations, and portfolio follow-ups together.',
    prep: 'Choose relevant portfolio samples, confirm usage rights, and prepare to explain your process and delivery.'
  },
  {
    match: /manager|director|supervisor|team lead|operations|project manager|store manager/i,
    name: 'management',
    label: 'Management & operations',
    focus: 'Keep leadership opportunities, decision makers, and follow-up commitments in view.',
    prep: 'Prepare examples of how you supported a team, handled a challenge, and improved a result.'
  },
  {
    match: /factory|manufactur|warehouse|production|assembly|machine operator|industrial|plant worker|forklift/i,
    name: 'production',
    label: 'Production & hands-on work',
    focus: 'Track shifts, locations, hiring contacts, and the next step for every opening.',
    prep: 'Note relevant equipment, safety training, certifications, shift availability, and start date.'
  },
  {
    match: /nurse|doctor|medical|healthcare|caregiver|pharmacist|therapist|clinical/i,
    name: 'healthcare',
    label: 'Healthcare',
    focus: 'Keep care roles, credentials, interviews, and hiring contacts organized.',
    prep: 'Check required credentials and prepare examples of safe, compassionate, effective care.'
  },
  {
    match: /teacher|educator|instructor|professor|school counselor/i,
    name: 'education',
    label: 'Education',
    focus: 'Track schools, teaching roles, application requirements, and interview dates.',
    prep: 'Review the school community and prepare examples of how you help learners make progress.'
  },
  {
    match: /sales|account executive|business development|customer success|recruiter/i,
    name: 'sales',
    label: 'Sales & customer teams',
    focus: 'Keep customer-facing roles, hiring contacts, and follow-up dates easy to find.',
    prep: 'Prepare a clear example of building trust, solving a customer need, and reaching a goal.'
  }
];

export function getRoleGuidance(roles = []) {
  const roleText = roles.join(' ');
  const match = roleGuidance.find(guidance => guidance.match.test(roleText));
  return match || {
    name: 'general',
    label: roleText ? 'Your career search' : 'Your job search',
    focus: 'Keep every opportunity, conversation, and next step together in one place.',
    prep: 'Review the role requirements and prepare examples of your experience that fit the work.'
  };
}
