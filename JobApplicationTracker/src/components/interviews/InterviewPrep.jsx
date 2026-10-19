import { prettyDate, toDateKey } from '../../utils/dateUtils.js';
import { getInterviewEvents, getSafeMeetingLink, isInterviewInProgress } from '../../utils/interviewUtils.js';
import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { useState } from 'react';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

const interviewOutcomes = ['Scheduled', 'Went well', 'Mixed', 'Needs follow-up', 'Waiting to hear back', 'Moving to next round', 'Not moving forward'];

function outcomeClass(outcome) {
  return (outcome || 'Scheduled').toLowerCase().replaceAll(' ', '-');
}

export function InterviewPrep({ jobs, onAddRound, onEditRound, onOutcomeChange }) {
  const [roundFilter, setRoundFilter] = useState('All');
  const today = toDateKey(new Date());
  const interviewJobs = jobs.filter(isInterviewInProgress);
  const allRounds = getInterviewEvents(interviewJobs);
  const categoryFor = outcome => {
    if (!outcome || outcome === 'Scheduled') return 'Scheduled';
    if (['Needs follow-up', 'Waiting to hear back'].includes(outcome)) return 'Pending';
    return 'Done';
  };
  const roundCounts = {
    All: allRounds.length,
    Scheduled: allRounds.filter(round => categoryFor(round.outcome) === 'Scheduled').length,
    Pending: allRounds.filter(round => categoryFor(round.outcome) === 'Pending').length,
    Done: allRounds.filter(round => categoryFor(round.outcome) === 'Done').length
  };
  const trackedJobs = interviewJobs.map(job => ({
    ...job,
    allRounds: getInterviewEvents([job]).sort((a, b) => a.interview.localeCompare(b.interview)),
    rounds: getInterviewEvents([job]).filter(round => roundFilter === 'All' || categoryFor(round.outcome) === roundFilter).sort((a, b) => a.interview.localeCompare(b.interview))
  })).filter(job => job.rounds.length);
  return <section className="interview-tracker-panel">
    <header className="interview-tracker-heading"><div><span className="eyebrow">YOUR CONVERSATIONS</span>
      <h2>Interview progress</h2>
      <p>See where you are in each process, capture how every round went, and keep your next steps close.</p></div>
      <div className="interview-tracker-actions"><span className="interview-tracker-count">{interviewJobs.length} {interviewJobs.length === 1 ? 'role' : 'roles'} · {allRounds.length} {allRounds.length === 1 ? 'round' : 'rounds'}</span>
        {interviewJobs.length > 0 && <button className="primary-button" onClick={onAddRound}><Icon name="plus" size={16} /> Add interview round</button>}</div></header>
    <div className="interview-round-filters" role="group" aria-label="Filter interview rounds">{['All', 'Scheduled', 'Pending', 'Done'].map(filter => <button type="button" key={filter} className={roundFilter === filter ? 'selected' : ''} aria-pressed={roundFilter === filter} onClick={() => setRoundFilter(filter)}>{filter}<span>{roundCounts[filter]}</span></button>)}</div>
    {trackedJobs.length ? <div className="interview-role-list">{trackedJobs.map(job => {
      const nextIndex = job.rounds.findIndex(round => round.interview >= today);
      const currentIndex = nextIndex < 0 ? job.allRounds.length - 1 : nextIndex;
      const currentRound = job.allRounds[currentIndex];
      return <article className="interview-role-card" key={job.id}>
        <div className="interview-role-heading"><CompanyLogo job={job} /><div className="interview-role-title"><h3>{job.company}</h3><p>{job.role}</p></div></div>
        <div className="interview-progress-summary"><span className="interview-progress-icon"><Icon name="calendar" size={17} /></span>
          <div><small>{currentRound.interview >= today ? 'UP NEXT' : 'MOST RECENT'}</small><strong>Round {currentRound.roundNumber || currentIndex + 1} · {currentRound.interviewType || currentRound.label || 'Interview'} · {prettyDate(currentRound.interview)}</strong></div>
          <span className="interview-round-total">Round {currentIndex + 1} of {job.allRounds.length}</span></div>
        <div className="interview-round-timeline">{job.rounds.map((round, index) => {
          const meetingLink = getSafeMeetingLink(round.meetingLink);
          return <section className={`interview-round-card${round.interviewId === currentRound.interviewId ? ' current' : ''}`} key={round.interviewId}>
          <div className="interview-round-heading"><div className="interview-round-marker">{round.roundNumber || index + 1}</div><div className="interview-round-label"><strong>{round.label || `Round ${round.roundNumber || index + 1}`}</strong><span>{round.interviewType || 'Interview'} · {prettyDate(round.interview)}</span></div>
            <div className="interview-outcome-control"><span>OUTCOME</span><ThemedDropdown className="interview-outcome-picker" triggerClassName={`interview-outcome-trigger ${outcomeClass(round.outcome)}`} ariaLabel={`Outcome for ${round.label || `round ${round.roundNumber}`}`} value={round.outcome || 'Scheduled'} options={interviewOutcomes.map(outcome => ({ value: outcome, label: outcome, className: `outcome-${outcomeClass(outcome)}` }))} onChange={outcome => onOutcomeChange(job.id, round.interviewId, outcome)} /></div>
            <button className="secondary-button" onClick={() => onEditRound(round)}>Edit round</button></div>
          <div className="interview-round-details">
            <div className="interview-round-description"><small>WHAT TO EXPECT</small><p>{round.description || 'No round description added yet'}</p></div>
            <div><small>INTERVIEWER / FORMAT</small><p>{round.interviewer || 'Not added yet'}</p></div>
            {meetingLink && <div className="interview-meeting-link"><small>MEETING LINK</small><a href={meetingLink} target="_blank" rel="noreferrer"><Icon name="arrow" size={13} /> Join interview</a></div>}
            <div><small>QUESTIONS TO ASK</small><p>{round.questionsToAsk || 'No questions saved'}</p></div>
            <div><small>QUESTIONS THEY ASKED</small><p>{round.questionsAsked || 'No questions recorded yet'}</p></div>
            <div><small>PREP NOTES</small><p>{round.prepNotes || 'No prep notes saved'}</p></div>
            <div className="interview-reflection"><small>REFLECTION & NEXT STEPS</small><p>{round.reflection || 'Add what went well, what you learned, or who to follow up with.'}</p></div>
          </div></section>})}</div>
        <button className="interview-add-round" onClick={() => onAddRound(job)}><Icon name="plus" size={15} /> Schedule another round at {job.company}</button>
      </article>;
    })}</div> : <div className="interview-tracker-empty"><span className="offers-empty-icon"><Icon name="calendar" size={22} /></span>
      <h3>Your interview timeline will live here.</h3><p>Move an application to Interview and add a date. Each round, outcome, and reflection will stay together here.</p></div>}
  </section>;
}
