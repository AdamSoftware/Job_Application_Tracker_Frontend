import { Icon } from '../shared/Ui.jsx';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

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
  }}><form className="modal warm-form-modal contact-modal" onSubmit={submitContact}><div className="modal-header"><div><div className="eyebrow">YOUR NETWORK</div>
          <h2>{contactEditing ? 'Edit recruiter contact' : 'Add recruiter contact'}</h2>
          <p>Save the details you’ll want when it’s time to connect.</p></div>
        <button type="button" className="icon-button" onClick={() => {
          setModal(null);
          setContactEditing(null);
        }} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-grid"><div className="application-form-section-label full-field"><span>CONTACT DETAILS</span><small>The best way to remember who’s who.</small></div><label>Name<input name="name" placeholder="e.g. Jordan Lee" defaultValue={contactEditing?.name || ''} required /></label>
        <label>Title<input name="title" placeholder="Recruiter, hiring manager..." defaultValue={contactEditing?.title || ''} /></label>
        <label>Company<input name="company" placeholder="Company name" defaultValue={contactEditing?.company || ''} /></label>
        <label>Related application<ThemedDropdown name="jobId" defaultValue={contactEditing?.jobId || ''} placeholder="No specific role" options={jobs.map(job => ({ value: job.id, label: `${job.company} · ${job.role}` }))} /></label>
        <label className="full-field">Email address<input name="email" type="email" placeholder="name@company.com" defaultValue={contactEditing?.email || ''} /></label>
        <details className="application-form-section full-field"><summary>More contact details <span>{contactEditing?.phone || contactEditing?.linkedin || contactEditing?.notes ? 'Saved details' : 'Optional'}</span></summary><div className="contact-extra-fields"><label>Phone<input name="phone" type="tel" placeholder="(555) 555-0123" defaultValue={contactEditing?.phone || ''} /></label>
          <label>LinkedIn profile URL<input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." defaultValue={contactEditing?.linkedin || ''} /></label>
          <label className="full-field">Conversation notes<textarea name="notes" rows="3" placeholder="How you connected, last conversation, useful context..." defaultValue={contactEditing?.notes || ''} /></label></div></details></div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => {
          setModal(null);
          setContactEditing(null);
        }}>Cancel</button>
        <button className="primary-button" type="submit">{contactEditing ? 'Save contact' : 'Add contact'}</button></div></form></div>;
}
