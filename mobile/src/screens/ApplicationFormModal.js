import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import { C, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { FormField, Icon } from '../components/common'
import { STATUS, STATUSES } from '../theme'
import styles from '../styles'

const updateField = (form, setForm, field, value) => setForm({ ...form, [field]: value })

export default function ApplicationFormModal({
  visible,
  editing,
  form,
  setForm,
  onClose,
  onSave,
}) {
  const title = editing
    ? 'Edit application'
    : form.status === 'Offer'
      ? 'Add an offer'
      : form.status === 'Interview'
        ? 'Add an interview'
        : 'Add an application'

  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={styles.modalSafe}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formModalHeader}>
          <View style={styles.formModalHeading}>
            <Text style={styles.eyebrow}>YOUR JOB SEARCH</Text>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalSubtitle}>Keep the details somewhere you can find them.</Text>
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close form" style={styles.closeButton}>
            <Icon name="close" color={C.muted} size={17} />
          </Pressable>
        </View>

        <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Application details</Text>
              <Text style={styles.formSectionCaption}>The essentials, all in one place.</Text>
            </View>
            <FormField label="Company name" required value={form.company} onChangeText={(value) => updateField(form, setForm, 'company', value)} placeholder="e.g. Acme, Inc." autoCapitalize="words" />
            <FormField label="Position title" required value={form.role} onChangeText={(value) => updateField(form, setForm, 'role', value)} placeholder="e.g. Product Designer" autoCapitalize="words" />
            <FormField label="Date applied" value={form.date} onChangeText={(value) => updateField(form, setForm, 'date', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" helper="Use YYYY-MM-DD" />
            <FormField label="Location" value={form.location} onChangeText={(value) => updateField(form, setForm, 'location', value)} placeholder="Remote or city" autoCapitalize="words" />

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusOptions}>
                {STATUSES.map((status) => {
                  const [ink, tint] = STATUS[status]
                  const chosen = form.status === status
                  return <Pressable key={status} accessibilityRole="radio" accessibilityState={{ checked: chosen }} onPress={() => updateField(form, setForm, 'status', status)} style={[styles.statusOption, { backgroundColor: chosen ? tint : C.white, borderColor: chosen ? ink : C.line }]}>
                    <View style={[styles.statusDot, { backgroundColor: ink }]} />
                    <Text style={[styles.statusOptionText, { color: chosen ? ink : C.inkSoft }]}>{status}</Text>
                  </Pressable>
                })}
              </View>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Interview date</Text>
              <Text style={styles.formSectionCaption}>Add a date to show it in your interview calendar.</Text>
            </View>
            <FormField label="Date" value={form.interview} onChangeText={(value) => updateField(form, setForm, 'interview', value)} placeholder="Optional · YYYY-MM-DD" keyboardType="numbers-and-punctuation" helper="Use YYYY-MM-DD" />
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Company profile</Text>
              <Text style={styles.formSectionCaption}>Add a logo URL to personalize this application.</Text>
            </View>
            <FormField label="Company logo URL" value={form.companyLogo} onChangeText={(value) => updateField(form, setForm, 'companyLogo', value)} placeholder="https://company.com/logo.png" autoCapitalize="none" keyboardType="url" />
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Follow-up reminder</Text>
              <Text style={styles.formSectionCaption}>Plan a gentle check-in. It will appear in your overview.</Text>
            </View>
            <FormField label="Reminder date" value={form.followUpDate} onChangeText={(value) => updateField(form, setForm, 'followUpDate', value)} placeholder="Optional · YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
            <FormField label="Next step" value={form.followUpAction} onChangeText={(value) => updateField(form, setForm, 'followUpAction', value)} placeholder="e.g. Email recruiter about the timeline" />
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Notes</Text>
              <Text style={styles.formSectionCaption}>Recruiter details, interview notes, or next steps.</Text>
            </View>
            <TextInput value={form.note} onChangeText={(value) => updateField(form, setForm, 'note', value)} style={[styles.formInput, styles.notesInput]} placeholder="Add anything you want to remember..." placeholderTextColor={C.faint} multiline textAlignVertical="top" />
          </View>
          <View style={styles.formBottomSpace} />
        </ScrollView>

        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable>
          <Pressable onPress={onSave} style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}><Text style={styles.saveButtonText}>{editing ? 'Save changes' : form.status === 'Offer' ? 'Save offer' : form.status === 'Interview' ? 'Save interview' : 'Add application'}</Text></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>
}
