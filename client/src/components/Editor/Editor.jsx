import { useCallback, useState } from 'react';
import useImageSmoothing from '../../hooks/useImageSmoothing.js';
import useToast from '../../hooks/useToast.js';
import SliderControl from '../SliderControl/SliderControl.jsx';
import Button from '../Button/Button.jsx';
import Uploader from '../Uploader/Uploader.jsx';
import './editor.styles.scss';

const Editor = () => {
  const { state, loadImage, scheduleProcessing, resetImage, downloadImage } = useImageSmoothing();
  const { showToast } = useToast();
  const [triggerUpload, setTriggerUpload] = useState(null);

  const handleDownload = useCallback(() => {
    if (!state.hasImage) {
      showToast('Upload an image before downloading.', 'error');
      return;
    }
    downloadImage(state.smoothingLevel)
      .then(() => showToast('Download started.', 'success'))
      .catch(() => showToast('Unable to download image.', 'error'));
  }, [downloadImage, showToast, state.hasImage, state.smoothingLevel]);

  const handleReset = useCallback(() => {
    resetImage();
    showToast('Original image restored.', 'success');
  }, [resetImage, showToast]);

  const handleNewImage = useCallback(() => {
    if (triggerUpload) {
      triggerUpload();
    }
  }, [triggerUpload]);

  const handleSliderChange = useCallback((value) => {
    scheduleProcessing(value);
  }, [scheduleProcessing]);

  const registerTrigger = useCallback((handler) => {
    setTriggerUpload(() => handler);
  }, []);

  return (
    <section className="editor" aria-live={state.isProcessing ? 'polite' : 'off'} aria-busy={state.isProcessing}>
      <div className="editor-canvas-area">
        {state.hasImage ? (
          <canvas ref={state.canvasRef} className="editor-canvas" />
        ) : (
          <Uploader onFileSelect={loadImage} disabled={false} registerTrigger={registerTrigger} />
        )}
      </div>
      <aside className="editor-panel">
        <div className="panel-group">
          <h2 className="panel-title">Smoothing Controls</h2>
          <SliderControl
            value={state.smoothingLevel}
            min={0}
            max={10}
            step={1}
            onChange={handleSliderChange}
            disabled={!state.hasImage || state.isProcessing}
          />
        </div>
        <div className="panel-actions">
          <Button variant="primary" type="button" onClick={handleDownload} disabled={!state.hasImage || state.isProcessing}>
            Download JPEG
          </Button>
          <Button variant="outline" type="button" onClick={handleReset} disabled={!state.hasImage}>
            Reset
          </Button>
          <Button variant="outline" type="button" onClick={handleNewImage} disabled={!triggerUpload}>
            New Image
          </Button>
        </div>
        {!state.hasImage && (
          <p className="panel-hint">All edits happen in your browser. No uploads leave your device.</p>
        )}
      </aside>
      {state.hasImage && (
        <Uploader onFileSelect={loadImage} disabled={state.isProcessing} registerTrigger={registerTrigger} />
      )}
    </section>
  );
};

export default Editor;
