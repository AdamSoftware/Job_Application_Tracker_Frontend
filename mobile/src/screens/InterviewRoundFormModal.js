import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import { C, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { FormField, Icon } from '../components/common'
import styles from '../styles'

const TYPES = ['Phone screen', 'Recruiter screen', 'Video interview', 'In-person interview', 'Technical assessment', 'Panel interview', 'Portfolio review', 'Final interview', 'Other']
export default function InterviewRoundFormModal({ visible, applications, editing, form, setForm, onClose, onSave }) {
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={styles.modalSafe}><KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.formModalHeader}><View style={styles.formModalHeading}><Text style={styles.eyebrow}>INTERVIEW DETAILS</Text><Text style={styles.modalTitle}>{editing ? 'Edit interview details' : 'Schedule an interview'}</Text><Text style={styles.modalSubtitle}>Keep prep and follow-up on one screen.</Text></View><Pressable onPress={onClose} accessibilityLabel="Close interview editor" style={styles.closeButton}><Icon name="close" color={C.muted} size={17} /></Pressable></View>
      <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.formSectionCard}><View style={styles.formSectionHeading}><Text style={styles.formSectionTitle}>Round details</Text><Text style={styles.formSectionCaption}>When, who, and what kind of round this is.</Text></View>
          <Text style={styles.inputLabel}>Application</Text>
          <View style={styles.statusOptions}>{applications.map((application) => { const chosen = String(form.applicationId) === String(application.id); return <Pressable key={application.id} onPress={() => update('applicationId', String(application.id))} style={[styles.statusOption, chosen && styles.statusOptionSelected]}><Text numberOfLines={1} style={[styles.statusOptionText, chosen && styles.statusOptionTextSelected]}>{application.company} · {application.role}</Text></Pressable> })}</View>
          <FormField label="Interview date" required value={form.date} onChangeText={(value) => update('date', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" helper="Use YYYY-MM-DD" />
          <FormField label="Round number" value={form.roundNumber} onChangeText={(value) => update('roundNumber', value)} placeholder="1" keyboardType="numeric" />
          <Text style={styles.inputLabel}>Interview type</Text>
          <View style={styles.statusOptions}>{TYPES.map((type) => { const chosen = form.interviewType === type; return <Pressable key={type} onPress={() => update('interviewType', type)} style={[styles.statusOption, chosen && styles.statusOptionSelected]}><Text style={[styles.statusOptionText, chosen && styles.statusOptionTextSelected]}>{type}</Text></Pressable> })}</View>
          <Text style={styles.inputLabel}>Current outcome</Text>
          <View style={[styles.statusOptions, { maxWidth: '100%' }]}>{['Scheduled', 'Went well', 'Mixed', 'Needs follow-up', 'Waiting to hear back', 'Moving to next round', 'Not moving forward', 'Offer received'].map((outcome) => { const chosen = form.outcome === outcome; return <Pressable key={outcome} onPress={() => update('outcome', outcome)} style={[styles.statusOption, chosen && styles.statusOptionSelected]}><Text numberOfLines={1} style={[styles.statusOptionText, chosen && styles.statusOptionTextSelected]}>{outcome}</Text></Pressable> })}</View>
          <FormField label="Round name" value={form.label} onChangeText={(value) => update('label', value)} placeholder="e.g. Hiring manager conversation" />
          <FormField label="Interviewer or format" value={form.interviewer} onChangeText={(value) => update('interviewer', value)} placeholder="Recruiter name, video call, onsite…" />
          <FormField label="Meeting or video link" value={form.meetingLink} onChangeText={(value) => update('meetingLink', value)} placeholder="https://…" keyboardType="url" autoCapitalize="none" />
          <View style={styles.fieldBlock}><Text style={styles.inputLabel}>What happens in this round?</Text><TextInput value={form.description} onChangeText={(value) => update('description', value)} style={[styles.formInput, styles.notesInput]} placeholder="Format, topics, or expectations…" placeholderTextColor={C.faint} multiline textAlignVertical="top" /></View>
        </View>
        <View style={styles.formSectionCard}><View style={styles.formSectionHeading}><Text style={styles.formSectionTitle}>Preparation & reflection</Text><Text style={styles.formSectionCaption}>Questions, notes, and follow-up reminders for your next move.</Text></View>
          {[['Questions to ask', 'questionsToAsk', 'What would you like to ask?'], ['Questions they asked', 'questionsAsked', 'Record their questions after the interview.'], ['Interview prep notes', 'prepNotes', 'Talking points, examples, or research…'], ['Reflection & follow-up notes', 'reflection', 'What went well and what to follow up on…']].map(([label, key, placeholder]) => <View key={key} style={styles.fieldBlock}><Text style={styles.inputLabel}>{label}</Text><TextInput value={form[key]} onChangeText={(value) => update(key, value)} style={[styles.formInput, styles.notesInput]} placeholder={placeholder} placeholderTextColor={C.faint} multiline textAlignVertical="top" /></View>)}
        </View><View style={styles.formBottomSpace} /></ScrollView>
      <View style={styles.modalActions}><Pressable onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable><Pressable onPress={onSave} style={styles.saveButton}><Text style={styles.saveButtonText}>{editing ? 'Save changes' : 'Save interview'}</Text></Pressable></View>
    </KeyboardAvoidingView></SafeAreaView>
  </Modal>
}
