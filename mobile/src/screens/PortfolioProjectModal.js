import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import { C, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { Icon } from '../components/common'
import styles from '../styles'

export default function PortfolioProjectModal({ visible, project, form, setForm, onClose, onSave }) {
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={styles.modalSafe}>
      <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.formModalHeader}>
          <View style={styles.formModalHeading}>
            <Text style={styles.eyebrow}>PORTFOLIO PROJECT</Text>
            <Text style={styles.modalTitle}>{project ? 'Edit project' : 'Add a project'}</Text>
            <Text style={styles.modalSubtitle}>Show the work that best proves your impact.</Text>
          </View>
          <Pressable onPress={onClose} accessibilityLabel="Close portfolio editor" style={styles.closeButton}>
            <Icon name="close" color={C.muted} size={17} />
          </Pressable>
        </View>

        <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formSectionCard}>
            <View style={styles.formSectionHeading}>
              <Text style={styles.formSectionTitle}>Project details</Text>
              <Text style={styles.formSectionCaption}>Give a clear story and make it easy to share.</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Project title</Text>
              <TextInput value={form.title} onChangeText={(value) => update('title', value)} style={styles.formInput} placeholder="Community resource finder" placeholderTextColor={C.faint} />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Context</Text>
              <TextInput value={form.context} onChangeText={(value) => update('context', value)} style={styles.formInput} placeholder="Web development · Case study" placeholderTextColor={C.faint} />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Short summary</Text>
              <TextInput value={form.description} onChangeText={(value) => update('description', value)} style={[styles.formInput, styles.notesInput]} placeholder="What problem did this solve? What did you do?" placeholderTextColor={C.faint} multiline textAlignVertical="top" />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Skills</Text>
              <TextInput value={form.skills} onChangeText={(value) => update('skills', value)} style={styles.formInput} placeholder="React, UX research, accessibility" placeholderTextColor={C.faint} />
              <Text style={styles.fieldHelper}>Separate with commas.</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Links</Text>
              <TextInput value={form.links} onChangeText={(value) => update('links', value)} style={[styles.formInput, styles.notesInput]} placeholder={'Live site | https://example.com\nGitHub | https://github.com/example'} placeholderTextColor={C.faint} multiline textAlignVertical="top" />
              <Text style={styles.fieldHelper}>One link per line. Use “Label | URL” for better naming.</Text>
            </View>
          </View>
          <View style={styles.formBottomSpace} />
        </ScrollView>

        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={onSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{project ? 'Save project' : 'Add project'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>
}
