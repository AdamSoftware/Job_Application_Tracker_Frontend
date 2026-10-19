import { Icon } from '../shared/Ui.jsx';
import { useState } from 'react';
import { toDateKey } from '../../utils/dateUtils.js';

export function InterviewNextStepModal({ company, outcome, questionsAsked = '', reflection = '', onClose, onAddRound, onWait, onReject, onKeep, onAddFollowUp }) {
  const [asked, setAsked] = useState(questionsAsked);
  const [notes, setNotes] = useState(reflection);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpAction, setFollowUpAction] = useState('Follow up after interview');
  const isNoLongerMoving = outcome === 'Not moving forward';
  const needsFollowUp = outcome === 'Needs follow-up';
  const savedNotes = () => ({ questionsAsked: asked, reflection: notes });
  const continueWith = action => action(savedNotes());
  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) continueWith(onClose);
  }}><section className="modal warm-form-modal interview-next-step-modal" role="dialog" aria-modal="true" aria-labelledby="interview-next-step-title">
    <div className="modal-header"><div><div className="eyebrow">ROUND UPDATE SAVED</div>
      <h2 id="interview-next-step-title">What happens next?</h2>
      <p>{company} · {outcome}</p></div><button type="button" className="icon-button" onClick={() => continueWith(onClose)} aria-label="Close"><Icon name="close" /></button></div>
    <p className="interview-next-step-copy">Before you move on, capture questions they asked and anything you want to remember for the next conversation.</p>
    <div className="interview-next-step-notes"><label>Questions they asked<textarea rows="3" value={asked} onChange={event => setAsked(event.target.value)} placeholder="What did they ask you?" /></label>
      <label>Interview notes<textarea rows="3" value={notes} onChange={event => setNotes(event.target.value)} placeholder="How did it feel? What would you like to remember?" /></label></div>
    {needsFollowUp && <div className="interview-follow-up-prompt"><strong>Set a reminder to follow up</strong><p>Choose when you want to check in. We’ll add it to your Follow-ups list.</p>
      <label>Follow-up date<input type="date" min={toDateKey(new Date())} value={followUpDate} onChange={event => setFollowUpDate(event.target.value)} required /></label>
      <label>What will you do?<input value={followUpAction} onChange={event => setFollowUpAction(event.target.value)} required /></label>
      <button type="button" className="primary-button" disabled={!followUpDate || !followUpAction.trim()} onClick={() => onAddFollowUp({ ...savedNotes(), followUpDate, followUpAction: followUpAction.trim() })}><Icon name="calendar" size={16} /> Create reminder & move to pending</button>
    </div>}
    <p className="interview-next-step-copy">{isNoLongerMoving ? 'Update this application to match the outcome, or keep it in your interview tracker.' : 'Would you like to schedule another round or move this application to pending while you wait to hear back?'}</p>
    <div className="interview-next-step-actions">{isNoLongerMoving ? <><button className="delete-button" onClick={() => continueWith(onReject)}>Mark application rejected</button><button className="secondary-button" onClick={() => continueWith(onKeep)}>Keep in Interviews</button></> : needsFollowUp ? <button className="secondary-button" onClick={() => continueWith(onAddRound)}><Icon name="plus" size={16} /> Add another round instead</button> : <><button className="primary-button" onClick={() => continueWith(onAddRound)}><Icon name="plus" size={16} /> Add another round</button><button className="secondary-button" onClick={() => continueWith(onWait)}>Move to pending</button></>}</div>
    {!isNoLongerMoving && <p className="interview-next-step-hint">Pending applications stay in the interview timeline while you wait for a response.</p>}
  </section></div>;
}
