import { Pressable, Text, TextInput, View, C, STATUS } from '../theme'
import { companyColor, companyInitials, shortDate } from '../data/applications'
import styles from '../styles'

export function Icon({ name, color = C.muted, size = 20 }) {
  const s = size
  if (name === 'grid') return <View style={{ width: s, height: s, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'space-between', padding: 1 }}><View style={{ width: s * 0.37, height: s * 0.37, borderRadius: 2, borderWidth: 1.5, borderColor: color }} /><View style={{ width: s * 0.37, height: s * 0.37, borderRadius: 2, borderWidth: 1.5, borderColor: color }} /><View style={{ width: s * 0.37, height: s * 0.37, borderRadius: 2, borderWidth: 1.5, borderColor: color }} /><View style={{ width: s * 0.37, height: s * 0.37, borderRadius: 2, borderWidth: 1.5, borderColor: color }} /></View>
  if (name === 'plus') return <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}><View style={{ position: 'absolute', width: s * 0.72, height: 2, borderRadius: 2, backgroundColor: color }} /><View style={{ position: 'absolute', width: 2, height: s * 0.72, borderRadius: 2, backgroundColor: color }} /></View>
  if (name === 'search') return <View style={{ width: s, height: s, alignItems: 'flex-start', justifyContent: 'flex-start' }}><View style={{ width: s * 0.62, height: s * 0.62, borderWidth: 1.7, borderColor: color, borderRadius: s, marginTop: 1, marginLeft: 1 }} /><View style={{ width: s * 0.35, height: 1.8, borderRadius: 2, backgroundColor: color, position: 'absolute', left: s * 0.56, top: s * 0.65, transform: [{ rotate: '45deg' }] }} /></View>
  if (name === 'briefcase') return <View style={{ width: s, height: s * 0.76, borderWidth: 1.6, borderColor: color, borderRadius: 3, marginTop: s * 0.18 }}><View style={{ position: 'absolute', width: s * 0.36, height: s * 0.22, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, borderTopLeftRadius: 2, borderTopRightRadius: 2, alignSelf: 'center', top: -s * 0.23 }} /><View style={{ position: 'absolute', height: 1.5, left: 0, right: 0, top: s * 0.34, backgroundColor: color }} /><View style={{ position: 'absolute', height: s * 0.12, width: s * 0.12, borderRadius: 2, backgroundColor: color, alignSelf: 'center', top: s * 0.27 }} /></View>
  if (name === 'calendar') return <View style={{ width: s * 0.84, height: s * 0.84, borderWidth: 1.6, borderColor: color, borderRadius: 3, marginTop: s * 0.12 }}><View style={{ position: 'absolute', left: 0, right: 0, top: s * 0.25, height: 1.5, backgroundColor: color }} /><View style={{ position: 'absolute', width: 1.6, height: s * 0.2, backgroundColor: color, top: -s * 0.11, left: s * 0.2 }} /><View style={{ position: 'absolute', width: 1.6, height: s * 0.2, backgroundColor: color, top: -s * 0.11, right: s * 0.2 }} /><View style={{ position: 'absolute', width: s * 0.12, height: s * 0.12, borderRadius: 2, backgroundColor: color, left: s * 0.18, top: s * 0.42 }} /><View style={{ position: 'absolute', width: s * 0.12, height: s * 0.12, borderRadius: 2, backgroundColor: color, right: s * 0.18, top: s * 0.42 }} /></View>
  if (name === 'chart') return <View style={{ width: s, height: s, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'flex-end', gap: s * 0.12, paddingBottom: s * 0.12, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderColor: color, paddingLeft: s * 0.15, paddingRight: s * 0.08 }}><View style={{ width: s * 0.16, height: s * 0.3, backgroundColor: color, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} /><View style={{ width: s * 0.16, height: s * 0.53, backgroundColor: color, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} /><View style={{ width: s * 0.16, height: s * 0.76, backgroundColor: color, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} /></View>
  if (name === 'award') return <View style={{ width: s * .72, height: s * .72, borderRadius: s, borderWidth: 1.7, borderColor: color, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: s * .22, height: s * .22, borderRadius: s, backgroundColor: color }} /></View>
  if (name === 'contacts') return <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: s * .34, height: s * .34, borderWidth: 1.5, borderColor: color, borderRadius: s, marginTop: -s * .22 }} /><View style={{ width: s * .72, height: s * .34, borderWidth: 1.5, borderColor: color, borderBottomWidth: 0, borderTopLeftRadius: s, borderTopRightRadius: s, position: 'absolute', bottom: 0 }} /></View>
  if (name === 'settings') return <View style={{ width: s * .72, height: s * .72, borderWidth: 1.7, borderColor: color, borderRadius: s, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: s * .24, height: s * .24, borderWidth: 1.5, borderColor: color, borderRadius: s }} /></View>
  if (name === 'more') return <View style={{ width: s, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>{[0, 1, 2].map((dot) => <View key={dot} style={{ width: s * .2, height: s * .2, borderRadius: s, backgroundColor: color }} />)}</View>
  if (name === 'close') return <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}><View style={{ position: 'absolute', width: s * 0.8, height: 1.7, borderRadius: 2, backgroundColor: color, transform: [{ rotate: '45deg' }] }} /><View style={{ position: 'absolute', width: s * 0.8, height: 1.7, borderRadius: 2, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} /></View>
  if (name === 'chevron') return <View style={{ width: s * 0.55, height: s * 0.55, borderTopWidth: 1.7, borderRightWidth: 1.7, borderColor: color, transform: [{ rotate: '45deg' }] }} />
  return null
}

export function Brand() {
  return <View style={styles.brand}>
    <View style={styles.brandMark}><Icon name="briefcase" color="#fff" size={18} /></View>
    <Text style={styles.brandName}>trackr<Text style={styles.brandDot}>.</Text></Text>
  </View>
}

export function StatusPill({ status }) {
  const [ink, tint] = STATUS[status] || STATUS.Applied
  return <View style={[styles.statusPill, { backgroundColor: tint }]}>
    <View style={[styles.statusDot, { backgroundColor: ink }]} />
    <Text style={[styles.statusText, { color: ink }]}>{status}</Text>
  </View>
}

export function CompanyMark({ company, color, logoInk }) {
  const identity = companyColor(company)
  return <View style={[styles.companyMark, { backgroundColor: color || identity.color }]}>
    <Text style={[styles.companyMarkText, { color: logoInk || identity.logoInk }]}>{companyInitials(company)}</Text>
  </View>
}

export function ApplicationRow({ application, onPress, compact = false }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.applicationRow, pressed && styles.rowPressed]}>
    <CompanyMark company={application.company} color={application.color} logoInk={application.logoInk} />
    <View style={styles.applicationInfo}>
      <View style={styles.applicationTitleLine}>
        <Text style={styles.companyName} numberOfLines={1}>{application.company}</Text>
        <Text style={styles.dateText}>{shortDate(application.date)}</Text>
      </View>
      <Text style={styles.roleText} numberOfLines={1}>{application.role}</Text>
      <View style={styles.applicationMeta}><StatusPill status={application.status} />
        {!compact && application.interview ? <Text style={styles.nextStepText}>Interview · {shortDate(application.interview)}</Text> : null}
      </View>
    </View>
    <View style={styles.rowChevron}><Icon name="chevron" size={12} color="#aaa6b4" /></View>
  </Pressable>
}

export function SectionHeader({ title, caption, action, onAction }) {
  return <View style={styles.sectionHeader}>
    <View style={styles.sectionHeadingGroup}><Text style={styles.sectionTitle}>{title}</Text>{caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}</View>
    {action ? <Pressable onPress={onAction} hitSlop={8}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}
  </View>
}

export function MetricCard({ label, value, note, tone = 'purple' }) {
  const toneStyle = tone === 'green' ? styles.metricIconGreen : tone === 'peach' ? styles.metricIconPeach : tone === 'blue' ? styles.metricIconBlue : styles.metricIconPurple
  const icon = tone === 'green' ? 'chart' : tone === 'peach' ? 'calendar' : tone === 'blue' ? 'chart' : 'briefcase'
  return <View style={styles.metricCard}>
    <View style={styles.metricTop}><Text style={styles.metricLabel}>{label}</Text><View style={[styles.metricIcon, toneStyle]}><Icon name={icon} size={15} color={tone === 'green' ? C.green : tone === 'peach' ? C.peach : tone === 'blue' ? C.blue : C.purple} /></View></View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricNote}>{note}</Text>
  </View>
}

export function SearchField({ value, onChangeText }) {
  return <View style={styles.searchField}><Icon name="search" size={17} color={C.faint} /><TextInput
    accessibilityLabel="Search applications"
    placeholder="Search by company or role"
    placeholderTextColor={C.faint}
    value={value}
    onChangeText={onChangeText}
    style={styles.searchInput}
    returnKeyType="search"
    autoCapitalize="none"
    clearButtonMode="while-editing"
  /></View>
}

export function SettingsToggle({ label, description, value, onValueChange }) {
  return <Pressable onPress={() => onValueChange(!value)} style={styles.settingsToggle}><View style={styles.settingsToggleCopy}><Text style={styles.settingsToggleTitle}>{label}</Text><Text style={styles.settingsCaption}>{description}</Text></View><View style={[styles.toggleTrack, value && styles.toggleTrackOn]}><View style={[styles.toggleKnob, value && styles.toggleKnobOn]} /></View></Pressable>
}

export function FormField({ label, required, helper, ...inputProps }) {
  return <View style={styles.fieldBlock}><Text style={styles.inputLabel}>{label}{required ? <Text style={styles.requiredLabel}> *</Text> : null}</Text><TextInput {...inputProps} style={styles.formInput} placeholderTextColor={C.faint} />{helper ? <Text style={styles.fieldHelper}>{helper}</Text> : null}</View>
}

export function DetailLine({ label, value, last }) {
  return <View style={[styles.detailLine, last && styles.detailLineLast]}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>
}

export function EmptyState({ title, message, action, onAction }) {
  return <View style={styles.emptyState}><View style={styles.emptyIllustration}><Icon name="briefcase" color={C.purple} size={22} /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyMessage}>{message}</Text>{action ? <Pressable onPress={onAction} style={styles.emptyAction}><Icon name="plus" color="#fff" size={15} /><Text style={styles.emptyActionText}>{action}</Text></Pressable> : null}</View>
}

