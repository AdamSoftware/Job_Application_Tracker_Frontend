import { useEffect, useState } from 'react';
import { reminderQuotes } from '../../data/initialData.js';

export function QuoteCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive(current => (current + 1) % reminderQuotes.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  const move = offset => setActive(current => (current + offset + reminderQuotes.length) % reminderQuotes.length);
  return <div className="encouragement quote-carousel"><span className="quote-spark">✳</span>
  <div className="eyebrow">A LITTLE REMINDER</div>
  <p key={active} className="quote-text" aria-live="polite">“{reminderQuotes[active]}”</p>
  <div className="quote-controls"><span>TRACKR REMINDER</span>
    <div className="quote-navigation"><button onClick={() => move(-1)} aria-label="Previous quote">‹</button>{reminderQuotes.map((quote, index) => <button key={quote} className={`quote-dot${index === active ? ' active' : ''}`} onClick={() => setActive(index)} aria-label={`Show reminder ${index + 1}`} />)}<button onClick={() => move(1)} aria-label="Next quote">›</button></div></div></div>;
}
