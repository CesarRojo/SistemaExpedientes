import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginFolio = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login Folio</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Folio:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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