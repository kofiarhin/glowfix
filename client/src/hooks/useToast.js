import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ toast: null, showToast: () => {}, clearToast: () => {} });

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = React.useRef();

  const clearToast = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = undefined;
    setToast(null);
  }, []);

  const showToast = useCallback((message, variant = 'info') => {
    if (!message) {
      return;
    }
    clearToast();
    setToast({ message, variant });
    timeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 4000);
  }, [clearToast]);

  const value = useMemo(() => ({ toast, showToast, clearToast }), [toast, showToast, clearToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  return useContext(ToastContext);
};

export { ToastProvider };
export default useToast;
