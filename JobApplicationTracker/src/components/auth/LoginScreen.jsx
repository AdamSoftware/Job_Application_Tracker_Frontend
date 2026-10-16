import { Icon } from '../shared/Ui.jsx';

export function LoginScreen({
  darkMode,
  onSignIn
}) {
  return <main className={`login-screen${darkMode ? ' dark' : ''}`}><div className="login-intro"><a className="brand login-brand" href="#login"><span className="brand-mark"><Icon name="briefcase" size={20} /></span>
      <span>trackr<span className="brand-dot">.</span></span></a>
    <div className="login-message"><span className="login-spark">✳</span>
      <div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>
      <h1>A little more clarity for the job search.</h1>
      <p>Keep applications, interviews, and next steps in one calm place.</p>
      <div className="login-art"><div className="login-art-card card-one"><span>✦</span>
          <b>Interview</b>
          <small>Product Designer · Linear</small></div>
        <div className="login-art-card card-two"><span>✓</span>
          <b>Application sent</b>
          <small>You’re making progress.</small></div>
        <div className="login-orbit orbit-one" />
        <div className="login-orbit orbit-two" /></div></div>
    <small className="login-footer-note">Made for the in-between.</small></div>
  <div className="login-form-side"><form className="login-form" onSubmit={event => {
        event.preventDefault();
        onSignIn();
      }}><span className="demo-label"><i /> PREVIEW MODE</span>
      <h2>Welcome back</h2>
      <p>Sign in to your personal workspace.</p>
      <label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" required /></label>
      <label>Password<input type="password" autoComplete="current-password" placeholder="Enter any password" required /></label>
      <button className="primary-button login-submit" type="submit">Continue to demo <Icon name="arrow" size={17} /></button>
      <div className="demo-notice"><Icon name="settings" size={15} />
        <span>Sign-in is a prototype. Any email and password will open the demo; no credentials are saved.</span></div></form></div></main>;
}
