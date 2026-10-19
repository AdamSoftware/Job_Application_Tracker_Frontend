import { useState } from 'react';
import { Icon } from '../shared/Ui.jsx';

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

function safeProjectUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

const getProjectImages = project => project?.images?.length ? project.images : (project?.image ? [project.image] : []);
const getProjectImageAlts = project => project?.imageAlts?.length ? project.imageAlts : (project?.image ? [project.imageAlt || ''] : []);
const getProjectLinks = project => project?.links?.length ? project.links : (project?.url ? [{ label: 'Project link', url: project.url }] : []);

async function createPortfolioHtml(projects, ownerName) {
  const toDataUrl = async source => {
    if (source.startsWith('data:image/')) return source;
    if (!source.startsWith('/assets/') && !source.startsWith('/src/assets/')) return '';
    const response = await fetch(source);
    if (!response.ok) return '';
    const blob = await response.blob();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return `data:${blob.type};base64,${btoa(binary)}`;
  };
  const projectPages = await Promise.all(projects.map(async project => {
    const images = (await Promise.all(getProjectImages(project).map(async (image, index) => {
      const source = await toDataUrl(image);
      return source ? `<img class="project-image" src="${escapeHtml(source)}" alt="${escapeHtml(getProjectImageAlts(project)[index] || project.title)}">` : '';
    }))).join('');
    const links = getProjectLinks(project).map(link => {
      const url = safeProjectUrl(link.url);
      return url ? `<li><a href="${escapeHtml(url)}">${escapeHtml(link.label || url)}</a></li>` : '';
    }).join('');
    return `<article class="project">${images ? `<div class="project-gallery">${images}</div>` : '<div class="project-placeholder">Selected work</div>'}
      <div class="project-copy"><span class="project-number">SELECTED WORK</span><h2>${escapeHtml(project.title)}</h2>
        ${project.context ? `<p class="context">${escapeHtml(project.context)}</p>` : ''}
        ${project.description ? `<p>${escapeHtml(project.description).replace(/\n/g, '<br>')}</p>` : ''}
        ${project.skills?.length ? `<p class="skills"><strong>Skills:</strong> ${project.skills.map(escapeHtml).join(' · ')}</p>` : ''}
        ${links ? `<div class="project-links"><strong>Explore this work</strong><ul>${links}</ul></div>` : ''}</div></article>`;
  }));
  const title = ownerName ? `${escapeHtml(ownerName)}’s Portfolio` : 'Selected Portfolio';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
    *{box-sizing:border-box}body{margin:0;color:#292538;background:#f5f3f8;font:15px/1.65 Arial,sans-serif}.page{max-width:1000px;margin:0 auto;padding:56px 36px}.hero{padding:44px;border-radius:24px;background:linear-gradient(125deg,#382957,#7053bc 67%,#9878d2);color:#fff}.eyebrow,.project-number{font-size:11px;letter-spacing:1.7px;font-weight:700}.hero h1{margin:10px 0;font-size:clamp(34px,7vw,58px);line-height:1.08}.hero p{max-width:600px;margin:0;color:#e7e0f5;font-size:17px}.work{display:grid;gap:20px;margin-top:28px}.project{overflow:hidden;border:1px solid #e8e3ed;border-radius:18px;background:#fff;box-shadow:0 8px 28px #30214c0c}.project-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;padding:12px;background:#f0edf5}.project-image{display:block;width:100%;height:250px;object-fit:cover;border-radius:10px}.project-placeholder{display:grid;place-items:center;min-height:130px;background:linear-gradient(135deg,#f1edfa,#e5efe9);color:#7a6b96;font-weight:700}.project-copy{padding:25px 30px}.project-number{color:#8065ba}.project-copy h2{margin:5px 0;color:#35294b;font-size:27px}.context{margin:0;color:#776a8d;font-weight:700}.project-copy p{margin:12px 0}.skills{color:#625280}.project-copy a{color:#6346ad;overflow-wrap:anywhere}.project-links ul{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0}.project-links a{display:inline-block;padding:7px 11px;border:1px solid #e4deee;border-radius:20px;text-decoration:none}.footer{padding:28px 4px;color:#888194;font-size:12px}@media(max-width:600px){.page{padding:20px 14px}.hero{padding:28px 22px}.project-copy{padding:21px}.project-image{height:200px}}@media print{body{background:#fff}.page{padding:0}.hero,.project{break-inside:avoid;box-shadow:none}.project{margin-bottom:16px}.hero,.project-gallery{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    </style></head><body><main class="page"><header class="hero"><span class="eyebrow">A COLLECTION OF SELECTED WORK</span><h1>${title}</h1><p>Selected projects, skills, and ways to explore the work.</p></header><section class="work">${projectPages.join('')}</section><footer class="footer">Portfolio · ${new Date().getFullYear()}</footer></main></body></html>`;
  return html;
}

function downloadPortfolio(html, ownerName) {
  const file = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  const slug = (ownerName || 'selected-work').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  link.href = url;
  link.download = `${slug || 'selected-work'}-portfolio.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PortfolioProjects({ projects, ownerName, onAdd, onEdit, onDelete }) {
  const [openProject, setOpenProject] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [exportError, setExportError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [selection, setSelection] = useState(null);
  const selectedProjectIds = (selection || projects.map(project => project.id)).filter(id => projects.some(project => project.id === id));
  const openImages = getProjectImages(openProject);
  const openImageAlts = getProjectImageAlts(openProject);
  const openLinks = getProjectLinks(openProject).filter(link => safeProjectUrl(link.url));

  const changeImage = direction => {
    if (openImages.length < 2) return;
    setSlideDirection(direction === 1 ? 'next' : 'previous');
    setImageIndex(current => (current + direction + openImages.length) % openImages.length);
  };

  const openPortfolioFile = project => {
    setOpenProject(project);
    setImageIndex(0);
    setSlideDirection('next');
  };

  const handleExport = async () => {
    try {
      const html = await createPortfolioHtml(projects.filter(project => selectedProjectIds.includes(project.id)), ownerName);
      downloadPortfolio(html, ownerName);
      setExportError('Downloaded to your Downloads folder. Open the HTML file in a browser to share or print it as a PDF.');
    } catch {
      setExportError('Could not create the portfolio file. Please try again.');
    }
  };

  const handlePreview = async () => {
    try {
      setPreviewHtml(await createPortfolioHtml(projects.filter(project => selectedProjectIds.includes(project.id)), ownerName));
      setExportError('');
    } catch {
      setExportError('Could not prepare the preview. Please try again.');
    }
  };

  return <section className="portfolio-section">
    <div className="portfolio-heading"><div><span className="eyebrow">SHOW WHAT YOU CAN DO</span>
      <h2>Portfolio & projects</h2>
      <p>{isExporting ? 'Choose the projects you want to include, then preview your portfolio before downloading.' : 'Open a project file to view it, or export selected work to share.'}</p></div>
      <div className="portfolio-heading-actions">{projects.length > 0 && !isExporting && <button className="secondary-button" onClick={() => { setIsExporting(true); setExportError(''); }}>Export portfolio <Icon name="download" size={15} /></button>}
        {isExporting && <button className="secondary-button" onClick={() => setIsExporting(false)}>Cancel export</button>}
        </div></div>
    {isExporting && projects.length > 0 && <div className="portfolio-export-bar"><span>{selectedProjectIds.length} of {projects.length} projects selected</span><button className="secondary-button" type="button" onClick={() => setSelection(projects.map(project => project.id))}>Select all</button><button className="secondary-button" type="button" onClick={() => setSelection([])}>Clear selection</button><button className="secondary-button" type="button" disabled={!selectedProjectIds.length} onClick={handlePreview}>Preview selected</button><button className="primary-button" type="button" disabled={!selectedProjectIds.length} onClick={handleExport}><Icon name="download" size={15} /> Download HTML</button></div>}
    {exportError && <p className="portfolio-export-error" role="status">{exportError}</p>}
    {projects.length ? <div className="portfolio-grid">{projects.map(project => <article className={`portfolio-file-wrap${selectedProjectIds.includes(project.id) ? ' selected' : ''}`} key={project.id}>
      {isExporting && <label className="portfolio-select"><input type="checkbox" checked={selectedProjectIds.includes(project.id)} onChange={event => setSelection(current => {
        const selected = current || projects.map(item => item.id);
        return event.target.checked ? [...selected, project.id] : selected.filter(id => id !== project.id);
      })} /> Include in export</label>}
      <button className="portfolio-file" onClick={() => openPortfolioFile(project)} aria-label={`Open project file: ${project.title}`}>
        <span className="portfolio-file-preview">{getProjectImages(project).length ? <img src={getProjectImages(project)[0]} alt="" /> : <Icon name="briefcase" size={25} />}</span>
        <span className="portfolio-file-name">{project.title}{project.isDemo && <small className="portfolio-sample-tag">SAMPLE</small>}</span>
        <span className="portfolio-file-meta">{project.context || (project.skills?.length ? project.skills.slice(0, 2).join(' · ') : 'Project file')}{getProjectImages(project).length > 1 ? ` · ${getProjectImages(project).length} images` : ''}</span>
      </button>
      <div className="portfolio-file-actions"><button className="text-button" onClick={() => onEdit(project)}>Edit</button>
        <button className="text-button" onClick={() => onDelete(project)}>Delete</button></div>
    </article>)}</div> : <div className="portfolio-empty"><div className="offers-empty-icon">✦</div><div><h3>Your work deserves to be seen.</h3>
      <p>Add photography, design work, apps, writing, or any project that helps tell your story.</p></div></div>}
    {previewHtml && <div className="modal-backdrop portfolio-view-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setPreviewHtml('');
    }}><section className="modal portfolio-preview-modal" role="dialog" aria-modal="true" aria-label="Portfolio export preview">
      <div className="modal-header"><div><div className="eyebrow">EXPORT PREVIEW</div><h2>How your portfolio will look</h2><p>Only the projects you selected are included.</p></div><button type="button" className="icon-button" onClick={() => setPreviewHtml('')} aria-label="Close preview"><Icon name="close" /></button></div>
      <iframe title="Portfolio export preview" srcDoc={previewHtml} />
      <div className="portfolio-view-actions"><button className="secondary-button" onClick={() => setPreviewHtml('')}>Back to selection</button><button className="primary-button" onClick={() => { downloadPortfolio(previewHtml, ownerName); setPreviewHtml(''); }}>Download HTML</button></div>
    </section></div>}
    {openProject && <div className="modal-backdrop portfolio-view-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setOpenProject(null);
    }}><section className="modal portfolio-viewer" role="dialog" aria-modal="true" aria-labelledby="portfolio-view-title">
      <div className="modal-header"><div><div className="eyebrow">PORTFOLIO FILE</div><h2 id="portfolio-view-title">{openProject.title}</h2>
        {openProject.context && <p>{openProject.context}</p>}</div>
        <button type="button" className="icon-button" onClick={() => setOpenProject(null)} aria-label="Close"><Icon name="close" /></button></div>
      {openProject.isDemo && <div className="portfolio-demo-notice">Demo sample — edit or replace this content before sharing your portfolio.</div>}
      {openImages.length > 0 && <div className="portfolio-gallery" onTouchStart={event => { event.currentTarget.dataset.touchX = String(event.touches[0].clientX); }} onTouchEnd={event => {
        const start = Number(event.currentTarget.dataset.touchX);
        const distance = event.changedTouches[0].clientX - start;
        if (Math.abs(distance) > 45) changeImage(distance < 0 ? 1 : -1);
      }} onKeyDown={event => {
        if (event.key === 'ArrowRight') changeImage(1);
        if (event.key === 'ArrowLeft') changeImage(-1);
      }} tabIndex={openImages.length > 1 ? 0 : undefined} aria-label="Project image gallery">
        <img key={`${imageIndex}-${openImages[imageIndex]}`} className={`portfolio-view-image slide-${slideDirection}`} src={openImages[imageIndex]} alt={openImageAlts[imageIndex] || `${openProject.title}, image ${imageIndex + 1}`} />
        {openImages.length > 1 && <><button className="portfolio-gallery-arrow previous" onClick={() => changeImage(-1)} aria-label="Previous image"><Icon name="arrow" size={18} /></button>
          <button className="portfolio-gallery-arrow next" onClick={() => changeImage(1)} aria-label="Next image"><Icon name="arrow" size={18} /></button>
          <div className="portfolio-gallery-counter" aria-live="polite">{imageIndex + 1} / {openImages.length}</div></>}
      </div>}
      {openProject.description && <p className="portfolio-view-description">{openProject.description}</p>}
      {openProject.skills?.length > 0 && <div className="portfolio-skills">{openProject.skills.map(skill => <span key={skill}>{skill}</span>)}</div>}
      {openLinks.length > 0 && <div className="portfolio-project-links">{openLinks.map(link => <a key={`${link.label}-${link.url}`} className="secondary-button" href={safeProjectUrl(link.url)} target="_blank" rel="noreferrer">{link.label || 'Open project link'} <Icon name="arrow" size={14} /></a>)}</div>}
      <div className="portfolio-view-actions">
        <button className="secondary-button" onClick={() => { setOpenProject(null); onEdit(openProject); }}>Edit file</button>
        <button className="secondary-button" onClick={() => setOpenProject(null)}>Close</button></div>
    </section></div>}
  </section>;
}
