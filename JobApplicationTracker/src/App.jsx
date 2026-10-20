import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './styles/visualRefresh.css';
import './styles/mobile.css';
import { initialJobs, statuses, isOfferStatus } from './data/initialData.js';
import { samplePortfolioProjects } from './data/samplePortfolio.js';
import { historyEntryFromOffer, initials, roleStage } from './utils/jobUtils.js';
import { prettyDate, toDateKey } from './utils/dateUtils.js';
import { CompanyLogo, Icon } from './components/shared/Ui.jsx';
import { CurrencyPicker } from './components/shared/CurrencyPicker.jsx';
import { ApplicationRow } from './components/applications/ApplicationRow.jsx';
import { InterviewCalendar } from './components/interviews/InterviewCalendar.jsx';
import { StatCard, StatisticsDashboard } from './components/dashboard/StatisticsDashboard.jsx';
import { LoginScreen } from './components/auth/LoginScreen.jsx';
import { AccountSettings } from './components/settings/AccountSettings.jsx';
import { QuoteCarousel } from './components/dashboard/QuoteCarousel.jsx';
import { OfferComparison } from './components/offers/OfferComparison.jsx';
import { WorkHistory } from './components/work-history/WorkHistory.jsx';
import { PortfolioProjects } from './components/work-history/PortfolioProjects.jsx';
import { FollowUpList } from './components/dashboard/FollowUpList.jsx';
import { InterviewPrep } from './components/interviews/InterviewPrep.jsx';
import { createDemoStudyNotes, StudyArea } from './components/study/StudyArea.jsx';
import { RecruiterContacts } from './components/contacts/RecruiterContacts.jsx';
import { OfferCelebration } from './components/celebration/OfferCelebration.jsx';
import { ApplicationModal } from './components/forms/ApplicationModal.jsx';
import { OfferModal } from './components/forms/OfferModal.jsx';
import { ContactModal } from './components/forms/ContactModal.jsx';
import { EndReasonModal } from './components/forms/EndReasonModal.jsx';
import { WorkHistoryModal } from './components/forms/WorkHistoryModal.jsx';
import { PortfolioProjectModal } from './components/forms/PortfolioProjectModal.jsx';
import { FollowUpModal } from './components/forms/FollowUpModal.jsx';
import { InterviewRoundModal } from './components/forms/InterviewRoundModal.jsx';
import { InterviewNextStepModal } from './components/forms/InterviewNextStepModal.jsx';
import { PendingInterviewUpdateModal } from './components/forms/PendingInterviewUpdateModal.jsx';
import { getRoleGuidance } from './utils/roleGuidance.js';
import { getInterviewEvents, getInterviewRounds, isInterviewInProgress } from './utils/interviewUtils.js';
import { demoContacts, demoJobs, demoWorkHistory } from './data/demoWorkspace.js';

function readExchangeRateCache() {
  try { return JSON.parse(localStorage.getItem('job-tracker-exchange-rates')) || { rates: { USD: 1 }, date: '' }; }
  catch { return { rates: { USD: 1 }, date: '' }; }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [celebration, setCelebration] = useState(null);
  const [profileName, setProfileName] = useState(() => localStorage.getItem('job-tracker-name') || 'Alex Steinberg');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('job-tracker-email') || 'alex@example.com');
  const [profileDetails, setProfileDetails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('job-tracker-profile-details')) || {};
    } catch {
      return {};
    }
  });
  const [targetRoles, setTargetRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('job-tracker-target-roles')) || [];
    } catch {
      return [];
    }
  });
  const roleGuidance = getRoleGuidance(targetRoles);
  const [displayCurrency, setDisplayCurrency] = useState(() => localStorage.getItem('job-tracker-display-currency') || 'USD');
  const [exchangeRateData, setExchangeRateData] = useState(readExchangeRateCache);
  const [exchangeRateStatus, setExchangeRateStatus] = useState(() => {
    const cache = readExchangeRateCache();
    return cache.date ? 'ready' : 'loading';
  });
  const refreshExchangeRates = useCallback(async () => {
    setExchangeRateStatus('loading');
    try {
      const currencies = 'AUD,CAD,CHF,CNY,EUR,GBP,INR,JPY,MXN,NZD,SGD,USD';
      const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=USD&quotes=${currencies}`);
      if (!response.ok) throw new Error('Could not load exchange rates');
      const rows = await response.json();
      const rates = { USD: 1 };
      rows.forEach(row => { rates[row.quote] = row.rate; });
      const date = rows[0]?.date || '';
      const next = { rates, date };
      setExchangeRateData(next);
      localStorage.setItem('job-tracker-exchange-rates', JSON.stringify(next));
      setExchangeRateStatus('ready');
    } catch {
      setExchangeRateStatus('unavailable');
    }
  }, []);
  const updateDisplayCurrency = currency => {
    setDisplayCurrency(currency);
    localStorage.setItem('job-tracker-display-currency', currency);
  };
  useEffect(() => {
    const cache = readExchangeRateCache();
    if (!cache.date || Date.now() - new Date(cache.date).getTime() >= 24 * 60 * 60 * 1000) {
      const timer = window.setTimeout(() => refreshExchangeRates(), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [refreshExchangeRates]);
  const [jobs, setJobs] = useState(() => {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('job-tracker-jobs'));
      return Array.isArray(savedJobs) ? savedJobs : initialJobs;
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
  const [portfolioProjects, setPortfolioProjects] = useState(() => {
    const storageKey = 'job-tracker-portfolio-projects';
    const demoSeededKey = 'job-tracker-portfolio-demo-seeded';
    let savedProjects = null;
    try {
      const saved = localStorage.getItem(storageKey);
      savedProjects = saved ? JSON.parse(saved) : null;
    } catch {
      savedProjects = null;
    }
    if (Array.isArray(savedProjects) && savedProjects.length) {
      const photoSample = samplePortfolioProjects.find(project => project.id === 'demo-photo-project');
      const upgradedProjects = savedProjects.map(project => project.isDemo && project.id === 'demo-photo-project' && (project.images?.length || 0) < 3
        ? { ...project, image: photoSample.image, imageAlt: photoSample.imageAlt, images: photoSample.images, imageAlts: photoSample.imageAlts }
        : project);
      if (upgradedProjects.some((project, index) => project !== savedProjects[index])) {
        localStorage.setItem(storageKey, JSON.stringify(upgradedProjects));
      }
      return upgradedProjects;
    }
    if (localStorage.getItem(demoSeededKey) === 'true') return Array.isArray(savedProjects) ? savedProjects : [];
    localStorage.setItem(demoSeededKey, 'true');
    localStorage.setItem(storageKey, JSON.stringify(samplePortfolioProjects));
    return samplePortfolioProjects;
  });
  const [studyResetVersion, setStudyResetVersion] = useState(0);
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
  const [interviewTargetJob, setInterviewTargetJob] = useState(null);
  const [interviewEditingRound, setInterviewEditingRound] = useState(null);
  const [interviewNextStep, setInterviewNextStep] = useState(null);
  const [pendingInterviewUpdate, setPendingInterviewUpdate] = useState(null);
  const [employmentEditing, setEmploymentEditing] = useState(null);
  const [portfolioEditing, setPortfolioEditing] = useState(null);
  const [contactEditing, setContactEditing] = useState(null);
  const [endingRole, setEndingRole] = useState(null);
  const [showQuotes, setShowQuotes] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('job-tracker-theme') !== 'light');
  const [uiScale, setUiScale] = useState(() => {
    const saved = Number(localStorage.getItem('job-tracker-ui-scale'));
    return [90, 100, 110, 120].includes(saved) ? saved : 100;
  });
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const seedVersionKey = 'job-tracker-demo-workspace-v3';
    const interviewStageMigrationKey = 'job-tracker-demo-interview-stage-v1';
    // Keep demo data repairs idempotent: an older preview may have the seed
    // marker but still be missing newly added sample rounds or offer fields.
    let savedJobs = Array.isArray(jobs) ? jobs : initialJobs;
    try {
      const storedJobs = JSON.parse(localStorage.getItem('job-tracker-jobs'));
      if (Array.isArray(storedJobs)) savedJobs = storedJobs;
    } catch {
      // Fall back to the already loaded workspace if saved data is malformed.
    }
    const repairDemoInterviewStage = localStorage.getItem(interviewStageMigrationKey) !== 'true';
    const today = toDateKey(new Date());
    const mergedJobs = [...savedJobs];
    demoJobs.forEach(sample => {
      const existingIndex = mergedJobs.findIndex(job => String(job.id) === String(sample.id));
      if (existingIndex < 0) {
        mergedJobs.push(sample);
      } else {
        const existing = mergedJobs[existingIndex];
        const shouldRepairStage = sample.id === 'demo-interview-role' && repairDemoInterviewStage;
        const shouldAddRounds = sample.id === 'demo-interview-role' && Array.isArray(sample.interviews);
        if (!shouldRepairStage && !shouldAddRounds) return;
        const existingRounds = Array.isArray(existing.interviews) ? existing.interviews : [];
        const repairedRounds = shouldAddRounds
          ? [
              ...sample.interviews.map(sampleRound => {
                const savedRound = existingRounds.find(round => String(round.id) === String(sampleRound.id));
                if (!savedRound) return sampleRound;
                // Preserve edits, but keep a scheduled sample round usable after its date passes.
                const savedDate = savedRound.date || savedRound.interview || '';
                const shouldRefreshDate = (!savedRound.outcome || savedRound.outcome === 'Scheduled') && savedDate && savedDate < today;
                return {
                  ...sampleRound,
                  ...savedRound,
                  ...(shouldRefreshDate ? { date: sampleRound.date } : {}),
                  ...(savedRound.outcome === 'Scheduled' && !savedRound.meetingLink && sampleRound.meetingLink ? { meetingLink: sampleRound.meetingLink } : {})
                };
              }),
              ...existingRounds.filter(round => !sample.interviews.some(sampleRound => String(sampleRound.id) === String(round.id)))
            ]
          : existingRounds;
        mergedJobs[existingIndex] = {
          ...existing,
          ...(shouldRepairStage ? { status: sample.status } : {}),
          ...(shouldAddRounds ? { interviews: repairedRounds } : {}),
          followUpDate: existing.followUpDate || sample.followUpDate,
          followUpAction: existing.followUpAction || sample.followUpAction
        };
      }
    });
    // Earlier versions stored interview follow-ups as In review. Migrate those
    // records to the distinct Pending stage without changing pre-interview jobs.
    const normalizedJobs = mergedJobs.map(job => job.status === 'In review' && getInterviewRounds(job).some(round => ['Needs follow-up', 'Waiting to hear back'].includes(round.outcome))
      ? { ...job, status: 'Pending' }
      : job);
    setJobs(normalizedJobs);
    localStorage.setItem('job-tracker-jobs', JSON.stringify(normalizedJobs));

    const mergedHistory = [...workHistory];
    [...demoWorkHistory, ...demoJobs.filter(job => job.status === 'Accepted').map(historyEntryFromOffer)].forEach(sample => {
      if (!mergedHistory.some(entry => String(entry.id) === String(sample.id))) mergedHistory.push(sample);
    });
    setWorkHistory(mergedHistory);
    localStorage.setItem('job-tracker-work-history', JSON.stringify(mergedHistory));

    let savedContacts = [];
    try {
      savedContacts = JSON.parse(localStorage.getItem('job-tracker-recruiter-contacts')) || contacts;
    } catch {
      savedContacts = contacts;
    }
    const mergedContacts = [...savedContacts];
    demoContacts.forEach(sample => {
      if (!mergedContacts.some(contact => String(contact.id) === String(sample.id))) mergedContacts.push(sample);
    });
    setContacts(mergedContacts);
    localStorage.setItem('job-tracker-recruiter-contacts', JSON.stringify(mergedContacts));
    localStorage.setItem(seedVersionKey, 'true');
    localStorage.setItem(interviewStageMigrationKey, 'true');
  }, []);
  useEffect(() => {
    if (!profileMenuOpen) return undefined;
    const dismissOnOutsideClick = event => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false);
    };
    const dismissOnEscape = event => {
      if (event.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('pointerdown', dismissOnOutsideClick);
    document.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOnOutsideClick);
      document.removeEventListener('keydown', dismissOnEscape);
    };
  }, [profileMenuOpen]);
  const save = next => {
    setJobs(next);
    localStorage.setItem('job-tracker-jobs', JSON.stringify(next));
  };
  const saveWorkHistory = next => {
    setWorkHistory(next);
    localStorage.setItem('job-tracker-work-history', JSON.stringify(next));
  };
  const savePortfolioProjects = next => {
    try {
      localStorage.setItem('job-tracker-portfolio-projects', JSON.stringify(next));
      setPortfolioProjects(next);
      return true;
    } catch {
      notify('Browser storage is full. Remove a large project image and try again.');
      return false;
    }
  };
  const savePortfolioProject = project => {
    const exists = portfolioProjects.some(item => item.id === project.id);
    if (!savePortfolioProjects(exists ? portfolioProjects.map(item => item.id === project.id ? project : item) : [project, ...portfolioProjects])) return;
    setModal(null);
    setPortfolioEditing(null);
    notify(exists ? 'Portfolio project updated' : 'Portfolio project added');
  };
  const saveContacts = next => {
    setContacts(next);
    localStorage.setItem('job-tracker-recruiter-contacts', JSON.stringify(next));
  };
  const restoreSampleWorkspace = () => {
    if (!window.confirm('Replace your saved applications, work history, contacts, portfolio, and study notes with the sample workspace? Your profile and display preferences will stay as they are.')) return;

    const copy = value => JSON.parse(JSON.stringify(value));
    const sampleJobs = copy([...initialJobs, ...demoJobs]);
    const sampleHistory = copy([...demoWorkHistory, ...demoJobs.filter(job => job.status === 'Accepted').map(historyEntryFromOffer)]);
    const sampleContacts = copy(demoContacts);
    const sampleProjects = copy(samplePortfolioProjects);
    const sampleNotes = createDemoStudyNotes();

    setJobs(sampleJobs);
    setWorkHistory(sampleHistory);
    setContacts(sampleContacts);
    setPortfolioProjects(sampleProjects);
    localStorage.setItem('job-tracker-jobs', JSON.stringify(sampleJobs));
    localStorage.setItem('job-tracker-work-history', JSON.stringify(sampleHistory));
    localStorage.setItem('job-tracker-recruiter-contacts', JSON.stringify(sampleContacts));
    localStorage.setItem('job-tracker-portfolio-projects', JSON.stringify(sampleProjects));
    localStorage.setItem('job-tracker-study-notes', JSON.stringify(sampleNotes));
    localStorage.setItem('job-tracker-study-demo-seeded', 'true');
    localStorage.setItem('job-tracker-portfolio-demo-seeded', 'true');
    localStorage.setItem('job-tracker-demo-workspace-v3', 'true');
    localStorage.setItem('job-tracker-demo-interview-stage-v1', 'true');
    setStudyResetVersion(version => version + 1);
    setFilter('All applications');
    setQuery('');
    setNotice('Sample workspace restored. You can explore every page with preview data.');
    window.setTimeout(() => setNotice(''), 3200);
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
  const upcoming = getInterviewEvents(jobs.filter(isInterviewInProgress)).filter(interview => interview.interview >= today).sort((a, b) => a.interview.localeCompare(b.interview));
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
  const openOfferForm = (job = null) => {
    setEditing(job);
    setModal('offer');
  };
  const openEmploymentForm = (entry = null) => {
    setEmploymentEditing(entry);
    setModal('work-history');
  };
  const handlePageAdd = () => {
    if (view === 'Applications') openForm();
    if (view === 'Offers') {
      openOfferForm();
    }
    if (view === 'Work history') openEmploymentForm();
    if (view === 'Portfolio') {
      setPortfolioEditing(null);
      setModal('portfolio-project');
    }
    if (view === 'Recruiter contacts') {
      setContactEditing(null);
      setModal('contact');
    }
    if (view === 'Follow-ups') openFollowUpForm();
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
  const updateApplicationStage = (job, status) => {
    if (status === 'Offer' && job.status !== 'Offer') {
      setEditing({ ...job, _targetStatus: 'Offer' });
      setModal('offer');
      return;
    }
    if (status === 'Interview' && job.status !== 'Interview') {
      setInterviewTargetJob(job);
      setInterviewEditingRound(null);
      setModal('interview-round');
      return;
    }
    if (status === 'Accepted' && job.status !== 'Accepted') {
      acceptOffer(job);
      return;
    }
    save(jobs.map(item => item.id === job.id ? { ...item, status } : item));
    notify(`${job.company} moved to ${status}`);
  };
  const submitInterviewRound = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const selectedJob = interviewTargetJob || jobs.find(job => String(job.id) === String(data.jobId));
    if (!selectedJob) return;
    const currentRounds = getInterviewRounds(selectedJob);
    const newRound = { ...data, label: data.label.trim() || `Round ${currentRounds.length + 1}`, outcome: data.outcome || interviewEditingRound?.outcome || 'Scheduled', id: interviewEditingRound?.interviewId || interviewEditingRound?.id || Date.now(), date: data.date };
    delete newRound.jobId;
    const updatedJobs = jobs.map(job => job.id === selectedJob.id ? {
      ...job,
      status: 'Interview',
      interviews: interviewEditingRound ? currentRounds.map(round => String(round.id) === String(newRound.id) ? newRound : round) : [...currentRounds, newRound]
    } : job);
    save(updatedJobs);
    setModal(null);
    setInterviewTargetJob(null);
    setInterviewEditingRound(null);
    notify(interviewEditingRound ? 'Interview details updated' : `Interview scheduled with ${selectedJob.company}`);
    celebrate({
      eyebrow: 'YOU SHOWED UP',
      title: interviewEditingRound ? 'You’re getting ready for this.' : 'Another step forward!',
      message: `${selectedJob.company} is moving ahead. Take a moment to recognize your progress, then use your prep notes whenever you’re ready.`,
      button: 'Keep going'
    });
  };
  const openInterviewRound = (interview, round = null) => {
    const job = jobs.find(item => String(item.id) === String(interview.id));
    setInterviewTargetJob(job || interview);
    setInterviewEditingRound(round || (interview.interviewId ? interview : null));
    setModal('interview-round');
  };
  const updateInterviewOutcome = (jobId, roundId, outcome) => {
    const trackedJob = jobs.find(job => String(job.id) === String(jobId));
    if (!trackedJob) return;
    const rounds = getInterviewRounds(trackedJob).map(round => String(round.id) === String(roundId) ? { ...round, outcome } : round);
    const nextStatus = outcome === 'Waiting to hear back' ? 'Pending' : trackedJob.status;
    save(jobs.map(job => String(job.id) === String(jobId) ? { ...job, status: nextStatus, interviews: rounds } : job));
    if (outcome === 'Waiting to hear back') {
      notify(`${trackedJob.company} moved to Pending while you wait for a response`);
      return;
    }
    const changedRound = rounds.find(round => String(round.id) === String(roundId));
    if (outcome !== 'Scheduled') setInterviewNextStep({ jobId, roundId, company: trackedJob.company, outcome, questionsAsked: changedRound?.questionsAsked || '', reflection: changedRound?.reflection || '' });
  };
  const handlePendingInterviewUpdate = (job, round, outcome) => {
    const rounds = getInterviewRounds(job).map(item => String(item.id) === String(round.interviewId || round.id)
      ? { ...item, outcome: outcome === 'continue' ? 'Moving to next round' : 'Not moving forward' }
      : item);
    if (outcome === 'continue') {
      const updatedJob = { ...job, status: 'Interview', interviews: rounds };
      save(jobs.map(item => String(item.id) === String(job.id) ? updatedJob : item));
      setPendingInterviewUpdate(null);
      setInterviewTargetJob(updatedJob);
      setInterviewEditingRound(null);
      setModal('interview-round');
      notify(`${job.company} would like to continue the conversation. Add the next round when you’re ready.`);
      return;
    }
    save(jobs.map(item => String(item.id) === String(job.id) ? { ...item, status: 'Rejected', interviews: rounds } : item));
    setPendingInterviewUpdate(null);
    notify(`Saved the update from ${job.company}. Your interview notes are still here if you want to review them.`);
  };
  const finishInterviewNextStep = (action, notes = {}) => {
    if (!interviewNextStep) return;
    const trackedJob = jobs.find(job => String(job.id) === String(interviewNextStep.jobId));
    if (!trackedJob) {
      setInterviewNextStep(null);
      return;
    }
    const rounds = getInterviewRounds(trackedJob).map(round => String(round.id) === String(interviewNextStep.roundId) ? {
      ...round,
      ...(action === 'pending' ? { outcome: 'Waiting to hear back' } : {}),
      questionsAsked: notes.questionsAsked ?? round.questionsAsked ?? '',
      reflection: notes.reflection ?? round.reflection ?? ''
    } : round);
    const nextStatus = action === 'pending' || action === 'follow-up' ? 'Pending' : action === 'rejected' ? 'Rejected' : trackedJob.status;
    const updatedJob = { ...trackedJob, status: nextStatus, interviews: rounds, ...(action === 'follow-up' ? { followUpDate: notes.followUpDate, followUpAction: notes.followUpAction } : {}) };
    const updatedJobs = jobs.map(job => String(job.id) === String(interviewNextStep.jobId) ? updatedJob : job);
    save(updatedJobs);
    if (action === 'add-round' && trackedJob) {
      setInterviewTargetJob(updatedJob);
      setInterviewEditingRound(null);
      setInterviewNextStep(null);
      setModal('interview-round');
      return;
    }
    if (action === 'pending' && trackedJob) {
      notify(`${trackedJob.company} moved to Pending while you wait for a response`);
    }
    if (action === 'follow-up' && trackedJob) {
      notify(`Follow-up reminder added for ${trackedJob.company}; application moved to Pending`);
    }
    if (action === 'rejected' && trackedJob) {
      notify(`${trackedJob.company} application marked rejected`);
    }
    setInterviewNextStep(null);
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
  const openFollowUpForm = () => {
    const activeJobs = jobs.filter(job => !['Rejected', 'Accepted'].includes(job.status));
    if (!activeJobs.length) {
      setView('Applications');
      openForm();
      notify('Add an application first, then set a follow-up reminder.');
      return;
    }
    setModal('follow-up');
  };
  const submitFollowUp = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const updatedJobs = jobs.map(job => String(job.id) === data.jobId
      ? { ...job, followUpDate: data.followUpDate, followUpAction: data.followUpAction.trim() }
      : job);
    save(updatedJobs);
    setModal(null);
    notify('Follow-up reminder added');
  };
  const completeFollowUp = job => {
    save(jobs.map(item => String(item.id) === String(job.id)
      ? { ...item, followUpDate: '', followUpAction: '' }
      : item));
    notify(`Follow-up for ${job.company} marked complete`);
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
      status: 'Applied',
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
  const submitOffer = (event, applicationId) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const selectedId = editing ? String(editing.id) : String(applicationId || data.applicationId || '');
    const selectedJob = jobs.find(job => String(job.id) === selectedId);
    if (!selectedJob) {
      notify('Choose an application before saving the offer.');
      return;
    }
    const packageDetails = { ...data };
    delete packageDetails.applicationId;
    const next = jobs.map(job => String(job.id) === selectedId ? {
      ...job,
      ...packageDetails,
      status: editing?._targetStatus || (editing ? job.status : 'Offer')
    } : job);
    save(next);
    setModal(null);
    setEditing(null);
    notify(editing && !editing._targetStatus ? 'Offer package updated' : 'Offer details saved');
    if (!editing || editing._targetStatus === 'Offer') celebrate({
      eyebrow: 'LOOK AT YOU',
      title: 'You got an offer!',
      message: 'No matter how long the search took, you made it here. Take a well-earned break, then give yourself time to think through your offers.',
      button: 'Take a moment'
    });
  };
  const navGroups = [{
    label: 'JOB SEARCH',
    items: [{ label: 'Overview', icon: 'grid' }, { label: 'Applications', icon: 'briefcase' }, { label: 'Follow-ups', icon: 'calendar' }, { label: 'Interviews', icon: 'calendar' }]
  }, {
    label: 'PERSONAL TOOLKIT',
    items: [{ label: 'Study area', icon: 'book' }, { label: 'Recruiter contacts', icon: 'contacts' }, { label: 'Portfolio', icon: 'portfolio' }]
  }, {
    label: 'CAREER',
    items: [{ label: 'Offers', icon: 'award' }, { label: 'Work history', icon: 'briefcase' }]
  }, {
    label: 'INSIGHTS',
    items: [{ label: 'Statistics', icon: 'chart' }]
  }];
  const toggleTheme = () => setDarkMode(current => {
    localStorage.setItem('job-tracker-theme', current ? 'light' : 'dark');
    return !current;
  });
  const changeUiScale = scale => {
    setUiScale(scale);
    localStorage.setItem('job-tracker-ui-scale', String(scale));
  };
  const saveProfile = (name, email, details, roles) => {
    setProfileName(name);
    setProfileEmail(email);
    setProfileDetails(details);
    setTargetRoles(roles);
    localStorage.setItem('job-tracker-name', name);
    localStorage.setItem('job-tracker-email', email);
    localStorage.setItem('job-tracker-profile-details', JSON.stringify(details));
    localStorage.setItem('job-tracker-target-roles', JSON.stringify(roles));
  };
  const signOut = () => {
    setView('Overview');
    setIsLoggedIn(false);
    setProfileMenuOpen(false);
    setSidebarOpen(false);
  };
  if (!isLoggedIn) return <LoginScreen darkMode={darkMode} onSignIn={account => {
    if (account) {
      setProfileName(account.name);
      setProfileEmail(account.email);
      setTargetRoles(account.targetRoles);
      localStorage.setItem('job-tracker-name', account.name);
      localStorage.setItem('job-tracker-email', account.email);
      localStorage.setItem('job-tracker-target-roles', JSON.stringify(account.targetRoles));
    }
    setIsLoggedIn(true);
  }} />;
  return <div className={`app-shell${darkMode ? ' dark' : ''}${sidebarOpen ? ' sidebar-open' : ''}`} style={{
    '--app-zoom': uiScale / 100
  }}>
    {sidebarOpen && <button className="sidebar-touch-overlay" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={() => setView('Overview')}><span className="brand-mark"><Icon name="briefcase" size={20} /></span>
      <span>trackr<span className="brand-dot">.</span></span></a>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <div className="sidebar-navigation">{navGroups.map(group => <section className="nav-group" key={group.label} aria-label={group.label}>
        <div className="nav-group-label">{group.label}</div><nav>{group.items.map(item => <button key={item.label} className={`nav-item ${view === item.label ? 'active' : ''}`} aria-label={item.label} aria-current={view === item.label ? 'page' : undefined} title={item.label} onClick={() => {
          setView(item.label);
          setSidebarOpen(false);
          if (item.label === 'Applications' || item.label === 'Interviews' || item.label === 'Offers') setFilter(item.label === 'Interviews' ? 'Interview' : item.label === 'Offers' ? 'Offer' : 'All applications');
        }}><Icon name={item.icon} />
        <span>{item.label}</span>{(item.label === 'Applications' || item.label === 'Offers') && <span className="nav-count">{item.label === 'Offers' ? jobs.filter(job => isOfferStatus(job.status)).length : jobs.length}</span>}</button>)}</nav>
      </section>)}</div>
      <div className="sidebar-bottom"><div className="sidebar-tip"><span className="tip-spark">✳</span>
        <strong>One step at a time.</strong>
        <p>{roleGuidance.focus}</p></div>
      <div className="profile"><div className="avatar user-avatar">{initials(profileName)}</div>
        <div><strong>{profileName}</strong>
          <small>{profileEmail}</small></div></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="sidebar-menu-toggle" type="button" aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(open => !open)}><Icon name="menu" size={20} /></button><div className="breadcrumb">Workspace <span>/</span> <strong>{view}</strong></div>
      <div className="topbar-actions"><button className="export-button" onClick={exportCsv}><Icon name="download" size={16} />
          <span>Export</span></button>
        <div className="profile-menu" ref={profileMenuRef}><button type="button" className="profile-menu-trigger" aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen(open => !open)}><span className="avatar user-avatar top-avatar">{initials(profileName)}</span><span className="profile-menu-name">{profileName}</span><Icon name="chevronDown" size={15} /></button>
          {profileMenuOpen && <div className="profile-dropdown" role="menu"><div className="profile-dropdown-identity"><span className="avatar user-avatar">{initials(profileName)}</span><span><strong>{profileName}</strong><small>{profileEmail}</small></span></div><button type="button" role="menuitem" onClick={() => { setView('Settings'); setProfileMenuOpen(false); }}><Icon name="settings" size={17} />Settings</button><button type="button" role="menuitem" onClick={signOut}><Icon name="logout" size={17} />Sign out</button></div>}</div></div></header>
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
          <div className="settings-group-title"><span className="settings-group-icon">$</span><div><strong>Display currency</strong><small>Convert saved pay amounts for comparison. Original amounts stay saved.</small></div></div>
          <div className="currency-setting"><span>Show compensation in</span><CurrencyPicker value={displayCurrency} onChange={updateDisplayCurrency} /></div>
          <div className="exchange-rate-status">{exchangeRateStatus === 'ready' && exchangeRateData.date ? <>Indicative rates updated {new Date(`${exchangeRateData.date}T12:00:00`).toLocaleDateString()} · <a href="https://frankfurter.dev/" target="_blank" rel="noreferrer">rate source</a></> : exchangeRateStatus === 'loading' ? 'Loading current exchange rates…' : 'Exchange rates are unavailable. Amounts without a current rate stay in their original currency.'}<button type="button" className="text-button" onClick={refreshExchangeRates}>Refresh rates</button></div>
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
          <div className="settings-divider" />
          <div className="settings-group-title"><span className="settings-group-icon">↻</span>
            <div><strong>Frontend preview data</strong>
              <small>Restore sample applications, interviews, offers, contacts, work history, portfolio projects, and study notes to explore the interface. Your profile and preferences stay unchanged.</small></div></div>
          <button className="secondary-button settings-export" type="button" onClick={restoreSampleWorkspace}><Icon name="refresh" size={16} /> Restore sample workspace</button>
          <button className="secondary-button settings-export" onClick={exportCsv}><Icon name="download" size={16} /> Export all applications</button></section>
        <AccountSettings name={profileName} email={profileEmail} details={profileDetails} targetRoles={targetRoles} onSaveProfile={saveProfile} onSignOut={signOut} notify={notify} /></div></section> : <section className="page">
        <div className="page-heading"><div><div className="eyebrow">{todayLabel}</div>
          <h1>{view === 'Overview' ? `Good morning, ${profileName.split(' ')[0]}` : view === 'Interviews' ? 'Your interviews' : view === 'Follow-ups' ? 'Your follow-ups' : view === 'Statistics' ? 'Your progress' : view === 'Offers' ? 'Compare your offers' : view === 'Work history' ? 'Your work history' : view === 'Portfolio' ? 'Your portfolio' : view === 'Recruiter contacts' ? 'People in your corner' : view === 'Study area' ? 'Your study space' : 'Applications'}<span className="heading-period">.</span></h1>
          <p className="subheading">{view === 'Overview' ? 'Keep your job search organized from your first application to your final offer. Track opportunities, prepare for interviews, and stay on top of follow-ups—all in one place.' : view === 'Interviews' ? 'Stay ready for every conversation.' : view === 'Follow-ups' ? 'Set reminders to check in and keep each opportunity moving.' : view === 'Statistics' ? 'A little progress is still progress.' : view === 'Offers' ? 'Compare compensation, benefits, and the details that matter to you.' : view === 'Work history' ? 'Keep track of your current and past roles.' : view === 'Portfolio' ? 'Collect your work samples and share them when you are ready.' : view === 'Recruiter contacts' ? 'Keep recruiter and hiring team details easy to find.' : view === 'Study area' ? 'A personal place to practice, reflect, and keep learning.' : 'Keep all your opportunities in one place.'}</p>
          {view === 'Overview' && targetRoles.length > 0 && <div className="target-role-focus" aria-label="Your target roles"><span>YOUR FOCUS</span>{targetRoles.map(role => <span className="target-role-chip" key={role}>{role}</span>)}</div>}</div>
        {['Applications', 'Follow-ups', 'Offers', 'Work history', 'Portfolio', 'Recruiter contacts'].includes(view) && <button className="primary-button" onClick={handlePageAdd}><Icon name="plus" size={18} />{view === 'Offers' ? 'Add offer' : view === 'Work history' ? 'Add a role' : view === 'Portfolio' ? 'Add a project' : view === 'Recruiter contacts' ? 'Add contact' : view === 'Follow-ups' ? 'Add follow-up' : 'Add application'}</button>}</div>
        {showStats && view !== 'Applications' && view !== 'Interviews' && view !== 'Statistics' && view !== 'Offers' && view !== 'Work history' && view !== 'Portfolio' && view !== 'Follow-ups' && view !== 'Study area' && <div className="stats-grid"><StatCard label="Applications sent" value={jobs.length} change="Keep the momentum going" icon="briefcase" tone="violet" />
        <StatCard label="Interview & pending" value={count('Interview') + count('Pending')} change="You’re making progress" icon="calendar" tone="peach" />
        <StatCard label="Offers received" value={count('Offer') + count('Accepted')} change="Look at you go" icon="chart" tone="green" />
        <StatCard label="Response rate" value={`${jobs.length ? Math.round(jobs.filter(j => ['Interview', 'Offer', 'Accepted', 'Rejected'].includes(j.status)).length / jobs.length * 100) : 0}%`} change="Companies getting back to you" icon="arrow" tone="blue" /></div>}
        {view === 'Offers' && <OfferComparison jobs={jobs} workHistory={workHistory} displayCurrency={displayCurrency} exchangeRates={exchangeRateData.rates} onEdit={openOfferForm} onDeleteAccepted={job => {
          if (!window.confirm(`Remove ${job.company}'s accepted offer from this page? Its role will stay in your work history.`)) return;
          save(jobs.filter(item => item.id !== job.id));
          notify(`${job.company}'s accepted offer was removed. The work history entry was kept.`);
        }} onAdd={() => openOfferForm()} onAccept={acceptOffer} onReject={rejectedJob => {
          save(jobs.map(job => job.id === rejectedJob.id ? {
            ...job,
            status: 'Rejected'
          } : job));
          notify(`${rejectedJob.company}'s offer was marked rejected.`);
        }} />}
        {view === 'Work history' && <WorkHistory entries={workHistory} displayCurrency={displayCurrency} exchangeRates={exchangeRateData.rates} onAdd={() => openEmploymentForm()} onEdit={openEmploymentForm} onEnd={endEmployment} onStart={startEmployment} />}
        {view === 'Portfolio' && <PortfolioProjects projects={portfolioProjects} ownerName={profileName} onAdd={() => { setPortfolioEditing(null); setModal('portfolio-project'); }} onEdit={project => { setPortfolioEditing(project); setModal('portfolio-project'); }} onDelete={project => { if (window.confirm(`Delete “${project.title}” from your portfolio?`)) { savePortfolioProjects(portfolioProjects.filter(item => item.id !== project.id)); notify('Portfolio project deleted'); } }} />}
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
        {view === 'Interviews' && <div className="content-grid interview-tracker-workspace"><InterviewPrep jobs={jobs} onAddRound={job => { if (job) openInterviewRound(job); else { setInterviewTargetJob(null); setInterviewEditingRound(null); setModal('interview-round'); } }} onEditRound={interview => openInterviewRound(interview)} onOutcomeChange={updateInterviewOutcome} onPendingUpdate={(job, round) => setPendingInterviewUpdate({ job, round })} /><aside className="right-column interview-calendar-sidebar"><InterviewCalendar jobs={jobs.filter(isInterviewInProgress)} onOpen={interview => openInterviewRound(interview)} /></aside></div>}
        {view === 'Study area' && <StudyArea key={studyResetVersion} jobs={jobs} />}
        {view === 'Overview' && <FollowUpList jobs={jobs} contacts={contacts} onOpen={openForm} onComplete={completeFollowUp} limit={3} onViewAll={() => setView('Follow-ups')} />}
        {view === 'Follow-ups' && <FollowUpList jobs={jobs} contacts={contacts} onOpen={openForm} onComplete={completeFollowUp} />}
        {view !== 'Interviews' && view !== 'Statistics' && view !== 'Offers' && view !== 'Work history' && view !== 'Portfolio' && view !== 'Recruiter contacts' && view !== 'Follow-ups' && view !== 'Study area' && <div className={view === 'Applications' ? 'content-grid applications-workspace' : 'content-grid'}><div className="applications-card"><div className="card-title-row"><div><h2>{view === 'Applications' ? 'All applications' : 'Recent applications'}</h2>
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
                        <span className="group-hint">{isExpanded ? 'Collapse group' : 'View roles'}</span></button></td></tr>}{(!isGroup || isExpanded) && group.jobs.map(job => <ApplicationRow key={job.id} job={job} onOpen={openForm} onStatusChange={updateApplicationStage} statuses={statuses} grouped={isGroup} />)}</Fragment>;
                  })}</tbody></table>{filtered.length === 0 && <div className="empty-state">No applications found. Try another search or add one to get started.</div>}</div>
          <div className="table-footer">Showing <strong>{view === 'Applications' ? filtered.length : Math.min(filtered.length, 6)}</strong> of <strong>{filtered.length}</strong> applications {view === 'Overview' && <button onClick={() => setView('Applications')}>See all applications <Icon name="arrow" size={14} /></button>}</div></div>
          {view !== 'Applications' && <aside className={view === 'Interviews' ? 'right-column interview-calendar-sidebar' : 'right-column'}>{view === 'Interviews' ? <InterviewCalendar jobs={jobs.filter(job => !['Rejected', 'Accepted'].includes(job.status))} onOpen={interview => openInterviewRound(interview)} /> : <><div className="interviews-card"><div className="card-title-row"><div><button className="upcoming-title" onClick={openInterviews}><h2>Upcoming interviews</h2>
                    <Icon name="arrow" size={15} /></button>
                  <p>Get ready to shine</p></div>
                <button className="icon-button calendar-more" aria-label="View interview calendar" onClick={openInterviews}><Icon name="arrow" size={16} /></button></div>{upcoming.length ? <div className="interview-list">{upcoming.slice(0, 3).map(j => <div className="interview-item" key={j.interviewId}><div className="date-block"><strong>{new Date(`${j.interview}T12:00:00`).getDate()}</strong>
                    <small>{new Date(`${j.interview}T12:00:00`).toLocaleDateString('en-US', {
                          month: 'short'
                        })}</small></div>
                  <div className="interview-info"><strong>{j.company}</strong>
                    <small>{j.role} · Round {j.roundNumber} · {j.interviewType || j.interviewRound}</small>
                    <span>Interview · {prettyDate(j.interview)}</span></div>
                  <button className="icon-button" aria-label="Edit interview" onClick={() => openInterviewRound(j)}><Icon name="arrow" size={15} /></button></div>)}</div> : <div className="no-interviews"><div className="calendar-illustration"><Icon name="calendar" size={21} /></div>
                <strong>No upcoming interviews</strong>
                <p>Add an interview date to an application and it’ll show up here.</p></div>}<button className="calendar-link" onClick={openInterviews}>Open interview calendar <Icon name="arrow" size={15} /></button></div>{showQuotes && <QuoteCarousel />}</>}</aside>}</div>}
      </section>}
      <footer className="footer"><span>Made for the in-between.</span>
      <span>Take it one application at a time <span className="footer-heart">♥</span></span></footer>
    </main>
    {modal === 'application' && <ApplicationModal editing={editing} view={view} statuses={statuses} jobs={jobs} roleSuggestions={targetRoles} setModal={setModal} save={save} notify={notify} submitJob={submitJob} />}
    {modal === 'offer' && <OfferModal jobs={jobs} editing={editing} defaultCurrency={displayCurrency} onClose={() => { setModal(null); setEditing(null); }} onSubmit={submitOffer} onAddApplication={() => { setEditing(null); setModal('application'); setView('Applications'); }} />}
    {modal === 'follow-up' && <FollowUpModal jobs={jobs} onClose={() => setModal(null)} onSubmit={submitFollowUp} onAddApplication={() => { setModal('application'); setEditing(null); setView('Applications'); }} />}
    {modal === 'interview-round' && <InterviewRoundModal job={interviewTargetJob} round={interviewEditingRound} jobs={jobs.filter(isInterviewInProgress)} onClose={() => { setModal(null); setInterviewTargetJob(null); setInterviewEditingRound(null); }} onSubmit={submitInterviewRound} />}
    {pendingInterviewUpdate && <PendingInterviewUpdateModal company={pendingInterviewUpdate.job.company} onClose={() => setPendingInterviewUpdate(null)} onContinue={() => handlePendingInterviewUpdate(pendingInterviewUpdate.job, pendingInterviewUpdate.round, 'continue')} onCloseApplication={() => handlePendingInterviewUpdate(pendingInterviewUpdate.job, pendingInterviewUpdate.round, 'close')} />}
    {interviewNextStep && <InterviewNextStepModal company={interviewNextStep.company} outcome={interviewNextStep.outcome} questionsAsked={interviewNextStep.questionsAsked} reflection={interviewNextStep.reflection} onClose={notes => finishInterviewNextStep('keep', notes)} onAddRound={notes => finishInterviewNextStep('add-round', notes)} onWait={notes => finishInterviewNextStep('pending', notes)} onReject={notes => finishInterviewNextStep('rejected', notes)} onKeep={notes => finishInterviewNextStep('keep', notes)} onAddFollowUp={notes => finishInterviewNextStep('follow-up', notes)} />}
    {modal === 'contact' && <ContactModal contactEditing={contactEditing} setModal={setModal} setContactEditing={setContactEditing} submitContact={submitContact} jobs={jobs} />}
    {modal === 'end-reason' && endingRole && <EndReasonModal endingRole={endingRole} submitEndReason={submitEndReason} onClose={() => { setEndingRole(null); setModal(null); }} />}
    {modal === 'work-history' && <WorkHistoryModal employmentEditing={employmentEditing} defaultCurrency={displayCurrency} roleStage={roleStage} toDateKey={toDateKey} setModal={setModal} setEmploymentEditing={setEmploymentEditing} submitWorkHistory={submitWorkHistory} />}
    {modal === 'portfolio-project' && <PortfolioProjectModal project={portfolioEditing} onClose={() => { setModal(null); setPortfolioEditing(null); }} onSave={savePortfolioProject} />}
    {notice && <div className="toast">{notice}</div>}
    {celebration && <OfferCelebration {...celebration} onClose={() => setCelebration(null)} />}
  </div>;
}
export default App;
