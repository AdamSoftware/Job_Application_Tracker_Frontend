import { Icon } from '../shared/Ui.jsx';
import { initials } from '../../utils/jobUtils.js';

export function RecruiterContacts({
  contacts,
  jobs,
  onAdd,
  onEdit,
  onDelete
}) {
  return <div className="contacts-page"><div className="contacts-intro"><span className="offers-intro-icon">◎</span>
    <div><span className="eyebrow">PEOPLE IN YOUR CORNER</span>
      <h2>Recruiter contacts</h2>
      <p>Keep the names, details, and conversations connected to your search in one easy-to-find place.</p></div>
    <button className="primary-button" onClick={onAdd}><Icon name="plus" size={17} /> Add contact</button></div>{contacts.length ? <div className="contacts-grid">{contacts.map(contact => <article className="recruiter-card" key={contact.id}><div className="recruiter-card-heading"><div className="recruiter-avatar">{initials(contact.name || 'RC')}</div>
        <div><h3>{contact.name}</h3>
          <p>{contact.title || 'Recruiter / hiring contact'}</p></div>
        <button className="icon-button" aria-label={`Edit ${contact.name}`} onClick={() => onEdit(contact)}><Icon name="dots" /></button></div>
      <div className="recruiter-company">{contact.company || 'Company not linked'}{contact.jobId && jobs.find(job => String(job.id) === String(contact.jobId)) ? ` · ${jobs.find(job => String(job.id) === String(contact.jobId)).role}` : ''}</div>
      <div className="recruiter-details">{contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}{contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}{contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn profile ↗</a>}</div>{contact.notes && <p className="recruiter-notes">{contact.notes}</p>}<div className="recruiter-card-actions"><button className="secondary-button" onClick={() => onEdit(contact)}>Edit contact</button>
        <button className="delete-button" onClick={() => onDelete(contact)}>Remove</button></div></article>)}</div> : <div className="offers-empty"><div className="offers-empty-icon">◎</div>
    <h3>Keep your helpful connections close.</h3>
    <p>Add recruiter and hiring team details so you can find the right person when it’s time to follow up.</p>
    <button className="primary-button" onClick={onAdd}><Icon name="plus" size={17} /> Add your first contact</button></div>}</div>;
}
