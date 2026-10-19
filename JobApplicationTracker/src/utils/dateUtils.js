export const prettyDate = s => s ? new Date(`${s}T12:00:00`).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric'
}) : '—';

export const historyDate = s => s ? new Date(`${s}T12:00:00`).toLocaleDateString('en-US', {
  month: 'short',
  year: 'numeric'
}) : '—';

export const googleEventUrl = job => {
  const start = job.interview.replaceAll('-', '');
  const endDate = new Date(`${job.interview}T12:00:00`);
  endDate.setDate(endDate.getDate() + 1);
  const end = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${job.company} · ${job.role} · Round ${job.roundNumber || 1} · ${job.interviewType || 'interview'}`,
    dates: `${start}/${end}`,
    details: [job.description, job.interviewer, job.meetingLink && `Meeting link: ${job.meetingLink}`, job.questionsToAsk && `Questions: ${job.questionsToAsk}`, job.prepNotes && `Prep notes: ${job.prepNotes}`, job.note].filter(Boolean).join('\n') || `Interview for ${job.role} at ${job.company}.`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export function downloadIcs(jobs) {
  const escapeIcs = (value = '') => String(value).replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n');
  const events = jobs.filter(job => job.interview).map(job => {
    const start = job.interview.replaceAll('-', '');
    const date = new Date(`${job.interview}T12:00:00`);
    date.setDate(date.getDate() + 1);
    const end = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const description = [job.description, job.interviewer, job.meetingLink && `Meeting link: ${job.meetingLink}`, job.questionsToAsk && `Questions: ${job.questionsToAsk}`, job.prepNotes && `Prep notes: ${job.prepNotes}`, job.note].filter(Boolean).join('\n') || `Interview for ${job.role} at ${job.company}.`;
    const title = `${job.company} · ${job.role} · Round ${job.roundNumber || 1} · ${job.interviewType || 'Interview'}`;
    return ['BEGIN:VEVENT', `UID:job-${job.interviewId || job.id}@trackr.local`, `DTSTAMP:${new Date().toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}/, '')}`, `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:${escapeIcs(title)}`, `DESCRIPTION:${escapeIcs(description)}`, 'END:VEVENT'].join('\r\n');
  });
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Trackr//Job Application Tracker//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], {
    type: 'text/calendar;charset=utf-8'
  }));
  link.download = 'trackr-interviews.ics';
  link.click();
  URL.revokeObjectURL(link.href);
}
export function toDateKey(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}
