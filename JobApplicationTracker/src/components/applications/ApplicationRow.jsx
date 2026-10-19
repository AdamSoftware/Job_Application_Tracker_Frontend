import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { prettyDate } from '../../utils/dateUtils.js';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

export function ApplicationRow({
  job,
  onOpen,
  onStatusChange,
  statuses,
  grouped = false
}) {
  return <tr className={grouped ? 'group-child-row' : ''} onClick={() => onOpen(job)}><td><div className="company-cell"><CompanyLogo job={job} />
      <div><strong>{job.company}</strong>
        <small>{job.role}</small></div></div></td>
  <td className="date-cell">{prettyDate(job.date)}</td>
  <td><ThemedDropdown className="application-status-picker" triggerClassName={`application-status-select status-${job.status.toLowerCase().replace(' ', '-')}`} ariaLabel={`Status for ${job.company} — ${job.role}`} value={job.status} options={statuses.map(status => ({ value: status, label: status }))} onChange={status => onStatusChange(job, status)} stopPropagation /></td>
  <td className="location-cell">{job.location || '—'}</td>
  <td><button className="icon-button row-menu" aria-label={`Edit ${job.company}`} onClick={e => {
        e.stopPropagation();
        onOpen(job);
      }}><Icon name="dots" /></button></td></tr>;
}
