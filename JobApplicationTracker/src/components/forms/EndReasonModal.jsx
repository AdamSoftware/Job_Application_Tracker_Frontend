import { toDateKey } from '../../utils/dateUtils.js';

export function EndReasonModal(props) {
  const {
    endingRole,
    submitEndReason
  } = props;
  return <div className="modal-backdrop"><form className="modal end-reason-modal" onSubmit={submitEndReason}><div className="modal-header"><div><div className="eyebrow">WORK HISTORY</div>
          <h2>End {endingRole.role} at {endingRole.company}?</h2>
          <p>Choose a reason to move this role into your past work history.</p></div></div>
      <div className="form-grid"><label>Last day<input name="endDate" type="date" min={endingRole.startDate || undefined} max={toDateKey(new Date())} defaultValue={endingRole.endDate} required /></label>
        <label>Reason<select name="endReason" defaultValue="" required><option value="" disabled>Select a reason</option>
            <option>Prefer not to say</option>
            <option>Laid off</option>
            <option>Role ended</option>
            <option>Resigned</option>
            <option>Terminated</option>
            <option>Other</option></select></label></div>
      <div className="modal-actions"><button className="primary-button" type="submit">Save end details</button></div></form></div>;
}
