import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GenerateFolio = () => {
  const [loading, setLoading] = useState(false);
  const [newFolio, setNewFolio] = useState(null);
  const navigate = useNavigate();

  const handleGenerateFolio = async () => {
    setLoading(true);
    try {
      // Obtener el último folio desde el endpoint
      const response = await axios.get('http://172.30.189.106:5005/folio/last');
      const lastFolio = response.data.numFolio;

      // Generar el nuevo folio
      const generatedFolio = lastFolio + 2;

      // Insertar el nuevo folio en la base de datos
      await axios.post('http://172.30.189.106:5005/folio', { numFolio: generatedFolio });

      setNewFolio(generatedFolio);
    } catch (error) {
      console.error('Error al generar el folio:', error);
      alert('Hubo un error al generar el folio. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      <h1 className="text-4xl font-bold mb-6">Generar Folio</h1>
      {newFolio ? (
        <div className="text-center">
          <p className="text-lg">Tu nuevo folio es:</p>
          <p className="text-2xl font-bold">{newFolio}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Volver al inicio
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerateFolio}
          disabled={loading}
          className={`px-4 py-2 font-bold text-white rounded-md ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring focus:ring-blue-200`}
        >
          {loading ? 'Generando...' : 'Generar Folio'}
        </button>
      )}
    </div>
  );
};

export default GenerateFolio;