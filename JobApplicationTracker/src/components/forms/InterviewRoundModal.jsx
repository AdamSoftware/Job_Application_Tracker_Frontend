import { Icon } from '../shared/Ui.jsx';
import { useState } from 'react';
import { getInterviewRounds } from '../../utils/interviewUtils.js';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

const interviewTypes = ['Phone screen', 'Recruiter screen', 'Video interview', 'In-person interview', 'Technical assessment', 'Panel interview', 'Portfolio review', 'Final interview', 'Other'];

export function InterviewRoundModal({ job, round, jobs = [], onClose, onSubmit }) {
  const [selectedJobId, setSelectedJobId] = useState(job ? String(job.id) : '');
  const selectedJob = job || jobs.find(item => String(item.id) === selectedJobId);
  const roundNumber = selectedJob ? getInterviewRounds(selectedJob).length + 1 : 1;
  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}><form className="modal warm-form-modal interview-round-modal" onSubmit={onSubmit}>
    <div className="modal-header"><div><div className="eyebrow">INTERVIEW DETAILS</div>
      <h2>{round ? 'Edit interview details' : `Schedule ${roundNumber === 1 ? 'your interview' : `round ${roundNumber}`}`}</h2>
      <p>{selectedJob ? `${selectedJob.company} · ${selectedJob.role}` : 'Choose an application and add the interview details.'}</p></div>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
    <div className="form-grid">{!job && <label className="full-field">Application<ThemedDropdown name="jobId" value={selectedJobId} onChange={setSelectedJobId} required placeholder="Choose an application" options={jobs.map(item => ({ value: item.id, label: `${item.company} · ${item.role}` }))} /></label>}
      <label>Interview date<input name="date" type="date" required defaultValue={round?.date || round?.interview || ''} /></label>
      <label>Round number<input name="roundNumber" type="number" min="1" step="1" required defaultValue={round?.roundNumber || roundNumber} /></label>
      <label>Interview type<ThemedDropdown name="interviewType" required defaultValue={round?.interviewType || ''} placeholder="Choose a format" options={interviewTypes.map(type => ({ value: type, label: type }))} /></label>
      <label className="full-field">Round name <span className="optional">optional</span><input name="label" placeholder={`Round ${roundNumber} · hiring manager conversation...`} defaultValue={round?.label || ''} /></label>
      <label className="full-field">Interviewer or format<input name="interviewer" placeholder="Recruiter name, video call, onsite..." defaultValue={round?.interviewer || ''} /></label>
      <label className="full-field">Meeting or video link <span className="optional">optional</span><input name="meetingLink" type="url" placeholder="https://zoom.us/j/… or meeting URL" defaultValue={round?.meetingLink || ''} /></label>
      <label className="full-field">What will happen in this round?<textarea name="description" rows="3" placeholder="For example: a 30-minute call about my experience, followed by a portfolio walkthrough." defaultValue={round?.description || ''} /></label>
      <label className="full-field">Questions to ask<textarea name="questionsToAsk" rows="2" placeholder="What would you like to ask?" defaultValue={round?.questionsToAsk || ''} /></label>
      <label className="full-field">Questions they asked<textarea name="questionsAsked" rows="2" placeholder="Record their questions after the interview." defaultValue={round?.questionsAsked || ''} /></label>
      <label className="full-field">Interview prep notes <span className="optional">optional</span><textarea name="prepNotes" rows="3" placeholder="Talking points, examples, or research for this round..." defaultValue={round?.prepNotes || ''} /></label>
      <label className="full-field">Reflection & follow-up notes <span className="optional">optional</span><textarea name="reflection" rows="3" placeholder="What went well, what you learned, and anything to follow up on..." defaultValue={round?.reflection || ''} /></label>
    </div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
      <button className="primary-button" type="submit" disabled={!selectedJob}>{round ? 'Save changes' : 'Save interview'}</button></div>
  </form></div>;
}
