import { toDateKey } from '../../utils/dateUtils.js';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

const endReasons = ['Prefer not to say', 'Laid off', 'Role ended', 'Resigned', 'Terminated', 'Other'];

export function EndReasonModal(props) {
  const {
    endingRole,
    submitEndReason,
    onClose
  } = props;
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><form className="modal warm-form-modal end-reason-modal" onSubmit={submitEndReason}><div className="modal-header"><div><div className="eyebrow">WORK HISTORY</div>
          <h2>End {endingRole.role} at {endingRole.company}?</h2>
          <p>Choose a reason to move this role into your past work history.</p></div></div>
      <div className="form-grid"><label>Last day<input name="endDate" type="date" min={endingRole.startDate || undefined} max={toDateKey(new Date())} defaultValue={endingRole.endDate} required /></label>
        <label>Reason<ThemedDropdown name="endReason" required placeholder="Select a reason" options={endReasons.map(reason => ({ value: reason, label: reason }))} /></label></div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save end details</button></div></form></div>;
}
