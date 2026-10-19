import { useState } from 'react';
import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

const benefitFields = [
  ['Health coverage', 'healthCoverage', 'Medical, dental, vision...'],
  ['Paid time off', 'paidTimeOff', 'Vacation, sick leave, holidays...'],
  ['Retirement & savings', 'retirement', '401(k) match, pension...'],
  ['Parental leave', 'parentalLeave', 'Leave duration and details'],
  ['Other benefits & perks', 'benefits', 'Learning budget, wellness, commuter support...']
];
const currencies = [['USD', 'US dollar'], ['CAD', 'Canadian dollar'], ['GBP', 'British pound'], ['EUR', 'Euro'], ['AUD', 'Australian dollar'], ['NZD', 'New Zealand dollar'], ['CHF', 'Swiss franc'], ['JPY', 'Japanese yen'], ['CNY', 'Chinese yuan'], ['INR', 'Indian rupee'], ['MXN', 'Mexican peso'], ['SGD', 'Singapore dollar']];

export function OfferModal({ jobs, editing, onClose, onSubmit, onAddApplication, defaultCurrency = 'USD' }) {
  const eligibleJobs = jobs.filter(job => !['Offer', 'Accepted', 'Rejected'].includes(job.status));
  const [selectedJobId, setSelectedJobId] = useState(String(editing?.id ?? eligibleJobs[0]?.id ?? ''));
  const hasBenefits = Boolean(editing?.healthCoverage || editing?.paidTimeOff || editing?.retirement || editing?.parentalLeave || editing?.benefits);

  return <div className="modal-backdrop offer-modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}><form className="modal offer-entry-modal" onSubmit={event => onSubmit(event, editing ? String(editing.id) : selectedJobId)}><div className="modal-header"><div><div className="eyebrow">YOUR NEXT CHAPTER</div>
        <h2>{editing ? 'Update offer package' : 'Add an offer'}</h2>
        <p>{editing ? 'Keep the package details that matter to your decision.' : 'Choose an application, then add the package details.'}</p></div>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
    {editing ? <div className="offer-linked-application"><CompanyLogo job={editing} /><div><strong>{editing.company}</strong><small>{editing.role} · {editing.status === 'Accepted' ? 'Accepted package' : 'Offer received'}</small></div></div> : eligibleJobs.length ? <label className="offer-application-select">Which application received an offer?
      <ThemedDropdown name="applicationId" value={selectedJobId} onChange={setSelectedJobId} required placeholder="Select an application" options={eligibleJobs.map(job => ({ value: job.id, label: `${job.company} · ${job.role} (${job.status})` }))} /></label> : <div className="offer-no-applications"><div className="offers-empty-icon">✦</div><strong>No applications ready for an offer yet</strong><p>Add an application first. You can come back here and attach an offer to it.</p><button className="primary-button" type="button" onClick={onAddApplication}><Icon name="plus" size={16} /> Add an application</button></div>}
    {(editing || eligibleJobs.length > 0) && <><div className="offer-entry-section-title"><span>COMPENSATION</span><small>Enter what the employer offered.</small></div>
      <div className="offer-entry-compensation"><label>Currency<ThemedDropdown name="currency" defaultValue={editing?.currency || defaultCurrency} options={currencies.map(([code, currencyName]) => ({ value: code, label: `${code} · ${currencyName}` }))} /></label>
        <label>Annual base salary<input name="salary" type="number" min="0" step="1000" placeholder="e.g. 120000" defaultValue={editing?.salary || ''} /></label>
        <label>Signing bonus<input name="signingBonus" type="number" min="0" step="500" placeholder="e.g. 10000" defaultValue={editing?.signingBonus || ''} /></label>
        <label>Annual equity estimate<input name="equity" type="number" min="0" step="1000" placeholder="e.g. 15000" defaultValue={editing?.equity || ''} /></label>
        <label className="offer-entry-deadline">Decision deadline<input name="offerDeadline" type="date" defaultValue={editing?.offerDeadline || ''} /></label></div>
      <details className="application-form-section offer-benefits-accordion"><summary>Benefits & perks <span>{hasBenefits ? 'Package details saved' : 'Add health, time off, and other benefits'}</span></summary><div className="offer-entry-benefits">{benefitFields.map(([label, name, placeholder]) => <label className={name === 'benefits' ? 'full-field' : ''} key={name}>{label}{name === 'benefits' ? <textarea name={name} rows="2" placeholder={placeholder} defaultValue={editing?.[name] || ''} /> : <input name={name} placeholder={placeholder} defaultValue={editing?.[name] || ''} />}</label>)}</div></details></>}
    <div className="modal-actions">{(editing || eligibleJobs.length > 0) && <><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{editing ? 'Save package' : 'Save offer details'}</button></>}</div>
  </form></div>;
}
