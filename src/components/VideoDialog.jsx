import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useDialog } from '../lib/useDialog.js';
export function VideoDialog({
  video,
  onClose
}) {
  const ref = useRef(null);
  useDialog(ref, onClose);
  return createPortal(<div className="lightbox" onMouseDown={e => {
    if (e.target === e.currentTarget) onClose();
  }}><section className="film-dialog" ref={ref} role="dialog" aria-modal="true" aria-label={video.title}><header><span>{video.title}</span><button type="button" onClick={onClose} aria-label="Закрыть видео"><X /></button></header><iframe src={video.embedUrl} title={video.title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen /><a className="text-link" href={video.embedUrl} target="_blank" rel="noopener noreferrer">Открыть видео в отдельном окне ↗</a></section></div>, document.body);
}
