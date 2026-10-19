import { Icon } from '../shared/Ui.jsx';
import { toDateKey } from '../../utils/dateUtils.js';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

export function FollowUpModal({ jobs, onClose, onSubmit, onAddApplication }) {
  const activeJobs = jobs.filter(job => !['Rejected', 'Accepted'].includes(job.status));
  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}><form className="modal warm-form-modal follow-up-modal" onSubmit={onSubmit}><div className="modal-header"><div><div className="eyebrow">A GENTLE NUDGE</div>
      <h2>Plan a follow-up</h2><p>Choose an application and when you want to check in.</p></div>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
    {activeJobs.length ? <><div className="form-grid"><label className="full-field">Which application?<ThemedDropdown name="jobId" required defaultValue={activeJobs[0]?.id || ''} options={activeJobs.map(job => ({ value: job.id, label: `${job.company} · ${job.role}` }))} /></label>
      <label className="full-field">Reminder date<input name="followUpDate" type="date" min={toDateKey(new Date())} required /></label>
      <label className="full-field">What would you like to do?<input name="followUpAction" placeholder="Email the recruiter about the timeline" /></label></div>
      <div className="follow-up-modal-note">Your reminder will appear on the Overview and Follow-ups pages.</div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save reminder</button></div></> : <div className="follow-up-no-applications"><strong>Start with an active application</strong><p>Once you’ve added an opportunity, you can choose it here and set a reminder.</p><button type="button" className="primary-button" onClick={onAddApplication}><Icon name="plus" size={16} /> Add an application</button></div>}
  </form></div>;
}
