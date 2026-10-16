import { Icon } from '../shared/Ui.jsx';

export function WorkHistoryModal(props) {
  const {
    employmentEditing,
    roleStage,
    toDateKey,
    setModal,
    setEmploymentEditing,
    submitWorkHistory
  } = props;
  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) {
      setModal(null);
      setEmploymentEditing(null);
    }
  }}><form className="modal work-history-modal" onSubmit={submitWorkHistory}><div className="modal-header"><div><div className="eyebrow">YOUR CAREER</div>
          <h2>{employmentEditing?.id ? 'Edit role' : 'Add a role'}</h2>
          <p>Keep the details that matter to your work story.</p></div>
        <button type="button" className="icon-button" onClick={() => {
          setModal(null);
          setEmploymentEditing(null);
        }} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-grid"><label>Company<input name="company" required defaultValue={employmentEditing?.company || ''} /></label>
        <label>Position title<input name="role" required defaultValue={employmentEditing?.role || ''} /></label>
        <label>Location<input name="location" defaultValue={employmentEditing?.location || ''} /></label>
        <label>Currency<select name="currency" defaultValue={employmentEditing?.currency || 'USD'}><option value="USD">USD</option>
            <option value="CAD">CAD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option></select></label>
        <label>Annual salary<input name="salary" type="number" min="0" step="1000" defaultValue={employmentEditing?.salary || ''} /></label>
        <label>Start date<input name="startDate" type="date" defaultValue={employmentEditing?.startDate || ''} /></label>
        <label>Role status<select name="roleStatus" defaultValue={employmentEditing ? roleStage(employmentEditing) : 'Current'} onChange={event => {
            const isPast = event.target.value === 'Past';
            event.currentTarget.form.elements.endDate.required = isPast;
            event.currentTarget.form.elements.endReason.required = isPast;
          }}><option value="Upcoming">Upcoming / starting soon</option>
            <option value="Current">Current role</option>
            <option value="Past">Past role</option></select></label>
        <label>End date<input name="endDate" type="date" max={toDateKey(new Date())} min={employmentEditing?.startDate || undefined} required={employmentEditing ? roleStage(employmentEditing) === 'Past' : false} defaultValue={employmentEditing?.endDate || ''} /></label>
        <label>How did the role end?<select name="endReason" required={employmentEditing ? roleStage(employmentEditing) === 'Past' : false} defaultValue={employmentEditing?.endReason || ''}><option value="" disabled>Choose a reason</option>
            <option>Prefer not to say</option>
            <option>Laid off</option>
            <option>Role ended</option>
            <option>Resigned</option>
            <option>Terminated</option>
            <option>Other</option></select></label>
        <label className="full-field">Health coverage<input name="healthCoverage" defaultValue={employmentEditing?.healthCoverage || ''} /></label>
        <label className="full-field">Paid time off<input name="paidTimeOff" defaultValue={employmentEditing?.paidTimeOff || ''} /></label>
        <label className="full-field">Retirement & savings<input name="retirement" defaultValue={employmentEditing?.retirement || ''} /></label>
        <label className="full-field">Parental leave<input name="parentalLeave" defaultValue={employmentEditing?.parentalLeave || ''} /></label>
        <label className="full-field">Other benefits<textarea name="benefits" rows="2" defaultValue={employmentEditing?.benefits || ''} /></label>
        <label className="full-field">Notes & accomplishments<textarea name="notes" rows="3" placeholder="What you worked on, learned, or are proud of..." defaultValue={employmentEditing?.notes || ''} /></label></div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => {
          setModal(null);
          setEmploymentEditing(null);
        }}>Cancel</button>
        <button className="primary-button" type="submit">Save role</button></div></form></div>;
}
