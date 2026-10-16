import { Fragment, useMemo, useState } from 'react';
import './App.css';
import { initialJobs, statuses, isOfferStatus } from './data/initialData.js';
import { historyEntryFromOffer, initials, roleStage } from './utils/jobUtils.js';
import { prettyDate, toDateKey } from './utils/dateUtils.js';
import { CompanyLogo, Icon } from './components/shared/Ui.jsx';
import { ApplicationRow } from './components/applications/ApplicationRow.jsx';
import { InterviewCalendar } from './components/interviews/InterviewCalendar.jsx';
import { StatCard, StatisticsDashboard } from './components/dashboard/StatisticsDashboard.jsx';
import { LoginScreen } from './components/auth/LoginScreen.jsx';
import { AccountSettings } from './components/settings/AccountSettings.jsx';
import { QuoteCarousel } from './components/dashboard/QuoteCarousel.jsx';
import { OfferComparison } from './components/offers/OfferComparison.jsx';
import { WorkHistory } from './components/work-history/WorkHistory.jsx';
import { FollowUpList } from './components/dashboard/FollowUpList.jsx';
import { InterviewPrep } from './components/interviews/InterviewPrep.jsx';
import { RecruiterContacts } from './components/contacts/RecruiterContacts.jsx';
import { OfferCelebration } from './components/celebration/OfferCelebration.jsx';
import { ApplicationModal } from './components/forms/ApplicationModal.jsx';
import { ContactModal } from './components/forms/ContactModal.jsx';
import { EndReasonModal } from './components/forms/EndReasonModal.jsx';
import { WorkHistoryModal } from './components/forms/WorkHistoryModal.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [profileName, setProfileName] = useState(() => localStorage.getItem('job-tracker-name') || 'Alex Steinberg');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('job-tracker-email') || 'alex@example.com');
  const [jobs, setJobs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('job-tracker-jobs')) || initialJobs;
    } catch {
      return initialJobs;
    }
  });
  const [workHistory, setWorkHistory] = useState(() => {
    let savedHistory = [];
    let savedJobs;
    try {
      savedHistory = JSON.parse(localStorage.getItem('job-tracker-work-history')) || [];
    } catch {
      savedHistory = [];
    }
    try {
      savedJobs = JSON.parse(localStorage.getItem('job-tracker-jobs')) || initialJobs;
    } catch {
      savedJobs = initialJobs;
    }
    const missingAccepted = savedJobs.filter(job => job.status === 'Accepted' && !savedHistory.some(entry => entry.sourceOfferId === job.id));
    return [...missingAccepted.map(historyEntryFromOffer), ...savedHistory];
  });
  const [contacts, setContacts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('job-tracker-recruiter-contacts')) || [];
    } catch {
      return [];
    }
  });
  const [view, setView] = useState('Overview');
  const [filter, setFilter] = useState('All applications');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [employmentEditing, setEmploymentEditing] = useState(null);
  const [contactEditing, setContactEditing] = useState(null);
  const [endingRole, setEndingRole] = useState(null);
  const [showQuotes, setShowQuotes] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('job-tracker-theme') === 'dark');
  const [uiScale, setUiScale] = useState(() => {
    const saved = Number(localStorage.getItem('job-tracker-ui-scale'));
    return [90, 100, 110, 120].includes(saved) ? saved : 100;
  });
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [notice, setNotice] = useState('');
  const save = next => {
    setJobs(next);
    localStorage.setItem('job-tracker-jobs', JSON.stringify(next));
  };
  const saveWorkHistory = next => {
    setWorkHistory(next);
    localStorage.setItem('job-tracker-work-history', JSON.stringify(next));
  };
  const saveContacts = next => {
    setContacts(next);
    localStorage.setItem('job-tracker-recruiter-contacts', JSON.stringify(next));
  };
  const filtered = useMemo(() => jobs.filter(job => (filter === 'All applications' || job.status === filter) && `${job.company} ${job.role} ${job.status}`.toLowerCase().includes(query.toLowerCase())), [jobs, filter, query]);
  const companyGroups = useMemo(() => {
    const groups = new Map();
    filtered.slice(0, view === 'Applications' ? filtered.length : 6).forEach(job => {
      const key = job.company.trim().toLocaleLowerCase();
      if (!groups.has(key)) groups.set(key, {
        key,
        company: job.company,
        jobs: []
      });
      groups.get(key).jobs.push(job);
    });
    return [...groups.values()];
  }, [filtered, view]);
  const today = toDateKey(new Date());
  const upcoming = jobs.filter(j => j.interview && j.interview >= today && !['Rejected', 'Accepted'].includes(j.status)).sort((a, b) => a.interview.localeCompare(b.interview));
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();
  const count = status => jobs.filter(j => j.status === status).length;
  const notify = msg => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2600);
  };
  const celebrate = details => {
    setCelebration(details);
    window.setTimeout(() => setCelebration(null), 8000);
  };
  const exportCsv = () => {
    const rows = [['Company', 'Role', 'Applied', 'Status', 'Location', 'Notes', 'Interview', 'Follow-up date', 'Follow-up next step', 'Interviewer / format', 'Questions to ask', 'Interview prep notes', 'Currency', 'Base salary', 'Signing bonus', 'Annual equity value', 'Health coverage', 'Paid time off', 'Retirement', 'Parental leave', 'Other benefits and perks', 'Offer deadline'], ...jobs.map(({
      company,
      role,
      date,
      status,
      location,
      note,
      interview,
      followUpDate,
      followUpAction,
      interviewer,
      interviewFormat,
      questionsToAsk,
      prepNotes,
      currency,
      salary,
      signingBonus,
      equity,
      healthCoverage,
      paidTimeOff,
      retirement,
      parentalLeave,
      benefits,
      offerDeadline
    }) => [company, role, date, status, location, note, interview || '', followUpDate || '', followUpAction || '', interviewer || interviewFormat || '', questionsToAsk || '', prepNotes || '', currency || '', salary || '', signingBonus || '', equity || '', healthCoverage || '', paidTimeOff || '', retirement || '', parentalLeave || '', benefits || '', offerDeadline || ''])];
    const csv = rows.map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], {
      type: 'text/csv'
    }));
    link.download = 'applications.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    notify('Your applications were exported');
  };
  const openForm = (job = null) => {
    setEditing(job);
    setModal('application');
  };
  const openEmploymentForm = (entry = null) => {
    setEmploymentEditing(entry);
    setModal('work-history');
  };
  const startEmployment = entry => {
    const started = {
      ...entry,
      isCurrent: true,
      workStatus: 'Current',
      startDate: entry.startDate || toDateKey(new Date()),
      endDate: '',
      endReason: ''
    };
    saveWorkHistory(workHistory.map(item => item.id === entry.id ? started : item));
    notify(`${entry.role} at ${entry.company} is now marked as started`);
    celebrate({
      eyebrow: 'A NEW CHAPTER',
      title: 'Your first day!',
      message: `You made it to your start at ${entry.company}. Take a moment to be proud of how far you’ve come.`,
      button: 'Let’s go!'
    });
  };
  const endEmployment = entry => {
    const ended = {
      ...entry,
      isCurrent: false,
      workStatus: 'Past',
      endDate: toDateKey(new Date()),
      endReason: ''
    };
    setEndingRole(ended);
    setModal('end-reason');
  };
  const submitEndReason = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const updated = {
      ...endingRole,
      endDate: data.endDate,
      endReason: data.endReason
    };
    saveWorkHistory(workHistory.map(item => item.id === endingRole.id ? updated : item));
    setEndingRole(null);
    setModal(null);
    notify('Job end details saved');
  };
  const acceptOffer = acceptedJob => {
    save(jobs.map(job => job.id === acceptedJob.id ? {
      ...job,
      status: 'Accepted'
    } : job.status === 'Offer' ? {
      ...job,
      status: 'Rejected'
    } : job));
    if (!workHistory.some(entry => entry.sourceOfferId === acceptedJob.id)) saveWorkHistory([historyEntryFromOffer(acceptedJob), ...workHistory]);
    notify(`Accepted ${acceptedJob.company}'s offer. It’s now in Work history, and other pending offers were marked rejected.`);
    celebrate({
      eyebrow: 'LOOK AT YOU',
      title: 'You chose your next step!',
      message: `You made a big decision and your new role at ${acceptedJob.company} is waiting in Work history. Take a breath and enjoy this moment.`,
      button: 'Celebrate this win'
    });
  };
  const submitContact = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const relatedJob = jobs.find(job => String(job.id) === String(data.jobId));
    const contact = {
      ...contactEditing,
      ...data,
      company: data.company.trim() || relatedJob?.company || '',
      id: contactEditing?.id || Date.now()
    };
    saveContacts(contactEditing ? contacts.map(item => item.id === contactEditing.id ? contact : item) : [contact, ...contacts]);
    setModal(null);
    setContactEditing(null);
    notify(contactEditing ? 'Recruiter contact updated' : 'Recruiter contact added');
  };
  const submitWorkHistory = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const workStatus = data.roleStatus || 'Current';
    const isCurrent = workStatus === 'Current';
    const entry = {
      ...employmentEditing,
      ...data,
      id: employmentEditing?.id || Date.now(),
      workStatus,
      isCurrent,
      endDate: workStatus === 'Past' ? data.endDate : '',
      endReason: workStatus === 'Past' ? data.endReason : ''
    };
    const exists = workHistory.some(item => item.id === employmentEditing?.id);
    const next = exists ? workHistory.map(item => item.id === employmentEditing.id ? entry : item) : [entry, ...workHistory];
    saveWorkHistory(next);
    setModal(null);
    setEmploymentEditing(null);
    notify(workStatus === 'Upcoming' ? 'Upcoming role saved' : isCurrent ? 'Current role saved' : 'Past role saved');
  };
  const openInterviews = () => {
    setView('Interviews');
    setFilter('Interview');
  };
  const submitJob = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const next = editing ? jobs.map(j => j.id === editing.id ? {
      ...j,
      ...data
    } : j) : [{
      ...data,
      id: Date.now()
    }, ...jobs];
    const newOffer = data.status === 'Offer' && editing?.status !== 'Offer';
    save(next);
    setModal(null);
    notify(newOffer ? 'Offer details saved' : editing ? 'Application updated' : 'Application added');
    if (newOffer) celebrate({
      eyebrow: 'LOOK AT YOU',
      title: 'You got an offer!',
      message: 'No matter how long the search took, you made it here. Take a well-earned break, then give yourself time to think through your offers.',
      button: 'Take a moment'
    });
  };
  const navItems = [{
    label: 'Overview',
    icon: 'grid'
  }, {
    label: 'Applications',
    icon: 'briefcase'
  }, {
    label: 'Offers',
    icon: 'award'
  }, {
    label: 'Work history',
    icon: 'briefcase'
  }, {
    label: 'Interviews',
    icon: 'calendar'
  }, {
    label: 'Recruiter contacts',
    icon: 'contacts'
  }, {
    label: 'Statistics',
    icon: 'chart'
  }];
  const toggleTheme = () => setDarkMode(current => {
    localStorage.setItem('job-tracker-theme', current ? 'light' : 'dark');
    return !current;
  });
  const changeUiScale = scale => {
    setUiScale(scale);
    localStorage.setItem('job-tracker-ui-scale', String(scale));
  };
  const saveProfile = (name, email) => {
    setProfileName(name);
    setProfileEmail(email);
    localStorage.setItem('job-tracker-name', name);
    localStorage.setItem('job-tracker-email', email);
  };
  if (!isLoggedIn) return <LoginScreen darkMode={darkMode} onSignIn={() => setIsLoggedIn(true)} />;
  return <div className={`app-shell${darkMode ? ' dark' : ''}`} style={{
    '--app-zoom': uiScale / 100
  }}>
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={() => setView('Overview')}><span className="brand-mark"><Icon name="briefcase" size={20} /></span>
      <span>trackr<span className="brand-dot">.</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{navItems.map(item => <button key={item.label} className={`nav-item ${view === item.label ? 'active' : ''}`} aria-label={item.label} title={item.label} onClick={() => {
          setView(item.label);
          if (item.label === 'Applications' || item.label === 'Interviews' || item.label === 'Offers') setFilter(item.label === 'Interviews' ? 'Interview' : item.label === 'Offers' ? 'Offer' : 'All applications');
        }}><Icon name={item.icon} />
        <span>{item.label}</span>{(item.label === 'Applications' || item.label === 'Offers') && <span className="nav-count">{item.label === 'Offers' ? jobs.filter(job => isOfferStatus(job.status)).length : jobs.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-tip"><span className="tip-spark">✳</span>
        <strong>One step at a time.</strong>
        <p>Every application brings you closer to the right opportunity.</p></div>
      <button className={`nav-item ${view === 'Settings' ? 'active' : ''}`} onClick={() => setView('Settings')}><Icon name="settings" />
        <span>Settings</span></button>
      <div className="profile"><div className="avatar user-avatar">{initials(profileName)}</div>
        <div><strong>{profileName}</strong>
          <small>{profileEmail}</small></div></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{view}</strong></div>
      <div className="topbar-actions"><button className="export-button" onClick={exportCsv}><Icon name="download" size={16} />
          <span>Export</span></button>
        <button className="primary-button small" onClick={() => openForm()}><Icon name="plus" size={17} /> Add application</button>
        <div className="avatar user-avatar top-avatar">{initials(profileName)}</div></div></header>
      {view === 'Settings' ? <section className="page settings-page"><div className="page-heading"><div><div className="eyebrow">PREFERENCES</div>
          <h1>Settings<span className="heading-period">.</span></h1>
          <p className="subheading">Make Trackr feel comfortable and useful for you.</p></div></div>
      <div className="settings-hero"><span className="settings-hero-icon"><Icon name="settings" size={24} /></span>
        <div><span className="eyebrow">YOUR WORKSPACE</span>
          <h2>A little more you.</h2>
          <p>Adjust how Trackr looks, choose what you want to see, and keep your account details up to date.</p></div>
        <div className="settings-hero-orbit orbit-a" />
        <div className="settings-hero-orbit orbit-b" /></div>
      <div className="settings-layout"><section className="settings-card settings-preferences"><div className="settings-card-heading"><div><h2>Display & preferences</h2>
              <p>Set up a workspace that feels easy to use.</p></div>
            <span className="account-icon"><Icon name="settings" /></span></div>
          <div className="settings-group-title"><span className="settings-group-icon">Aa</span>
            <div><strong>Display size</strong>
              <small>Scale the whole workspace to suit your reading comfort.</small></div>
            <span className="scale-current">{uiScale}%</span></div>
          <div className="scale-options" role="group" aria-label="Display size">{[90, 100, 110, 120].map(scale => <button type="button" key={scale} className={uiScale === scale ? 'active' : ''} aria-pressed={uiScale === scale} onClick={() => changeUiScale(scale)}><span>{scale === 90 ? 'Compact' : scale === 100 ? 'Default' : scale === 110 ? 'Large' : 'Extra large'}</span>
              <small>{scale}%</small></button>)}</div>
          <div className="settings-divider" />
          <div className="settings-group-title"><span className="settings-group-icon palette-icon">✦</span>
            <div><strong>Appearance</strong>
              <small>Choose a look that works for your day.</small></div></div>
          <label className="toggle-row"><span><strong>Dark mode</strong>
              <small>Use the darker color palette across your workspace.</small></span>
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} /></label>
          <div className="settings-divider" />
          <div className="settings-group-title"><span className="settings-group-icon">✓</span>
            <div><strong>Your workflow</strong>
              <small>Choose which helpful extras appear in your workspace.</small></div></div>
          <label className="toggle-row"><span><strong>Progress statistics</strong>
              <small>Show application and interview totals on your overview.</small></span>
            <input type="checkbox" checked={showStats} onChange={event => setShowStats(event.target.checked)} /></label>
          <label className="toggle-row"><span><strong>Rejection encouragement</strong>
              <small>Show a rotating reminder while you track your applications.</small></span>
            <input type="checkbox" checked={showQuotes} onChange={event => setShowQuotes(event.target.checked)} /></label>
          <button className="secondary-button settings-export" onClick={exportCsv}><Icon name="download" size={16} /> Export all applications</button></section>
        <AccountSettings name={profileName} email={profileEmail} onSaveProfile={saveProfile} onSignOut={() => {
            setView("Overview");
            setIsLoggedIn(false);
          }} notify={notify} /></div></section> : <section className="page">
        <div className="page-heading"><div><div className="eyebrow">{todayLabel}</div>
          <h1>{view === 'Overview' ? `Good morning, ${profileName.split(' ')[0]}` : view === 'Interviews' ? 'Your interviews' : view === 'Statistics' ? 'Your progress' : view === 'Offers' ? 'Compare your offers' : view === 'Work history' ? 'Your work history' : view === 'Recruiter contacts' ? 'People in your corner' : 'Applications'}<span className="heading-period">.</span></h1>
          <p className="subheading">{view === 'Overview' ? 'Here’s what’s happening with your job search.' : view === 'Interviews' ? 'Stay ready for every conversation.' : view === 'Statistics' ? 'A little progress is still progress.' : view === 'Offers' ? 'Compare compensation, benefits, and the details that matter to you.' : view === 'Work history' ? 'Keep track of your current and past roles.' : view === 'Recruiter contacts' ? 'Keep recruiter and hiring team details easy to find.' : 'Keep all your opportunities in one place.'}</p></div>
        <button className="primary-button" onClick={() => view === 'Work history' ? openEmploymentForm() : view === 'Recruiter contacts' ? (setContactEditing(null), setModal('contact')) : openForm()}><Icon name="plus" size={18} />{view === 'Offers' ? 'Add offer' : view === 'Work history' ? 'Add a role' : view === 'Recruiter contacts' ? 'Add contact' : 'Add application'}</button></div>
        {showStats && view !== 'Applications' && view !== 'Statistics' && view !== 'Offers' && view !== 'Work history' && <div className="stats-grid"><StatCard label="Applications sent" value={jobs.length} change="Keep the momentum going" icon="briefcase" tone="violet" />
        <StatCard label="In interview" value={count('Interview')} change="You’re making progress" icon="calendar" tone="peach" />
        <StatCard label="Offers received" value={count('Offer') + count('Accepted')} change="Look at you go" icon="chart" tone="green" />
        <StatCard label="Response rate" value={`${jobs.length ? Math.round(jobs.filter(j => ['Interview', 'Offer', 'Accepted', 'Rejected'].includes(j.status)).length / jobs.length * 100) : 0}%`} change="Companies getting back to you" icon="arrow" tone="blue" /></div>}
        {view === 'Offers' && <OfferComparison jobs={jobs} workHistory={workHistory} onEdit={openForm} onAdd={() => {
          setEditing(null);
          setModal('application');
        }} onAccept={acceptOffer} onReject={rejectedJob => {
          save(jobs.map(job => job.id === rejectedJob.id ? {
            ...job,
            status: 'Rejected'
          } : job));
          notify(`${rejectedJob.company}'s offer was marked rejected.`);
        }} />}
        {view === 'Work history' && <WorkHistory entries={workHistory} onAdd={() => openEmploymentForm()} onEdit={openEmploymentForm} onEnd={endEmployment} onStart={startEmployment} />}
        {view === 'Recruiter contacts' && <RecruiterContacts contacts={contacts} jobs={jobs} onAdd={() => {
          setContactEditing(null);
          setModal('contact');
        }} onEdit={contact => {
          setContactEditing(contact);
          setModal('contact');
        }} onDelete={contact => {
          saveContacts(contacts.filter(item => item.id !== contact.id));
          notify(`${contact.name} removed from contacts`);
        }} />}
        {view === 'Statistics' && <StatisticsDashboard jobs={jobs} />}
        {view === 'Interviews' && <InterviewPrep jobs={jobs} onOpen={openForm} />}
        {view === 'Overview' && <FollowUpList jobs={jobs} onOpen={openForm} />}
        {view !== 'Statistics' && view !== 'Offers' && view !== 'Work history' && view !== 'Recruiter contacts' && <div className={view === 'Applications' ? 'content-grid applications-workspace' : view === 'Interviews' ? 'content-grid interviews-workspace' : 'content-grid'}><div className="applications-card"><div className="card-title-row"><div><h2>{view === 'Interviews' ? 'Interview pipeline' : view === 'Applications' ? 'All applications' : 'Recent applications'}</h2>
              <p>{view === 'Interviews' ? 'Your conversations and next steps' : view === 'Applications' ? 'Every opportunity, organized by company.' : 'You’ve got this. Keep showing up.'}</p></div>{view === 'Overview' && <button className="text-button" onClick={() => {
                setView('Applications');
                setFilter('All applications');
              }}>View all <Icon name="arrow" size={15} /></button>}</div>
          <div className="table-toolbar"><div className="tabs">{['All applications', ...statuses].map(s => <button key={s} className={filter === s ? 'selected' : ''} aria-pressed={filter === s} onClick={() => setFilter(s)}>{s}<span>{s === 'All applications' ? jobs.length : count(s)}</span></button>)}</div>
            <label className="search"><Icon name="search" size={16} />
              <input placeholder="Search applications..." value={query} onChange={e => setQuery(e.target.value)} /></label></div>
          <div className="table-wrap"><table><thead><tr><th>COMPANY</th>
                  <th>DATE APPLIED</th>
                  <th>STATUS</th>
                  <th>LOCATION</th>
                  <th></th></tr></thead>
              <tbody>{companyGroups.map(group => {
                    const isGroup = group.jobs.length > 1;
                    const isExpanded = expandedCompanies[group.key] !== false;
                    return <Fragment key={group.key}>{isGroup && <tr className="company-group-row"><td colSpan="5"><button className="company-group-toggle" aria-expanded={isExpanded} onClick={() => setExpandedCompanies(current => ({
                            ...current,
                            [group.key]: !isExpanded
                          }))}><span className="group-chevron">{isExpanded ? '▾' : '▸'}</span>
                        <CompanyLogo job={group.jobs[0]} />
                        <span className="group-name">{group.company}</span>
                        <span className="group-count">{group.jobs.length} applications</span>
                        <span className="group-hint">{isExpanded ? 'Collapse group' : 'View roles'}</span></button></td></tr>}{(!isGroup || isExpanded) && group.jobs.map(job => <ApplicationRow key={job.id} job={job} onOpen={openForm} grouped={isGroup} />)}</Fragment>;
                  })}</tbody></table>{filtered.length === 0 && <div className="empty-state">No applications found. Try another search or add one to get started.</div>}</div>
          <div className="table-footer">Showing <strong>{view === 'Applications' ? filtered.length : Math.min(filtered.length, 6)}</strong> of <strong>{filtered.length}</strong> applications {view === 'Overview' && <button onClick={() => setView('Applications')}>See all applications <Icon name="arrow" size={14} /></button>}</div></div>
          {view !== 'Applications' && <aside className={view === 'Interviews' ? 'right-column interview-calendar-sidebar' : 'right-column'}>{view === 'Interviews' ? <InterviewCalendar jobs={jobs.filter(job => job.interview && !['Rejected', 'Accepted'].includes(job.status))} onOpen={openForm} /> : <><div className="interviews-card"><div className="card-title-row"><div><button className="upcoming-title" onClick={openInterviews}><h2>Upcoming interviews</h2>
                    <Icon name="arrow" size={15} /></button>
                  <p>Get ready to shine</p></div>
                <button className="icon-button calendar-more" aria-label="View interview calendar" onClick={openInterviews}><Icon name="arrow" size={16} /></button></div>{upcoming.length ? <div className="interview-list">{upcoming.slice(0, 3).map(j => <div className="interview-item" key={j.id}><div className="date-block"><strong>{new Date(`${j.interview}T12:00:00`).getDate()}</strong>
                    <small>{new Date(`${j.interview}T12:00:00`).toLocaleDateString('en-US', {
                          month: 'short'
                        })}</small></div>
                  <div className="interview-info"><strong>{j.company}</strong>
                    <small>{j.role}</small>
                    <span>Interview · {prettyDate(j.interview)}</span></div>
                  <button className="icon-button" aria-label="Edit interview" onClick={() => openForm(j)}><Icon name="arrow" size={15} /></button></div>)}</div> : <div className="no-interviews"><div className="calendar-illustration"><Icon name="calendar" size={21} /></div>
                <strong>No upcoming interviews</strong>
                <p>Add an interview date to an application and it’ll show up here.</p></div>}<button className="calendar-link" onClick={openInterviews}>Open interview calendar <Icon name="arrow" size={15} /></button></div>{showQuotes && <QuoteCarousel />}</>}</aside>}</div>}
      </section>}
      <footer className="footer"><span>Made for the in-between.</span>
      <span>Take it one application at a time <span className="footer-heart">♥</span></span></footer>
    </main>
    {modal === 'application' && <ApplicationModal editing={editing} view={view} statuses={statuses} jobs={jobs} setModal={setModal} save={save} notify={notify} submitJob={submitJob} />}
    {modal === 'contact' && <ContactModal contactEditing={contactEditing} setModal={setModal} setContactEditing={setContactEditing} submitContact={submitContact} jobs={jobs} />}
    {modal === 'end-reason' && endingRole && <EndReasonModal endingRole={endingRole} submitEndReason={submitEndReason} />}
    {modal === 'work-history' && <WorkHistoryModal employmentEditing={employmentEditing} roleStage={roleStage} toDateKey={toDateKey} setModal={setModal} setEmploymentEditing={setEmploymentEditing} submitWorkHistory={submitWorkHistory} />}
    {notice && <div className="toast">{notice}</div>}
    {celebration && <OfferCelebration {...celebration} onClose={() => setCelebration(null)} />}
  </div>;
}
export default App;
