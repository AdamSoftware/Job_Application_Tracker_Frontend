import { Icon } from '../shared/Ui.jsx';

export function PendingInterviewUpdateModal({ company, onClose, onContinue, onCloseApplication }) {
  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}><section className="modal warm-form-modal pending-interview-update-modal" role="dialog" aria-modal="true" aria-labelledby="pending-interview-update-title">
    <div className="modal-header"><div><div className="eyebrow">INTERVIEW UPDATE</div>
      <h2 id="pending-interview-update-title">What did you hear?</h2>
      <p>{company} · Choose what fits, and we’ll update your application.</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
    <div className="pending-interview-update-options">
      <button type="button" className="pending-interview-update-option continue" onClick={onContinue}><span className="pending-interview-update-icon"><Icon name="arrow" size={17} /></span><span><strong>They’d like to continue</strong><small>Keep the process moving and add the next interview round.</small></span><Icon name="chevronDown" size={16} /></button>
      <button type="button" className="pending-interview-update-option close-out" onClick={onCloseApplication}><span className="pending-interview-update-icon"><Icon name="check" size={17} /></span><span><strong>They’ve decided to go another direction</strong><small>Close this application and keep your interview notes for later.</small></span><Icon name="chevronDown" size={16} /></button>
    </div>
    <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>I’m still waiting</button></div>
  </section></div>;
}
