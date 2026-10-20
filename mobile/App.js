import { StatusBar } from 'expo-status-bar'
import { useMemo, useState } from 'react'
import { Alert, Modal, ScrollView, useWindowDimensions } from 'react-native'
import {
  Pressable, SafeAreaView, Text, View,
  C, STATUS, STATUSES, setThemePreferences,
} from './src/theme'
import { TABS, companyInitials, isoToday, longDate, shortDate } from './src/data/applications'
import { createDemoWorkspace } from './src/data/demoWorkspace'
import {
  ApplicationRow, Brand, CompanyMark, DetailLine, EmptyState, Icon,
  MetricCard, SearchField, SectionHeader, SettingsToggle, StatusPill,
} from './src/components/common'
import LoginScreen from './src/screens/LoginScreen'
import ApplicationFormModal from './src/screens/ApplicationFormModal'
import ContactFormModal from './src/screens/ContactFormModal'
import OfferFormModal from './src/screens/OfferFormModal'
import InterviewRoundFormModal from './src/screens/InterviewRoundFormModal'
import PendingInterviewUpdateModal from './src/screens/PendingInterviewUpdateModal'
import InterviewNextStepModal from './src/screens/InterviewNextStepModal'
import PortfolioProjectModal from './src/screens/PortfolioProjectModal'
import WorkHistoryFormModal from './src/screens/WorkHistoryFormModal'
import StudyNoteModal from './src/screens/StudyNoteModal'
import styles from './src/styles'

export default function App() {
  const initialWorkspace = useMemo(() => createDemoWorkspace(), [])
  const [applications, setApplications] = useState(initialWorkspace.applications)
  const [loggedIn, setLoggedIn] = useState(false)
  const [moreScreen, setMoreScreen] = useState('Menu')
  const [darkMode, setDarkMode] = useState(true)
  const [largeText, setLargeText] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [showQuotes, setShowQuotes] = useState(true)
  const [contacts, setContacts] = useState(initialWorkspace.contacts)
  const [workHistory, setWorkHistory] = useState(initialWorkspace.workHistory)
  const [portfolio, setPortfolio] = useState(initialWorkspace.portfolio)
  const [studyNotes, setStudyNotes] = useState(initialWorkspace.studyNotes)
  const emptyContact = { name: '', title: '', company: '', email: '', phone: '', linkedin: '', notes: '', jobId: '' }
  const [contactForm, setContactForm] = useState(emptyContact)
  const [contactEditing, setContactEditing] = useState(null)
  const [contactVisible, setContactVisible] = useState(false)
  const [offerForm, setOfferForm] = useState({ currency: 'USD', salary: '', signingBonus: '', equity: '', offerDeadline: '', healthCoverage: '', paidTimeOff: '', retirement: '', parentalLeave: '', benefits: '' })
  const [offerEditing, setOfferEditing] = useState(null)
  const [offerVisible, setOfferVisible] = useState(false)
  const [offerCelebrationPending, setOfferCelebrationPending] = useState(false)
  const [portfolioVisible, setPortfolioVisible] = useState(false)
  const [portfolioEditing, setPortfolioEditing] = useState(null)
  const [portfolioForm, setPortfolioForm] = useState({ title: '', context: '', description: '', skills: '', links: '' })
  const [workHistoryVisible, setWorkHistoryVisible] = useState(false)
  const [workHistoryEditing, setWorkHistoryEditing] = useState(null)
  const [workHistoryForm, setWorkHistoryForm] = useState({ company: '', role: '', location: '', startDate: '', endDate: '', workStatus: 'Current', notes: '', salary: '' })
  const [studyNoteVisible, setStudyNoteVisible] = useState(false)
  const [studyNoteEditing, setStudyNoteEditing] = useState(null)
  const [studyNoteForm, setStudyNoteForm] = useState({ title: '', category: 'Study notes', content: '' })
  const [interviewFormVisible, setInterviewFormVisible] = useState(false)
  const [interviewEditing, setInterviewEditing] = useState(null)
  const [interviewForm, setInterviewForm] = useState({ applicationId: '', date: isoToday(), roundNumber: '1', interviewType: '', label: '', interviewer: '', meetingLink: '', description: '', outcome: 'Waiting to hear back', questionsToAsk: '', questionsAsked: '', prepNotes: '', reflection: '' })
  const [pendingInterviewUpdate, setPendingInterviewUpdate] = useState(null)
  const [interviewNextStep, setInterviewNextStep] = useState(null)
  const [interviewNextStepDraft, setInterviewNextStepDraft] = useState({ questionsAsked: '', reflection: '' })
  const [interviewRoundFilter, setInterviewRoundFilter] = useState('All')
  const [interviewFollowUpDate, setInterviewFollowUpDate] = useState(isoToday())
  const [interviewFollowUpAction, setInterviewFollowUpAction] = useState('Follow up after this interview')
  const [outcomePicker, setOutcomePicker] = useState(null)
  const [celebration, setCelebration] = useState(null)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [calendarDate, setCalendarDate] = useState(() => initialWorkspace.applications.find((item) => item.interview && item.interview >= isoToday())?.interview || isoToday())
  const [activeTab, setActiveTab] = useState('Overview')
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [formVisible, setFormVisible] = useState(false)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ company: '', role: '', location: '', date: isoToday(), interview: '', companyLogo: '', followUpDate: '', followUpAction: '', note: '', status: 'Applied' })
  const { width: windowWidth } = useWindowDimensions()
  const compactLayout = windowWidth < 360

  setThemePreferences({ darkMode, largeText })

  const openMore = (screen) => { setMoreScreen(screen); setActiveTab('More') }
  const changeOfferStatus = (application, status) => {
    Alert.alert(status === 'Accepted' ? 'Accept this offer?' : 'Decline this offer?', `${application.company} · ${application.role}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: status === 'Accepted' ? 'Accept offer' : 'Mark declined', onPress: () => {
        setApplications((items) => items.map((item) => item.id === application.id ? { ...item, status } : item))
        if (status === 'Accepted') setCelebration({ kind: 'accepted', company: application.company, role: application.role })
      } },
    ])
  }

  const today = isoToday()
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const interviews = useMemo(() => applications.map((item) => {
    const nextRoundDate = (item.interviews || []).map((round) => round.date).filter((date) => date >= today).sort()[0]
    const nextDate = nextRoundDate || (item.interview >= today ? item.interview : '')
    return { ...item, interview: nextDate }
  }).filter((item) => item.interview).sort((a, b) => a.interview.localeCompare(b.interview)), [applications, today])
  const responseCount = applications.filter((item) => ['Interview', 'Offer', 'Rejected', 'Pending'].includes(item.status)).length
  const responseRate = applications.length ? `${Math.round(responseCount / applications.length * 100)}%` : '0%'
  const pendingInterviews = useMemo(() => applications.filter((item) => item.status === 'Pending' || (item.interviews || []).some((round) => ['Waiting to hear back', 'Needs follow-up'].includes(round.outcome))), [applications])
  const totalInterviewRounds = useMemo(() => applications.reduce((count, item) => count + ((item.interviews || []).length), 0), [applications])
  const getInterviewRoundCategory = (outcome) => {
    if (!outcome || outcome === 'Scheduled') return 'Scheduled'
    if (['Needs follow-up', 'Waiting to hear back'].includes(outcome)) return 'Pending'
    return 'Done'
  }
  const interviewRoundCounts = useMemo(() => {
    const counts = { All: totalInterviewRounds, Scheduled: 0, Pending: 0, Done: 0 }
    applications.forEach((item) => {
      ;(item.interviews || []).forEach((round) => {
        const category = getInterviewRoundCategory(round.outcome)
        counts[category] += 1
      })
    })
    return counts
  }, [applications, totalInterviewRounds])
  const filteredInterviewRounds = useMemo(() => applications.flatMap((application) => {
    const rounds = (application.interviews || []).filter((round) => {
      if (interviewRoundFilter === 'All') return true
      return getInterviewRoundCategory(round.outcome) === interviewRoundFilter
    }).sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    return rounds.map((round) => ({ application, round }))
  }).sort((a, b) => (a.round.date || '').localeCompare(b.round.date || '')), [applications, interviewRoundFilter])
  const getCurrentInterviewRound = (application) => {
    const rounds = [...(application.interviews || [])].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    if (!rounds.length) return null
    const upcoming = rounds.find((round) => (round.date || '') >= today)
    return upcoming || rounds[rounds.length - 1]
  }
  const updateInterviewRoundOutcome = (applicationId, roundId, outcome) => {
    const target = applications.find((item) => String(item.id) === String(applicationId))
    if (!target) return
    const updatedRounds = (target.interviews || []).map((round) => String(round.id) === String(roundId)
      ? { ...round, outcome }
      : round)
    const changedRound = updatedRounds.find((round) => String(round.id) === String(roundId))
    const nextStatus = outcome === 'Offer received' ? 'Offer'
      : outcome === 'Waiting to hear back' ? 'Pending'
        : outcome === 'Needs follow-up' ? 'Pending'
          : outcome === 'Not moving forward' ? 'Rejected'
            : target.status
    setApplications((items) => items.map((item) => {
      if (String(item.id) !== String(applicationId)) return item
      return { ...item, interviews: updatedRounds, status: nextStatus }
    }))
    setOutcomePicker(null)
    if (outcome === 'Scheduled') return
    setInterviewNextStepDraft({ questionsAsked: changedRound?.questionsAsked || '', reflection: changedRound?.reflection || '' })
    setInterviewNextStep({ application: { ...target, status: nextStatus }, outcome })
  }
  const pendingOffers = useMemo(() => applications.filter((item) => item.status === 'Offer'), [applications])
  const acceptedOffers = useMemo(() => applications.filter((item) => item.status === 'Accepted'), [applications])
  const offerEstimate = (application) => {
    const salary = Number(application.salary || 0)
    const bonus = Number(application.signingBonus || 0)
    const equity = Number(application.equity || 0)
    return salary + bonus + equity
  }
  const bestOffer = useMemo(() => {
    const bundled = [...pendingOffers, ...acceptedOffers]
    if (!bundled.length) return null
    return bundled.reduce((best, app) => (offerEstimate(app) > offerEstimate(best) ? app : best), bundled[0])
  }, [acceptedOffers, pendingOffers])
  const filteredApplications = useMemo(() => applications
    .filter((item) => filter === 'All' || item.status === filter)
    .filter((item) => `${item.company} ${item.role}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [applications, filter, query])
  const followUps = useMemo(() => applications
    .filter((item) => item.followUpDate || item.followUpAction)
    .map((item) => ({
      ...item,
      dueDate: item.followUpDate || isoToday(),
      action: item.followUpAction || 'Follow up on the application',
    }))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [applications])

  const openCreate = (initialStatus = 'Applied') => {
    setEditing(null)
    setForm({ company: '', role: '', location: '', date: isoToday(), interview: '', companyLogo: '', followUpDate: '', followUpAction: '', note: '', status: initialStatus })
    setFormVisible(true)
  }
  const openContactCreate = () => {
    setContactEditing(null)
    setContactForm(emptyContact)
    setContactVisible(true)
  }
  const openContactEdit = (contact) => { setContactEditing(contact); setContactForm({ ...emptyContact, ...contact }); setContactVisible(true) }
  const parsePortfolioLinks = (raw) => raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, ...rest] = line.split('|')
      const label = labelPart?.trim() || 'Project link'
      const url = (rest.join('|') || label).trim()
      if (!/^https?:\/\//i.test(url)) return null
      return { label, url }
    })
    .filter(Boolean)
  const openPortfolioCreate = () => {
    setPortfolioEditing(null)
    setPortfolioForm({ title: '', context: '', description: '', skills: '', links: '' })
    setPortfolioVisible(true)
  }
  const openPortfolioEdit = (project) => {
    setPortfolioEditing(project)
    setPortfolioForm({
      title: project.title || '',
      context: project.context || '',
      description: project.description || '',
      skills: (project.skills || []).join(', '),
      links: (project.links || []).map((link) => `${link.label || 'Project link'} | ${link.url}`).join('\n'),
    })
    setPortfolioVisible(true)
  }
  const savePortfolioProject = () => {
    if (!portfolioForm.title.trim()) return Alert.alert('Add a project title', 'Give this project a name so it’s easy to share.')
    const nextProject = {
      id: portfolioEditing?.id || String(Date.now()),
      title: portfolioForm.title.trim(),
      context: portfolioForm.context.trim(),
      description: portfolioForm.description.trim(),
      skills: portfolioForm.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      links: parsePortfolioLinks(portfolioForm.links),
      isDemo: false,
    }
    setPortfolio((current) => portfolioEditing ? current.map((project) => project.id === portfolioEditing.id ? nextProject : project) : [nextProject, ...current])
    setPortfolioVisible(false)
    setPortfolioEditing(null)
    setPortfolioForm({ title: '', context: '', description: '', skills: '', links: '' })
  }
  const openWorkHistoryCreate = () => {
    setWorkHistoryEditing(null)
    setWorkHistoryForm({ company: '', role: '', location: '', startDate: '', endDate: '', workStatus: 'Current', notes: '', salary: '' })
    setWorkHistoryVisible(true)
  }
  const openWorkHistoryEdit = (entry) => {
    setWorkHistoryEditing(entry)
    setWorkHistoryForm({ company: entry.company || '', role: entry.role || '', location: entry.location || '', startDate: entry.startDate || '', endDate: entry.endDate || '', workStatus: entry.workStatus || 'Current', notes: entry.notes || '', salary: entry.salary || '' })
    setWorkHistoryVisible(true)
  }
  const saveWorkHistory = () => {
    if (!workHistoryForm.company.trim() || !workHistoryForm.role.trim()) return Alert.alert('Add the basics', 'Give this role a company and title before saving it.')
    const nextEntry = {
      id: workHistoryEditing?.id || String(Date.now()),
      company: workHistoryForm.company.trim(),
      role: workHistoryForm.role.trim(),
      location: workHistoryForm.location.trim(),
      startDate: workHistoryForm.startDate.trim(),
      endDate: workHistoryForm.endDate.trim(),
      workStatus: workHistoryForm.workStatus || 'Current',
      notes: workHistoryForm.notes.trim(),
      salary: workHistoryForm.salary.trim(),
      isCurrent: workHistoryForm.workStatus === 'Current',
    }
    setWorkHistory((current) => workHistoryEditing
      ? current.map((entry) => entry.id === workHistoryEditing.id ? nextEntry : entry)
      : [nextEntry, ...current])
    setWorkHistoryVisible(false)
    setWorkHistoryEditing(null)
  }
  const deleteWorkHistory = (entry) => {
    Alert.alert('Delete this role?', `Remove “${entry.company}” from your work history?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setWorkHistory((current) => current.filter((item) => item.id !== entry.id)) },
    ])
  }
  const openStudyNoteCreate = () => {
    setStudyNoteEditing(null)
    setStudyNoteForm({ title: '', category: 'Study notes', content: '' })
    setStudyNoteVisible(true)
  }
  const openStudyNoteEdit = (note) => {
    setStudyNoteEditing(note)
    setStudyNoteForm({ title: note.title || '', category: note.category || 'Study notes', content: note.content || '' })
    setStudyNoteVisible(true)
  }
  const saveStudyNote = () => {
    if (!studyNoteForm.title.trim()) return Alert.alert('Add a title', 'Give this note a clear title before saving it.')
    const nextNote = {
      id: studyNoteEditing?.id || String(Date.now()),
      title: studyNoteForm.title.trim(),
      category: studyNoteForm.category || 'Study notes',
      content: studyNoteForm.content.trim(),
      createdAt: studyNoteEditing?.createdAt || isoToday(),
      updatedAt: isoToday(),
    }
    setStudyNotes((current) => studyNoteEditing
      ? current.map((note) => note.id === studyNoteEditing.id ? nextNote : note)
      : [nextNote, ...current])
    setStudyNoteVisible(false)
    setStudyNoteEditing(null)
  }
  const deleteStudyNote = (note) => {
    Alert.alert('Delete this note?', `Remove “${note.title}” from your study area?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setStudyNotes((current) => current.filter((item) => item.id !== note.id)) },
    ])
  }
  const deletePortfolioProject = (project) => {
    Alert.alert('Delete this project?', `Remove “${project.title}” from your portfolio?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPortfolio((current) => current.filter((item) => item.id !== project.id)) },
    ])
  }
  const saveContact = () => {
    if (!contactForm.name.trim()) return Alert.alert('Add a name', 'Enter a name before saving this contact.')
    const saved = { ...contactForm, name: contactForm.name.trim(), id: contactEditing?.id || String(Date.now()) }
    setContacts((items) => contactEditing ? items.map((item) => item.id === contactEditing.id ? saved : item) : [saved, ...items])
    setContactVisible(false)
    setContactEditing(null)
  }
  const openOfferEdit = (application) => {
    setOfferEditing(application)
    setOfferForm({ currency: application.currency || 'USD', salary: String(application.salary || ''), signingBonus: String(application.signingBonus || ''), equity: String(application.equity || ''), offerDeadline: application.offerDeadline || '', healthCoverage: application.healthCoverage || '', paidTimeOff: application.paidTimeOff || '', retirement: application.retirement || '', parentalLeave: application.parentalLeave || '', benefits: application.benefits || '' })
    setOfferVisible(true)
  }
  const saveOffer = () => {
    setApplications((items) => items.map((item) => item.id === offerEditing.id ? { ...item, ...offerForm } : item))
    setOfferVisible(false)
    if (offerCelebrationPending) setCelebration({ kind: 'offer', company: offerEditing.company, role: offerEditing.role })
    setOfferCelebrationPending(false)
    setOfferEditing(null)
  }
  const openInterviewCreate = () => {
    const first = applications.find((item) => !['Rejected', 'Accepted'].includes(item.status)) || applications[0]
    setInterviewEditing(null)
    setInterviewForm({ applicationId: first ? String(first.id) : '', date: isoToday(), roundNumber: String((first?.interviews || []).length + 1), interviewType: '', label: '', interviewer: '', meetingLink: '', description: '', outcome: 'Waiting to hear back', questionsToAsk: '', questionsAsked: '', prepNotes: '', reflection: '' })
    setInterviewFormVisible(true)
  }
  const openInterviewEdit = (application, round) => {
    setInterviewEditing({ application, round })
    setInterviewForm({ applicationId: String(application.id), date: round.date || round.interview || '', roundNumber: String(round.roundNumber || 1), interviewType: round.interviewType || '', label: round.label || '', interviewer: round.interviewer || '', meetingLink: round.meetingLink || '', description: round.description || '', outcome: round.outcome || 'Waiting to hear back', questionsToAsk: round.questionsToAsk || '', questionsAsked: round.questionsAsked || '', prepNotes: round.prepNotes || '', reflection: round.reflection || '' })
    setInterviewFormVisible(true)
  }
  const updateInterviewNextStepDraft = (field, value) => setInterviewNextStepDraft((current) => ({ ...current, [field]: value }))
  const syncInterviewRoundNotes = (applicationId, values) => {
    if (!applicationId) return
    setApplications((items) => items.map((item) => {
      if (String(item.id) !== String(applicationId)) return item
      const latestRound = [...(item.interviews || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]
      if (!latestRound) return { ...item, note: values.reflection || item.note || '' }
      const updatedRounds = (item.interviews || []).map((round) => String(round.id) === String(latestRound.id)
        ? { ...round, questionsAsked: values.questionsAsked ?? round.questionsAsked ?? '', reflection: values.reflection ?? round.reflection ?? '' }
        : round)
      return { ...item, interviews: updatedRounds, note: values.reflection || item.note || '' }
    }))
  }
  const saveInterviewRound = () => {
    const target = applications.find((item) => String(item.id) === String(interviewForm.applicationId))
    if (!target) return Alert.alert('Choose an application', 'Select the job this interview belongs to.')
    if (!interviewForm.date.trim()) return Alert.alert('Add an interview date', 'Enter the date for this interview round.')
    const nextRound = { ...interviewForm, id: interviewEditing?.round.id || String(Date.now()), roundNumber: Number(interviewForm.roundNumber) || 1, date: interviewForm.date.trim(), outcome: interviewForm.outcome || 'Scheduled' }
    const nextStatus = nextRound.outcome === 'Offer received' ? 'Offer'
      : nextRound.outcome === 'Not moving forward' ? 'Rejected'
        : ['Needs follow-up', 'Waiting to hear back'].includes(nextRound.outcome) ? 'Pending'
          : nextRound.outcome === 'Moving to next round' ? 'Interview'
            : ['Went well', 'Mixed', 'Scheduled'].includes(nextRound.outcome) ? 'Interview'
              : ['Offer', 'Accepted', 'Rejected'].includes(target.status) ? target.status : 'Interview'

    setApplications((items) => items.map((item) => {
      if (String(item.id) !== String(target.id)) return item
      const rounds = item.interviews || []
      const updatedRounds = interviewEditing
        ? rounds.map((round) => String(round.id) === String(interviewEditing.round.id) ? nextRound : round)
        : [...rounds, nextRound]
      const nextDate = [...updatedRounds].map((round) => round.date).sort()[0]
      return {
        ...item,
        interviews: updatedRounds,
        interview: nextDate,
        status: ['Offer', 'Accepted', 'Rejected'].includes(item.status) ? item.status : nextStatus,
        followUpDate: nextStatus === 'Pending' && !item.followUpDate ? isoToday() : item.followUpDate,
        followUpAction: nextStatus === 'Pending' && !item.followUpAction ? 'Follow up after this interview' : item.followUpAction,
      }
    }))
    setInterviewFormVisible(false)
    setInterviewEditing(null)

    if (nextRound.outcome === 'Offer received') {
      setCelebration({ kind: 'offer', company: target.company, role: target.role })
      return
    }
    if (nextRound.outcome === 'Not moving forward') {
      return
    }
    if (nextRound.outcome === 'Needs follow-up') {
      setInterviewNextStepDraft({ questionsAsked: nextRound.questionsAsked || '', reflection: nextRound.reflection || '' })
      setInterviewNextStep({ application: target, outcome: 'Needs follow-up' })
      return
    }
    if (nextRound.outcome === 'Moving to next round') {
      setInterviewNextStepDraft({ questionsAsked: nextRound.questionsAsked || '', reflection: nextRound.reflection || '' })
      setInterviewNextStep({ application: target, outcome: 'Moving to next round' })
      return
    }
    setInterviewNextStepDraft({ questionsAsked: nextRound.questionsAsked || '', reflection: nextRound.reflection || '' })
    if (['Waiting to hear back', 'Needs follow-up'].includes(nextRound.outcome)) setPendingInterviewUpdate(target)
  }
  const openEdit = (application) => {
    setEditing(application)
    setForm({ company: application.company || '', role: application.role || '', location: application.location || '', date: application.date || isoToday(), interview: application.interview || '', companyLogo: application.companyLogo || '', followUpDate: application.followUpDate || '', followUpAction: application.followUpAction || '', note: application.note || '', status: application.status || 'Applied' })
    setDetailsVisible(false)
    setFormVisible(true)
  }
  const showDetails = (application) => { setSelected(application); setDetailsVisible(true) }
  const closeForm = () => { setFormVisible(false); setEditing(null) }
  const saveApplication = () => {
    if (!form.company.trim() || !form.role.trim()) {
      Alert.alert('Add the essentials', 'Enter a company and position before saving.')
      return
    }
    const nextApplication = {
      ...editing,
      ...form,
      id: editing?.id || String(Date.now()),
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      interview: form.interview.trim(),
      companyLogo: form.companyLogo.trim(),
      followUpDate: form.followUpDate.trim(),
      followUpAction: form.followUpAction.trim(),
      note: form.note.trim(),
      date: form.date.trim() || isoToday(),
    }
    setApplications((current) => editing
      ? current.map((item) => item.id === editing.id ? nextApplication : item)
      : [nextApplication, ...current])
    const newlyAcceptedOffer = form.status === 'Accepted' && editing?.status !== 'Accepted'
    closeForm()
    if (form.status === 'Offer') { setOfferCelebrationPending(!editing || editing.status !== 'Offer'); openOfferEdit(nextApplication) }
    else if (newlyAcceptedOffer) setCelebration({ kind: 'accepted', company: nextApplication.company, role: nextApplication.role })
  }
  const updateSelectedStatus = (nextStatus) => {
    if (!selected) return
    const updated = { ...selected, status: nextStatus }
    setApplications((current) => current.map((item) => String(item.id) === String(selected.id) ? updated : item))
    setSelected(updated)
  }
  const resolvePendingInterview = (application) => {
    if (!application) return
    setPendingInterviewUpdate(application)
  }
  const markFollowUpDone = (applicationId) => {
    setApplications((current) => current.map((item) => item.id === applicationId ? { ...item, followUpDate: '', followUpAction: '' } : item))
  }
  const deleteApplication = () => {
    if (!selected) return
    Alert.alert('Delete this application?', `Remove ${selected.company} from your tracker?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setApplications((current) => current.filter((item) => item.id !== selected.id)); setDetailsVisible(false); setSelected(null) } },
    ])
  }

  const heading = activeTab === 'Overview' ? `${greeting}, Alex` : activeTab === 'Applications' ? 'Applications' : activeTab === 'Interviews' ? 'Your interviews' : moreScreen === 'Menu' ? 'More tools' : moreScreen
  const subtitle = activeTab === 'Overview' ? 'Here’s what’s happening with your job search.' : activeTab === 'Applications' ? 'Keep every opportunity in one place.' : activeTab === 'Interviews' ? 'Feel ready for every conversation.' : moreScreen === 'Menu' ? 'Offers, recruiter contacts, settings, and more.' : 'Everything you need, in one place.'
  const quickAction = activeTab === 'Interviews' ? { label: 'Add interview', run: openInterviewCreate }
    : activeTab === 'More' && moreScreen === 'Offers' ? { label: 'Add offer', run: () => openCreate('Offer') }
      : activeTab === 'More' && moreScreen === 'Recruiter contacts' ? { label: 'Add contact', run: openContactCreate }
        : activeTab === 'More' && moreScreen !== 'Menu' ? null : { label: 'Add application', run: openCreate }
  const quickActions = [
    { label: 'Application', onPress: openCreate },
    { label: 'Interview', onPress: openInterviewCreate },
    { label: 'Offer', onPress: () => openCreate('Offer') },
  ]
  const moreMenuItems = [
    ['Offers', 'Compare offers and record your decision', 'award'],
    ['Recruiter contacts', 'Keep hiring contacts and follow-ups together', 'contacts'],
    ['Follow-ups', 'Check in on the next action in your search', 'calendar'],
    ['Work history', 'See your current, past, and upcoming roles', 'briefcase'],
    ['Portfolio', 'Keep your sample work and impact stories close', 'grid'],
    ['Study area', 'Practice answers and keep interview notes organized', 'chart'],
    ['Progress', 'See your application pipeline', 'chart'],
    ['Settings', 'Personalize Trackr and your account', 'settings'],
  ]

  if (!loggedIn) return <LoginScreen darkMode={darkMode} onSignIn={() => setLoggedIn(true)} />

  return <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSurface]}>
    <StatusBar style={darkMode ? 'light' : 'dark'} />
    <View style={[styles.screen, darkMode && styles.darkSurface]}>
      <View style={[styles.topBar, darkMode && styles.darkCard, compactLayout && styles.topBarCompact]}>
        <Brand />
        {quickAction ? <Pressable accessibilityRole="button" accessibilityLabel={quickAction.label} onPress={quickAction.run} style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
          <Icon name="plus" color="#fff" size={16} /><Text numberOfLines={1} style={[styles.addButtonText, compactLayout && styles.addButtonTextCompact]}>{compactLayout ? 'Add' : quickAction.label}</Text>
        </Pressable> : <View style={styles.topBarSpacer} />}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Text style={styles.eyebrow}>{activeTab === 'Overview' ? todayLabel : 'YOUR JOB SEARCH'}</Text>
        <Text style={styles.pageTitle}>{heading}<Text style={styles.titleDot}>.</Text></Text>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>

        {activeTab !== 'More' ? <View style={styles.quickActionRow}>
          {quickActions.map((action) => <Pressable key={action.label} onPress={action.onPress} style={({ pressed }) => [styles.quickActionButton, pressed && styles.quickActionButtonActive]}>
            <Text style={styles.quickActionText}>{action.label}</Text>
          </Pressable>)}
        </View> : null}

        {activeTab === 'Overview' ? <>
          {showStats ? <>
          <View style={styles.metricGrid}>
            <MetricCard label="Applications sent" value={applications.length} note="Keep the momentum" tone="purple" />
            <MetricCard label="In interview" value={applications.filter((item) => item.status === 'Interview').length} note="You’re making progress" tone="peach" />
            <MetricCard label="Offers received" value={applications.filter((item) => item.status === 'Offer').length} note="Look at you go" tone="green" />
            <MetricCard label="Response rate" value={responseRate} note="Companies getting back" tone="blue" />
          </View>
          </> : <View style={styles.settingsCard}><Text style={styles.settingsTitle}>Your search, at your pace</Text><Text style={styles.settingsCaption}>Progress statistics are hidden. You can turn them back on in Settings.</Text></View>}

          <SectionHeader title="Upcoming interviews" caption="Get ready to shine" action="See all" onAction={() => setActiveTab('Interviews')} />
          {interviews.length ? <Pressable onPress={() => showDetails(interviews[0])} style={({ pressed }) => [styles.nextInterviewCard, pressed && styles.rowPressed]}>
            <View style={styles.interviewDateBlock}><Text style={styles.interviewDay}>{new Date(`${interviews[0].interview}T12:00:00`).getDate()}</Text><Text style={styles.interviewMonth}>{new Date(`${interviews[0].interview}T12:00:00`).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</Text></View>
            <CompanyMark company={interviews[0].company} color={interviews[0].color} logoInk={interviews[0].logoInk} />
            <View style={styles.interviewInfo}><Text style={styles.interviewCompany}>{interviews[0].company}</Text><Text style={styles.interviewRole} numberOfLines={1}>{interviews[0].role}</Text><Text style={styles.interviewWhen}>{shortDate(interviews[0].interview)} · Interview</Text></View>
            <View style={styles.rowChevron}><Icon name="chevron" size={12} color="#aaa6b4" /></View>
          </Pressable> : <View style={styles.emptyInterview}><View style={styles.emptyCalendar}><Icon name="calendar" color={C.purple} size={18} /></View><View style={styles.emptyInterviewCopy}><Text style={styles.emptyInterviewTitle}>No upcoming interviews</Text><Text style={styles.emptyInterviewText}>Add an interview date to an application and it’ll show up here.</Text></View></View>}

          <SectionHeader title="Recent applications" caption="You’ve got this. Keep showing up." action="View all" onAction={() => { setActiveTab('Applications'); setFilter('All') }} />
          <View style={styles.applicationList}>
            {filteredApplications.slice(0, 4).map((application) => <ApplicationRow key={application.id} application={application} onPress={() => showDetails(application)} />)}
          </View>
          <Pressable onPress={openCreate} style={({ pressed }) => [styles.addAnotherButton, pressed && styles.buttonPressed]}><Icon name="plus" color={C.purple} size={15} /><Text style={styles.addAnotherText}>Add another application</Text></Pressable>

          {showQuotes ? <View style={styles.encouragement}><View style={styles.encouragementSpark}><Text style={styles.sparkText}>✳</Text></View><View style={styles.encouragementCopy}><Text style={styles.encouragementLabel}>A LITTLE REMINDER</Text><Text style={styles.encouragementQuote}>One step at a time. Every application brings you closer to the right opportunity.</Text></View></View> : null}
        </> : null}

        {activeTab === 'Applications' ? <>
          <SearchField value={query} onChangeText={setQuery} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroller}>
            {['All', ...STATUSES].map((status) => <Pressable key={status} onPress={() => setFilter(status)} style={[styles.filterChip, filter === status && styles.filterChipSelected]}><Text style={[styles.filterLabel, filter === status && styles.filterLabelSelected]}>{status}{status === 'All' ? `  ${applications.length}` : ''}</Text></Pressable>)}
    
          </ScrollView>
          <Text style={styles.resultCount}>{filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}</Text>
          {filteredApplications.length ? <View style={styles.applicationList}>{filteredApplications.map((application) => <ApplicationRow key={application.id} application={application} onPress={() => showDetails(application)} />)}</View> : <EmptyState title="No applications found" message="Try a different search or status filter, or add a new application." onAction={openCreate} action="Add application" />}
        </> : null}

        {activeTab === 'Interviews' ? <>
          <View style={styles.interviewSummaryCard}>
            <Text style={styles.offerSummaryEyebrow}>ROUND TRACKER</Text>
            <View style={styles.offerSummaryRow}>
              <View style={styles.offerSummaryMetric}><Text style={styles.offerSummaryValue}>{interviews.length}</Text><Text style={styles.offerSummaryLabel}>Upcoming</Text></View>
              <View style={styles.offerSummaryMetric}><Text style={styles.offerSummaryValue}>{pendingInterviews.length}</Text><Text style={styles.offerSummaryLabel}>Pending</Text></View>
              <View style={styles.offerSummaryMetric}><Text style={styles.offerSummaryValue}>{totalInterviewRounds}</Text><Text style={styles.offerSummaryLabel}>Rounds</Text></View>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroller}>
            {['All', 'Scheduled', 'Pending', 'Done'].map((stage) => <Pressable key={stage} onPress={() => setInterviewRoundFilter(stage)} style={[styles.filterChip, interviewRoundFilter === stage && styles.filterChipSelected]}><Text style={[styles.filterLabel, interviewRoundFilter === stage && styles.filterLabelSelected]}>{stage}{stage === 'All' ? `  ${totalInterviewRounds}` : `  ${interviewRoundCounts[stage] || 0}`}</Text></Pressable>)}
          </ScrollView>
          <SectionHeader title={calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} caption="Tap a date to see your interviews" />
          <View style={styles.calendarCard}>
            <View style={styles.calendarNav}><Pressable onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}><Text style={styles.calendarArrow}>‹</Text></Pressable><Pressable onPress={() => { setCalendarMonth(new Date()); setCalendarDate(isoToday()) }}><Text style={styles.calendarToday}>Today</Text></Pressable><Pressable onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}><Text style={styles.calendarArrow}>›</Text></Pressable></View>
            <View style={styles.calendarGrid}>{['S','M','T','W','T','F','S'].map((day, index) => <Text key={`${day}${index}`} style={styles.calendarWeekday}>{day}</Text>)}{Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() }, (_, i) => <View key={`blank${i}`} style={styles.calendarBlank} />)}{Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate() }, (_, i) => { const day = i + 1; const key = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; const hasEvent = applications.some((app) => app.interview === key); return <Pressable key={key} onPress={() => setCalendarDate(key)} style={[styles.calendarDay, calendarDate === key && styles.calendarDaySelected]}><Text style={[styles.calendarDayText, calendarDate === key && styles.calendarDayTextSelected]}>{day}</Text>{hasEvent ? <View style={styles.calendarEventDot} /> : null}</Pressable> })}</View>
          </View>
          <SectionHeader title={new Date(`${calendarDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} caption="Scheduled interviews" />
          {applications.filter((item) => item.interview === calendarDate || (item.interviews || []).some((round) => round.date === calendarDate)).length ? <View style={styles.applicationList}>{applications.filter((item) => item.interview === calendarDate || (item.interviews || []).some((round) => round.date === calendarDate)).map((application) => <View key={application.id}><ApplicationRow application={application} onPress={() => showDetails(application)} />{(application.interviews || []).filter((round) => round.date === calendarDate).map((round) => <Pressable key={round.id} onPress={() => openInterviewEdit(application, round)} style={styles.roundPreview}><Text style={styles.roundPreviewTitle}>{round.label || round.interviewType || `Round ${round.roundNumber}`}</Text><Text style={styles.roundPreviewNote}>{round.interviewer || 'Interview details and preparation'}</Text><Text style={styles.offerReviewText}>Edit interview details</Text></Pressable>)}</View>)}</View> : <Text style={styles.calendarNoEvents}>No interviews scheduled for this day.</Text>}
          <SectionHeader title="Coming up" caption="Your conversations and next steps" />
          {filteredInterviewRounds.length ? <View style={styles.applicationList}>{filteredInterviewRounds.map(({ application, round }) => {
            const currentRound = getCurrentInterviewRound(application)
            const isCurrent = currentRound && String(currentRound.id) === String(round.id)
            const statusGroup = getInterviewRoundCategory(round.outcome)
            const isPending = statusGroup === 'Pending'
            return <View key={`${application.id}-${round.id}`}>
              <ApplicationRow application={application} onPress={() => showDetails(application)} />
              <Pressable onPress={() => openInterviewEdit(application, round)} style={[styles.interviewRoundCard, isCurrent && styles.interviewRoundCardCurrent]}>
                <View style={styles.interviewRoundHeader}>
                  <View style={styles.interviewRoundMetaWrap}>
                    <Text style={styles.interviewRoundTitle}>{round.label || round.interviewType || `Round ${round.roundNumber}`}</Text>
                    <Text style={styles.interviewRoundMeta}>{longDate(round.date)}{round.interviewer ? ` · ${round.interviewer}` : ''}</Text>
                  </View>
                  {isCurrent ? <View style={styles.interviewRoundBadge}><Text style={styles.interviewRoundBadgeText}>Current</Text></View> : null}
                </View>
                <Text style={styles.interviewOutcomeLabel}>Outcome</Text>
                <Pressable onPress={() => setOutcomePicker({ applicationId: application.id, roundId: round.id })} hitSlop={8} style={styles.interviewOutcomePicker}>
                  <Text style={styles.interviewOutcomePickerText}>{round.outcome || 'Scheduled'}</Text>
                  <Text style={styles.interviewOutcomeChevron}>▾</Text>
                </Pressable>
                <View style={styles.interviewRoundActions}>
                  <Pressable onPress={() => openInterviewEdit(application, round)} style={styles.secondaryActionButton}><Text style={styles.secondaryActionText}>Edit</Text></Pressable>
                  {isPending ? <Pressable onPress={() => setPendingInterviewUpdate(application)} style={styles.primaryActionButton}><Text style={styles.primaryActionText}>Resolve</Text></Pressable> : null}
                </View>
                <Text style={styles.interviewRoundFooter}>{statusGroup} · {isCurrent ? `Round ${round.roundNumber || 1} of ${(application.interviews || []).length}` : 'Round update'}</Text>
              </Pressable>
            </View>
          })}</View> : <EmptyState title="No interviews in this filter" message="Try another round status or add a new interview update." onAction={openInterviewCreate} action="Add an interview" />}
          {applications.some((item) => item.status === 'Interview' && (!item.interview || item.interview < today)) ? <><SectionHeader title="Past interviews" caption="Keep track of where you’ve been" /><View style={styles.applicationList}>{applications.filter((item) => item.status === 'Interview' && (!item.interview || item.interview < today)).map((application) => <ApplicationRow key={application.id} application={application} onPress={() => showDetails(application)} />)}</View></> : null}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Menu' ? <View style={styles.moreMenu}>
          {moreMenuItems.map(([title, note, icon]) => <Pressable key={title} onPress={() => openMore(title)} style={({ pressed }) => [styles.moreCard, pressed && styles.rowPressed]}><View style={styles.moreIcon}><Icon name={icon === 'settings' ? 'close' : icon} color={C.purple} size={18} /></View><View style={styles.moreCardCopy}><Text style={styles.moreCardTitle}>{title}</Text><Text style={styles.moreCardNote}>{note}</Text></View><Icon name="chevron" size={12} color={C.faint} /></Pressable>)}
        </View> : null}

        {activeTab === 'More' && moreScreen === 'Follow-ups' ? <>
          <SectionHeader title="Follow-up reminders" caption="Keep momentum without losing the thread" action="Review all" onAction={() => setActiveTab('Applications')} />
          {followUps.length ? <View style={styles.applicationList}>{followUps.map((application) => <View key={application.id} style={styles.followUpCard}><View style={styles.followUpHeader}><View style={styles.followUpBadge}><Text style={styles.followUpBadgeText}>{new Date(`${application.dueDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text></View><View style={{ flex: 1 }}><Text style={styles.moreCardTitle}>{application.company}</Text><Text style={styles.moreCardNote}>{application.role}</Text></View></View><Text style={styles.followUpAction}>{application.action}</Text><View style={styles.offerActions}><Pressable onPress={() => showDetails(application)} style={styles.secondaryActionButton}><Text style={styles.secondaryActionText}>Open</Text></Pressable><Pressable onPress={() => markFollowUpDone(application.id)} style={styles.primaryActionButton}><Text style={styles.primaryActionText}>Done</Text></Pressable></View></View>)}</View> : <EmptyState title="No reminders yet" message="Add a follow-up date to an application and it’ll show up here." onAction={openCreate} action="Add application" />}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Work history' ? <>
          <SectionHeader title="Work history" caption="Your career journey, organized clearly" action="Add role" onAction={openWorkHistoryCreate} />
          {workHistory.length ? <View style={styles.applicationList}>{workHistory.map((entry) => <View key={entry.id} style={styles.historyCard}><View style={styles.historyHeader}><Text style={styles.moreCardTitle}>{entry.company}</Text><StatusPill status={entry.workStatus || 'Current'} /></View><Text style={styles.historyRole}>{entry.role}</Text><Text style={styles.historyMeta}>{entry.location || 'Remote'}{entry.startDate ? ` · ${shortDate(entry.startDate)} — ${entry.endDate ? shortDate(entry.endDate) : 'Present'}` : ''}</Text>{entry.notes ? <Text style={styles.historyNotes}>{entry.notes}</Text> : null}<View style={styles.portfolioActions}><Pressable onPress={() => openWorkHistoryEdit(entry)} style={styles.offerEdit}><Text style={styles.offerReviewText}>Edit</Text></Pressable><Pressable onPress={() => deleteWorkHistory(entry)} style={styles.offerDecline}><Text style={styles.offerDeclineText}>Delete</Text></Pressable></View></View>)}</View> : <EmptyState title="No work history yet" message="Add past roles and current work details to keep your story together." onAction={openWorkHistoryCreate} action="Add role" />}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Portfolio' ? <>
          <SectionHeader title="Portfolio" caption="Projects and examples you want to share" action="Add project" onAction={openPortfolioCreate} />
          {portfolio.length ? <View style={styles.applicationList}>{portfolio.map((project) => <View key={project.id} style={styles.portfolioCard}><Text style={styles.portfolioContext}>{project.context || 'Portfolio project'}</Text><Text style={styles.moreCardTitle}>{project.title}</Text><Text style={styles.historyNotes}>{project.description || 'No summary yet.'}</Text>{project.skills?.length ? <View style={styles.skillWrap}>{project.skills.slice(0, 4).map((skill) => <View key={skill} style={styles.skillPill}><Text style={styles.skillText}>{skill}</Text></View>)}</View> : null}{project.links?.length ? <View style={styles.linkGroup}>{project.links.map((link) => <Pressable key={`${project.id}-${link.label}-${link.url}`} onPress={() => undefined} style={styles.linkButton}><Text style={styles.linkButtonText}>{link.label}</Text></Pressable>)}</View> : null}<View style={styles.portfolioActions}><Pressable onPress={() => openPortfolioEdit(project)} style={styles.offerEdit}><Text style={styles.offerReviewText}>Edit</Text></Pressable><Pressable onPress={() => deletePortfolioProject(project)} style={styles.offerDecline}><Text style={styles.offerDeclineText}>Delete</Text></Pressable></View></View>)}</View> : <EmptyState title="No portfolio items yet" message="Add a few standout examples of your work to prep for a portfolio review." onAction={openPortfolioCreate} action="Add project" />}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Study area' ? <>
          <SectionHeader title="Study area" caption="Practice your stories, notes, and prep" action="Add note" onAction={openStudyNoteCreate} />
          {studyNotes.length ? <View style={styles.applicationList}>{studyNotes.map((note) => <View key={note.id} style={styles.studyCard}><Text style={styles.studyCategory}>{note.category}</Text><Text style={styles.moreCardTitle}>{note.title}</Text><Text style={styles.historyNotes}>{note.content}</Text><View style={styles.portfolioActions}><Pressable onPress={() => openStudyNoteEdit(note)} style={styles.offerEdit}><Text style={styles.offerReviewText}>Edit</Text></Pressable><Pressable onPress={() => deleteStudyNote(note)} style={styles.offerDecline}><Text style={styles.offerDeclineText}>Delete</Text></Pressable></View></View>)}</View> : <EmptyState title="No study notes yet" message="Save notes and prep prompts here so you can review them before interviews." onAction={openStudyNoteCreate} action="Add note" />}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Offers' ? <>
          <SectionHeader title="Offers to compare" caption="Review the whole package and decide when you’re ready" action="Add offer" onAction={() => openCreate('Offer')} />
          <View style={styles.offerSummaryCard}>
            <Text style={styles.offerSummaryEyebrow}>PACKAGE SNAPSHOT</Text>
            <View style={styles.offerSummaryRow}>
              <View style={styles.offerSummaryMetric}><Text style={styles.offerSummaryValue}>{pendingOffers.length}</Text><Text style={styles.offerSummaryLabel}>Pending</Text></View>
              <View style={styles.offerSummaryMetric}><Text style={styles.offerSummaryValue}>{acceptedOffers.length}</Text><Text style={styles.offerSummaryLabel}>Accepted</Text></View>
              <View style={styles.offerSummaryMetric}><Text style={styles.offerSummaryValue}>{bestOffer ? `${bestOffer.currency || 'USD'} ${Number(offerEstimate(bestOffer)).toLocaleString()}` : '$0'}</Text><Text style={styles.offerSummaryLabel}>Top package</Text></View>
            </View>
          </View>
          {applications.filter((item) => ['Offer','Accepted'].includes(item.status)).length ? <>
            {pendingOffers.length ? <View style={styles.applicationList}>{pendingOffers.map((application) => <View key={application.id} style={styles.offerCard}><View style={styles.offerHeading}><CompanyMark company={application.company} /><View style={{ flex: 1 }}><Text style={styles.moreCardTitle}>{application.company}</Text><Text style={styles.moreCardNote}>{application.role}</Text></View><StatusPill status={application.status} /></View><View style={styles.offerValue}><Text style={styles.offerValueLabel}>ESTIMATED YEAR ONE</Text><Text style={styles.offerValueText}>{`${application.currency || 'USD'} ${Number(offerEstimate(application)).toLocaleString()}`}</Text><Text style={styles.moreCardNote}>{application.offerDeadline ? `Decision by ${longDate(application.offerDeadline)}` : application.note || 'Add compensation and benefits to compare this package.'}</Text></View><View style={styles.offerMetricGrid}>{[ ['Base', application.salary ? `${application.currency || 'USD'} ${Number(application.salary).toLocaleString()}` : 'Not added'], ['Bonus', application.signingBonus ? `${application.currency || 'USD'} ${Number(application.signingBonus).toLocaleString()}` : 'Not added'], ['Equity', application.equity ? `${application.currency || 'USD'} ${Number(application.equity).toLocaleString()}` : 'Not added'] ].map(([label, value]) => <View key={label} style={styles.offerMetric}><Text style={styles.offerMetricLabel}>{label}</Text><Text style={styles.offerMetricValue}>{value}</Text></View>)}</View><View style={styles.offerActions}><Pressable onPress={() => changeOfferStatus(application, 'Accepted')} style={styles.offerAccept}><Text style={styles.offerAcceptText}>Accept</Text></Pressable><Pressable onPress={() => changeOfferStatus(application, 'Rejected')} style={styles.offerDecline}><Text style={styles.offerDeclineText}>Decline</Text></Pressable><Pressable onPress={() => openOfferEdit(application)} style={styles.offerEdit}><Text style={styles.offerReviewText}>Edit</Text></Pressable></View></View>)}</View> : null}
            {acceptedOffers.length ? <View style={styles.acceptedOffersWrap}>{acceptedOffers.map((application) => <View key={application.id} style={styles.acceptedOfferCard}><View style={styles.offerHeading}><CompanyMark company={application.company} /><View style={{ flex: 1 }}><Text style={styles.moreCardTitle}>{application.company}</Text><Text style={styles.moreCardNote}>{application.role}</Text></View><StatusPill status={application.status} /></View><Text style={styles.acceptedOfferValue}>{application.salary ? `${application.currency || 'USD'} ${Number(application.salary).toLocaleString()} base salary` : 'Accepted package saved'}</Text>{application.healthCoverage ? <Text style={styles.acceptedOfferNote}>{application.healthCoverage}</Text> : null}{application.paidTimeOff ? <Text style={styles.acceptedOfferNote}>{application.paidTimeOff}</Text> : null}<Pressable onPress={() => openOfferEdit(application)} style={styles.offerReview}><Text style={styles.offerReviewText}>Review package details</Text></Pressable></View>)}</View> : null}
          </> : <EmptyState title="Your next opportunity could be an offer." message="When a company makes an offer, save it here and compare the details." onAction={openCreate} action="Add offer" />}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Recruiter contacts' ? <>
          <SectionHeader title="Recruiter contacts" caption="Keep people in your corner close at hand" action="Add contact" onAction={openContactCreate} />
          {contacts.length ? contacts.map((contact) => <View key={contact.id} style={styles.contactCard}><View style={styles.offerHeading}><View style={styles.contactAvatar}><Text style={styles.contactAvatarText}>{companyInitials(contact.name)}</Text></View><View style={{ flex: 1 }}><Text style={styles.moreCardTitle}>{contact.name}</Text><Text style={styles.moreCardNote}>{contact.title}{contact.company ? ` · ${contact.company}` : ''}</Text></View><Pressable onPress={() => setContacts(contacts.filter((item) => item.id !== contact.id))}><Text style={styles.deleteContact}>Remove</Text></Pressable></View>{contact.email ? <Text style={styles.contactDetail}>{contact.email}</Text> : null}{contact.phone ? <Text style={styles.contactDetail}>{contact.phone}</Text> : null}{contact.linkedin ? <Text style={styles.contactDetail}>{contact.linkedin}</Text> : null}{contact.jobId ? <Text style={styles.contactDetail}>{applications.find((item) => String(item.id) === String(contact.jobId))?.company || 'Related application'}</Text> : null}{contact.notes ? <Text style={styles.moreCardNote}>{contact.notes}</Text> : null}<Pressable onPress={() => openContactEdit(contact)} style={styles.offerReview}><Text style={styles.offerReviewText}>Edit contact</Text></Pressable></View>) : <EmptyState title="Keep your helpful connections close." message="Add recruiter and hiring team details so you can find the right person when it’s time to follow up." onAction={openContactCreate} action="Add contact" />}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Settings' ? <>
          <View style={styles.settingsCard}><Text style={styles.settingsTitle}>Display & preferences</Text><Text style={styles.settingsCaption}>Set up a workspace that feels easy to use.</Text><SettingsToggle label="Dark mode" description="Use a darker color palette." value={darkMode} onValueChange={setDarkMode} /><SettingsToggle label="Larger text" description="Make labels and details easier to read." value={largeText} onValueChange={setLargeText} /><SettingsToggle label="Progress statistics" description="Show application and interview totals." value={showStats} onValueChange={setShowStats} /><SettingsToggle label="Rejection encouragement" description="Show a supportive reminder on your overview." value={showQuotes} onValueChange={setShowQuotes} /></View>
          <View style={styles.settingsCard}><Text style={styles.settingsTitle}>Your account</Text><Text style={styles.settingsCaption}>Signed in to the local demo workspace.</Text><Pressable style={styles.signOutButton} onPress={() => setLoggedIn(false)}><Text style={styles.signOutText}>Sign out</Text></Pressable></View>
        </> : null}

        {activeTab === 'More' && moreScreen === 'Progress' ? <>
          <View style={styles.progressSummary}><Text style={styles.progressNumber}>{applications.length}</Text><Text style={styles.progressSummaryLabel}>applications in your search</Text><View style={styles.progressSummaryBottom}><View style={styles.progressTrack}><View style={[styles.progressFill, { width: responseRate }]} /></View><Text style={styles.progressSummaryRate}>{responseRate} response rate</Text></View></View>
          <View style={styles.pipelineCard}><SectionHeader title="Search snapshot" caption="Your applications at a glance" />{STATUSES.map((status) => { const count = applications.filter((item) => item.status === status).length; const [ink] = STATUS[status]; return <View key={status} style={styles.pipelineRow}><View style={[styles.statusDot, { backgroundColor: ink }]} /><Text style={styles.pipelineLabel}>{status}</Text><View style={styles.pipelineTrack}><View style={[styles.pipelineFill, { width: `${applications.length ? count / applications.length * 100 : 0}%` }]} /></View><Text style={styles.pipelineCount}>{count}</Text></View> })}</View>
          <SectionHeader title="Latest activity" caption="Your most recent applications" action="View all" onAction={() => setActiveTab('Applications')} />
          <View style={styles.applicationList}>{filteredApplications.slice(0, 3).map((application) => <ApplicationRow key={application.id} application={application} onPress={() => showDetails(application)} compact />)}</View>
        </> : null}
        {activeTab === 'More' && moreScreen !== 'Menu' ? <Pressable style={styles.backToMore} onPress={() => setMoreScreen('Menu')}><Text style={styles.backToMoreText}>‹  More tools</Text></Pressable> : null}
        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={[styles.tabBar, darkMode && styles.darkCard]}>
        {TABS.map((tab) => {
          const selectedTab = activeTab === tab.key
          return <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected: selectedTab }} onPress={() => { setActiveTab(tab.key); setFilter('All'); setQuery(''); setMoreScreen('Menu') }} style={styles.tabButton}>
            <View style={[styles.tabIconWrap, selectedTab && styles.tabIconWrapActive]}><Icon name={tab.icon} color={selectedTab ? C.purple : '#9693a1'} size={19} /></View>
            <Text style={[styles.tabLabel, selectedTab && styles.tabLabelActive]}>{tab.key}</Text>
          </Pressable>
        })}
      </View>
    </View>

    <ApplicationFormModal visible={formVisible} editing={editing} form={form} setForm={setForm} onClose={closeForm} onSave={saveApplication} />

    <Modal visible={detailsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailsVisible(false)}>
      <SafeAreaView style={styles.modalSafe}>
        {selected ? <View style={styles.detailRoot}>
          <View style={styles.detailTop}><Text style={styles.eyebrow}>APPLICATION DETAILS</Text><Pressable onPress={() => setDetailsVisible(false)} accessibilityLabel="Close details" style={styles.closeButton}><Icon name="close" color={C.muted} size={17} /></Pressable></View>
          <View style={styles.detailIdentity}><CompanyMark company={selected.company} color={selected.color} logoInk={selected.logoInk} /><View style={styles.detailHeading}><Text style={styles.detailCompany}>{selected.company}</Text><Text style={styles.detailRole}>{selected.role}</Text></View></View>
          <StatusPill status={selected.status} />
          <View style={styles.statusSelectorWrap}>
            <Text style={styles.inputLabel}>Change stage</Text>
            <View style={styles.statusSelectorRow}>
              {['Applied', 'In review', 'Interview', 'Pending', 'Offer', 'Accepted', 'Rejected'].map((stage) => {
                const selectedStage = selected.status === stage
                const [ink] = STATUS[stage] || ['#5f5b6d', '#f0efef']
                return <Pressable key={stage} onPress={() => updateSelectedStatus(stage)} style={[styles.statusSelectorButton, selectedStage && styles.statusSelectorButtonActive, { borderColor: selectedStage ? ink : '#e9e1f8' }]}><Text style={[styles.statusSelectorLabel, { color: selectedStage ? ink : '#5e596a' }]}>{stage}</Text></Pressable>
              })}
            </View>
          </View>
          <View style={styles.detailCard}><DetailLine label="Date applied" value={longDate(selected.date)} /><DetailLine label="Location" value={selected.location || 'Not set'} /><DetailLine label="Interview date" value={selected.interview ? longDate(selected.interview) : 'Not scheduled'} last /></View>
          {(selected.interviews || []).length ? <View style={styles.notesCard}><Text style={styles.notesTitle}>Interview rounds</Text>{selected.interviews.slice().sort((a, b) => a.date.localeCompare(b.date)).map((round) => <Pressable key={round.id} onPress={() => openInterviewEdit(selected, round)} style={styles.detailRound}><Text style={styles.detailRoundTitle}>{round.label || round.interviewType || `Round ${round.roundNumber}`}</Text><Text style={styles.detailRoundMeta}>{longDate(round.date)}{round.interviewer ? ` · ${round.interviewer}` : ''}</Text><Text style={styles.offerReviewText}>Edit round and preparation</Text></Pressable>)}</View> : null}
          {['Offer', 'Accepted'].includes(selected.status) ? <View style={styles.notesCard}><Text style={styles.notesTitle}>Offer package</Text><Text style={styles.notesBody}>{selected.salary ? `${selected.currency || 'USD'} ${Number(selected.salary).toLocaleString()} annual base` : 'Compensation not added yet'}{selected.signingBonus ? ` · ${selected.currency || 'USD'} ${Number(selected.signingBonus).toLocaleString()} signing bonus` : ''}{selected.equity ? ` · ${selected.currency || 'USD'} ${Number(selected.equity).toLocaleString()} equity estimate` : ''}</Text><Pressable onPress={() => openOfferEdit(selected)} style={styles.offerReview}><Text style={styles.offerReviewText}>Edit offer package and benefits</Text></Pressable></View> : null}
          <View style={styles.notesCard}><Text style={styles.notesTitle}>Notes</Text><Text style={styles.notesBody}>{selected.note || 'No notes yet.'}</Text></View>
          {selected.status === 'Interview' ? <Pressable onPress={() => { setDetailsVisible(false); setInterviewEditing(null); setInterviewForm({ applicationId: String(selected.id), date: selected.interview || isoToday(), roundNumber: String((selected.interviews || []).length + 1), interviewType: '', label: '', interviewer: '', meetingLink: '', description: '', outcome: 'Waiting to hear back', questionsToAsk: '', questionsAsked: '', prepNotes: '', reflection: '' }); setInterviewFormVisible(true) }} style={styles.detailAddRound}><Text style={styles.offerReviewText}>＋  Add interview round</Text></Pressable> : null}
          <View style={styles.detailActions}>
            {selected.status === 'Pending' ? <Pressable onPress={() => resolvePendingInterview(selected)} style={styles.pendingResolveButton}><Text style={styles.pendingResolveText}>Resolve pending</Text></Pressable> : null}
            <Pressable onPress={deleteApplication} style={styles.deleteButton}><Text style={styles.deleteButtonText}>Delete</Text></Pressable>
            <Pressable onPress={() => openEdit(selected)} style={styles.editButton}><Text style={styles.editButtonText}>Edit application</Text></Pressable>
          </View>
        </View> : null}
      </SafeAreaView>
    </Modal>

    <ContactFormModal visible={contactVisible} editing={contactEditing} applications={applications} form={contactForm} setForm={setContactForm} onClose={() => setContactVisible(false)} onSave={saveContact} />
    <OfferFormModal visible={offerVisible} application={offerEditing} form={offerForm} setForm={setOfferForm} onClose={() => { setOfferVisible(false); setOfferCelebrationPending(false) }} onSave={saveOffer} />
    <PortfolioProjectModal visible={portfolioVisible} project={portfolioEditing} form={portfolioForm} setForm={setPortfolioForm} onClose={() => { setPortfolioVisible(false); setPortfolioEditing(null); setPortfolioForm({ title: '', context: '', description: '', skills: '', links: '' }) }} onSave={savePortfolioProject} />
    <WorkHistoryFormModal visible={workHistoryVisible} editing={workHistoryEditing} form={workHistoryForm} setForm={setWorkHistoryForm} onClose={() => { setWorkHistoryVisible(false); setWorkHistoryEditing(null) }} onSave={saveWorkHistory} />
    <StudyNoteModal visible={studyNoteVisible} editing={studyNoteEditing} form={studyNoteForm} setForm={setStudyNoteForm} onClose={() => { setStudyNoteVisible(false); setStudyNoteEditing(null) }} onSave={saveStudyNote} />
    <InterviewRoundFormModal visible={interviewFormVisible} applications={applications} editing={interviewEditing?.round} form={interviewForm} setForm={setInterviewForm} onClose={() => setInterviewFormVisible(false)} onSave={saveInterviewRound} />
    <PendingInterviewUpdateModal visible={Boolean(pendingInterviewUpdate)} application={pendingInterviewUpdate} onClose={() => setPendingInterviewUpdate(null)} onContinue={() => {
      if (!pendingInterviewUpdate) return
      const latestRound = [...(pendingInterviewUpdate.interviews || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]
      setInterviewNextStepDraft({ questionsAsked: latestRound?.questionsAsked || '', reflection: latestRound?.reflection || '' })
      setInterviewNextStep({ application: pendingInterviewUpdate, outcome: 'Moving to next round' })
      setPendingInterviewUpdate(null)
    }} onCloseApplication={() => {
      if (!pendingInterviewUpdate) return
      setApplications((items) => items.map((item) => item.id === pendingInterviewUpdate.id ? { ...item, status: 'Rejected' } : item))
      setPendingInterviewUpdate(null)
    }} />
    <Modal transparent visible={Boolean(outcomePicker)} animationType="fade" onRequestClose={() => setOutcomePicker(null)}>
      <View style={styles.resetBackdrop}>
        <View style={styles.resetCard}>
          <Text style={styles.eyebrow}>ROUND OUTCOME</Text>
          <Text style={styles.resetTitle}>How did this interview go?</Text>
          <ScrollView style={styles.pendingChoiceList} contentContainerStyle={styles.pendingChoiceListContent} showsVerticalScrollIndicator={false}>
            {['Scheduled', 'Went well', 'Mixed', 'Needs follow-up', 'Waiting to hear back', 'Moving to next round', 'Not moving forward', 'Offer received'].map((choice) => (
              <Pressable key={choice} onPress={() => {
                if (outcomePicker) updateInterviewRoundOutcome(outcomePicker.applicationId, outcomePicker.roundId, choice)
              }} style={[styles.pendingChoice, choice === 'Not moving forward' && styles.pendingChoiceSecondary]}>
                <View style={styles.pendingChoiceIcon}><Text style={styles.offerReviewText}>{choice === 'Offer received' ? '✓' : choice === 'Not moving forward' ? '—' : choice === 'Moving to next round' ? '→' : '•'}</Text></View>
                <View style={styles.pendingChoiceTextWrap}><Text style={styles.pendingChoiceTitle}>{choice}</Text><Text style={styles.pendingChoiceCopy}>{choice === 'Went well' ? 'Strong signal and momentum.' : choice === 'Mixed' ? 'Some signal but not decisive yet.' : choice === 'Needs follow-up' ? 'Follow up and keep the process moving.' : choice === 'Waiting to hear back' ? 'Move to pending while you wait.' : choice === 'Moving to next round' ? 'Keep the cycle moving forward.' : choice === 'Not moving forward' ? 'Close this round and move on.' : choice === 'Offer received' ? 'Celebrate this milestone.' : 'Scheduled for a conversation.'}</Text></View>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable onPress={() => setOutcomePicker(null)} style={styles.resetButton}><Text style={styles.resetButtonText}>Close</Text></Pressable>
        </View>
      </View>
    </Modal>
    <InterviewNextStepModal
      visible={Boolean(interviewNextStep)}
      application={interviewNextStep?.application}
      outcome={interviewNextStep?.outcome || 'Waiting to hear back'}
      draft={interviewNextStepDraft}
      followUpDate={interviewFollowUpDate}
      followUpAction={interviewFollowUpAction}
      onQuestionChange={(value) => updateInterviewNextStepDraft('questionsAsked', value)}
      onReflectionChange={(value) => updateInterviewNextStepDraft('reflection', value)}
      onFollowUpDateChange={setInterviewFollowUpDate}
      onFollowUpActionChange={setInterviewFollowUpAction}
      onClose={() => setInterviewNextStep(null)}
      onWait={() => {
        if (!interviewNextStep?.application) return
        syncInterviewRoundNotes(interviewNextStep.application.id, interviewNextStepDraft)
        setApplications((items) => items.map((item) => item.id === interviewNextStep.application.id ? { ...item, status: 'Pending', followUpDate: item.followUpDate || interviewFollowUpDate || isoToday(), followUpAction: item.followUpAction || interviewFollowUpAction || 'Follow up after this interview' } : item))
        setInterviewNextStep(null)
      }}
      onAddRound={() => {
        if (!interviewNextStep?.application) return
        syncInterviewRoundNotes(interviewNextStep.application.id, interviewNextStepDraft)
        setInterviewNextStep(null)
        setInterviewEditing(null)
        setInterviewForm({ applicationId: String(interviewNextStep.application.id), date: isoToday(), roundNumber: String((interviewNextStep.application.interviews || []).length + 1), interviewType: '', label: '', interviewer: '', meetingLink: '', description: '', outcome: 'Waiting to hear back', questionsToAsk: '', questionsAsked: interviewNextStepDraft.questionsAsked, prepNotes: '', reflection: interviewNextStepDraft.reflection })
        setInterviewFormVisible(true)
      }}
      onReject={() => {
        if (!interviewNextStep?.application) return
        syncInterviewRoundNotes(interviewNextStep.application.id, interviewNextStepDraft)
        setApplications((items) => items.map((item) => item.id === interviewNextStep.application.id ? { ...item, status: 'Rejected' } : item))
        setInterviewNextStep(null)
      }}
      onKeep={() => {
        if (!interviewNextStep?.application) return
        syncInterviewRoundNotes(interviewNextStep.application.id, interviewNextStepDraft)
        setApplications((items) => items.map((item) => item.id === interviewNextStep.application.id ? { ...item, status: 'Interview' } : item))
        setInterviewNextStep(null)
      }}
      onAddFollowUp={(customFields = {}) => {
        if (!interviewNextStep?.application) return
        const nextDate = customFields.followUpDate || interviewFollowUpDate || isoToday()
        const nextAction = customFields.followUpAction || interviewFollowUpAction || 'Follow up after this interview'
        syncInterviewRoundNotes(interviewNextStep.application.id, interviewNextStepDraft)
        setApplications((items) => items.map((item) => item.id === interviewNextStep.application.id ? { ...item, status: 'Pending', followUpDate: nextDate, followUpAction: nextAction } : item))
        setInterviewNextStep(null)
      }}
    />

    <Modal transparent visible={Boolean(celebration)} animationType="fade" onRequestClose={() => setCelebration(null)}>
      <View style={styles.celebrationBackdrop}>
        {celebration ? <View style={styles.celebrationCard}>
          <View style={styles.celebrationConfetti}>
            {['#7054cf', '#e6a17f', '#7fb594', '#8ca5d0', '#d9bc67', '#c87981'].map((color, index) => <View key={color} style={[styles.confettiPiece, { backgroundColor: color, transform: [{ rotate: `${index * 31}deg` }, { translateY: index % 2 ? 3 : -3 }] }]} />)}
          </View>
          <View style={styles.celebrationStar}><Text style={styles.celebrationStarText}>✦</Text></View>
          <Text style={styles.celebrationEyebrow}>{celebration.kind === 'accepted' ? 'YOUR NEXT CHAPTER' : 'LOOK AT YOU'}</Text>
          <Text style={styles.celebrationTitle}>{celebration.kind === 'accepted' ? 'You got the job!' : 'You got an offer!'}</Text>
          <Text style={styles.celebrationMessage}>{celebration.kind === 'accepted' ? `${celebration.company} is excited to have you as ${celebration.role}. Take a moment to celebrate what you’ve accomplished.` : `${celebration.company} offered you the ${celebration.role} role. Take a breath and give yourself time to enjoy this moment.`}</Text>
          <Pressable onPress={() => setCelebration(null)} style={styles.celebrationButton}><Text style={styles.celebrationButtonText}>Take a moment</Text></Pressable>
        </View> : null}
      </View>
    </Modal>

  </SafeAreaView>
}

