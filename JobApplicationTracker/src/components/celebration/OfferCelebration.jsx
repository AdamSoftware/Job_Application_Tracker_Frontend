export function OfferCelebration({
  onClose,
  eyebrow = 'LOOK AT YOU',
  title = 'You got an offer!',
  message = 'No matter how long the search took, you made it here. Take a well-earned break, then give yourself time to think through your offers.',
  button = 'Take a moment'
}) {
  return <div className="offer-celebration" role="status" aria-live="polite"><div className="confetti-field" aria-hidden="true">{Array.from({
        length: 28
      }, (_, index) => <i key={index} style={{
        '--left': `${index * 37 % 100}%`,
        '--delay': `${index * -0.12}s`,
        '--turn': `${index * 53}deg`
      }} />)}</div>
  <div className="celebration-card"><span className="celebration-star">✦</span>
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    <p>{message}</p>
    <button className="primary-button" onClick={onClose}>{button}</button></div></div>;
}
