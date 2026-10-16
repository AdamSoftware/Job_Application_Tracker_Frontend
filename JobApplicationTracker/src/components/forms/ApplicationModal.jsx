import { Icon } from '../shared/Ui.jsx';
import { toDateKey } from '../../utils/dateUtils.js';

export function ApplicationModal(props) {
  const {
    editing,
    view,
    statuses,
    jobs,
    setModal,
    save,
    notify,
    submitJob
  } = props;
  return <div className="modal-backdrop" onMouseDown={e => {
    if (e.target === e.currentTarget) setModal(null);
  }}><form className="modal" onSubmit={submitJob}><div className="modal-header"><div><div className="eyebrow">YOUR JOB SEARCH</div>
          <h2>{editing ? 'Edit application' : view === 'Offers' ? 'Add an offer' : 'Add an application'}</h2>
          <p>Keep the details somewhere you can find them.</p></div>
        <button type="button" className="icon-button" onClick={() => setModal(null)} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-grid"><label>Company name<input name="company" placeholder="e.g. Acme, Inc." defaultValue={editing?.company} required /></label>
        <label>Position title<input name="role" placeholder="e.g. Product Designer" defaultValue={editing?.role} required /></label>
        <label>Date applied<input name="date" type="date" defaultValue={editing?.date || toDateKey(new Date())} required /></label>
        <label>Status<select name="status" defaultValue={editing?.status || (view === 'Offers' ? 'Offer' : 'Applied')}>{statuses.filter(status => status !== 'Accepted' || editing?.status === 'Accepted').map(status => <option key={status}>{status}</option>)}</select></label>
        <label>Location<input name="location" placeholder="Remote or city" defaultValue={editing?.location} /></label>
        <label>Company logo URL <span className="optional">optional</span>
          <input name="companyLogo" type="url" placeholder="https://company.com/logo.png" defaultValue={editing?.companyLogo || ''} /></label>
        <label>Interview date <span className="optional">optional</span>
          <input name="interview" type="date" defaultValue={editing?.interview || ''} /></label>
        <label>Follow-up reminder date <span className="optional">optional</span>
          <input name="followUpDate" type="date" defaultValue={editing?.followUpDate || ''} /></label>
        <label>Follow-up next step <span className="optional">optional</span>
          <input name="followUpAction" placeholder="e.g. Email recruiter about timeline" defaultValue={editing?.followUpAction || ''} /></label>
        <details className="interview-prep-fields" open={Boolean(editing?.interview)}><summary>Interview prep <span>optional</span></summary>
          <p>Save a few details to help you feel ready.</p>
          <div className="offer-fields"><label>Interviewer / format<input name="interviewer" placeholder="Name, recruiter screen, panel..." defaultValue={editing?.interviewer || editing?.interviewFormat || ''} /></label>
            <label>Questions to ask<textarea name="questionsToAsk" rows="2" placeholder="What would you like to ask?" defaultValue={editing?.questionsToAsk || ''} /></label>
            <label className="offer-benefits-field">Prep notes<textarea name="prepNotes" rows="3" placeholder="Talking points, examples, research..." defaultValue={editing?.prepNotes || ''} /></label></div></details>
        <details className="offer-details" open={editing?.status === 'Offer' || view === 'Offers'}><summary>Offer compensation & benefits <span>optional</span></summary>
          <p>Save the full package so you can compare offers side by side.</p>
          <div className="offer-fields"><label>Currency<select name="currency" defaultValue={editing?.currency || 'USD'}><option value="USD">USD · US dollar</option>
                <option value="CAD">CAD · Canadian dollar</option>
                <option value="GBP">GBP · British pound</option>
                <option value="EUR">EUR · Euro</option></select></label>
            <label>Annual base salary<input name="salary" type="number" min="0" step="1000" placeholder="e.g. 120000" defaultValue={editing?.salary || ''} /></label>
            <label>Signing bonus<input name="signingBonus" type="number" min="0" step="500" placeholder="e.g. 10000" defaultValue={editing?.signingBonus || ''} /></label>
            <label>Annual equity value<input name="equity" type="number" min="0" step="1000" placeholder="e.g. 15000" defaultValue={editing?.equity || ''} /></label>
            <label>Decision deadline<input name="offerDeadline" type="date" defaultValue={editing?.offerDeadline || ''} /></label>
            <label>Health coverage<input name="healthCoverage" placeholder="Medical, dental, vision..." defaultValue={editing?.healthCoverage || ''} /></label>
            <label>Paid time off<input name="paidTimeOff" placeholder="Vacation, sick leave, holidays..." defaultValue={editing?.paidTimeOff || ''} /></label>
            <label>Retirement & savings<input name="retirement" placeholder="401(k) match, pension..." defaultValue={editing?.retirement || ''} /></label>
            <label>Parental leave<input name="parentalLeave" placeholder="Leave duration and details" defaultValue={editing?.parentalLeave || ''} /></label>
            <label className="offer-benefits-field">Other benefits & perks<textarea name="benefits" rows="3" placeholder="Wellness, learning budget, commuter support..." defaultValue={editing?.benefits || ''} /></label></div></details>
        <label className="full-field">Notes<textarea name="note" placeholder="Recruiter details, interview notes, next steps..." rows="3" defaultValue={editing?.note} /></label></div>
      <div className="modal-actions">{editing && <button type="button" className="delete-button" onClick={() => {
          save(jobs.filter(j => j.id !== editing.id));
          setModal(null);
          notify('Application removed');
        }}>Delete application</button>}<button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button>
        <button className="primary-button" type="submit">{editing ? 'Save changes' : view === 'Offers' ? 'Save offer' : 'Add application'}</button></div></form></div>;
}
