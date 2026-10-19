import { useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Ui.jsx';

/** A themed option picker with a stable string value for forms and API payloads. */
export function ThemedDropdown({
  name,
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Choose an option',
  ariaLabel,
  required = false,
  disabled = false,
  className = '',
  triggerClassName = '',
  onClick,
  stopPropagation = false,
}) {
  const generatedId = useId();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const optionRefs = useRef([]);
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue));
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const selectedValue = String(value === undefined ? uncontrolledValue : value);
  const selected = options.find(option => String(option.value) === String(selectedValue));

  useLayoutEffect(() => {
    if (!open) return undefined;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const maxHeight = Math.min(280, window.innerHeight - 16);
      const estimatedHeight = Math.min(maxHeight, options.length * 40 + 12);
      const placeAbove = window.innerHeight - rect.bottom < estimatedHeight + 8 && rect.top > estimatedHeight + 8;
      const width = Math.min(Math.max(rect.width, 205), window.innerWidth - 16);
      setMenuStyle({ top: placeAbove ? Math.max(8, rect.top - estimatedHeight - 7) : Math.min(rect.bottom + 7, window.innerHeight - estimatedHeight - 8), left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)), width, maxHeight });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    const handleOutsidePointer = event => {
      if (!triggerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handleOutsidePointer);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('pointerdown', handleOutsidePointer);
    };
  }, [open, options.length]);

  const choose = option => {
    if (value === undefined) setUncontrolledValue(String(option.value));
    onChange?.(String(option.value), option.label);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => optionRefs.current[event.key === 'ArrowDown' ? 0 : options.length - 1]?.focus());
    }
    if (event.key === 'Escape') setOpen(false);
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (index + direction + options.length) % options.length;
      optionRefs.current[nextIndex]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      optionRefs.current[event.key === 'Home' ? 0 : options.length - 1]?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return <div className={`themed-dropdown ${className}`} onClick={event => { if (stopPropagation) event.stopPropagation(); }} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget) && !menuRef.current?.contains(event.relatedTarget)) setOpen(false);
  }}>
    {name && <select className="themed-dropdown-form-value" name={name} value={selectedValue} required={required} disabled={disabled} tabIndex={-1} aria-hidden="true" onInvalid={() => { setOpen(true); triggerRef.current?.focus(); }} onChange={() => {}}>
      {!required && <option value="" />}
      {required && !selectedValue && <option value="" disabled />}
      {options.map(option => <option key={String(option.value)} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>}
    <button ref={triggerRef} type="button" className={`themed-dropdown-trigger ${triggerClassName}`} aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-required={required || undefined} aria-controls={open ? `${generatedId}-options` : undefined} disabled={disabled} onClick={event => { onClick?.(event); setOpen(current => !current); }} onKeyDown={handleTriggerKeyDown}>
      <span className="themed-dropdown-value">{selected?.label || placeholder}</span><Icon name="chevronDown" size={15} />
    </button>
    {open && createPortal(<div ref={menuRef} className={`themed-dropdown-options${triggerRef.current?.closest('.app-shell.dark') ? ' is-dark' : ''}`} style={menuStyle || { visibility: 'hidden' }} id={`${generatedId}-options`} role="listbox" aria-label={ariaLabel || placeholder}>
      {options.map((option, index) => <button ref={element => { optionRefs.current[index] = element; }} type="button" role="option" aria-selected={String(option.value) === String(selectedValue)} className={`${option.className || ''}${String(option.value) === String(selectedValue) ? ' selected' : ''}`} key={String(option.value)} disabled={option.disabled} onClick={() => choose(option)} onKeyDown={event => handleOptionKeyDown(event, index)}>
        <span>{option.label}</span>{String(option.value) === String(selectedValue) && <span className="themed-dropdown-check" aria-hidden="true">✓</span>}
      </button>)}
    </div>, document.body)}
  </div>;
}
