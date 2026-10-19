import { Icon } from '../shared/Ui.jsx';
import { RoleAutocomplete } from '../shared/RoleAutocomplete.jsx';

export function AccountSettings({
  name,
  email,
  details,
  targetRoles,
  onSaveProfile,
  onSignOut,
  notify
}) {
  const saveProfile = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    onSaveProfile(data.name.trim(), data.email.trim(), {
      phone: data.phone.trim(),
      location: data.location.trim(),
      linkedin: data.linkedin.trim(),
      portfolio: data.portfolio.trim()
    }, data.targetRoles.split(',').map(role => role.trim()).filter(Boolean));
    notify('Profile details saved on this device');
  };
  const previewPassword = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.newPassword !== data.confirmPassword) {
      notify('The new passwords do not match');
      return;
    }
    notify('Password settings are in preview mode and are not saved');
    event.currentTarget.reset();
  };
  return <div className="account-settings"><form className="settings-card account-card" onSubmit={saveProfile}><div className="settings-card-heading"><div><h2>Personal details</h2>
        <p>Your name appears across your workspace.</p></div>
      <span className="account-icon"><Icon name="settings" /></span></div>
    <div className="account-form-grid"><label>Full name<input name="name" defaultValue={name} required /></label>
      <label>Email address<input name="email" type="email" defaultValue={email} required /></label></div>
    <div className="account-profile-section"><strong>Roles you’re targeting</strong><p>Use this to keep your search centered on the kinds of jobs you want. Separate roles with commas.</p></div>
    <div className="account-form-grid"><div className="full-field"><RoleAutocomplete name="targetRoles" label="Target roles or fields" value={targetRoles} placeholder="Start typing a job title or field" hint="Choose a suggestion or type your own. Press Enter to add each role." /></div></div>
    <div className="account-profile-section"><strong>Job search profile</strong><p>Add contact and profile links you want to keep handy. You can leave any of these blank.</p></div>
    <div className="account-form-grid"><label>Phone number<input name="phone" type="tel" autoComplete="tel" defaultValue={details.phone || ''} placeholder="(555) 123-4567" /></label>
      <label>Location<input name="location" autoComplete="address-level2" defaultValue={details.location || ''} placeholder="City, State" /></label>
      <label>LinkedIn profile<input name="linkedin" type="url" autoComplete="url" defaultValue={details.linkedin || ''} placeholder="https://linkedin.com/in/you" /></label>
      <label>Portfolio or personal website<input name="portfolio" type="url" defaultValue={details.portfolio || ''} placeholder="https://yourwebsite.com" /></label></div>
    <div className="account-form-actions"><button className="primary-button" type="submit">Save profile</button></div></form>
  <form className="settings-card account-card" onSubmit={previewPassword}><div className="settings-card-heading"><div><h2>Password & security</h2>
        <p>Password changes are a visual preview until sign-in is connected.</p></div>
      <span className="account-icon security-icon"><Icon name="briefcase" /></span></div>
    <div className="account-form-grid"><label>Current password<input name="currentPassword" type="password" placeholder="Enter current password" required /></label>
      <span />
      <label>New password<input name="newPassword" type="password" minLength="8" placeholder="At least 8 characters" required /></label>
      <label>Confirm new password<input name="confirmPassword" type="password" minLength="8" placeholder="Re-enter new password" required /></label></div>
    <div className="account-form-actions"><button className="secondary-button" type="submit">Preview password change</button></div></form>
  <div className="signout-card"><div><strong>Sign out of this preview</strong>
      <small>Your saved applications will stay in this browser.</small></div>
    <button className="secondary-button" onClick={onSignOut}>Sign out</button></div></div>;
}
