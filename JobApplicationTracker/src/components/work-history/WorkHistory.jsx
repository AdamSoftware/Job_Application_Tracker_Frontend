import { useState } from 'react';
import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { historyDate } from '../../utils/dateUtils.js';
import { money, roleStage } from '../../utils/jobUtils.js';

export function WorkHistory({
  entries,
  onAdd,
  onEdit,
  onEnd,
  onStart
}) {
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const companies = entries.reduce((groups, entry) => {
    const key = entry.company.trim().toLocaleLowerCase();
    if (!groups.has(key)) groups.set(key, {
      key,
      company: entry.company,
      entries: []
    });
    groups.get(key).entries.push(entry);
    return groups;
  }, new Map());
  const companyGroups = [...companies.values()].sort((a, b) => a.company.localeCompare(b.company));
  const stageOrder = {
    Current: 0,
    Upcoming: 1,
    Past: 2
  };
  const renderEntry = entry => {
    const stage = roleStage(entry);
    return <article className="history-card" key={entry.id}><div className="history-card-heading"><div><h3>{entry.role}</h3>
      <small>{entry.location || 'Location not added'}</small></div>
    <span className={`history-status ${stage.toLowerCase()}`}>{stage === 'Upcoming' ? 'Starting soon' : stage === 'Current' ? 'Current' : 'Past role'}</span></div>
  <div className="history-dates"><span>{entry.startDate ? historyDate(entry.startDate) : stage === 'Upcoming' ? 'Start date to be added' : 'Start date not added'}</span>
    <b>→</b>
    <span>{stage === 'Current' ? 'Present' : stage === 'Upcoming' ? 'Not started' : entry.endDate ? historyDate(entry.endDate) : 'End date not added'}</span>{entry.salary && <strong>{money(entry.salary, entry.currency || 'USD')} / year</strong>}</div>{stage === 'Past' && entry.endReason && <p className="history-end-reason"><strong>How it ended:</strong> {entry.endReason}</p>}{entry.notes && <p className="history-notes">{entry.notes}</p>}<div className="history-card-actions"><button className="secondary-button" onClick={() => onEdit(entry)}>Edit role</button>{stage === 'Current' && <button className="end-role-button" onClick={() => onEnd(entry)}>End job</button>}{stage === 'Upcoming' && <button className="accept-offer-button" onClick={() => onStart(entry)}>Mark as started</button>}</div></article>;
  };
  return <div className="work-history-page"><div className="history-intro"><span className="offers-intro-icon">✦</span>
    <div><span className="eyebrow">YOUR CAREER, IN ONE PLACE</span>
      <h2>Keep your work story together</h2>
      <p>Roles at the same company branch together. Choose “Prefer not to say” if you don’t want to record an end reason.</p></div>
    <button className="primary-button" onClick={onAdd}><Icon name="plus" size={17} /> Add a role</button></div>{entries.length ? <div className="history-tree">{companyGroups.map(group => {
        const expanded = expandedCompanies[group.key] !== false;
        const orderedRoles = [...group.entries].sort((a, b) => stageOrder[roleStage(a)] - stageOrder[roleStage(b)] || (b.startDate || '').localeCompare(a.startDate || ''));
        return <section className="history-company-group" key={group.key}><button className="history-company-node" aria-expanded={expanded} onClick={() => setExpandedCompanies(state => ({
            ...state,
            [group.key]: !expanded
          }))}><span className="history-tree-chevron">{expanded ? '▾' : '▸'}</span>
        <CompanyLogo job={group.entries[0]} />
        <span className="history-company-name">{group.company}</span>
        <span className="history-company-count">{group.entries.length} role{group.entries.length === 1 ? '' : 's'}</span>
        <span className="history-company-hint">{expanded ? 'Collapse' : 'Expand'}</span></button>{expanded && <div className="history-branches">{orderedRoles.map(renderEntry)}</div>}</section>;
      })}</div> : <div className="offers-empty"><div className="offers-empty-icon">✦</div>
    <h3>Your work story starts here.</h3>
    <p>Add roles you’ve had, or accept an offer to have it appear here automatically.</p>
    <button className="primary-button" onClick={onAdd}><Icon name="plus" size={17} /> Add your first role</button></div>}</div>;
}
