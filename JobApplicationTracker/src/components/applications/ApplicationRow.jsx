import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { prettyDate } from '../../utils/dateUtils.js';

export function ApplicationRow({
  job,
  onOpen,
  grouped = false
}) {
  return <tr className={grouped ? 'group-child-row' : ''} onClick={() => onOpen(job)}><td><div className="company-cell"><CompanyLogo job={job} />
      <div><strong>{job.company}</strong>
        <small>{job.role}</small></div></div></td>
  <td className="date-cell">{prettyDate(job.date)}</td>
  <td><span className={`status-pill ${job.status.toLowerCase().replace(' ', '-')}`}><i />{job.status}</span></td>
  <td className="location-cell">{job.location || '—'}</td>
  <td><button className="icon-button row-menu" aria-label={`Edit ${job.company}`} onClick={e => {
        e.stopPropagation();
        onOpen(job);
      }}><Icon name="dots" /></button></td></tr>;
}
