import { toDateKey } from '../../utils/dateUtils.js';
import { Icon } from '../shared/Ui.jsx';

export function FollowUpList({ jobs, contacts = [], onOpen, onComplete, limit, onViewAll }) {
  const today = toDateKey(new Date());
  const reminders = jobs.filter(job => job.followUpDate && job.followUpDate >= today && job.status !== 'Rejected' && job.status !== 'Accepted').sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
  const overdue = jobs.filter(job => job.followUpDate && job.followUpDate < today && job.status !== 'Rejected' && job.status !== 'Accepted').sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
  const allReminders = [...overdue, ...reminders];
  const visibleReminders = typeof limit === 'number' ? allReminders.slice(0, limit) : allReminders;
  const showFollowUpDetails = typeof limit !== 'number';
  const contactFor = job => contacts.find(contact => String(contact.jobId) === String(job.id))
    || contacts.find(contact => contact.company?.trim().toLowerCase() === job.company?.trim().toLowerCase());
  const dueLabel = date => {
    const daysUntil = Math.round((new Date(`${date}T12:00:00`) - new Date(`${today}T12:00:00`)) / 86400000);
    if (daysUntil < 0) return `Overdue ${Math.abs(daysUntil)} ${Math.abs(daysUntil) === 1 ? 'day' : 'days'}`;
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return `In ${daysUntil} days`;
  };

  return <section className="follow-up-panel"><div className="feature-panel-heading"><div><span className="eyebrow">KEEP THE MOMENTUM</span>
    <h2>Follow-ups</h2>
    <p>Gentle reminders for the next time you want to check in.</p></div>
    <div className="follow-up-heading-actions">{showFollowUpDetails && <div className="follow-up-summary" aria-label={`${overdue.length} overdue, ${reminders.length} upcoming`}>
        <span className={overdue.length ? 'has-overdue' : ''}><strong>{overdue.length}</strong> overdue</span><span><strong>{reminders.length}</strong> upcoming</span>
      </div>}
      {onViewAll && <button className="text-button" onClick={onViewAll}>View all <Icon name="arrow" size={14} /></button>}
      <span className="feature-panel-icon"><Icon name="calendar" size={18} /></span></div></div>{allReminders.length ? <div className={`follow-up-list${showFollowUpDetails ? ' detailed-list' : ''}`}>{visibleReminders.map(job => {
      const contact = contactFor(job);
      const daysUntil = Math.round((new Date(`${job.followUpDate}T12:00:00`) - new Date(`${today}T12:00:00`)) / 86400000);
      return <div className={`follow-up-row${showFollowUpDetails ? ' detailed-card' : ` compact${onComplete ? ' actionable' : ''}`}`} key={job.id}><button className="follow-up-item" onClick={() => onOpen(job)}><span className={'follow-up-date' + (daysUntil < 0 ? ' overdue' : '')}><small>{new Date(`${job.followUpDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}</small>
        <strong>{new Date(`${job.followUpDate}T12:00:00`).getDate()}</strong></span>
        <span className="follow-up-info"><span className="follow-up-title-row"><strong>{job.company}</strong><span className={`follow-up-label${daysUntil < 0 ? ' overdue' : daysUntil === 0 ? ' due-today' : ''}`}>{dueLabel(job.followUpDate)}</span></span><small>{job.followUpAction || `Follow up about ${job.role}`}</small></span></button>
        {showFollowUpDetails && contact && <div className="follow-up-contact"><span className="follow-up-contact-label">CONTACT DETAILS</span><strong>{contact.name || 'Recruiter contact'}</strong>{contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}{contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}</div>}
        {onComplete && <button className="follow-up-complete" onClick={() => onComplete(job)} aria-label={`Mark follow-up for ${job.company} complete`} title="Mark complete"><Icon name="check" size={16} /><span>Done</span></button>}</div>;
    })}</div> : <div className="feature-empty"><strong>No follow-ups planned</strong>
    <p>{onViewAll ? 'No reminders yet. Visit Follow-ups when you’re ready to plan a check-in.' : 'No reminders are planned. Add one from an active application whenever you want to check in.'}</p></div>}</section>;
}
