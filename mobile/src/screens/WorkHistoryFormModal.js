import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import { C, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { FormField, Icon } from '../components/common'
import styles from '../styles'

const workStatuses = ['Current', 'Past', 'Upcoming']

const updateField = (form, setForm, field, value) => setForm({ ...form, [field]: value })

export default function WorkHistoryFormModal({ visible, editing, form, setForm, onClose, onSave }) {
  const title = editing ? 'Edit work history' : 'Add a role'

  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={styles.modalSafe}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formModalHeader}>
          <View style={styles.formModalHeading}>
            <Text style={styles.eyebrow}>YOUR CAREER STORY</Text>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalSubtitle}>Keep your past, present, and future roles organized.</Text>
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close form" style={styles.closeButton}>
            <Icon name="close" color={C.muted} size={17} />
          </Pressable>
        </View>

        <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Role details</Text>
              <Text style={styles.formSectionCaption}>The essentials for each position.</Text>
            </View>
            <FormField label="Company" required value={form.company} onChangeText={(value) => updateField(form, setForm, 'company', value)} placeholder="e.g. Northstar Health" autoCapitalize="words" />
            <FormField label="Role title" required value={form.role} onChangeText={(value) => updateField(form, setForm, 'role', value)} placeholder="e.g. Senior Product Designer" autoCapitalize="words" />
            <FormField label="Location" value={form.location} onChangeText={(value) => updateField(form, setForm, 'location', value)} placeholder="Remote or city" autoCapitalize="words" />
            <FormField label="Annual salary" value={form.salary} onChangeText={(value) => updateField(form, setForm, 'salary', value)} placeholder="Optional · 120000" keyboardType="numeric" />

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusOptions}>
                {workStatuses.map((status) => {
                  const selected = form.workStatus === status
                  return <Pressable key={status} onPress={() => updateField(form, setForm, 'workStatus', status)} style={[styles.statusOption, selected && styles.statusOptionSelected, { borderColor: selected ? C.purple : C.line }]}> 
                    <Text style={[styles.statusOptionText, selected && styles.statusOptionTextSelected]}>{status}</Text>
                  </Pressable>
                })}
              </View>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Dates</Text>
              <Text style={styles.formSectionCaption}>Track the timeline clearly.</Text>
            </View>
            <FormField label="Start date" value={form.startDate} onChangeText={(value) => updateField(form, setForm, 'startDate', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
            <FormField label="End date" value={form.endDate} onChangeText={(value) => updateField(form, setForm, 'endDate', value)} placeholder="Optional · YYYY-MM-DD, or leave blank" keyboardType="numbers-and-punctuation" />
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Notes</Text>
              <Text style={styles.formSectionCaption}>Add your impact, responsibilities, or a quick summary.</Text>
            </View>
            <TextInput value={form.notes} onChangeText={(value) => updateField(form, setForm, 'notes', value)} style={[styles.formInput, styles.notesInput]} placeholder="Tell the story of this role..." placeholderTextColor={C.faint} multiline textAlignVertical="top" />
          </View>

          <View style={styles.formBottomSpace} />
        </ScrollView>

        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable>
          <Pressable onPress={onSave} style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}><Text style={styles.saveButtonText}>{editing ? 'Save role' : 'Add role'}</Text></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>
}
