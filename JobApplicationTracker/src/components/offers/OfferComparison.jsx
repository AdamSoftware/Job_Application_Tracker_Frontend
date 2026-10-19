import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { prettyDate } from '../../utils/dateUtils.js';
import { convertCurrencyAmount, money, moneyInCurrency } from '../../utils/jobUtils.js';
import { useEffect, useRef, useState } from 'react';

export function AcceptedOfferDetails({
  job,
  onEdit,
  alreadyInHistory,
  expanded,
  onToggle,
  onDelete,
  focused = false,
  displayCurrency = 'USD',
  exchangeRates = {}
}) {
  const currency = job.currency || 'USD';
  const packageItems = [['Health coverage', job.healthCoverage], ['Paid time off', job.paidTimeOff], ['Retirement', job.retirement], ['Parental leave', job.parentalLeave], ['Other benefits & perks', job.benefits]];
  return <article className={`accepted-package-card accepted-offer-card${expanded ? ' expanded' : ''}`}><div className="accepted-package-heading offer-card-head"><div className="offer-card-head-company"><CompanyLogo job={job} />
      <div><strong>{job.company}</strong>
        <small>{job.role}{job.location ? ` · ${job.location}` : ''}</small></div></div>
    <span className="accepted-badge">✓ Accepted</span></div>
    {!focused && <><div className="accepted-compact-summary"><div><span>BASE SALARY</span><strong>{moneyInCurrency(job.salary, currency, displayCurrency, exchangeRates)}<small> / year</small></strong></div>
      <p>{job.paidTimeOff || job.healthCoverage || 'Accepted package details saved'}</p></div>
    <div className="accepted-compact-actions"><button type="button" className="accepted-view-package" aria-label={`View ${job.company} offer package`} onClick={onToggle}>View full package <Icon name="arrow" size={15} /></button>
      <button type="button" className="accepted-remove-button" onClick={() => onDelete(job)}><Icon name="close" size={15} /><span>Remove</span></button></div></>}
    {expanded && <div className="accepted-package-details"><div className="accepted-pay-overview"><div className="accepted-base-pay"><span>YOUR BASE SALARY</span>
      <strong>{moneyInCurrency(job.salary, currency, displayCurrency, exchangeRates)}</strong><small>per year</small></div>
    <div className="accepted-extra-pay"><div><span>Signing bonus</span><strong>{moneyInCurrency(job.signingBonus, currency, displayCurrency, exchangeRates)}</strong></div>
      <div><span>Annual equity estimate</span><strong>{moneyInCurrency(job.equity, currency, displayCurrency, exchangeRates)}</strong></div></div></div>
  <div className="accepted-benefits-heading"><div><span className="eyebrow">YOUR PACKAGE</span>
      <h3>What you’ll receive</h3></div>
    <button className="offer-edit-button" onClick={() => onEdit(job)}>Edit package <Icon name="arrow" size={15} /></button></div>
  <div className="accepted-benefits-grid">{packageItems.map(([label, value]) => <div className="accepted-benefit-item" key={label}><strong>{label}</strong>
      <p>{value?.trim() || 'Not added yet'}</p></div>)}</div>
  <div className="accepted-history-action"><span>{alreadyInHistory ? '✓ This role is in your work history' : 'This accepted role is added to Work history automatically.'}</span></div></div>}</article>;
}
export function PendingOfferCard({
  job,
  onEdit,
  onAccept,
  onReject,
  displayCurrency = 'USD',
  exchangeRates = {}
}) {
  const currency = job.currency || 'USD';
  const convertedToDisplay = convertCurrencyAmount(1, currency, displayCurrency, exchangeRates) !== null;
  const total = ['salary', 'signingBonus', 'equity'].reduce((sum, key) => sum + (convertCurrencyAmount(job[key] || 0, currency, displayCurrency, exchangeRates) ?? Number(job[key] || 0)), 0);
  const benefits = [job.healthCoverage, job.paidTimeOff, job.retirement, job.parentalLeave, job.benefits].filter(item => item?.trim());
  return <article className="offer-card" key={job.id}>
    <div className="offer-card-head"><CompanyLogo job={job} />
    <div><strong>{job.company}</strong>
      <small>{job.role}</small></div><span className="offer-pending-badge">Offer to review</span></div>
    <div className="offer-total"><span>{convertedToDisplay ? displayCurrency : currency} · ESTIMATED YEAR-ONE VALUE</span>
    <strong>{total ? money(total, convertedToDisplay ? displayCurrency : currency) : 'Add compensation'}</strong>
    <small>Entered salary + bonus + equity estimates</small></div>
    <div className="offer-metrics"><div><span>Base salary</span>
      <strong>{moneyInCurrency(job.salary, currency, displayCurrency, exchangeRates)}<small>/ year</small></strong></div>
    <div><span>Signing bonus</span>
      <strong>{moneyInCurrency(job.signingBonus, currency, displayCurrency, exchangeRates)}</strong></div>
    <div><span>Equity value</span>
      <strong>{moneyInCurrency(job.equity, currency, displayCurrency, exchangeRates)}<small>/ year</small></strong></div></div>
    <div className="offer-benefits"><span>BENEFITS & PERKS</span>{benefits.length ? <ul>{benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul> : <p>Add health coverage, PTO, retirement, and other details.</p>}</div>
    <div className="offer-deadline"><span>Decision deadline</span>
    <strong>{job.offerDeadline ? prettyDate(job.offerDeadline) : 'Not added'}</strong></div>
    <div className="offer-card-actions"><div className="offer-decision-actions"><button className="accept-offer-button" onClick={() => onAccept(job)}>Accept offer</button>
      <button className="reject-offer-button" onClick={() => onReject(job)}>Reject offer</button></div>
    <button className="offer-edit-button" onClick={() => onEdit(job)}>Review offer details <Icon name="arrow" size={15} /></button></div>
  </article>;
}

function OfferComparisonInsights({ offers, displayCurrency, exchangeRates }) {
  if (offers.length < 2) return null;
  const currencies = [...new Set(offers.map(job => job.currency || 'USD'))];
  const canConvertAll = offers.every(job => convertCurrencyAmount(1, job.currency || 'USD', displayCurrency, exchangeRates) !== null);
  const sameCurrency = currencies.length === 1 || canConvertAll;
  const summaryCurrency = canConvertAll ? displayCurrency : currencies[0];
  const estimatedValue = job => ['salary', 'signingBonus', 'equity'].reduce((sum, key) => sum + (convertCurrencyAmount(job[key] || 0, job.currency || 'USD', displayCurrency, exchangeRates) ?? Number(job[key] || 0)), 0);
  const rankedOffers = [...offers].sort((a, b) => estimatedValue(b) - estimatedValue(a));
  const bestValue = rankedOffers[0];
  const bestAmount = estimatedValue(bestValue);
  const benefits = [
    ['Health coverage', 'healthCoverage'],
    ['Paid time off', 'paidTimeOff'],
    ['Retirement match', 'retirement'],
    ['Parental leave', 'parentalLeave'],
    ['Other benefits & perks', 'benefits']
  ];
  const payRows = [
    ['Base salary', 'salary'],
    ['Signing bonus', 'signingBonus'],
    ['Equity estimate', 'equity']
  ];
  const columns = `minmax(150px, 1.1fr) repeat(${offers.length}, minmax(175px, 1fr))`;
  return <section className="offer-comparison-section"><div className="offer-section-heading"><div><span className="eyebrow">SIDE BY SIDE</span>
      <h3>See what’s different</h3>
      <p>Compare the money, benefits, and tradeoffs in one place.</p></div></div>
    {sameCurrency && bestAmount > 0 && <div className="offer-value-insight"><span className="offer-insight-spark">✦</span><p><strong>{bestValue.company}</strong> has the highest estimated first-year package at <strong>{money(bestAmount, summaryCurrency)}</strong>{rankedOffers.slice(1).map(job => {
        const difference = bestAmount - estimatedValue(job);
        return difference > 0 ? <span className="offer-difference" key={job.id}>{job.company} is {money(difference, summaryCurrency)} lower</span> : null;
      })}<small>Estimates shown in {displayCurrency}; exchange rates are indicative. Equity can change and may not be cash.</small></p></div>}
    {!sameCurrency && <p className="offer-currency-note">Offers use different currencies, so pay totals are shown separately and aren’t ranked.</p>}
    <div className="offer-comparison-scroll"><div className="offer-comparison-table" role="table" aria-label="Side-by-side offer comparison" style={{ '--offer-columns': columns }}>
      <div className="offer-comparison-row offer-comparison-header" role="row"><div role="columnheader">Package details</div>{offers.map(job => <div role="columnheader" key={job.id}><strong>{job.company}</strong><small>{job.role}</small></div>)}</div>
      {payRows.map(([label, field]) => <div className="offer-comparison-row" role="row" key={field}><div className="offer-comparison-label" role="rowheader">{label}</div>{offers.map(job => {
        const value = Number(job[field] || 0);
        const shownValue = convertCurrencyAmount(value, job.currency || 'USD', displayCurrency, exchangeRates) ?? value;
        const maxShown = Math.max(...offers.map(candidate => convertCurrencyAmount(candidate[field] || 0, candidate.currency || 'USD', displayCurrency, exchangeRates) ?? Number(candidate[field] || 0)));
        return <div className={sameCurrency && shownValue === maxShown && shownValue > 0 ? 'offer-comparison-value strongest' : 'offer-comparison-value'} role="cell" key={job.id}>{money(shownValue, convertCurrencyAmount(value, job.currency || 'USD', displayCurrency, exchangeRates) === null ? job.currency || 'USD' : displayCurrency)}{field !== 'signingBonus' && <small>{field === 'salary' ? ' / year' : ' / year est.'}</small>}</div>;
      })}</div>)}
      {sameCurrency && <div className="offer-comparison-row offer-total-row" role="row"><div className="offer-comparison-label" role="rowheader">Estimated first year</div>{offers.map(job => {
        const amount = estimatedValue(job);
        return <div className={amount === bestAmount && amount > 0 ? 'offer-comparison-value strongest' : 'offer-comparison-value'} role="cell" key={job.id}>{money(amount, summaryCurrency)}<small>salary + bonus + equity</small></div>;
      })}</div>}
      {benefits.map(([label, field]) => <div className="offer-comparison-row benefit-comparison-row" role="row" key={field}><div className="offer-comparison-label" role="rowheader">{label}</div>{offers.map(job => <div className="offer-comparison-benefit" role="cell" key={job.id}>{job[field]?.trim() || <span className="benefit-not-listed">Not listed</span>}</div>)}</div>)}
    </div></div>
  </section>;
}

export function OfferComparison({
  jobs,
  onEdit,
  onAdd,
  onAccept,
  onReject,
  workHistory,
  onDeleteAccepted,
  displayCurrency = 'USD',
  exchangeRates = {}
}) {
  const offers = jobs.filter(job => job.status === 'Offer');
  const acceptedOffers = jobs.filter(job => job.status === 'Accepted');
  const acceptedTrackRef = useRef(null);
  const dragRef = useRef(null);
  const [draggingAcceptedOffers, setDraggingAcceptedOffers] = useState(false);
  const [focusedAcceptedOfferId, setFocusedAcceptedOfferId] = useState(null);
  const focusedOfferCloseRef = useRef(null);
  const focusedAcceptedOffer = acceptedOffers.find(job => String(job.id) === String(focusedAcceptedOfferId));
  const scrollAcceptedOffers = direction => acceptedTrackRef.current?.scrollBy({ left: direction * acceptedTrackRef.current.clientWidth * .8, behavior: 'smooth' });
  const startAcceptedDrag = event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button')) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: acceptedTrackRef.current.scrollLeft };
    acceptedTrackRef.current.setPointerCapture(event.pointerId);
    setDraggingAcceptedOffers(true);
  };
  const moveAcceptedDrag = event => {
    if (!dragRef.current) return;
    acceptedTrackRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  };
  const endAcceptedDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDraggingAcceptedOffers(false);
  };
  useEffect(() => {
    if (!focusedAcceptedOffer) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setFocusedAcceptedOfferId(null);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    focusedOfferCloseRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [focusedAcceptedOffer]);
  const hasOffers = offers.length > 0 || acceptedOffers.length > 0;
  return <div className="offers-dashboard">
    <div className="offers-intro"><div className="offers-intro-icon">✦</div>
    <div><span className="eyebrow">A GOOD PROBLEM TO HAVE</span>
      <h2>Compare the whole package</h2>
      <p>Look at compensation, benefits, and timing side by side. The right choice is the one that fits your life.</p></div>
    </div>
    {hasOffers ? <>
      <div className="offers-summary"><strong>{offers.length} pending · {acceptedOffers.length} accepted</strong>
      <span>Amounts stay in their entered currency; estimates do not adjust for taxes or equity vesting.</span></div>
      {offers.length > 0 && <section className="offer-section">
        <div className="offer-section-heading"><div><span className="eyebrow">STILL DECIDING</span>
          <h3>Offers to compare</h3></div>
        <span>{offers.length}</span></div>
        <div className="offer-cards">{offers.map(job => <PendingOfferCard key={job.id} job={job} onEdit={onEdit} onAccept={onAccept} onReject={onReject} displayCurrency={displayCurrency} exchangeRates={exchangeRates} />)}</div>
        <OfferComparisonInsights offers={offers} displayCurrency={displayCurrency} exchangeRates={exchangeRates} />
      </section>}
      {acceptedOffers.length > 0 && <section className="accepted-offers-section">
        <div className="accepted-offers-heading"><div className="offer-section-heading"><div><span className="eyebrow">THE NEXT CHAPTER</span>
          <h3>Accepted offers</h3>
          <p>Your packages, saved to revisit whenever you need them.</p></div>
        <span>{acceptedOffers.length}</span></div>{acceptedOffers.length > 1 && <div className="accepted-carousel-controls"><button type="button" aria-label="Previous accepted offers" onClick={() => scrollAcceptedOffers(-1)}>‹</button><button type="button" aria-label="Next accepted offers" onClick={() => scrollAcceptedOffers(1)}>›</button></div>}</div>
        <div className={`accepted-package-list${draggingAcceptedOffers ? ' dragging' : ''}`} ref={acceptedTrackRef} onPointerDown={startAcceptedDrag} onPointerMove={moveAcceptedDrag} onPointerUp={endAcceptedDrag} onPointerCancel={endAcceptedDrag} onLostPointerCapture={endAcceptedDrag} aria-label="Accepted offer packages. Swipe or drag to browse.">{acceptedOffers.map(job => <AcceptedOfferDetails key={job.id} job={job} onEdit={onEdit} onDelete={onDeleteAccepted} alreadyInHistory={workHistory.some(entry => entry.sourceOfferId === job.id)} expanded={false} onToggle={() => setFocusedAcceptedOfferId(job.id)} displayCurrency={displayCurrency} exchangeRates={exchangeRates} />)}</div>
        {acceptedOffers.length > 1 && <p className="accepted-carousel-hint">Swipe, drag, or use the arrows to browse your accepted offers.</p>}
        {focusedAcceptedOffer && <div className="accepted-focus-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setFocusedAcceptedOfferId(null); }}><section className="accepted-focus-dialog" role="dialog" aria-modal="true" aria-label={`${focusedAcceptedOffer.company} accepted offer details`}><div className="accepted-focus-heading"><span>YOUR ACCEPTED PACKAGE</span><button type="button" className="icon-button" ref={focusedOfferCloseRef} onClick={() => setFocusedAcceptedOfferId(null)} aria-label="Close offer details"><Icon name="close" /></button></div><AcceptedOfferDetails job={focusedAcceptedOffer} onEdit={job => { setFocusedAcceptedOfferId(null); onEdit(job); }} onDelete={onDeleteAccepted} alreadyInHistory={workHistory.some(entry => entry.sourceOfferId === focusedAcceptedOffer.id)} expanded focused displayCurrency={displayCurrency} exchangeRates={exchangeRates} /></section></div>}
      </section>}
    </> : <div className="offers-empty"><div className="offers-empty-icon">✦</div>
    <h3>Your next opportunity could be an offer.</h3>
    <p>When a company makes an offer, save the salary, benefits, and decision date here. We’ll help you compare the full package.</p>
    </div>}
  </div>;
}
