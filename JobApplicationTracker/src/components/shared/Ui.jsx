import { icons } from './icons.jsx';
import { initials } from '../../utils/jobUtils.js';

export function Icon({
  name,
  size = 18
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}
export function CompanyLogo({
  job
}) {
  return <div className={`company-logo logo-${job.company.toLowerCase()}`}><span>{initials(job.company)}</span>{job.companyLogo && <img src={job.companyLogo} alt="" onError={event => {
      event.currentTarget.remove();
    }} />}</div>;
}
