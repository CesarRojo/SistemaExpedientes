import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './authStore';

const LoginFolio = () => {
  const [folio, setFolio] = useState('');
  const navigate = useNavigate();
  const loginWithFolio = useAuthStore((state) => state.loginWithFolio);

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginWithFolio(parseInt(folio));
    if (useAuthStore.getState().isAuthenticated) {
      navigate('/home');
    } else {
      alert('Folio incorrecto');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      <h1 className="text-6xl font-bold text-center font-protest title-log mb-30">Kiroku</h1>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login con Folio</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Folio:</label>
            <input
              type="text"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-200"
          >
            Tengo cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginFolio;