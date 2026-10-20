import { Modal, ScrollView } from 'react-native'
import { C, Pressable, Text, TextInput, View } from '../theme'
import { Icon } from '../components/common'
import styles from '../styles'

export default function InterviewNextStepModal({ visible, application, outcome, draft, followUpDate, followUpAction, onFollowUpDateChange, onFollowUpActionChange, onQuestionChange, onReflectionChange, onClose, onAddRound, onWait, onReject, onKeep, onAddFollowUp }) {
  if (!application) return null

  const needsFollowUp = outcome === 'Needs follow-up'
  const isNoLongerMoving = outcome === 'Not moving forward'
  const questionsAsked = draft?.questionsAsked ?? ''
  const reflection = draft?.reflection ?? ''

  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <View style={styles.resetBackdrop}>
      <View style={styles.resetCard}>
        <View style={styles.resetIcon}><Icon name="calendar" color={C.purple} size={20} /></View>
        <Text style={styles.eyebrow}>ROUND UPDATE SAVED</Text>
        <Text style={styles.resetTitle}>What happens next?</Text>
        <Text style={styles.resetMessage}>{application.company} · {outcome}</Text>

        <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Before you move on, capture a few notes.</Text>
          <View style={styles.fieldBlock}>
            <Text style={styles.inputLabel}>Questions they asked</Text>
            <TextInput value={questionsAsked} onChangeText={onQuestionChange} style={[styles.formInput, styles.notesInput]} placeholder="What did they ask you?" placeholderTextColor={C.faint} multiline textAlignVertical="top" />
          </View>
          <View style={styles.fieldBlock}>
            <Text style={styles.inputLabel}>Interview notes</Text>
            <TextInput value={reflection} onChangeText={onReflectionChange} style={[styles.formInput, styles.notesInput]} placeholder="How did it feel? What would you like to remember?" placeholderTextColor={C.faint} multiline textAlignVertical="top" />
          </View>

          {needsFollowUp && <View style={styles.followUpReminderBox}>
            <Text style={styles.followUpReminderTitle}>Set a reminder to follow up</Text>
            <Text style={styles.followUpReminderCopy}>Choose when you want to check in. We’ll add it to your follow-ups list.</Text>
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>Follow-up date</Text>
              <TextInput value={followUpDate || ''} onChangeText={onFollowUpDateChange} style={[styles.formInput, styles.notesInput]} placeholder="YYYY-MM-DD" placeholderTextColor={C.faint} />
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.inputLabel}>What will you do?</Text>
              <TextInput value={followUpAction || ''} onChangeText={onFollowUpActionChange} style={[styles.formInput, styles.notesInput]} placeholder="Follow up after this interview" placeholderTextColor={C.faint} />
            </View>
            <Pressable onPress={() => onAddFollowUp({ followUpDate, followUpAction })} style={styles.offerAccept}><Text style={styles.offerAcceptText}>Create reminder & move to pending</Text></Pressable>
          </View>}
        </ScrollView>

        <View style={styles.modalActions}>
          {isNoLongerMoving ? <>
            <Pressable onPress={onReject} style={styles.deleteButton}><Text style={styles.deleteButtonText}>Mark rejected</Text></Pressable>
            <Pressable onPress={onKeep} style={styles.saveButton}><Text style={styles.saveButtonText}>Keep in interviews</Text></Pressable>
          </> : needsFollowUp ? <>
            <Pressable onPress={() => onAddFollowUp({ followUpDate, followUpAction })} style={styles.saveButton}><Text style={styles.saveButtonText}>Set follow-up reminder</Text></Pressable>
            <Pressable onPress={onAddRound} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Add another round</Text></Pressable>
          </> : <>
            <Pressable onPress={onAddRound} style={styles.saveButton}><Text style={styles.saveButtonText}>Add another round</Text></Pressable>
            <Pressable onPress={onWait} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Move to pending</Text></Pressable>
          </>}
        </View>
      </View>
    </View>
  </Modal>
}
