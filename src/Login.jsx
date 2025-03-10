import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './authStore';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(username, password);
    if (useAuthStore.getState().isAuthenticated) {
      navigate('/Videos');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate('/SubirVideos')}
            className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-200"
          >
            Subir Videos
          </button>
          <button
            onClick={() => navigate('/Videos')}
            className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Ver Videos
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/LoginFolio')}
            className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-200"
          >
            No tengo cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;