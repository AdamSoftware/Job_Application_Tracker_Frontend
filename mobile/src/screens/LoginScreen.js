import { useState } from 'react'
import { Alert, Modal, Platform, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { C, KeyboardAvoidingView, Pressable, SafeAreaView, Text, TextInput, View } from '../theme'
import { Icon } from '../components/common'
import styles from '../styles'

export default function LoginScreen({ darkMode = true, onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [showResetNotice, setShowResetNotice] = useState(false)
  const submit = () => {
    if (!email.trim() || !password) return Alert.alert('Enter your details', 'Add an email and password to open the demo.')
    onSignIn()
  }
  return <SafeAreaView style={styles.loginRoot}>
    <StatusBar style={darkMode ? 'light' : 'dark'} />
    <KeyboardAvoidingView style={styles.loginKeyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.loginScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.loginBrand}><View style={styles.brandMark}><Icon name="briefcase" color="#fff" size={18} /></View><Text style={styles.brandName}>trackr<Text style={styles.brandDot}>.</Text></Text></View>
        <View style={styles.loginContent}>
          <View style={styles.loginIntro}>
            <View style={styles.loginEyebrowRow}><View style={styles.loginSparkle}><Text style={styles.loginSparkleText}>✳</Text></View><Text style={styles.loginEyebrow}>YOUR NEXT CHAPTER STARTS HERE</Text></View>
            <Text style={styles.loginTitle}><Text style={styles.loginTitleAccent}>A calmer way</Text> to keep your search moving.</Text>
            <Text style={styles.loginText}>Applications, interviews, and next steps—together in one place.</Text>
            <View style={styles.loginFeatureRow}><View style={[styles.loginFeaturePill, styles.loginPillPurple]}><View style={[styles.loginPillDot, { backgroundColor: '#7054cf' }]} /><Text style={styles.loginFeatureText}>Applications</Text></View><View style={[styles.loginFeaturePill, styles.loginPillPeach]}><View style={[styles.loginPillDot, { backgroundColor: '#cf886b' }]} /><Text style={styles.loginFeatureText}>Interviews</Text></View><View style={[styles.loginFeaturePill, styles.loginPillGreen]}><View style={[styles.loginPillDot, { backgroundColor: '#4f9874' }]} /><Text style={styles.loginFeatureText}>Next steps</Text></View></View>
          </View>
          <View style={styles.loginForm}>
            <Text style={styles.loginFormTitle}>Welcome back</Text><Text style={styles.loginFormCaption}>Sign in to your personal workspace.</Text>
            <View style={styles.loginField}><Text style={styles.loginLabel}>Email address</Text><TextInput value={email} onChangeText={setEmail} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="you@example.com" placeholderTextColor="#aaa7b4" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" returnKeyType="next" style={[styles.loginInput, focusedField === 'email' && styles.loginInputFocused]} /></View>
            <View style={styles.loginField}><Text style={styles.loginLabel}>Password</Text><View style={[styles.passwordInputRow, focusedField === 'password' && styles.loginInputFocused]}><TextInput value={password} onChangeText={setPassword} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder="Enter your password" placeholderTextColor="#aaa7b4" secureTextEntry={!showPassword} textContentType="password" returnKeyType="done" onSubmitEditing={submit} style={styles.passwordInput} /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword((value) => !value)} hitSlop={10}><Text style={styles.passwordToggle}>{showPassword ? 'Hide' : 'Show'}</Text></Pressable></View></View>
            <Pressable accessibilityRole="button" onPress={() => setShowResetNotice(true)} style={styles.forgotPassword}><Text style={styles.forgotPasswordText}>Forgot password?</Text></Pressable>
            <Pressable onPress={submit} style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed]}><Text style={styles.loginButtonText}>Sign in</Text><Text style={styles.loginButtonArrow}>→</Text></Pressable>
          </View>
          <View style={styles.loginDemoNote}><View style={styles.loginDemoDot} /><Text style={styles.loginNotice}>Demo preview · Any email and password will open the app. Your credentials aren’t saved.</Text></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    <Modal transparent visible={showResetNotice} animationType="fade" onRequestClose={() => setShowResetNotice(false)}>
      <View style={styles.resetBackdrop}><View style={styles.resetCard}><View style={styles.resetIcon}><Icon name="settings" color={C.purple} size={20} /></View><Text style={styles.resetTitle}>Password reset</Text><Text style={styles.resetMessage}>Password reset isn’t connected in this demo, so no reset email will be sent.</Text><Pressable onPress={() => setShowResetNotice(false)} style={styles.resetButton}><Text style={styles.resetButtonText}>Got it</Text></Pressable></View></View>
    </Modal>
  </SafeAreaView>
}

