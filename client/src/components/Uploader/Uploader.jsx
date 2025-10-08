import { useEffect, useRef, useState } from 'react';
import useToast from '../../hooks/useToast.js';
import './uploader.styles.scss';

const Uploader = ({ onFileSelect, disabled, registerTrigger }) => {
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (registerTrigger) {
      registerTrigger(() => {
        inputRef.current?.click();
      });
    }
  }, [registerTrigger]);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) {
      return;
    }
    onFileSelect(file).then((result) => {
      if (!result.ok) {
        showToast(result.message, 'error');
      } else {
        showToast('Image loaded. Adjust smoothness to taste.', 'success');
      }
    });
  };

  const onDrop = (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onInputChange = (event) => {
    handleFiles(event.target.files);
  };

  return (
    <div
      className={`uploader ${isDragging ? 'is-dragging' : ''}`}
      role="region"
      aria-live="polite"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="uploader-input"
        onChange={onInputChange}
        disabled={disabled}
      />
      <button type="button" className="uploader-trigger" onClick={() => inputRef.current?.click()} disabled={disabled}>
        <span className="uploader-title">Drop a portrait or browse</span>
        <span className="uploader-subtitle">JPG or PNG up to 20MB. Private in-browser processing.</span>
      </button>
    </div>
  );
};

export default Uploader;
