import { Icon } from '../shared/Ui.jsx';
import { AutocompleteInput } from '../shared/AutocompleteInput.jsx';
import { toDateKey } from '../../utils/dateUtils.js';

export function ApplicationModal(props) {
  const {
    editing,
    view,
    jobs,
    roleSuggestions = [],
    setModal,
    save,
    notify,
    submitJob
  } = props;
  return <div className="modal-backdrop" onMouseDown={e => {
    if (e.target === e.currentTarget) setModal(null);
    }}><form className={`modal application-modal${editing ? ' editing-application-modal' : ''}`} onSubmit={submitJob}><div className="modal-header"><div><div className="eyebrow">YOUR JOB SEARCH</div>
          <h2>{editing ? 'Edit application' : view === 'Offers' ? 'Add an offer' : 'Add an application'}</h2>
          <p>{editing ? 'Update the details you want to keep close.' : 'Keep the details somewhere you can find them.'}</p></div>
        <button type="button" className="icon-button" onClick={() => setModal(null)} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-grid"><div className="application-form-section-label full-field"><span>APPLICATION DETAILS</span><small>The essentials, all in one place.</small></div><label>Company name<input name="company" placeholder="e.g. Acme, Inc." defaultValue={editing?.company} required /></label>
        <label>Position title<AutocompleteInput name="role" suggestions={roleSuggestions} placeholder="e.g. Product Designer" defaultValue={editing?.role || ''} required /></label>
        <label>Date applied<input name="date" type="date" defaultValue={editing?.date || toDateKey(new Date())} required /></label>
        <label>Location<input name="location" placeholder="Remote or city" defaultValue={editing?.location} /></label>
        <details className="application-form-section full-field"><summary>Company profile <span>{editing?.companyLogo ? 'Logo saved' : 'Optional'}</span></summary><p>Add a logo URL if you want the company mark to appear in your workspace.</p>
          <label>Company logo URL<input name="companyLogo" type="url" placeholder="https://company.com/logo.png" defaultValue={editing?.companyLogo || ''} /></label></details>
        <details className="application-form-section full-field"><summary>Follow-up reminder <span>{editing?.followUpDate ? 'Reminder saved' : 'Optional'}</span></summary><div className="application-follow-up-fields"><div><strong>Plan a gentle check-in</strong>
            <p>Set a date to check in about this application. It will appear on your Overview.</p></div>
          <label>Reminder date<input name="followUpDate" type="date" defaultValue={editing?.followUpDate || ''} /></label>
          <label>Next step<input name="followUpAction" placeholder="e.g. Email recruiter about timeline" defaultValue={editing?.followUpAction || ''} /></label></div></details>
        <label className="full-field notes-field">Notes<textarea name="note" placeholder="Recruiter details, interview notes, next steps..." rows="2" defaultValue={editing?.note} /></label></div>
      <div className="modal-actions">{editing && <button type="button" className="delete-button" onClick={() => {
          save(jobs.filter(j => j.id !== editing.id));
          setModal(null);
          notify('Application removed');
        }}>Delete application</button>}<button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button>
        <button className="primary-button" type="submit">{editing ? 'Save changes' : view === 'Offers' ? 'Save offer' : 'Add application'}</button></div></form></div>;
}
