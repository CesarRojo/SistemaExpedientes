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
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuthStore from './authStore';

function App() {
  //Comprobacion de si está autenticado para proteger las rutas en caso de que se quieran acceder directamente desde la url
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 

  return (
    <Router>
      {isAuthenticated && <Navbar />} {/* Renderiza el Navbar solo si está autenticado */}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="/Videos" element={isAuthenticated ? <VideosList /> : <Navigate to="/" />} />
        <Route path="/SubirVideos" element={isAuthenticated ? <SubirVideos /> : <Navigate to="/" />} />
        <Route path="/LoginFolio" element={isAuthenticated ? <Navigate to="/home" /> : <LoginFolio />} />
        <Route path="/EntrevIni" element={isAuthenticated ? <EntrevIniForm /> : <Navigate to="/" />} />
        <Route path="/TablaEntrev" element={isAuthenticated ? <TablaEntrevistas /> : <Navigate to="/" />} />
        <Route path="/TablaUsers" element={isAuthenticated ? <TablaUsuarios /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;