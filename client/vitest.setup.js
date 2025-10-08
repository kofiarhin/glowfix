import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const mockCanvasContext = () => {
  return {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => new ImageData(new Uint8ClampedArray([255, 0, 0, 255]), 1, 1)),
    putImageData: vi.fn(),
    clearRect: vi.fn(),
    canvas: { width: 1, height: 1 }
  };
};

if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = () => mockCanvasContext();
}

if (!HTMLCanvasElement.prototype.toBlob) {
  HTMLCanvasElement.prototype.toBlob = (callback) => {
    callback(new Blob());
  };
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    callback();
    return 1;
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = () => {};
}

window.URL.createObjectURL = window.URL.createObjectURL || (() => 'blob:mock');
window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => {});
