import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  Pressable as NativePressable,
  SafeAreaView as NativeSafeAreaView,
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  View as NativeView,
} from 'react-native'

let darkModeEnabled = false
let appTextScale = 1.7

export function setThemePreferences({ darkMode, largeText }) {
  darkModeEnabled = darkMode
  appTextScale = largeText ? 1.7 : 1.35
}

function themedStyle(input, kind) {
  const flat = StyleSheet.flatten(input)
  if (!flat) return input
  const result = { ...flat }
  const recolor = (value, role) => {
    if (typeof value !== 'string' || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return value
    const hex = value.length === 4 ? `#${[...value.slice(1)].map((digit) => digit + digit).join('')}` : value
    const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
    const [red, green, blue] = channels.map((channel) => channel / 255)
    const r = red
    const g = green
    const b = blue
    const luminance = .2126 * r + .7152 * g + .0722 * b
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max ? (max - min) / max : 0
    if (role === 'text' && luminance < .43) {
      const lift = (channel) => Math.round(channel + (255 - channel) * .62).toString(16).padStart(2, '0')
      return `#${channels.map(lift).join('')}`
    }
    if (role === 'border' && luminance > .62) return '#514d5d'
    if (role === 'surface' && luminance > .58) {
      if (saturation < .12) return luminance > .92 ? '#302d3a' : '#383542'
      return `#${channels.map((channel) => Math.round(channel * .36).toString(16).padStart(2, '0')).join('')}`
    }
    return value
  }
  if (darkModeEnabled) {
    for (const key of Object.keys(result)) {
      if (key === 'color') result[key] = recolor(result[key], 'text')
      else if (key.toLowerCase().includes('border') && key.toLowerCase().includes('color')) result[key] = recolor(result[key], 'border')
      else if (key === 'backgroundColor') result[key] = recolor(result[key], 'surface')
    }
  }
  if (kind !== 'view') {
    if (typeof result.fontSize === 'number') result.fontSize = Math.max(result.fontSize * appTextScale, appTextScale > 1 ? 12 : 0)
    if (typeof result.lineHeight === 'number') result.lineHeight *= appTextScale
  }
  return result
}

export function View({ style, ...props }) { return <NativeView {...props} style={themedStyle(style, 'view')} /> }
export function Text({ style, ...props }) { return <NativeText {...props} style={themedStyle(style, 'text')} /> }
export function TextInput({ style, ...props }) { return <NativeTextInput {...props} style={themedStyle(style, 'input')} /> }
export function Pressable({ style, ...props }) {
  const themedPressableStyle = (state) => themedStyle(typeof style === 'function' ? style(state) : style, 'view')
  return <NativePressable {...props} style={style ? themedPressableStyle : undefined} />
}
export function SafeAreaView({ style, ...props }) { return <NativeSafeAreaView {...props} style={themedStyle(style, 'view')} /> }
export function KeyboardAvoidingView({ style, ...props }) { return <NativeKeyboardAvoidingView {...props} style={themedStyle(style, 'view')} /> }

export const C = {
  bg: '#efebf6', white: '#f7f3fc', ink: '#302d3e', inkSoft: '#4e4a5c',
  muted: '#8f8c9b', faint: '#a8a5b2', line: '#eeedf2', lineSoft: '#f3f2f5',
  purple: '#7054cf', purpleDark: '#5f45bd', lilac: '#f1edff', lilacLine: '#e8e1fb',
  green: '#4f9874', greenBg: '#eaf7f0', peach: '#cf886b', peachBg: '#fff2e9',
  blue: '#6487b3', blueBg: '#eef5fc', gold: '#9a7c38', goldBg: '#fbf5e5',
  red: '#b16c71', redBg: '#fbefef',
}
export const STATUS = {
  Applied: [C.blue, C.blueBg],
  'In review': [C.gold, C.goldBg],
  Interview: [C.purple, C.lilac],
  Pending: ['#8b6cb4', '#f0ebf7'],
  Offer: [C.green, C.greenBg],
  Accepted: [C.green, '#e3f4e9'],
  Rejected: [C.red, C.redBg],
  Current: [C.green, C.greenBg],
  Past: [C.gold, C.goldBg],
  Upcoming: [C.purple, C.lilac],
}
export const STATUSES = Object.keys(STATUS)
