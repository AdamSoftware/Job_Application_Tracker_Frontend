import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import { C, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { FormField, Icon } from '../components/common'
import styles from '../styles'

export default function ContactFormModal({ visible, editing, applications, form, setForm, onClose, onSave }) {
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={styles.modalSafe}><KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.formModalHeader}><View style={styles.formModalHeading}><Text style={styles.eyebrow}>YOUR NETWORK</Text><Text style={styles.modalTitle}>{editing ? 'Edit contact' : 'Add recruiter contact'}</Text><Text style={styles.modalSubtitle}>Save the details you’ll want when it’s time to connect.</Text></View><Pressable onPress={onClose} accessibilityLabel="Close contact editor" style={styles.closeButton}><Icon name="close" color={C.muted} size={17} /></Pressable></View>
      <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.formSectionCard}><View style={styles.formSectionHeading}><Text style={styles.formSectionTitle}>Contact details</Text><Text style={styles.formSectionCaption}>The best way to remember who’s who.</Text></View>
          <FormField label="Name" required value={form.name} onChangeText={(value) => update('name', value)} placeholder="e.g. Jordan Lee" autoCapitalize="words" />
          <FormField label="Title" value={form.title} onChangeText={(value) => update('title', value)} placeholder="Recruiter or hiring manager" />
          <FormField label="Company" value={form.company} onChangeText={(value) => update('company', value)} placeholder="Company name" />
          <Text style={styles.inputLabel}>Related application</Text><View style={styles.statusOptions}><Pressable onPress={() => update('jobId', '')} style={[styles.statusOption, !form.jobId && styles.statusOptionSelected]}><Text style={[styles.statusOptionText, !form.jobId && styles.statusOptionTextSelected]}>None</Text></Pressable>{applications.map((app) => { const chosen = String(form.jobId || '') === String(app.id); return <Pressable key={app.id} onPress={() => update('jobId', String(app.id))} style={[styles.statusOption, chosen && styles.statusOptionSelected]}><Text numberOfLines={1} style={[styles.statusOptionText, chosen && styles.statusOptionTextSelected]}>{app.company}</Text></Pressable> })}</View>
          <FormField label="Email address" value={form.email} onChangeText={(value) => update('email', value)} placeholder="name@company.com" keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View style={styles.formSectionCard}><View style={styles.formSectionHeading}><Text style={styles.formSectionTitle}>More contact details</Text><Text style={styles.formSectionCaption}>Optional details for future follow-ups.</Text></View>
          <FormField label="Phone" value={form.phone} onChangeText={(value) => update('phone', value)} placeholder="(555) 555-0123" keyboardType="phone-pad" />
          <FormField label="LinkedIn profile URL" value={form.linkedin} onChangeText={(value) => update('linkedin', value)} placeholder="https://linkedin.com/in/…" keyboardType="url" autoCapitalize="none" />
          <View style={styles.fieldBlock}><Text style={styles.inputLabel}>Conversation notes</Text><TextInput value={form.notes} onChangeText={(value) => update('notes', value)} style={[styles.formInput, styles.notesInput]} placeholder="How you connected, last conversation, useful context…" placeholderTextColor={C.faint} multiline textAlignVertical="top" /></View>
        </View><View style={styles.formBottomSpace} />
      </ScrollView>
      <View style={styles.modalActions}><Pressable onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable><Pressable onPress={onSave} style={styles.saveButton}><Text style={styles.saveButtonText}>{editing ? 'Save contact' : 'Add contact'}</Text></Pressable></View>
    </KeyboardAvoidingView></SafeAreaView>
  </Modal>
}
