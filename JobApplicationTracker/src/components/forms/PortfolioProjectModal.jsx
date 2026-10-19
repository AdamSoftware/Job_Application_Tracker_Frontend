import { useState } from 'react';
import { Icon } from '../shared/Ui.jsx';

const getProjectImages = project => project?.images?.length ? project.images : (project?.image ? [project.image] : []);
const getProjectImageAlts = project => project?.imageAlts || (project?.image ? [project.imageAlt || ''] : []);

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error(`Could not open ${file.name}.`));
      image.onload = () => {
        const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve({
          src: canvas.toDataURL('image/webp', 0.78),
          alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
        });
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function parseProjectLinks(value) {
  return value.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const [label, ...urlParts] = line.split('|');
    const url = (urlParts.length ? urlParts.join('|') : label).trim();
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) return null;
      return { label: urlParts.length ? label.trim() : parsed.hostname, url: parsed.href };
    } catch {
      return null;
    }
  }).filter(Boolean);
}

export function PortfolioProjectModal({ project, onClose, onSave }) {
  const [images, setImages] = useState(getProjectImages(project));
  const [imageAlts, setImageAlts] = useState(getProjectImageAlts(project));
  const [imageError, setImageError] = useState('');
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const readImages = async event => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = '';
    if (!selectedFiles.length) return;
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== selectedFiles.length) {
      setImageError('Choose image files smaller than 10 MB each. Images are resized for this browser preview.');
    } else {
      setImageError('');
    }
    if (!validFiles.length) return;
    if (images.length + validFiles.length > 12) {
      setImageError('Add up to 12 images to each project collection.');
      return;
    }
    setIsLoadingImages(true);
    try {
      const resized = await Promise.all(validFiles.map(resizeImage));
      setImages(current => [...current, ...resized.map(item => item.src)]);
      setImageAlts(current => [...current, ...resized.map(item => item.alt)]);
    } catch (error) {
      setImageError(error.message || 'One of the images could not be added.');
    } finally {
      setIsLoadingImages(false);
    }
  };

  const removeImage = index => {
    setImages(current => current.filter((_, imageIndex) => imageIndex !== index));
    setImageAlts(current => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const submit = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const links = parseProjectLinks(data.links || '');
    onSave({
      id: project?.id || Date.now(),
      title: data.title.trim(),
      context: data.context.trim(),
      description: data.description.trim(),
      links,
      url: links[0]?.url || '',
      skills: data.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      images,
      image: images[0] || '',
      imageAlts,
      imageAlt: imageAlts[0] || '',
      isDemo: false
    });
  };

  const linkValue = project?.links?.length
    ? project.links.map(link => `${link.label || link.url} | ${link.url}`).join('\n')
    : project?.url || '';

  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}><form className="modal warm-form-modal portfolio-modal" onSubmit={submit}><div className="modal-header"><div><div className="eyebrow">YOUR WORK, YOUR WAY</div>
      <h2>{project ? 'Edit project collection' : 'Add portfolio collection'}</h2><p>Bring related samples together for one role, client, or project.</p></div>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
    <div className="form-grid"><div className="application-form-section-label full-field"><span>YOUR WORK</span><small>Name the collection and add the samples you want to share.</small></div><label className="full-field">Collection name<input name="title" required maxLength="100" defaultValue={project?.title || ''} placeholder="Portrait series, mobile app, writing samples..." /></label>
      <label className="full-field">A little about this work<textarea name="description" rows="2" defaultValue={project?.description || ''} placeholder="Your contribution, approach, or result" /></label>
      <label className="full-field">Images<input type="file" accept="image/*" multiple onChange={readImages} disabled={isLoadingImages} /><small className="field-hint">Add up to 12 images. Large images are resized to help save space in this browser preview.</small></label>
      <details className="application-form-section full-field"><summary>Links, context & skills <span>{project?.context || project?.links?.length || project?.skills?.length ? 'Saved details' : 'Optional'}</span></summary><div className="portfolio-extra-fields"><label>Company or context<input name="context" defaultValue={project?.context || ''} placeholder="Client, employer, or personal project" /></label>
        <label>Skills<input name="skills" defaultValue={project?.skills?.join(', ') || ''} placeholder="Photography, React, research, writing..." /><small className="field-hint">Separate skills with commas.</small></label>
        <label className="full-field">Project links<textarea name="links" rows="2" defaultValue={linkValue} placeholder={'Live site | https://example.com\nSource code | https://github.com/you/project'} /><small className="field-hint">Add one link per line. Use “Label | URL” to give each link a name.</small></label></div></details>
      {isLoadingImages && <p className="field-hint full-field" role="status">Preparing your images…</p>}
      {images.length > 0 && <div className="portfolio-upload-grid">{images.map((image, index) => <div className="portfolio-upload-item" key={`${index}-${image.slice(0, 20)}`}>
        <img src={image} alt={imageAlts[index] || `Portfolio sample ${index + 1}`} />
        <label>Image description<input value={imageAlts[index] || ''} onChange={event => setImageAlts(current => current.map((alt, altIndex) => altIndex === index ? event.target.value : alt))} placeholder="Describe this image" /></label>
        <button type="button" className="text-button" onClick={() => removeImage(index)}>Remove image</button>
      </div>)}</div>}
      {imageError && <p className="form-error full-field" role="alert">{imageError}</p>}
    </div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
      <button className="primary-button" type="submit" disabled={isLoadingImages}>Save collection</button></div>
  </form></div>;
}
