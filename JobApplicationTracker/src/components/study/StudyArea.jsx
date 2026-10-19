import { useMemo, useState } from 'react';
import { getInterviewEvents } from '../../utils/interviewUtils.js';
import { Icon } from '../shared/Ui.jsx';
import { ThemedDropdown } from '../shared/ThemedDropdown.jsx';

const categories = ['Study notes', 'What went well', 'Lessons learned', 'Questions to practice'];
const storageKey = 'job-tracker-study-notes';
const demoSeedKey = 'job-tracker-study-demo-seeded';

export function createDemoStudyNotes() {
  const today = new Date().toISOString();
  return [
    {
      id: 'demo-study-questions',
      title: 'Questions worth asking the team',
      category: 'Study notes',
      content: 'What would success look like in the first 90 days?\nHow does the team share feedback?\nWhat is a challenge the person in this role could help solve?',
      linkedInterviewId: '',
      linkedJobId: '',
      updatedAt: today,
      createdAt: today,
      isExample: true
    },
    {
      id: 'demo-study-story',
      title: 'A clearer project story',
      category: 'Questions to practice',
      content: 'Practice a short story with four parts: the problem, my role, the choices I made, and the result. Keep one specific measure ready to explain the impact.',
      linkedInterviewId: '',
      linkedJobId: '',
      updatedAt: today,
      createdAt: today,
      isExample: true
    },
    {
      id: 'demo-study-reflection',
      title: 'Remember what went well',
      category: 'What went well',
      content: 'I explained the tradeoffs clearly and gave the interviewer room to ask follow-up questions. Bring that same calm pace into the next conversation.',
      linkedInterviewId: '',
      linkedJobId: '',
      updatedAt: today,
      createdAt: today,
      isExample: true
    }
  ];
}

function readNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(saved) && saved.length) return saved;
    if (localStorage.getItem(demoSeedKey) === 'true') return Array.isArray(saved) ? saved : [];
    const examples = createDemoStudyNotes();
    localStorage.setItem(storageKey, JSON.stringify(examples));
    localStorage.setItem(demoSeedKey, 'true');
    return examples;
  } catch {
    return [];
  }
}

function formatSavedDate(value) {
  if (!value) return 'Just added';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function StudyArea({ jobs }) {
  const [notes, setNotes] = useState(readNotes);
  const [editing, setEditing] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All notes');
  const [search, setSearch] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const interviewRounds = useMemo(() => getInterviewEvents(jobs)
    .sort((a, b) => (b.interview || '').localeCompare(a.interview || '')), [jobs]);
  const visibleNotes = notes.filter(note => {
    const matchesCategory = categoryFilter === 'All notes' || note.category === categoryFilter;
    const haystack = `${note.title} ${note.content} ${note.category}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase());
  });
  const persist = next => {
    setNotes(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      return true;
    } catch {
      return false;
    }
  };
  const saveNote = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const linkedRound = interviewRounds.find(round => String(round.interviewId) === data.linkedInterviewId);
    const note = {
      id: editing?.isExample ? `study-${Date.now()}` : (editing?.id || `study-${Date.now()}`),
      title: data.title.trim(),
      category: data.category,
      content: data.content.trim(),
      linkedInterviewId: linkedRound?.interviewId || '',
      linkedJobId: linkedRound?.id || '',
      updatedAt: new Date().toISOString(),
      createdAt: editing?.isExample ? new Date().toISOString() : (editing?.createdAt || new Date().toISOString()),
      isExample: false
    };
    const savedForNextVisit = persist(editing ? notes.map(item => item.id === editing.id ? note : item) : [note, ...notes]);
    setCategoryFilter('All notes');
    setSearch('');
    setEditing(null);
    setSaveNotice(savedForNextVisit ? `“${note.title}” saved. Your note card is below.` : `“${note.title}” is visible below for now, but this browser could not save it for your next visit.`);
  };
  const linkedRoundFor = note => interviewRounds.find(round => String(round.interviewId) === String(note.linkedInterviewId));

  return <section className="study-area">
    <div className="study-welcome"><span className="study-welcome-mark"><Icon name="book" size={20} /></span>
      <div><strong>A space to learn at your own pace</strong><p>Save useful research, practice answers, and reminders about what you want to carry into your next conversation.</p></div>
      <button className="primary-button" onClick={() => setEditing({})}><Icon name="plus" size={16} /> Add a note</button></div>
    {saveNotice && <p className="study-save-notice" role="status">{saveNotice}</p>}
    <div className="study-toolbar"><div className="study-filters" role="group" aria-label="Filter study notes">{['All notes', ...categories].map(category => <button type="button" key={category} className={categoryFilter === category ? 'selected' : ''} aria-pressed={categoryFilter === category} onClick={() => setCategoryFilter(category)}>{category}<span>{category === 'All notes' ? notes.length : notes.filter(note => note.category === category).length}</span></button>)}</div>
      <label className="study-search"><Icon name="search" size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a note..." /></label></div>
    {visibleNotes.length ? <div className="study-note-grid">{visibleNotes.map(note => {
      const relatedRound = linkedRoundFor(note);
      return <article className={`study-note-card category-${categories.indexOf(note.category)}`} key={note.id}>
        <div className="study-note-card-top"><span className="study-note-category">{note.category}</span><div className="study-note-card-tools">{note.isExample && <span className="study-example-label">Example</span>}<button type="button" className="study-note-edit" onClick={() => setEditing(note)} aria-label={`Edit ${note.title}`}><Icon name="dots" size={18} /></button></div></div>
        <h2>{note.title}</h2><p className="study-note-content">{note.content}</p>
        <footer><span>{relatedRound ? `${relatedRound.company} · ${relatedRound.interviewRound}` : 'Personal study note'}</span><time dateTime={note.updatedAt}>{formatSavedDate(note.updatedAt)}</time></footer>
        <div className="study-note-actions"><button type="button" className="text-button" onClick={() => setEditing(note)}>Edit note</button><button type="button" className="study-delete" onClick={() => {
          if (window.confirm(`Delete “${note.title}”?`)) persist(notes.filter(item => item.id !== note.id));
        }}>Delete</button></div>
      </article>;
    })}</div> : <div className="study-empty"><span className="study-empty-icon"><Icon name="book" size={21} /></span><h2>{notes.length ? 'No notes match this view' : 'Start your own study space'}</h2><p>{notes.length ? 'Try another category or search term.' : 'Keep notes on what you are learning, interview answers to practice, or the moments you want to remember. Link a note to an interview only when it is helpful.'}</p>{!notes.length && <button className="primary-button" onClick={() => setEditing({})}><Icon name="plus" size={16} /> Write your first note</button>}</div>}

    {editing && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setEditing(null); }}><form className="modal warm-form-modal study-note-modal" onSubmit={saveNote}>
      <div className="modal-header"><div><div className="eyebrow">YOUR STUDY SPACE</div><h2>{editing.id ? 'Edit note' : 'Add a study note'}</h2><p>Write something you want to remember or practice.</p></div><button type="button" className="icon-button" onClick={() => setEditing(null)} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-grid"><label className="full-field">Note title<input name="title" required maxLength="90" placeholder="e.g. A stronger answer for ‘tell me about yourself’" defaultValue={editing.title || ''} /></label>
        <label className="full-field">Type of note<ThemedDropdown name="category" defaultValue={editing.category || categories[0]} options={categories.map(category => ({ value: category, label: category }))} /></label>
        <label className="full-field">Your notes<textarea name="content" required rows="7" placeholder="Add a topic to study, an answer to practice, something that went well, or a lesson you want to remember." defaultValue={editing.content || ''} /></label>
        <label className="full-field">Connect to an interview <span className="optional">optional</span><ThemedDropdown name="linkedInterviewId" defaultValue={editing.linkedInterviewId || ''} placeholder="Keep this as a personal note" options={interviewRounds.map(round => ({ value: round.interviewId, label: `${round.company} · ${round.role} · ${round.interviewRound}` }))} /></label></div>
      <div className="study-modal-note"><Icon name="sparkles" size={15} />This is your own study area. Notes do not need to be connected to an application or interview.</div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancel</button><button className="primary-button" type="submit">Save note</button></div>
    </form></div>}
  </section>;
}
