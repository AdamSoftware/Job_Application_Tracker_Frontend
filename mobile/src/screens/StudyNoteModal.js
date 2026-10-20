import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import { C, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { FormField, Icon } from '../components/common'
import styles from '../styles'

const noteCategories = ['Study notes', 'Questions to practice', 'What went well']

const updateField = (form, setForm, field, value) => setForm({ ...form, [field]: value })

export default function StudyNoteModal({ visible, editing, form, setForm, onClose, onSave }) {
  const title = editing ? 'Edit note' : 'Add a study note'

  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={styles.modalSafe}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formModalHeader}>
          <View style={styles.formModalHeading}>
            <Text style={styles.eyebrow}>STUDY AREA</Text>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalSubtitle}>Capture the stories and answers you want to remember.</Text>
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close form" style={styles.closeButton}>
            <Icon name="close" color={C.muted} size={17} />
          </Pressable>
        </View>

        <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Note details</Text>
              <Text style={styles.formSectionCaption}>Quick reminders and coaching notes.</Text>
            </View>
            <FormField label="Title" required value={form.title} onChangeText={(value) => updateField(form, setForm, 'title', value)} placeholder="e.g. Questions to ask" autoCapitalize="words" />
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.statusOptions}>
                {noteCategories.map((category) => {
                  const selected = form.category === category
                  return <Pressable key={category} onPress={() => updateField(form, setForm, 'category', category)} style={[styles.statusOption, selected && styles.statusOptionSelected, { borderColor: selected ? C.purple : C.line }]}> 
                    <Text style={[styles.statusOptionText, selected && styles.statusOptionTextSelected]}>{category}</Text>
                  </Pressable>
                })}
              </View>
            </View>
          </View>

          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Content</Text>
              <Text style={styles.formSectionCaption}>Write the answer, example, or reminder you want to keep nearby.</Text>
            </View>
            <TextInput value={form.content} onChangeText={(value) => updateField(form, setForm, 'content', value)} style={[styles.formInput, styles.notesInput]} placeholder="Write your talking points, notes, or reminders..." placeholderTextColor={C.faint} multiline textAlignVertical="top" />
          </View>
          <View style={styles.formBottomSpace} />
        </ScrollView>

        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable>
          <Pressable onPress={onSave} style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}><Text style={styles.saveButtonText}>{editing ? 'Save note' : 'Add note'}</Text></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>
}
