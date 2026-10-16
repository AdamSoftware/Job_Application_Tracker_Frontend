import { useState } from 'react';
import { Icon } from '../shared/Ui.jsx';
import { downloadIcs, googleEventUrl, toDateKey } from '../../utils/dateUtils.js';

export function InterviewCalendar({
  jobs,
  onOpen
}) {
  const [weekStart, setWeekStart] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay());
    return date;
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + (6 - today.getDay()));
    const firstUpcoming = jobs.map(job => job.interview).filter(date => date && date >= toDateKey(today) && date <= toDateKey(weekEnd)).sort()[0];
    return firstUpcoming || toDateKey(today);
  });
  const [monthOpen, setMonthOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const weekDays = Array.from({
    length: 7
  }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const selectedJobs = jobs.filter(job => job.interview === selectedDate);
  const monthYear = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthOffset = new Date(monthYear, monthIndex, 1).getDay();
  const monthDates = Array.from({
    length: 42
  }, (_, index) => {
    const date = new Date(monthYear, monthIndex, index - monthOffset + 1);
    return {
      date,
      key: toDateKey(date),
      inMonth: date.getMonth() === monthIndex
    };
  });
  const moveWeek = offset => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + offset * 7);
    setWeekStart(next);
  };
  const moveMonth = offset => setMonth(new Date(monthYear, monthIndex + offset, 1));
  const chooseDate = key => {
    setSelectedDate(key);
    const date = new Date(key + 'T12:00:00');
    date.setDate(date.getDate() - date.getDay());
    setWeekStart(date);
  };
  const interviewCount = key => jobs.filter(job => job.interview === key).length;
  const renderInterview = job => <div className="selected-interview" key={job.id}><span className="selected-dot" />
  <span className="selected-interview-info"><b>{job.company}</b>
    <small>{job.role}</small></span>
  <a className="selected-time google-event-link" href={googleEventUrl(job)} target="_blank" rel="noreferrer">Google</a>
  <button className="selected-time apple-event-link" onClick={() => downloadIcs([job])}>Apple</button>
  <button className="selected-edit" onClick={() => onOpen(job)} aria-label={'Edit interview at ' + job.company}>Edit</button></div>;
  return <>
    <section className="interview-calendar weekly-calendar">
      <div className="week-calendar-heading"><div><span className="eyebrow">THIS WEEK</span>
        <h2>Interview days</h2>
        <p>{weekStart.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })} – {weekDays[6].toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}</p></div>
      <button className="month-expand-button" onClick={() => setMonthOpen(true)}><Icon name="calendar" size={15} /> Month view</button></div>
      <div className="week-calendar-nav"><button className="calendar-nav" onClick={() => moveWeek(-1)} aria-label="Previous week">‹</button>
      <button className="week-today-button" onClick={() => {
          const today = new Date();
          today.setDate(today.getDate() - today.getDay());
          setWeekStart(today);
          setSelectedDate(toDateKey(new Date()));
        }}>This week</button>
      <button className="calendar-nav" onClick={() => moveWeek(1)} aria-label="Next week">›</button></div>
      <div className="week-strip">{weekDays.map(date => {
          const key = toDateKey(date);
          const total = interviewCount(key);
          const today = key === toDateKey(new Date());
          return <button key={key} className={'week-day' + (selectedDate === key ? ' selected' : '') + (today ? ' today' : '') + (total ? ' has-interview' : '')} onClick={() => setSelectedDate(key)}><span>{date.toLocaleDateString('en-US', {
                weekday: 'short'
              })}</span>
        <strong>{date.getDate()}</strong>
        <i>{total ? total + (total === 1 ? ' interview' : ' interviews') : '—'}</i>
        <b className="week-day-dot" /></button>;
        })}</div>
      <div className="week-agenda"><div className="week-agenda-heading"><strong>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}</strong>
        <button className="calendar-export" onClick={() => downloadIcs(jobs)} disabled={!jobs.length}>Apple .ics</button></div>{selectedJobs.length ? selectedJobs.map(renderInterview) : <div className="week-empty"><span className="week-empty-icon"><Icon name="calendar" size={18} /></span>
        <div><strong>No interviews this day</strong>
          <p>Pick another day to check your week.</p></div></div>}</div>
      <p className="calendar-sync-note">Google opens an event draft. Apple imports a calendar file. Live sync needs account connection.</p>
    </section>
    {monthOpen && <div className="month-modal-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setMonthOpen(false);
    }}><section className="month-modal" role="dialog" aria-modal="true" aria-labelledby="month-title"><div className="month-modal-heading"><div><span className="eyebrow">FULL CALENDAR</span>
          <h2 id="month-title">{month.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}</h2></div>
        <div className="month-modal-actions"><button className="calendar-nav" onClick={() => moveMonth(-1)} aria-label="Previous month">‹</button>
          <button className="calendar-nav" onClick={() => moveMonth(1)} aria-label="Next month">›</button>
          <button className="icon-button" onClick={() => setMonthOpen(false)} aria-label="Close calendar">×</button></div></div>
      <div className="month-grid"><div className="month-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day}>{day}</span>)}</div>
        <div className="month-days">{monthDates.map(({
              date,
              key,
              inMonth
            }) => {
              const total = interviewCount(key);
              return <button key={key} className={'month-day' + (!inMonth ? ' outside' : '') + (selectedDate === key ? ' selected' : '') + (key === toDateKey(new Date()) ? ' today' : '') + (total ? ' has-interview' : '')} onClick={() => chooseDate(key)}><span>{date.getDate()}</span>{total > 0 && <i>{total}</i>}</button>;
            })}</div></div>
      <div className="month-selected-agenda"><strong>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}</strong>{selectedJobs.length ? selectedJobs.map(renderInterview) : <p>No interviews scheduled for this day.</p>}</div>
      <div className="month-modal-footer"><span>Choose a date to see scheduled interviews.</span>
        <button className="calendar-export" onClick={() => downloadIcs(jobs)} disabled={!jobs.length}>Download Apple calendar file</button></div></section></div>}
  </>;
}
