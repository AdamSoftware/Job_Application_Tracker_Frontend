import { Icon } from '../shared/Ui.jsx';

export function ContactModal(props) {
  const {
    contactEditing,
    setModal,
    setContactEditing,
    submitContact,
    jobs
  } = props;
  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) {
      setModal(null);
      setContactEditing(null);
    }
  }}><form className="modal contact-modal" onSubmit={submitContact}><div className="modal-header"><div><div className="eyebrow">YOUR NETWORK</div>
          <h2>{contactEditing ? 'Edit recruiter contact' : 'Add recruiter contact'}</h2>
          <p>Save the details you’ll want when it’s time to connect.</p></div>
        <button type="button" className="icon-button" onClick={() => {
          setModal(null);
          setContactEditing(null);
        }} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-grid"><label>Name<input name="name" placeholder="e.g. Jordan Lee" defaultValue={contactEditing?.name || ''} required /></label>
        <label>Title<input name="title" placeholder="Recruiter, hiring manager..." defaultValue={contactEditing?.title || ''} /></label>
        <label>Company<input name="company" placeholder="Company name" defaultValue={contactEditing?.company || ''} /></label>
        <label>Related application<select name="jobId" defaultValue={contactEditing?.jobId || ''}><option value="">No specific role</option>{jobs.map(job => <option key={job.id} value={job.id}>{job.company} · {job.role}</option>)}</select></label>
        <label>Email<input name="email" type="email" placeholder="name@company.com" defaultValue={contactEditing?.email || ''} /></label>
        <label>Phone<input name="phone" type="tel" placeholder="(555) 555-0123" defaultValue={contactEditing?.phone || ''} /></label>
        <label className="full-field">LinkedIn profile URL<input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." defaultValue={contactEditing?.linkedin || ''} /></label>
        <label className="full-field">Conversation notes<textarea name="notes" rows="3" placeholder="How you connected, last conversation, useful context..." defaultValue={contactEditing?.notes || ''} /></label></div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => {
          setModal(null);
          setContactEditing(null);
        }}>Cancel</button>
        <button className="primary-button" type="submit">{contactEditing ? 'Save contact' : 'Add contact'}</button></div></form></div>;
}
