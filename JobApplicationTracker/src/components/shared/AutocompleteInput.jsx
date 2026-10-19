import { useId, useState } from 'react';

export function AutocompleteInput({ name, suggestions = [], defaultValue = '', placeholder, required = false }) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(0);
  const filtered = value.trim() ? suggestions.filter(item => item.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()) && item.toLocaleLowerCase() !== value.trim().toLocaleLowerCase()).slice(0, 7) : [];
  const choose = item => { setValue(item); setActiveIndex(0); };

  return <div className="autocomplete-input-wrap"><input id={id} name={name} value={value} placeholder={placeholder} required={required} role="combobox" aria-autocomplete="list" aria-expanded={filtered.length > 0} aria-controls={`${id}-options`} aria-activedescendant={filtered.length ? `${id}-option-${activeIndex}` : undefined} onChange={event => { setValue(event.target.value); setActiveIndex(0); }} onKeyDown={event => {
    if (event.key === 'ArrowDown' && filtered.length) { event.preventDefault(); setActiveIndex(index => (index + 1) % filtered.length); }
    if (event.key === 'ArrowUp' && filtered.length) { event.preventDefault(); setActiveIndex(index => (index - 1 + filtered.length) % filtered.length); }
    if (event.key === 'Enter' && filtered.length) { event.preventDefault(); choose(filtered[activeIndex]); }
  }} />
    {filtered.length > 0 && <div className="autocomplete-suggestions" id={`${id}-options`} role="listbox">{filtered.map((item, index) => <button type="button" role="option" aria-selected={activeIndex === index} id={`${id}-option-${index}`} key={item} onMouseDown={event => event.preventDefault()} onClick={() => choose(item)}>{item}</button>)}</div>}
  </div>;
}
