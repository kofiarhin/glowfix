import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import EditorPage from './pages/Editor/Editor.jsx';
import About from './pages/About/About.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
