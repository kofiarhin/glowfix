import { act, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import useImageSmoothing from '../hooks/useImageSmoothing.js';

const createContextMock = () => {
  const data = new ImageData(new Uint8ClampedArray([
    255, 0, 0, 255,
    0, 0, 0, 255,
    255, 0, 0, 255,
    0, 0, 0, 255
  ]), 2, 2);
  return {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => data),
    putImageData: vi.fn(),
    clearRect: vi.fn(),
    canvas: { width: 0, height: 0 }
  };
};

const HookHarness = ({ onReady }) => {
  const api = useImageSmoothing();
  React.useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return <canvas ref={api.state.canvasRef} data-testid="test-canvas" />;
};

describe('useImageSmoothing', () => {
  let originalGetContext;
  let context;

  beforeEach(() => {
    context = createContextMock();
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => context);
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    window.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  test('rejects unsupported file types', async () => {
    let api;
    render(<HookHarness onReady={(value) => { api = value; }} />);
    const file = new File(['demo'], 'demo.gif', { type: 'image/gif' });
    const result = await api.loadImage(file);
    expect(result.ok).toBe(false);
    expect(result.message).toContain('Only JPG or PNG files');
  });

  test('rejects files over 20MB', async () => {
    let api;
    render(<HookHarness onReady={(value) => { api = value; }} />);
    const bigBlob = new Blob([new Uint8Array(21 * 1024 * 1024)]);
    const file = new File([bigBlob], 'big.jpg', { type: 'image/jpeg' });
    const result = await api.loadImage(file);
    expect(result.ok).toBe(false);
    expect(result.message).toContain('20MB');
  });

  test('loads image and applies smoothing', async () => {
    let api;
    render(<HookHarness onReady={(value) => { api = value; }} />);
    window.createImageBitmap = vi.fn(async () => ({ width: 4, height: 4 }));
    const file = new File([new Uint8Array([1, 2, 3])], 'photo.jpg', { type: 'image/jpeg' });
    await act(async () => {
      const result = await api.loadImage(file);
      expect(result.ok).toBe(true);
    });
    expect(api.state.hasImage).toBe(true);
    expect(context.drawImage).toHaveBeenCalled();
    await act(async () => {
      api.scheduleProcessing(0);
    });
    expect(context.putImageData).toHaveBeenCalled();
    await act(async () => {
      await api.downloadImage(api.state.smoothingLevel);
    });
    await act(() => {
      api.resetImage();
    });
    expect(api.state.smoothingLevel).toBe(0);
  });

  test('handles image load failure', async () => {
    let api;
    render(<HookHarness onReady={(value) => { api = value; }} />);
    window.createImageBitmap = vi.fn(() => Promise.reject(new Error('fail')));
    const file = new File([new Uint8Array([1])], 'broken.jpg', { type: 'image/jpeg' });
    const result = await api.loadImage(file);
    expect(result.ok).toBe(false);
    expect(api.state.error).toBe('Unable to load image.');
  });

  test('falls back to Image element when createImageBitmap is unavailable', async () => {
    const originalCreateImageBitmap = window.createImageBitmap;
    const originalImage = window.Image;
    let api;
    render(<HookHarness onReady={(value) => { api = value; }} />);
    window.createImageBitmap = undefined;
    window.Image = class {
      constructor() {
        this.onload = null;
        this.onerror = null;
      }

      set src(value) {
        if (value && this.onload) {
          this.onload();
        }
      }
    };
    const file = new File([new Uint8Array([1, 2])], 'fallback.png', { type: 'image/png' });
    await act(async () => {
      const result = await api.loadImage(file);
      expect(result.ok).toBe(true);
    });
    window.createImageBitmap = originalCreateImageBitmap;
    window.Image = originalImage;
    expect(api.state.hasImage).toBe(true);
  });

  test('rejects download when canvas is missing', async () => {
    let api;
    render(<HookHarness onReady={(value) => { api = value; }} />);
    api.state.canvasRef.current = null;
    await expect(api.downloadImage(5)).rejects.toThrow('Canvas unavailable');
  });
});
