import './App.css';
import Login from './Login';
import VideosList from './VideosList';
import SubirVideos from './SubirVideos';
import LoginFolio from './LoginFolio';
import EntrevIniForm from './EntrevIni';
import TablaEntrevistas from './TablaEntrevistas';
import TablaUsuarios from './TablaUsuarios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuthStore from './authStore';

function App() {
  //Comprobacion de si está autenticado para proteger las rutas en caso de que se quieran acceder directamente desde la url
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Videos" element={isAuthenticated ? <VideosList /> : <Navigate to="/" />} />
        <Route path="/SubirVideos" element={isAuthenticated ? <SubirVideos /> : <Navigate to="/" />} />
        <Route path="/LoginFolio" element={<LoginFolio />} />
        <Route path="/EntrevIni" element={<EntrevIniForm />} />
        <Route path="/TablaEntrev" element={<TablaEntrevistas />} />
        <Route path="/TablaUsers" element={<TablaUsuarios />} />
      </Routes>
    </Router>
  );
}

export default App;