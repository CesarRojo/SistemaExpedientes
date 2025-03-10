import './App.css';
import Login from './Login';
import VideosList from './VideosList';
import SubirVideos from './SubirVideos';
import LoginFolio from './LoginFolio';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuthStore from './authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Videos" element={isAuthenticated ? <VideosList /> : <Navigate to="/" />} />
        <Route path="/SubirVideos" element={isAuthenticated ? <SubirVideos /> : <Navigate to="/" />} />
        <Route path="/LoginFolio" element={<LoginFolio />} />
      </Routes>
    </Router>
  );
}

export default App;