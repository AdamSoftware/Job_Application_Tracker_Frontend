import { Modal } from 'react-native'
import { C, Pressable, Text, View } from '../theme'
import { Icon } from '../components/common'
import styles from '../styles'

export default function PendingInterviewUpdateModal({ visible, application, onClose, onContinue, onCloseApplication }) {
  if (!application) return null

  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <View style={styles.resetBackdrop}>
      <View style={styles.resetCard}>
        <View style={styles.resetIcon}><Icon name="calendar" color={C.purple} size={20} /></View>
        <Text style={styles.eyebrow}>INTERVIEW UPDATE</Text>
        <Text style={styles.resetTitle}>What did you hear?</Text>
        <Text style={styles.resetMessage}>{application.company} · Choose what fits, and we’ll update your application.</Text>

        <Pressable onPress={onContinue} style={({ pressed }) => [styles.pendingChoice, pressed && styles.buttonPressed]}>
          <View style={styles.pendingChoiceIcon}><Icon name="calendar" color={C.purple} size={16} /></View>
          <View style={styles.pendingChoiceTextWrap}>
            <Text style={styles.pendingChoiceTitle}>They’d like to continue</Text>
            <Text style={styles.pendingChoiceCopy}>Keep the process moving and add the next interview round.</Text>
          </View>
          <Icon name="chevron" color={C.muted} size={12} />
        </Pressable>

        <Pressable onPress={onCloseApplication} style={({ pressed }) => [styles.pendingChoice, styles.pendingChoiceSecondary, pressed && styles.buttonPressed]}>
          <View style={styles.pendingChoiceIcon}><Icon name="close" color={C.red} size={16} /></View>
          <View style={styles.pendingChoiceTextWrap}>
            <Text style={[styles.pendingChoiceTitle, { color: C.red }]}>They’ve decided to go another direction</Text>
            <Text style={styles.pendingChoiceCopy}>Close this application and keep your interview notes for later.</Text>
          </View>
          <Icon name="chevron" color={C.muted} size={12} />
        </Pressable>

        <Pressable onPress={onClose} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>I’m still waiting</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
}
