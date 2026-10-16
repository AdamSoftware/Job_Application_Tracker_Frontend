import { StatusBar } from 'expo-status-bar'
import { useMemo, useState } from 'react'
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import {
  Pressable, SafeAreaView, Text, TextInput, View,
  C, STATUS, STATUSES, setThemePreferences,
} from './src/theme'
import { SEED, TABS, companyInitials, isoToday, longDate, shortDate } from './src/data/applications'
import {
  ApplicationRow, Brand, CompanyMark, DetailLine, EmptyState, FormField, Icon,
  MetricCard, SearchField, SectionHeader, SettingsToggle, StatusPill,
} from './src/components/common'
import LoginScreen from './src/screens/LoginScreen'
import styles from './src/styles'

export default function App() {
  const [applications, setApplications] = useState(SEED)
  const [loggedIn, setLoggedIn] = useState(false)
  const [moreScreen, setMoreScreen] = useState('Menu')
  const [darkMode, setDarkMode] = useState(false)
  const [largeText, setLargeText] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [showQuotes, setShowQuotes] = useState(true)
  const [contacts, setContacts] = useState([])
  const [contactForm, setContactForm] = useState({ name: '', title: '', company: '', email: '', phone: '', notes: '' })
  const [contactVisible, setContactVisible] = useState(false)
  const [celebration, setCelebration] = useState(null)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [calendarDate, setCalendarDate] = useState(() => SEED.find((item) => item.interview && item.interview >= isoToday())?.interview || isoToday())
  const [activeTab, setActiveTab] = useState('Home')
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [formVisible, setFormVisible] = useState(false)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ company: '', role: '', location: '', date: isoToday(), interview: '', note: '', status: 'Applied' })

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
  const interviews = useMemo(() => applications.filter((item) => item.interview && item.interview >= today).sort((a, b) => a.interview.localeCompare(b.interview)), [applications, today])
  const responseCount = applications.filter((item) => ['Interview', 'Offer', 'Rejected'].includes(item.status)).length
  const responseRate = applications.length ? `${Math.round(responseCount / applications.length * 100)}%` : '0%'
  const filteredApplications = useMemo(() => applications
    .filter((item) => filter === 'All' || item.status === filter)
    .filter((item) => `${item.company} ${item.role}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [applications, filter, query])

  const openCreate = (initialStatus = 'Applied') => {
    setEditing(null)
    setForm({ company: '', role: '', location: '', date: isoToday(), interview: '', note: '', status: initialStatus })
    setFormVisible(true)
  }
  const openContactCreate = () => {
    setContactForm({ name: '', title: '', company: '', email: '', phone: '', notes: '' })
    setContactVisible(true)
  }
  const openEdit = (application) => {
    setEditing(application)
    setForm({ company: application.company || '', role: application.role || '', location: application.location || '', date: application.date || isoToday(), interview: application.interview || '', note: application.note || '', status: application.status || 'Applied' })
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
      note: form.note.trim(),
      date: form.date.trim() || isoToday(),
    }
    setApplications((current) => editing
      ? current.map((item) => item.id === editing.id ? nextApplication : item)
      : [nextApplication, ...current])
    const newlyReceivedOffer = form.status === 'Offer' && editing?.status !== 'Offer'
    const newlyAcceptedOffer = form.status === 'Accepted' && editing?.status !== 'Accepted'
    closeForm()
    if (newlyReceivedOffer) setCelebration({ kind: 'offer', company: nextApplication.company, role: nextApplication.role })
    else if (newlyAcceptedOffer) setCelebration({ kind: 'accepted', company: nextApplication.company, role: nextApplication.role })
  }
  const deleteApplication = () => {
    if (!selected) return
    Alert.alert('Delete this application?', `Remove ${selected.company} from your tracker?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setApplications((current) => current.filter((item) => item.id !== selected.id)); setDetailsVisible(false); setSelected(null) } },
    ])
  }

  const heading = activeTab === 'Home' ? `${greeting}, Alex` : activeTab === 'Applications' ? 'Applications' : activeTab === 'Interviews' ? 'Your interviews' : moreScreen === 'Menu' ? 'More tools' : moreScreen
  const subtitle = activeTab === 'Home' ? 'Here’s what’s happening with your job search.' : activeTab === 'Applications' ? 'Keep every opportunity in one place.' : activeTab === 'Interviews' ? 'Feel ready for every conversation.' : moreScreen === 'Menu' ? 'Offers, recruiter contacts, settings, and more.' : 'Everything you need, in one place.'
  const quickAction = activeTab === 'Interviews' ? { label: 'Add interview', run: () => openCreate('Interview') }
    : activeTab === 'More' && moreScreen === 'Offers' ? { label: 'Add offer', run: () => openCreate('Offer') }
      : activeTab === 'More' && moreScreen === 'Recruiter contacts' ? { label: 'Add contact', run: openContactCreate }
        : activeTab === 'More' && moreScreen !== 'Menu' ? null : { label: 'Add application', run: openCreate }

  if (!loggedIn) return <LoginScreen onSignIn={() => setLoggedIn(true)} />

  return <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSurface]}>
    <StatusBar style={darkMode ? 'light' : 'dark'} />
    <View style={[styles.screen, darkMode && styles.darkSurface]}>
      <View style={[styles.topBar, darkMode && styles.darkCard]}>
        <Brand />
        {quickAction ? <Pressable accessibilityRole="button" accessibilityLabel={quickAction.label} onPress={quickAction.run} style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
          <Icon name="plus" color="#fff" size={16} /><Text style={styles.addButtonText}>{quickAction.label}</Text>
        </Pressable> : <View style={styles.topBarSpacer} />}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Text style={styles.eyebrow}>{activeTab === 'Home' ? todayLabel : 'YOUR JOB SEARCH'}</Text>
        <Text style={styles.pageTitle}>{heading}<Text style={styles.titleDot}>.</Text></Text>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>

        {activeTab === 'Home' ? <>
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
          <SectionHeader title={calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} caption="Tap a date to see your interviews" />
          <View style={styles.calendarCard}>
            <View style={styles.calendarNav}><Pressable onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}><Text style={styles.calendarArrow}>‹</Text></Pressable><Pressable onPress={() => { setCalendarMonth(new Date()); setCalendarDate(isoToday()) }}><Text style={styles.calendarToday}>Today</Text></Pressable><Pressable onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}><Text style={styles.calendarArrow}>›</Text></Pressable></View>
            <View style={styles.calendarGrid}>{['S','M','T','W','T','F','S'].map((day, index) => <Text key={`${day}${index}`} style={styles.calendarWeekday}>{day}</Text>)}{Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() }, (_, i) => <View key={`blank${i}`} style={styles.calendarBlank} />)}{Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate() }, (_, i) => { const day = i + 1; const key = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; const hasEvent = applications.some((app) => app.interview === key); return <Pressable key={key} onPress={() => setCalendarDate(key)} style={[styles.calendarDay, calendarDate === key && styles.calendarDaySelected]}><Text style={[styles.calendarDayText, calendarDate === key && styles.calendarDayTextSelected]}>{day}</Text>{hasEvent ? <View style={styles.calendarEventDot} /> : null}</Pressable> })}</View>
          </View>
          <SectionHeader title={new Date(`${calendarDate}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} caption="Scheduled interviews" />
          {applications.filter((item) => item.interview === calendarDate).length ? <View style={styles.applicationList}>{applications.filter((item) => item.interview === calendarDate).map((application) => <ApplicationRow key={application.id} application={application} onPress={() => showDetails(application)} />)}</View> : <Text style={styles.calendarNoEvents}>No interviews scheduled for this day.</Text>}
          <SectionHeader title="Coming up" caption="Your conversations and next steps" />
          {interviews.length ? <View style={styles.applicationList}>{interviews.map((application) => <ApplicationRow key={application.id} application={application} onPress={() => showDetails(application)} />)}</View> : <EmptyState title="No upcoming interviews" message="When you add an interview date to an application, it’ll appear here." onAction={openCreate} action="Add an interview" />}
          {applications.some((item) => item.status === 'Interview' && (!item.interview || item.interview < today)) ? <><SectionHeader title="Past interviews" caption="Keep track of where you’ve been" /><View style={styles.applicationList}>{applications.filter((item) => item.status === 'Interview' && (!item.interview || item.interview < today)).map((application) => <ApplicationRow key={application.id} application={application} onPress={() => showDetails(application)} />)}</View></> : null}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Menu' ? <View style={styles.moreMenu}>
          {[['Offers', 'Compare offers and record your decision', 'award'], ['Recruiter contacts', 'Keep hiring contacts and follow-ups together', 'contacts'], ['Progress', 'See your application pipeline', 'chart'], ['Settings', 'Personalize Trackr and your account', 'settings']].map(([title, note, icon]) => <Pressable key={title} onPress={() => openMore(title)} style={({ pressed }) => [styles.moreCard, pressed && styles.rowPressed]}><View style={styles.moreIcon}><Icon name={icon === 'settings' ? 'close' : icon} color={C.purple} size={18} /></View><View style={styles.moreCardCopy}><Text style={styles.moreCardTitle}>{title}</Text><Text style={styles.moreCardNote}>{note}</Text></View><Icon name="chevron" size={12} color={C.faint} /></Pressable>)}
        </View> : null}

        {activeTab === 'More' && moreScreen === 'Offers' ? <>
          <SectionHeader title="Offers to compare" caption="Review the whole package and decide when you’re ready" action="Add offer" onAction={() => openCreate('Offer')} />
          {applications.filter((item) => ['Offer','Accepted'].includes(item.status)).length ? applications.filter((item) => ['Offer','Accepted'].includes(item.status)).map((application) => <View key={application.id} style={styles.offerCard}><View style={styles.offerHeading}><CompanyMark company={application.company} /><View style={{ flex: 1 }}><Text style={styles.moreCardTitle}>{application.company}</Text><Text style={styles.moreCardNote}>{application.role}</Text></View><StatusPill status={application.status} /></View><View style={styles.offerValue}><Text style={styles.offerValueLabel}>OFFER STATUS</Text><Text style={styles.offerValueText}>{application.status === 'Accepted' ? 'Accepted' : 'Decision pending'}</Text><Text style={styles.moreCardNote}>{application.note || 'Add offer compensation and benefits in application details.'}</Text></View>{application.status === 'Offer' ? <View style={styles.offerActions}><Pressable onPress={() => changeOfferStatus(application, 'Accepted')} style={styles.offerAccept}><Text style={styles.offerAcceptText}>Accept offer</Text></Pressable><Pressable onPress={() => changeOfferStatus(application, 'Rejected')} style={styles.offerDecline}><Text style={styles.offerDeclineText}>Decline</Text></Pressable></View> : null}<Pressable onPress={() => showDetails(application)} style={styles.offerReview}><Text style={styles.offerReviewText}>Review application details</Text></Pressable></View>) : <EmptyState title="Your next opportunity could be an offer." message="When a company makes an offer, save it here and compare the details." onAction={openCreate} action="Add offer" />}
        </> : null}

        {activeTab === 'More' && moreScreen === 'Recruiter contacts' ? <>
          <SectionHeader title="Recruiter contacts" caption="Keep people in your corner close at hand" action="Add contact" onAction={openContactCreate} />
          {contacts.length ? contacts.map((contact, index) => <View key={`${contact.email}${index}`} style={styles.contactCard}><View style={styles.offerHeading}><View style={styles.contactAvatar}><Text style={styles.contactAvatarText}>{companyInitials(contact.name)}</Text></View><View style={{ flex: 1 }}><Text style={styles.moreCardTitle}>{contact.name}</Text><Text style={styles.moreCardNote}>{contact.title}{contact.company ? ` · ${contact.company}` : ''}</Text></View><Pressable onPress={() => setContacts(contacts.filter((_, i) => i !== index))}><Text style={styles.deleteContact}>Remove</Text></Pressable></View>{contact.email ? <Text style={styles.contactDetail}>{contact.email}</Text> : null}{contact.phone ? <Text style={styles.contactDetail}>{contact.phone}</Text> : null}{contact.notes ? <Text style={styles.moreCardNote}>{contact.notes}</Text> : null}</View>) : <EmptyState title="Keep your helpful connections close." message="Add recruiter and hiring team details so you can find the right person when it’s time to follow up." onAction={openContactCreate} action="Add contact" />}
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
          return <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected: selectedTab }} onPress={() => { setActiveTab(tab.key); setFilter('All'); setQuery('') }} style={styles.tabButton}>
            <View style={[styles.tabIconWrap, selectedTab && styles.tabIconWrapActive]}><Icon name={tab.icon} color={selectedTab ? C.purple : '#9693a1'} size={19} /></View>
            <Text style={[styles.tabLabel, selectedTab && styles.tabLabelActive]}>{tab.key}</Text>
          </Pressable>
        })}
      </View>
    </View>

    <Modal visible={formVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeForm}>
      <SafeAreaView style={styles.modalSafe}>
        <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}><View><Text style={styles.eyebrow}>YOUR JOB SEARCH</Text><Text style={styles.modalTitle}>{editing ? 'Edit application' : form.status === 'Offer' ? 'Add an offer' : form.status === 'Interview' ? 'Add an interview' : 'Add an application'}</Text><Text style={styles.modalSubtitle}>Keep the details somewhere you can find them.</Text></View><Pressable onPress={closeForm} accessibilityLabel="Close form" style={styles.closeButton}><Icon name="close" color={C.muted} size={17} /></Pressable></View>
          <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <FormField label="Company name" required value={form.company} onChangeText={(value) => setForm({ ...form, company: value })} placeholder="e.g. Acme, Inc." autoCapitalize="words" />
            <FormField label="Position title" required value={form.role} onChangeText={(value) => setForm({ ...form, role: value })} placeholder="e.g. Product Designer" autoCapitalize="words" />
            <FormField label="Location" value={form.location} onChangeText={(value) => setForm({ ...form, location: value })} placeholder="Remote or city" autoCapitalize="words" />
            <View style={styles.dateFields}><View style={styles.dateField}><FormField label="Date applied" value={form.date} onChangeText={(value) => setForm({ ...form, date: value })} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" helper="YYYY-MM-DD" /></View><View style={styles.dateField}><FormField label="Interview date" value={form.interview} onChangeText={(value) => setForm({ ...form, interview: value })} placeholder="Optional" keyboardType="numbers-and-punctuation" helper="YYYY-MM-DD" /></View></View>
            <View style={styles.fieldBlock}><Text style={styles.inputLabel}>Status</Text><View style={styles.statusOptions}>{STATUSES.map((status) => { const [ink, tint] = STATUS[status]; const chosen = form.status === status; return <Pressable key={status} onPress={() => setForm({ ...form, status })} style={[styles.statusOption, { backgroundColor: chosen ? tint : C.white, borderColor: chosen ? ink : C.line }]}><View style={[styles.statusDot, { backgroundColor: ink }]} /><Text style={[styles.statusOptionText, { color: chosen ? ink : C.inkSoft }]}>{status}</Text></Pressable> })}</View></View>
            <View style={styles.fieldBlock}><Text style={styles.inputLabel}>Notes <Text style={styles.optionalLabel}>Optional</Text></Text><TextInput value={form.note} onChangeText={(value) => setForm({ ...form, note: value })} style={[styles.formInput, styles.notesInput]} placeholder="Recruiter details, interview notes, next steps..." placeholderTextColor={C.faint} multiline textAlignVertical="top" /></View>
          </ScrollView>
          <View style={styles.modalActions}><Pressable onPress={closeForm} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable><Pressable onPress={saveApplication} style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}><Text style={styles.saveButtonText}>{editing ? 'Save changes' : form.status === 'Offer' ? 'Save offer' : form.status === 'Interview' ? 'Save interview' : 'Add application'}</Text></Pressable></View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>

    <Modal visible={detailsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailsVisible(false)}>
      <SafeAreaView style={styles.modalSafe}>
        {selected ? <View style={styles.detailRoot}>
          <View style={styles.detailTop}><Text style={styles.eyebrow}>APPLICATION DETAILS</Text><Pressable onPress={() => setDetailsVisible(false)} accessibilityLabel="Close details" style={styles.closeButton}><Icon name="close" color={C.muted} size={17} /></Pressable></View>
          <View style={styles.detailIdentity}><CompanyMark company={selected.company} color={selected.color} logoInk={selected.logoInk} /><View style={styles.detailHeading}><Text style={styles.detailCompany}>{selected.company}</Text><Text style={styles.detailRole}>{selected.role}</Text></View></View>
          <StatusPill status={selected.status} />
          <View style={styles.detailCard}><DetailLine label="Date applied" value={longDate(selected.date)} /><DetailLine label="Location" value={selected.location || 'Not set'} /><DetailLine label="Interview date" value={selected.interview ? longDate(selected.interview) : 'Not scheduled'} last /></View>
          <View style={styles.notesCard}><Text style={styles.notesTitle}>Notes</Text><Text style={styles.notesBody}>{selected.note || 'No notes yet.'}</Text></View>
          <View style={styles.detailActions}><Pressable onPress={deleteApplication} style={styles.deleteButton}><Text style={styles.deleteButtonText}>Delete</Text></Pressable><Pressable onPress={() => openEdit(selected)} style={styles.editButton}><Text style={styles.editButtonText}>Edit application</Text></Pressable></View>
        </View> : null}
      </SafeAreaView>
    </Modal>

    <Modal visible={contactVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setContactVisible(false)}>
      <SafeAreaView style={styles.modalSafe}><View style={styles.detailRoot}><View style={styles.detailTop}><View><Text style={styles.eyebrow}>PEOPLE IN YOUR CORNER</Text><Text style={styles.modalTitle}>Add recruiter contact</Text></View><Pressable onPress={() => setContactVisible(false)} style={styles.closeButton}><Icon name="close" size={17} /></Pressable></View><ScrollView contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled"><FormField label="Name" required value={contactForm.name} onChangeText={(name) => setContactForm({ ...contactForm, name })} placeholder="Full name"/><FormField label="Title" value={contactForm.title} onChangeText={(title) => setContactForm({ ...contactForm, title })} placeholder="Recruiter or hiring manager"/><FormField label="Company" value={contactForm.company} onChangeText={(company) => setContactForm({ ...contactForm, company })} placeholder="Company name"/><FormField label="Email" value={contactForm.email} onChangeText={(email) => setContactForm({ ...contactForm, email })} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none"/><FormField label="Phone" value={contactForm.phone} onChangeText={(phone) => setContactForm({ ...contactForm, phone })} placeholder="Optional" keyboardType="phone-pad"/><View style={styles.fieldBlock}><Text style={styles.inputLabel}>Notes</Text><TextInput value={contactForm.notes} onChangeText={(notes) => setContactForm({ ...contactForm, notes })} style={[styles.formInput, styles.notesInput]} placeholder="Follow-up context or conversation notes" placeholderTextColor={C.faint} multiline /></View></ScrollView><View style={styles.modalActions}><Pressable onPress={() => setContactVisible(false)} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable><Pressable onPress={() => { if (!contactForm.name.trim()) return Alert.alert('Add a name', 'Enter a name before saving this contact.'); setContacts((items) => [...items, contactForm]); setContactVisible(false) }} style={styles.saveButton}><Text style={styles.saveButtonText}>Save contact</Text></Pressable></View></View></SafeAreaView>
    </Modal>

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

