import { useCallback, useMemo, useRef, useState } from 'react';
import { applyStackBlur } from '../utils/stackBlur.js';

const DEFAULT_LEVEL = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const SUPPORTED_TYPES = ['image/jpeg', 'image/png'];
const MAX_RENDER_EDGE = 1600;

const useImageSmoothing = () => {
  const canvasRef = useRef(null);
  const originalDataRef = useRef(null);
  const rafRef = useRef(null);
  const [state, setState] = useState({
    smoothingLevel: DEFAULT_LEVEL,
    isProcessing: false,
    hasImage: false,
    imageName: '',
    error: null
  });

  const cancelFrame = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const drawBitmap = useCallback((bitmap) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context unavailable');
    }
    const maxEdge = Math.max(bitmap.width, bitmap.height);
    const scale = maxEdge > MAX_RENDER_EDGE ? MAX_RENDER_EDGE / maxEdge : 1;
    const targetWidth = Math.round(bitmap.width * scale);
    const targetHeight = Math.round(bitmap.height * scale);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    originalDataRef.current = context.getImageData(0, 0, targetWidth, targetHeight);
  }, []);

  const processLevel = useCallback((level) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context unavailable');
    }
    const imageData = originalDataRef.current;
    if (!imageData) {
      return;
    }
    const effectiveLevel = Math.max(0, Math.min(10, level));
    if (effectiveLevel === 0) {
      context.putImageData(imageData, 0, 0);
      setState((current) => ({ ...current, smoothingLevel: effectiveLevel, isProcessing: false }));
      return;
    }
    const blurred = applyStackBlur(imageData, effectiveLevel * 2);
    context.putImageData(blurred, 0, 0);
    setState((current) => ({ ...current, smoothingLevel: effectiveLevel, isProcessing: false }));
  }, []);

  const scheduleProcessing = useCallback((level) => {
    cancelFrame();
    setState((current) => ({ ...current, smoothingLevel: level, isProcessing: true }));
    rafRef.current = window.requestAnimationFrame(() => {
      processLevel(level);
    });
  }, [cancelFrame, processLevel]);

  const loadImage = useCallback(async (file) => {
    if (!file) {
      return { ok: false, message: 'No file provided' };
    }
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return { ok: false, message: 'Only JPG or PNG files are supported.' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false, message: 'File exceeds 20MB limit.' };
    }
    try {
      let bitmap;
      if (window.createImageBitmap) {
        bitmap = await window.createImageBitmap(file, { imageOrientation: 'from-image' });
      } else {
        bitmap = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = URL.createObjectURL(file);
        });
      }
      drawBitmap(bitmap);
      scheduleProcessing(DEFAULT_LEVEL);
      setState((current) => ({
        ...current,
        hasImage: true,
        imageName: file.name,
        error: null
      }));
      return { ok: true };
    } catch (error) {
      setState((current) => ({ ...current, error: 'Unable to load image.' }));
      return { ok: false, message: 'Unable to load image.' };
    }
  }, [drawBitmap, scheduleProcessing]);

  const resetImage = useCallback(() => {
    cancelFrame();
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context unavailable');
    }
    const imageData = originalDataRef.current;
    if (!imageData) {
      return;
    }
    context.putImageData(imageData, 0, 0);
    setState((current) => ({ ...current, smoothingLevel: 0, isProcessing: false }));
  }, [cancelFrame]);

  const downloadImage = useCallback((level) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return Promise.reject(new Error('Canvas unavailable'));
    }
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Unable to export image'));
          return;
        }
        const link = document.createElement('a');
        const filename = `glowfix-smooth-${level}.jpg`;
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        resolve({ ok: true });
      }, 'image/jpeg', 0.9);
    });
  }, []);

  const stateSummary = useMemo(() => ({
    ...state,
    canvasRef,
    smoothingLevel: state.smoothingLevel,
    defaultLevel: DEFAULT_LEVEL
  }), [state]);

  return {
    state: stateSummary,
    loadImage,
    scheduleProcessing,
    resetImage,
    downloadImage
  };
};

export default useImageSmoothing;
