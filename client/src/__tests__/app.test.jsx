import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import App from '../App.jsx';
import Button from '../components/Button/Button.jsx';
import useToast, { ToastProvider } from '../hooks/useToast.js';

const renderWithProviders = (initialEntries = ['/']) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('App shell', () => {
  test('renders navigation and hero copy', async () => {
    renderWithProviders();
    expect(await screen.findByText('glowfix')).toBeInTheDocument();
    expect(await screen.findByText('Instant portrait perfection.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Editor' })).toBeInTheDocument();
  });

  test('navigates to about page', async () => {
    renderWithProviders();
    fireEvent.click(await screen.findByRole('link', { name: 'About' }));
    expect(await screen.findByText('Privacy first')).toBeInTheDocument();
  });

  test('button renders anchor when to is provided', () => {
    render(
      <MemoryRouter>
        <Button to="/editor">Go</Button>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/editor');
  });
});

describe('Toast provider', () => {
  const ToastHarness = () => {
    const { showToast, clearToast, toast } = useToast();
    return (
      <div>
        <button type="button" onClick={() => showToast('Saved', 'success')}>
          Show
        </button>
        <button type="button" onClick={() => showToast('', 'info')}>
          Skip
        </button>
        <button type="button" onClick={clearToast}>
          Clear
        </button>
        {toast && <span data-testid="toast-message">{toast.message}</span>}
      </div>
    );
  };

  test('shows and clears toast messages', () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('Skip'));
    expect(screen.queryByTestId('toast-message')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByTestId('toast-message').textContent).toBe('Saved');
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.queryByTestId('toast-message')).not.toBeInTheDocument();
  });
});
