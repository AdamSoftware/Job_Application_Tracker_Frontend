import { Icon } from '../shared/Ui.jsx';
import { useState } from 'react';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

const currencies = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'NZD', 'CHF', 'JPY', 'CNY', 'INR', 'MXN', 'SGD'];
const endReasons = ['Prefer not to say', 'Laid off', 'Role ended', 'Resigned', 'Terminated', 'Other'];

export function WorkHistoryModal(props) {
  const {
    employmentEditing,
    roleStage,
    toDateKey,
    setModal,
    setEmploymentEditing,
    submitWorkHistory,
    defaultCurrency = 'USD'
  } = props;
  const [selectedRoleStatus, setSelectedRoleStatus] = useState(employmentEditing ? roleStage(employmentEditing) : 'Current');
  const hasExtraDetails = Boolean(employmentEditing?.salary || employmentEditing?.healthCoverage || employmentEditing?.paidTimeOff || employmentEditing?.retirement || employmentEditing?.parentalLeave || employmentEditing?.benefits || employmentEditing?.notes);
  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) {
      setModal(null);
      setEmploymentEditing(null);
    }
  }}><form className="modal warm-form-modal work-history-modal" onSubmit={submitWorkHistory}><div className="modal-header"><div><div className="eyebrow">YOUR CAREER</div>
          <h2>{employmentEditing?.id ? 'Edit role' : 'Add a role'}</h2>
          <p>Keep the details that matter to your work story.</p></div>
        <button type="button" className="icon-button" onClick={() => {
          setModal(null);
          setEmploymentEditing(null);
        }} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-grid"><div className="application-form-section-label full-field"><span>ROLE DETAILS</span><small>Start with the basics of this chapter.</small></div><label>Company<input name="company" required defaultValue={employmentEditing?.company || ''} /></label>
        <label>Position title<input name="role" required defaultValue={employmentEditing?.role || ''} /></label>
        <label>Location<input name="location" defaultValue={employmentEditing?.location || ''} /></label>
        <label>Start date<input name="startDate" type="date" defaultValue={employmentEditing?.startDate || ''} /></label>
        <label>Role status<ThemedDropdown name="roleStatus" value={selectedRoleStatus} onChange={setSelectedRoleStatus} options={[{ value: 'Upcoming', label: 'Starting soon' }, { value: 'Current', label: 'Current role' }, { value: 'Past', label: 'Past role' }]} /></label>
        {selectedRoleStatus === 'Past' && <><label>Last day<input name="endDate" type="date" max={toDateKey(new Date())} min={employmentEditing?.startDate || undefined} required defaultValue={employmentEditing?.endDate || ''} /></label>
        <label>How did the role end?<ThemedDropdown name="endReason" required defaultValue={employmentEditing?.endReason || ''} placeholder="Choose a reason" options={endReasons.map(reason => ({ value: reason, label: reason }))} /></label></>}
        <details className="application-form-section full-field"><summary>Pay, benefits & notes <span>{hasExtraDetails ? 'Saved details' : 'Optional'}</span></summary><div className="work-history-extra-fields"><label>Currency<ThemedDropdown name="currency" defaultValue={employmentEditing?.currency || defaultCurrency} options={currencies.map(currency => ({ value: currency, label: currency }))} /></label>
          <label>Annual salary<input name="salary" type="number" min="0" step="1000" defaultValue={employmentEditing?.salary || ''} /></label>
          <label>Health coverage<input name="healthCoverage" defaultValue={employmentEditing?.healthCoverage || ''} /></label>
          <label>Paid time off<input name="paidTimeOff" defaultValue={employmentEditing?.paidTimeOff || ''} /></label>
          <label>Retirement & savings<input name="retirement" defaultValue={employmentEditing?.retirement || ''} /></label>
          <label>Parental leave<input name="parentalLeave" defaultValue={employmentEditing?.parentalLeave || ''} /></label>
          <label className="full-field">Other benefits<textarea name="benefits" rows="2" defaultValue={employmentEditing?.benefits || ''} /></label>
          <label className="full-field">Notes & accomplishments<textarea name="notes" rows="3" placeholder="What you worked on, learned, or are proud of..." defaultValue={employmentEditing?.notes || ''} /></label></div></details></div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => {
          setModal(null);
          setEmploymentEditing(null);
        }}>Cancel</button>
        <button className="primary-button" type="submit">Save role</button></div></form></div>;
}
