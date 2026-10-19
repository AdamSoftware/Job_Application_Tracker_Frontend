import { toDateKey } from './dateUtils.js';

export function getSafeMeetingLink(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export function getInterviewRounds(job) {
  if (Array.isArray(job.interviews) && job.interviews.length) return job.interviews;
  if (!job.interview) return [];
  return [{
    id: `legacy-${job.id}`,
    date: job.interview,
    interviewer: job.interviewer || job.interviewFormat || '',
    questionsToAsk: job.questionsToAsk || '',
    prepNotes: job.prepNotes || '',
    interviewType: job.interviewFormat || '',
    roundNumber: 1,
    description: '',
    outcome: 'Scheduled',
    reflection: ''
  }];
}

// Keep applications with active interview rounds visible, including those
// waiting for a response in the separate Pending pipeline stage.
export function isInterviewInProgress(job) {
  if (job.status === 'Interview' || job.status === 'Pending') return true;
  if (job.status !== 'In review') return false;
  const today = toDateKey(new Date());
  return getInterviewRounds(job).some(round => {
    // Keep completed conversations visible while the application is waiting on
    // a response or needs a follow-up, so they remain available in Pending.
    if (['Needs follow-up', 'Waiting to hear back'].includes(round.outcome)) return true;
    const date = round.date || round.interview || '';
    return date >= today && (!round.outcome || round.outcome === 'Scheduled');
  });
}

export function getInterviewEvents(jobs) {
  return jobs.flatMap(job => getInterviewRounds(job).map((round, index) => ({
    ...job,
    ...round,
    interview: round.date || round.interview || '',
    interviewId: round.id || `${job.id}-round-${index + 1}`,
    interviewRound: round.label || `Round ${round.roundNumber || index + 1}`,
    roundNumber: Number(round.roundNumber) || index + 1
  })).filter(interview => interview.interview));
}
