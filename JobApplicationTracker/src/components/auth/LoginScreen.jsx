import { Icon } from '../shared/Ui.jsx';
import { useState } from 'react';
import { RoleAutocomplete } from '../shared/RoleAutocomplete.jsx';

export function LoginScreen({
  darkMode,
  onSignIn
}) {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return <main className={`login-screen${darkMode ? ' dark' : ''}`}><div className="login-intro"><a className="brand login-brand" href="#login"><span className="brand-mark"><Icon name="briefcase" size={20} /></span>
      <span>trackr<span className="brand-dot">.</span></span></a>
    <div className="login-message"><span className="login-spark">✳</span>
      <div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>
      <h1>A little more clarity for the job search.</h1>
      <p>Keep applications, interviews, and next steps in one calm place.</p>
      <div className="login-art"><div className="login-art-card card-one"><span>✦</span>
          <b>Next step</b>
          <small>One opportunity at a time</small></div>
        <div className="login-art-card card-two"><span>✓</span>
          <b>Application sent</b>
          <small>You’re making progress.</small></div>
        <div className="login-orbit orbit-one" />
        <div className="login-orbit orbit-two" /></div></div>
    <small className="login-footer-note">Made for the in-between.</small></div>
  <div className="login-form-side"><form className="login-form" onSubmit={event => {
        event.preventDefault();
        if (isSigningUp) {
          const passwords = event.currentTarget.querySelectorAll('input[type="password"]');
          if (passwords[0].value !== passwords[1].value) {
            passwords[1].setCustomValidity('Passwords do not match.');
            passwords[1].reportValidity();
            passwords[1].addEventListener('input', () => passwords[1].setCustomValidity(''), { once: true });
            return;
          }
        }
        if (isSigningUp) {
          const form = event.currentTarget;
          onSignIn({
            name: form.elements.fullName.value.trim(),
            email: form.elements.email.value.trim(),
            targetRoles: form.elements.targetRoles.value.split(',').map(role => role.trim()).filter(Boolean)
          });
        } else {
          onSignIn();
        }
      }}><span className="demo-label"><i /> PREVIEW MODE</span>
      <h2>{isSigningUp ? 'Set up your job search' : 'Welcome back'}</h2>
      <p>{isSigningUp ? 'We’ll shape your workspace around the roles you want.' : 'Sign in to your personal workspace.'}</p>
      {isSigningUp && <label>Your name<input name="fullName" type="text" autoComplete="name" placeholder="Alex Morgan" required /></label>}
      <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
      {isSigningUp && <RoleAutocomplete name="targetRoles" label="What kind of work are you looking for?" placeholder="Start typing a job title or field" required hint="Choose a suggestion or type your own. Press Enter to add each role." />}
      <label>Password<input type="password" autoComplete={isSigningUp ? 'new-password' : 'current-password'} placeholder={isSigningUp ? 'Create a password' : 'Enter any password'} minLength={isSigningUp ? 8 : undefined} required /></label>
      {isSigningUp && <label>Confirm password<input type="password" autoComplete="new-password" placeholder="Enter your password again" minLength={8} required /></label>}
      <button className="primary-button login-submit" type="submit">{isSigningUp ? 'Create demo account' : 'Continue to demo'} <Icon name="arrow" size={17} /></button>
      <div className="login-switch">{isSigningUp ? 'Already have an account?' : "Don't have an account?"} <button type="button" onClick={() => setIsSigningUp(!isSigningUp)}>{isSigningUp ? 'Sign in' : 'Sign up'}</button></div>
      <div className="demo-notice"><Icon name="settings" size={15} />
        <span>{isSigningUp ? 'This is a local preview. Your name, email, and target roles are saved in this browser; passwords are not stored.' : 'Sign-in is a prototype. Any email and password will open the demo; credentials are not saved.'}</span></div></form></div></main>;
}
