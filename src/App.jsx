import './App.css';
import Login from './Login';
import VideosList from './VideosList';
import SubirVideos from './SubirVideos';
import LoginFolio from './LoginFolio';
import EntrevIniForm from './EntrevIni';
import TablaEntrevistas from './TablaEntrevistas';
import TablaUsuarios from './TablaUsuarios';
import Home from './Home';
import Navbar from './Navbar';
import NavbarFolio from './NavbarFolio';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuthStore from './authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 
  const loginType = useAuthStore((state) => state.loginType); 
  const hasWatchedAllVideos = useAuthStore((state) => state.hasWatchedAllVideos); 

  return (
    <Router>
      {isAuthenticated && (loginType === 'normal' ? <Navbar /> : <NavbarFolio />)}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="/Videos" element={isAuthenticated ? <VideosList /> : <Navigate to="/" />} />
        <Route path="/SubirVideos" element={isAuthenticated ? (loginType === 'folio' && !hasWatchedAllVideos ? <Navigate to="/Videos" /> : <SubirVideos />) : <Navigate to="/" />} />
        <Route path="/LoginFolio" element={isAuthenticated ? <Navigate to="/home" /> : <LoginFolio />} />
        <Route path="/EntrevIni" element={isAuthenticated ? (loginType === 'folio' && !hasWatchedAllVideos ? <Navigate to="/Videos" /> : <EntrevIniForm />) : <Navigate to="/" />} />
        <Route path="/TablaEntrev" element={isAuthenticated ? (loginType === 'folio' && !hasWatchedAllVideos ? <Navigate to="/Videos" /> : <TablaEntrevistas />) : <Navigate to="/" />} />
        <Route path="/TablaUsers" element={isAuthenticated ? (loginType === 'folio' && !hasWatchedAllVideos ? <Navigate to="/Videos" /> : <TablaUsuarios />) : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;