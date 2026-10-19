import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { prettyDate } from '../../utils/dateUtils.js';

export function StatCard({
  label,
  value,
  change,
  icon,
  tone
}) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span>
    <span className={`stat-icon ${tone}`}><Icon name={icon} size={17} /></span></div>
  <div className="stat-value">{value}</div>
  <div className="stat-change"><span>↗</span> {change}</div></div>;
}
export function StatisticsDashboard({
  jobs
}) {
  const stages = ['Applied', 'In review', 'Interview', 'Pending', 'Offer', 'Accepted', 'Rejected'];
  const stageCount = status => jobs.filter(job => job.status === status).length;
  const responding = jobs.filter(job => job.status !== 'Applied').length;
  const offerCount = stageCount('Offer') + stageCount('Accepted');
  const interviewTrack = stageCount('Interview') + stageCount('Pending') + offerCount;
  const responseRate = jobs.length ? Math.round(responding / jobs.length * 100) : 0;
  const interviewConversion = responding ? Math.round(interviewTrack / responding * 100) : 0;
  const offerConversion = interviewTrack ? Math.round(offerCount / interviewTrack * 100) : 0;
  const monthData = Array.from({
    length: 6
  }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return {
      key,
      label: date.toLocaleDateString('en-US', {
        month: 'short'
      }),
      total: jobs.filter(job => job.date?.startsWith(key)).length
    };
  });
  const peak = Math.max(...monthData.map(item => item.total), 1);
  const latest = [...jobs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return <div className="statistics-dashboard">
    <section className="stats-activity-card"><div className="stats-section-heading"><div><span className="eyebrow">APPLICATION ACTIVITY</span>
        <h2>Your search over time</h2>
        <p>Applications submitted each month</p></div>
      <span className="activity-total"><strong>{jobs.length}</strong>
        <small>all time</small></span></div>
    <div className="activity-chart" role="img" aria-label="Applications submitted in the last six months">{monthData.map(month => <div className="activity-column" key={month.key}><strong>{month.total}</strong>
        <div className="activity-bar-area"><i className={month.total ? 'has-activity' : ''} style={{
              height: `${Math.max(month.total ? month.total / peak * 100 : 0, 3)}%`
            }} /></div>
        <span>{month.label}</span></div>)}</div></section>
    <div className="stats-content-grid"><section className="stage-card"><div className="stats-section-heading"><div><span className="eyebrow">PIPELINE</span>
          <h2>Where things stand</h2>
          <p>A snapshot of every application stage</p></div></div>
      <div className="stage-list">{stages.map(stage => <div className="stage-row" key={stage}><span className={`stage-indicator ${stage.toLowerCase().replace(' ', '-')}`} />
          <span className="stage-label">{stage}</span>
          <div className="stage-track"><i className={stage.toLowerCase().replace(' ', '-')} style={{
                width: `${jobs.length ? stageCount(stage) / jobs.length * 100 : 0}%`
              }} /></div>
          <strong>{stageCount(stage)}</strong></div>)}</div>
      <div className="stage-total">{jobs.length ? `${stageCount('Interview') + stageCount('Pending') + offerCount} of ${jobs.length} applications reached an interview or offer stage.` : 'Add an application to start building your pipeline.'}</div></section>
      <aside className="conversion-card"><div className="stats-section-heading"><div><span className="eyebrow">MOMENTUM</span>
          <h2>Search health</h2>
          <p>Small signals of progress</p></div></div>
      <div className="conversion-metric"><div className="conversion-ring" style={{
            '--progress': `${responseRate}%`
          }}><strong>{responseRate}%</strong></div>
        <div><b>Response rate</b>
          <small>{responding} of {jobs.length} companies responded to your application</small></div></div>
      <div className="conversion-row"><span>Responses → interview</span>
        <strong>{interviewConversion}%</strong></div>
      <div className="conversion-row"><span>Interview → offer</span>
        <strong>{offerConversion}%</strong></div>
      <div className="conversion-note"><span>✳</span>
        <p>{offerCount ? `${offerCount} offer${offerCount === 1 ? '' : 's'} received. Take the time you need to decide what’s right for you.` : stageCount('Interview') ? `${stageCount('Interview')} active interview${stageCount('Interview') === 1 ? '' : 's'}—you’re getting conversations started.` : 'Every application is a step forward. Keep going at a pace that works for you.'}</p></div></aside></div>
    <section className="latest-activity-card"><div className="stats-section-heading"><div><span className="eyebrow">LATEST</span>
        <h2>Recent applications</h2></div>
      <span className="latest-caption">Your most recently added opportunities</span></div>{latest.length ? <div className="latest-list">{latest.map(job => <div className="latest-row" key={job.id}><CompanyLogo job={job} />
        <div className="latest-company"><strong>{job.company}</strong>
          <small>{job.role}</small></div>
        <span className="latest-date">Applied {prettyDate(job.date)}</span>
        <span className={`status-pill ${job.status.toLowerCase().replace(' ', '-')}`}><i />{job.status}</span></div>)}</div> : <p className="stats-empty">Your recent applications will appear here.</p>}</section>
  </div>;
}
