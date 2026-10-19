import { useState } from 'react';
import { Icon } from './Ui.jsx';

const currencies = [
  ['USD', 'US dollar'], ['CAD', 'Canadian dollar'], ['GBP', 'British pound'], ['EUR', 'Euro'],
  ['AUD', 'Australian dollar'], ['NZD', 'New Zealand dollar'], ['CHF', 'Swiss franc'],
  ['JPY', 'Japanese yen'], ['CNY', 'Chinese yuan'], ['INR', 'Indian rupee'],
  ['MXN', 'Mexican peso'], ['SGD', 'Singapore dollar']
];

export function CurrencyPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = currencies.find(([code]) => code === value) || currencies[0];
  return <div className="currency-picker" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button type="button" className="currency-picker-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(current => !current)}>
      <span className="currency-code-badge">{selected[0]}</span><span className="currency-picker-label"><small>DISPLAY CURRENCY</small><strong>{selected[1]}</strong></span><Icon name="chevronDown" size={17} />
    </button>
    {open && <div className="currency-picker-options" role="listbox" aria-label="Display currency">{currencies.map(([code, name]) => <button type="button" role="option" aria-selected={code === value} className={code === value ? 'selected' : ''} key={code} onClick={() => { onChange(code); setOpen(false); }}><span className="currency-code-badge">{code}</span><span>{name}</span>{code === value && <span className="currency-picker-check">✓</span>}</button>)}</div>}
  </div>;
}
