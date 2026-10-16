import { CompanyLogo, Icon } from '../shared/Ui.jsx';
import { prettyDate } from '../../utils/dateUtils.js';
import { money } from '../../utils/jobUtils.js';

export function AcceptedOfferDetails({
  job,
  onEdit,
  alreadyInHistory
}) {
  const currency = job.currency || 'USD';
  const packageItems = [['Health coverage', job.healthCoverage], ['Paid time off', job.paidTimeOff], ['Retirement', job.retirement], ['Parental leave', job.parentalLeave], ['Other benefits & perks', job.benefits]];
  return <article className="accepted-package-card"><div className="accepted-package-heading"><div className="offer-card-head"><CompanyLogo job={job} />
      <div><strong>{job.company}</strong>
        <small>{job.role}{job.location ? ` · ${job.location}` : ''}</small></div></div>
    <span className="accepted-badge">✓ Accepted</span></div>
  <div className="accepted-package-comp"><div><span>ANNUAL BASE SALARY</span>
      <strong>{money(job.salary, currency)}</strong></div>
    <div><span>SIGNING BONUS</span>
      <strong>{money(job.signingBonus, currency)}</strong></div>
    <div><span>ANNUAL EQUITY ESTIMATE</span>
      <strong>{money(job.equity, currency)}</strong></div>
    <div><span>OFFER DEADLINE</span>
      <strong>{job.offerDeadline ? prettyDate(job.offerDeadline) : 'Not added'}</strong></div></div>
  <div className="accepted-benefits-heading"><div><span className="eyebrow">YOUR BENEFITS PACKAGE</span>
      <h3>What’s included</h3></div>
    <button className="offer-edit-button" onClick={() => onEdit(job)}>Edit package <Icon name="arrow" size={15} /></button></div>
  <div className="accepted-benefits-grid">{packageItems.map(([label, value]) => <div className="accepted-benefit-item" key={label}><strong>{label}</strong>
      <p>{value?.trim() || 'Not added yet'}</p></div>)}</div>
  <div className="accepted-history-action"><span>{alreadyInHistory ? '✓ In your work history as an upcoming role' : 'This accepted role is added to Work history automatically.'}</span></div></article>;
}
export function PendingOfferCard({
  job,
  onEdit,
  onAccept,
  onReject
}) {
  const currency = job.currency || 'USD';
  const total = Number(job.salary || 0) + Number(job.signingBonus || 0) + Number(job.equity || 0);
  const benefits = [job.healthCoverage, job.paidTimeOff, job.retirement, job.parentalLeave, job.benefits].filter(item => item?.trim());
  return <article className="offer-card" key={job.id}>
    <div className="offer-card-head"><CompanyLogo job={job} />
    <div><strong>{job.company}</strong>
      <small>{job.role}</small></div></div>
    <div className="offer-total"><span>{currency} · ESTIMATED YEAR-ONE VALUE</span>
    <strong>{total ? money(total, currency) : 'Add compensation'}</strong>
    <small>Entered salary + bonus + equity estimates</small></div>
    <div className="offer-metrics"><div><span>Base salary</span>
      <strong>{money(job.salary, currency)}<small>/ year</small></strong></div>
    <div><span>Signing bonus</span>
      <strong>{money(job.signingBonus, currency)}</strong></div>
    <div><span>Equity value</span>
      <strong>{money(job.equity, currency)}<small>/ year</small></strong></div></div>
    <div className="offer-benefits"><span>BENEFITS & PERKS</span>{benefits.length ? <ul>{benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul> : <p>Add health coverage, PTO, retirement, and other details.</p>}</div>
    <div className="offer-deadline"><span>Decision deadline</span>
    <strong>{job.offerDeadline ? prettyDate(job.offerDeadline) : 'Not added'}</strong></div>
    <div className="offer-card-actions"><div className="offer-decision-actions"><button className="accept-offer-button" onClick={() => onAccept(job)}>Accept offer</button>
      <button className="reject-offer-button" onClick={() => onReject(job)}>Reject offer</button></div>
    <button className="offer-edit-button" onClick={() => onEdit(job)}>Review offer details <Icon name="arrow" size={15} /></button></div>
  </article>;
}
export function OfferComparison({
  jobs,
  onEdit,
  onAdd,
  onAccept,
  onReject,
  workHistory
}) {
  const offers = jobs.filter(job => job.status === 'Offer');
  const acceptedOffers = jobs.filter(job => job.status === 'Accepted');
  const hasOffers = offers.length > 0 || acceptedOffers.length > 0;
  return <div className="offers-dashboard">
    <div className="offers-intro"><div className="offers-intro-icon">✦</div>
    <div><span className="eyebrow">A GOOD PROBLEM TO HAVE</span>
      <h2>Compare the whole package</h2>
      <p>Look at compensation, benefits, and timing side by side. The right choice is the one that fits your life.</p></div>
    <button className="primary-button" onClick={onAdd}><Icon name="plus" size={17} /> Add offer</button></div>
    {hasOffers ? <>
      <div className="offers-summary"><strong>{offers.length} pending · {acceptedOffers.length} accepted</strong>
      <span>Amounts stay in their entered currency; estimates do not adjust for taxes or equity vesting.</span></div>
      {offers.length > 0 && <section className="offer-section">
        <div className="offer-section-heading"><div><span className="eyebrow">STILL DECIDING</span>
          <h3>Offers to compare</h3></div>
        <span>{offers.length}</span></div>
        <div className="offer-cards">{offers.map(job => <PendingOfferCard key={job.id} job={job} onEdit={onEdit} onAccept={onAccept} onReject={onReject} />)}</div>
        {offers.length < 2 && <div className="compare-nudge"><span>✳</span>
        <p>Have another offer? Add it here to compare the details together.</p>
        <button onClick={onAdd}>Add another offer <Icon name="arrow" size={14} /></button></div>}
      </section>}
      {acceptedOffers.length > 0 && <section className="accepted-offers-section">
        <div className="offer-section-heading"><div><span className="eyebrow">THE NEXT CHAPTER</span>
          <h3>Accepted offers</h3>
          <p>Your chosen packages, all in one place.</p></div>
        <span>{acceptedOffers.length}</span></div>
        <div className="accepted-package-list">{acceptedOffers.map(job => <AcceptedOfferDetails key={job.id} job={job} onEdit={onEdit} alreadyInHistory={workHistory.some(entry => entry.sourceOfferId === job.id)} />)}</div>
      </section>}
    </> : <div className="offers-empty"><div className="offers-empty-icon">✦</div>
    <h3>Your next opportunity could be an offer.</h3>
    <p>When a company makes an offer, save the salary, benefits, and decision date here. We’ll help you compare the full package.</p>
    <button className="primary-button" onClick={onAdd}><Icon name="plus" size={17} /> Add your first offer</button></div>}
  </div>;
}
