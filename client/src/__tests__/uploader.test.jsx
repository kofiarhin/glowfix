import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import Uploader from '../components/Uploader/Uploader.jsx';

const showToastMock = vi.fn();
vi.mock('../hooks/useToast.js', () => ({
  __esModule: true,
  default: () => ({ showToast: showToastMock })
}));

describe('Uploader component', () => {
  beforeEach(() => {
    showToastMock.mockReset();
  });

  test('invokes onFileSelect on input change and shows success toast', async () => {
    const onFileSelect = vi.fn(() => Promise.resolve({ ok: true }));
    const registerTrigger = vi.fn();
    const { container } = render(
      <Uploader onFileSelect={onFileSelect} disabled={false} registerTrigger={registerTrigger} />
    );
    const input = container.querySelector('input');
    const file = new File(['demo'], 'demo.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file] } });
    await Promise.resolve();
    expect(onFileSelect).toHaveBeenCalledWith(file);
    expect(registerTrigger).toHaveBeenCalled();
    expect(showToastMock).toHaveBeenCalledWith('Image loaded. Adjust smoothness to taste.', 'success');
  });

  test('shows error toast on failure', async () => {
    const onFileSelect = vi.fn(() => Promise.resolve({ ok: false, message: 'bad file' }));
    const { container } = render(
      <Uploader onFileSelect={onFileSelect} disabled={false} registerTrigger={() => {}} />
    );
    const input = container.querySelector('input');
    const file = new File(['demo'], 'demo.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    await Promise.resolve();
    expect(showToastMock).toHaveBeenCalledWith('bad file', 'error');
  });

  test('applies dragging class on drag events', () => {
    const onFileSelect = vi.fn(() => Promise.resolve({ ok: true }));
    const { getByRole } = render(
      <Uploader onFileSelect={onFileSelect} disabled={false} registerTrigger={() => {}} />
    );
    const region = getByRole('region');
    fireEvent.dragOver(region, { dataTransfer: { files: [] } });
    expect(region.classList.contains('is-dragging')).toBe(true);
    fireEvent.drop(region, { dataTransfer: { files: [] } });
    expect(region.classList.contains('is-dragging')).toBe(false);
  });

  test('ignores drop when disabled', () => {
    const onFileSelect = vi.fn(() => Promise.resolve({ ok: true }));
    const { getByRole } = render(
      <Uploader onFileSelect={onFileSelect} disabled registerTrigger={() => {}} />
    );
    const region = getByRole('region');
    fireEvent.dragOver(region, { dataTransfer: { files: [] } });
    fireEvent.drop(region, { dataTransfer: { files: [new File(['x'], 'x.jpg', { type: 'image/jpeg' })] } });
    expect(onFileSelect).not.toHaveBeenCalled();
  });
});
