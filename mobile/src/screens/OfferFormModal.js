import { KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native'
import { C, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { FormField, Icon } from '../components/common'
import styles from '../styles'

const BENEFITS = [
  ['Health coverage', 'healthCoverage', 'Medical, dental, vision…'],
  ['Paid time off', 'paidTimeOff', 'Vacation, sick leave, holidays…'],
  ['Retirement & savings', 'retirement', '401(k) match, pension…'],
  ['Parental leave', 'parentalLeave', 'Leave duration and details'],
  ['Other benefits & perks', 'benefits', 'Learning budget, wellness, commuter support…'],
]
const CURRENCIES = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'NZD', 'CHF', 'JPY', 'CNY', 'INR', 'MXN', 'SGD']

export default function OfferFormModal({ visible, application, form, setForm, onClose, onSave }) {
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={styles.modalSafe}><KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.formModalHeader}><View style={styles.formModalHeading}><Text style={styles.eyebrow}>YOUR NEXT CHAPTER</Text><Text style={styles.modalTitle}>Offer package</Text><Text style={styles.modalSubtitle}>{application ? `${application.company} · ${application.role}` : 'Record compensation and benefits.'}</Text></View><Pressable onPress={onClose} accessibilityLabel="Close offer editor" style={styles.closeButton}><Icon name="close" color={C.muted} size={17} /></Pressable></View>
      <ScrollView style={styles.formScroll} contentContainerStyle={styles.formFields} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.formSectionCard}><View style={styles.formSectionHeading}><Text style={styles.formSectionTitle}>Compensation</Text><Text style={styles.formSectionCaption}>Enter the amounts and currency from the offer.</Text></View>
          <Text style={styles.inputLabel}>Currency</Text><View style={styles.statusOptions}>{CURRENCIES.map((currency) => <Pressable key={currency} accessibilityRole="radio" accessibilityState={{ checked: form.currency === currency }} onPress={() => update('currency', currency)} style={[styles.statusOption, form.currency === currency && styles.statusOptionSelected]}><Text style={[styles.statusOptionText, form.currency === currency && styles.statusOptionTextSelected]}>{currency}</Text></Pressable>)}</View>
          <FormField label="Annual base salary" value={form.salary} onChangeText={(value) => update('salary', value)} placeholder="e.g. 120000" keyboardType="numeric" />
          <FormField label="Signing bonus" value={form.signingBonus} onChangeText={(value) => update('signingBonus', value)} placeholder="e.g. 10000" keyboardType="numeric" />
          <FormField label="Annual equity estimate" value={form.equity} onChangeText={(value) => update('equity', value)} placeholder="e.g. 15000" keyboardType="numeric" />
          <FormField label="Decision deadline" value={form.offerDeadline} onChangeText={(value) => update('offerDeadline', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" helper="Use YYYY-MM-DD" />
        </View>
        <View style={styles.formSectionCard}><View style={styles.formSectionHeading}><Text style={styles.formSectionTitle}>Benefits & perks</Text><Text style={styles.formSectionCaption}>Keep the full package together while you decide.</Text></View>{BENEFITS.map(([label, key, placeholder]) => <View key={key} style={styles.fieldBlock}><Text style={styles.inputLabel}>{label}</Text><TextInput value={form[key]} onChangeText={(value) => update(key, value)} style={[styles.formInput, key === 'benefits' && styles.notesInput]} placeholder={placeholder} placeholderTextColor={C.faint} multiline={key === 'benefits'} textAlignVertical={key === 'benefits' ? 'top' : 'center'} /></View>)}</View>
        <View style={styles.formBottomSpace} />
      </ScrollView>
      <View style={styles.modalActions}><Pressable onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Cancel</Text></Pressable><Pressable onPress={onSave} style={styles.saveButton}><Text style={styles.saveButtonText}>Save offer package</Text></Pressable></View>
    </KeyboardAvoidingView></SafeAreaView>
  </Modal>
}
