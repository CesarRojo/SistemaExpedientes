import './App.css';
import Login from './Login';
import VideosList from './VideosList';
import SubirVideos from './SubirVideos';
import LoginFolio from './LoginFolio';
import EntrevIniForm from './EntrevIni';
import TablaEntrevistas from './TablaEntrevistas';
import TablaExamMed from './TablaExamMed';
import TablaUsuarios from './TablaUsuarios';
import Home from './Home';
import Navbar from './Navbar';
import NavbarFolio from './NavbarFolio';
import ExamenMedico from './ExamMedico';
import ExploracionFisica from './ExpFisica';
import SolicitudInterna from './solicIntern';
import EntrevistaDiseño from './EntrevistaDiseño';
import SubirDocumentos from './SubirDocs';
import TablaSubirDocs from './TablaSubirDocs';
import GenerateFolio from './GenerateFolio';
import TablaSolicInterna from './TablaSolicInterna';
import ExamMedDiseño from './ExamMedDiseño';
import ExpFisicaDiseño from './ExpFisicaDiseño';
import SolicIntDiseño from './SolicIntDiseño';
import Consentimiento from './Consentimiento';
import TablaFondoAhorro from './TablaFondoAhorro';
import FondoAhorroDiseño from './FondoAhorroDiseño';
import TablaInstrumentos from './TablaInstrumentos';
import InstrumentosDiseño from './InstrumentosDiseño';
import TemarioDiseño from './TemarioDiseño';
import ListaVerifDiseño from './ListaVerifDiseño';
import FonacotDiseño from './FonacotDiseño';
import CtmDiseño from './CtmDiseño';
import ValeMaterialDiseño from './ValeMaterialDiseño';
import TablaContratos from './TablaContratos';
import SubirContratos from './SubirContratos';
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
        <Route path="/SubirVideos" element={isAuthenticated && loginType === 'normal' ? <SubirVideos /> : <Navigate to="/" />} />
        <Route path="/LoginFolio" element={isAuthenticated ? <Navigate to="/home" /> : <LoginFolio />} />
        <Route path="/GenFolio" element={isAuthenticated ? <Navigate to="/home" /> : <GenerateFolio />} />
        <Route path="/EntrevIni" element={isAuthenticated && loginType === 'normal' ? <EntrevIniForm /> : <Navigate to="/" />} />
        <Route path="/EntrevDiseño" element={isAuthenticated && loginType === 'normal' ? <EntrevistaDiseño /> : <Navigate to="/" />} />
        <Route path="/ExamMedDiseño" element={isAuthenticated && loginType === 'normal' ? <ExamMedDiseño /> : <Navigate to="/" />} />
        <Route path="/ExpFisicaDiseño" element={isAuthenticated && loginType === 'normal' ? <ExpFisicaDiseño /> : <Navigate to="/" />} />
        <Route path="/FondoAhorroDiseño" element={isAuthenticated && loginType === 'normal' ? <FondoAhorroDiseño /> : <Navigate to="/" />} />
        <Route path="/InstrumentosDiseño" element={isAuthenticated && loginType === 'normal' ? <InstrumentosDiseño /> : <Navigate to="/" />} />
        <Route path="/TemarioDiseño" element={isAuthenticated && loginType === 'normal' ? <TemarioDiseño /> : <Navigate to="/" />} />
        <Route path="/CtmDiseño" element={isAuthenticated && loginType === 'normal' ? <CtmDiseño /> : <Navigate to="/" />} />
        <Route path="/ValeDiseño" element={isAuthenticated && loginType === 'normal' ? <ValeMaterialDiseño /> : <Navigate to="/" />} />
        <Route path="/ListaVerifDiseño" element={isAuthenticated && loginType === 'normal' ? <ListaVerifDiseño /> : <Navigate to="/" />} />
        <Route path="/FonacotDiseño" element={isAuthenticated && loginType === 'normal' ? <FonacotDiseño /> : <Navigate to="/" />} />
        <Route path="/SolicIntDiseño" element={isAuthenticated && loginType === 'normal' ? <SolicIntDiseño /> : <Navigate to="/" />} />
        <Route path="/TablaEntrev" element={isAuthenticated && loginType === 'normal' ? <TablaEntrevistas /> : <Navigate to="/" />} />
        <Route path="/TablaExamMed" element={isAuthenticated && loginType === 'normal' ? <TablaExamMed /> : <Navigate to="/" />} />
        <Route path="/TablaExFis" element={isAuthenticated && loginType === 'normal' ?  <TablaUsuarios /> : <Navigate to="/" />} />
        <Route path="/TablaSolInt" element={isAuthenticated && loginType === 'normal' ?  <TablaSolicInterna /> : <Navigate to="/" />} />
        <Route path="/TablaFondoAhorro" element={isAuthenticated && loginType === 'normal' ?  <TablaFondoAhorro /> : <Navigate to="/" />} />
        <Route path="/TablaInstrumentos" element={isAuthenticated && loginType === 'normal' ?  <TablaInstrumentos /> : <Navigate to="/" />} />
        <Route path="/TablaSubirDocs" element={isAuthenticated && loginType === 'normal' ?  <TablaSubirDocs /> : <Navigate to="/" />} />
        <Route path="/TablaContratos" element={isAuthenticated && loginType === 'normal' ?  <TablaContratos /> : <Navigate to="/" />} />
        <Route path="/SubirContratos" element={isAuthenticated && loginType === 'normal' ?  <SubirContratos /> : <Navigate to="/" />} />
        <Route path="/SubirDocs" element={isAuthenticated && loginType === 'normal' ?  <SubirDocumentos /> : <Navigate to="/" />} />
        <Route path="/ExamMedico" element={isAuthenticated ? (loginType === 'folio' && !hasWatchedAllVideos ? <Navigate to="/Videos" /> : <ExamenMedico />) : <Navigate to="/" />} />
        <Route path="/ExpFisica" element={isAuthenticated && loginType === 'normal' ? <ExploracionFisica /> : <Navigate to="/" />} />
        <Route path="/SolicInt" element={isAuthenticated ? (loginType === 'folio' && !hasWatchedAllVideos ? <Navigate to="/Videos" /> : <SolicitudInterna />) : <Navigate to="/" />} />
        <Route path="/Consent" element={isAuthenticated ? (loginType === 'folio' && !hasWatchedAllVideos ? <Navigate to="/Videos" /> : <Consentimiento />) : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;