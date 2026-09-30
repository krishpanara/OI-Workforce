'use client';
import { useEffect } from 'react';
import Image from 'next/image';

interface LightboxProps {
  src: string;
  onClose: () => void;
  open: boolean;
}

export default function Lightbox({ src, onClose, open }: LightboxProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <div
      className={`lightbox${open ? ' open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        &times;
      </button>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Enlarged screenshot"
          onClick={e => e.stopPropagation()}
        />
      )}
    </div>
  );
}
