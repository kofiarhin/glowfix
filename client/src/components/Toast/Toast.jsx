import useToast from '../../hooks/useToast.js';
import './toast.styles.scss';

const Toast = () => {
  const { toast, clearToast } = useToast();

  if (!toast) {
    return null;
  }

  return (
    <div className={`toast-container toast-${toast.variant}`} role="status" aria-live="polite">
      <p className="toast-message">{toast.message}</p>
      <button type="button" className="toast-close" onClick={clearToast} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default Toast;
