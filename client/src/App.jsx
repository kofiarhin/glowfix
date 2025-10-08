import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Toast from './components/Toast/Toast.jsx';
import AppRoutes from './router.jsx';
import { ToastProvider } from './hooks/useToast.js';

const App = () => {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <AppRoutes />
        </main>
        <Footer />
        <Toast />
      </div>
    </ToastProvider>
  );
};

export default App;
