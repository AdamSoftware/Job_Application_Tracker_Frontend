import { prettyDate, toDateKey } from '../../utils/dateUtils.js';

export function InterviewPrep({
  jobs,
  onOpen
}) {
  const today = toDateKey(new Date());
  const interviews = jobs.filter(job => job.interview && job.interview >= today && !['Rejected', 'Accepted'].includes(job.status)).sort((a, b) => a.interview.localeCompare(b.interview));
  return <section className="interview-prep-panel"><div className="feature-panel-heading"><div><span className="eyebrow">FEEL READY</span>
      <h2>Interview prep</h2>
      <p>Keep the details and questions you want close at hand.</p></div>
    <span className="feature-panel-icon prep-icon">✦</span></div>{interviews.length ? <div className="prep-list">{interviews.map(job => <article className="prep-card" key={job.id}><div className="prep-card-top"><div><strong>{job.company} · {job.role}</strong>
          <small>{prettyDate(job.interview)}</small></div>
        <button className="secondary-button" onClick={() => onOpen(job)}>Edit prep</button></div>
      <div className="prep-columns"><div><span>INTERVIEWER / FORMAT</span>
          <p>{job.interviewer || job.interviewFormat || 'Add interviewer or interview format'}</p></div>
        <div><span>QUESTIONS TO ASK</span>
          <p>{job.questionsToAsk || 'Add questions you want to remember'}</p></div>
        <div className="prep-notes"><span>PREP NOTES</span>
          <p>{job.prepNotes || 'Add talking points, research, or examples to bring up'}</p></div></div></article>)}</div> : <div className="feature-empty"><strong>No interviews to prep for yet</strong>
    <p>Add an interview date to an application to start a prep plan.</p></div>}</section>;
}
