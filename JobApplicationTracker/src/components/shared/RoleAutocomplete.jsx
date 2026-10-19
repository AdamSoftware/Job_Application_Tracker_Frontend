import { useId, useState } from 'react';

const roleOptions = [
  'Accountant', 'Administrative Assistant', 'Assembly Worker', 'Business Analyst',
  'Caregiver', 'Carpenter', 'Cashier', 'Chef', 'Customer Service Representative',
  'Data Analyst', 'Data Scientist', 'Delivery Driver', 'Designer', 'Developer',
  'Electrician', 'Engineer', 'Factory Worker', 'Financial Analyst', 'Forklift Operator',
  'Graphic Designer', 'Healthcare Assistant', 'Human Resources Manager', 'IT Support Specialist',
  'Machine Operator', 'Maintenance Technician', 'Marketing Manager', 'Mechanic', 'Nurse',
  'Operations Manager', 'Photographer', 'Plumber', 'Product Manager', 'Project Manager',
  'Receptionist', 'Sales Associate', 'Software Engineer', 'Teacher', 'UX Designer', 'Warehouse Worker'
].map(role => role.trim());

export function RoleAutocomplete({ name, label, value = [], placeholder, required = false, hint }) {
  const listId = useId();
  const [roles, setRoles] = useState(value);
  const [input, setInput] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestions = input.trim() ? roleOptions.filter(role => role.toLocaleLowerCase().includes(input.trim().toLocaleLowerCase()) && !roles.some(selected => selected.toLocaleLowerCase() === role.toLocaleLowerCase())).slice(0, 7) : [];
  const addInputRoles = rawValue => {
    const additions = rawValue.split(',').map(role => role.trim()).filter(Boolean);
    if (additions.length) {
      setRoles(current => {
        const unique = new Map([...current, ...additions].map(role => [role.toLocaleLowerCase(), role]));
        return Array.from(unique.values());
      });
      setInput('');
    }
  };
  const removeRole = role => setRoles(current => current.filter(item => item !== role));

  const selectRole = role => addInputRoles(role);

  return (<div className="role-autocomplete-field"><label htmlFor={`${listId}-input`}>{label}</label>
    <div className="role-autocomplete-control"><div className="role-chips">{roles.map(role => <span className="role-chip" key={role}>{role}<button type="button" aria-label={`Remove ${role}`} onClick={() => removeRole(role)}>×</button></span>)}</div>
      <div className="role-autocomplete-input-wrap"><input id={`${listId}-input`} type="text" value={input} placeholder={roles.length ? 'Add another role' : placeholder} required={required && roles.length === 0} role="combobox" aria-autocomplete="list" aria-expanded={suggestions.length > 0} aria-controls={`${listId}-options`} aria-activedescendant={suggestions.length ? `${listId}-option-${activeIndex}` : undefined} onChange={event => {
        const nextValue = event.target.value;
        if (nextValue.includes(',')) addInputRoles(nextValue);
        else { setInput(nextValue); setActiveIndex(0); }
      }} onKeyDown={event => {
        if (event.key === 'ArrowDown' && suggestions.length) { event.preventDefault(); setActiveIndex(index => (index + 1) % suggestions.length); }
        if (event.key === 'ArrowUp' && suggestions.length) { event.preventDefault(); setActiveIndex(index => (index - 1 + suggestions.length) % suggestions.length); }
        if (event.key === 'Enter' && input.trim()) { event.preventDefault(); selectRole(suggestions[activeIndex] || input); }
        if (event.key === 'Backspace' && !input && roles.length) removeRole(roles.at(-1));
      }} onBlur={() => addInputRoles(input)} />
      {suggestions.length > 0 && <div className="role-suggestion-list" id={`${listId}-options`} role="listbox">{suggestions.map((role, index) => <button type="button" role="option" aria-selected={index === activeIndex} id={`${listId}-option-${index}`} key={role} onMouseDown={event => event.preventDefault()} onClick={() => selectRole(role)}>{role}</button>)}</div>}
      </div>
    </div><input type="hidden" name={name} value={roles.join(', ')} />
    {hint && <small className="field-hint">{hint}</small>}</div>);
}
