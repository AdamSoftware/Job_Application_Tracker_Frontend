import { prettyDate, toDateKey } from '../../utils/dateUtils.js';

export function FollowUpList({
  jobs,
  onOpen
}) {
  const today = toDateKey(new Date());
  const reminders = jobs.filter(job => job.followUpDate && job.followUpDate >= today && job.status !== 'Rejected' && job.status !== 'Accepted').sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
  const overdue = jobs.filter(job => job.followUpDate && job.followUpDate < today && job.status !== 'Rejected' && job.status !== 'Accepted').sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
  return <section className="follow-up-panel"><div className="feature-panel-heading"><div><span className="eyebrow">KEEP THE MOMENTUM</span>
      <h2>Follow-ups</h2>
      <p>Gentle reminders for the next time you want to check in.</p></div>
    <span className="feature-panel-icon">↗</span></div>{overdue.length + reminders.length ? <div className="follow-up-list">{[...overdue, ...reminders].map(job => <button className="follow-up-item" key={job.id} onClick={() => onOpen(job)}><span className={'follow-up-date' + (job.followUpDate < today ? ' overdue' : '')}><strong>{new Date(`${job.followUpDate}T12:00:00`).getDate()}</strong>
        <small>{new Date(`${job.followUpDate}T12:00:00`).toLocaleDateString('en-US', {
              month: 'short'
            })}</small></span>
      <span className="follow-up-info"><strong>{job.company}</strong>
        <small>{job.followUpAction || `Follow up about ${job.role}`}</small></span>
      <span className={'follow-up-label' + (job.followUpDate < today ? ' overdue' : '')}>{job.followUpDate < today ? 'Overdue' : job.followUpDate === today ? 'Today' : prettyDate(job.followUpDate)}</span></button>)}</div> : <div className="feature-empty"><strong>No follow-ups planned</strong>
    <p>Add a follow-up date to an application when you want a reminder to check in.</p></div>}</section>;
}
