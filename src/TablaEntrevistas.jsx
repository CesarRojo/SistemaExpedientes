import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TablaEntrevistas = () => {
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await axios.get('http://172.30.189.87:5005/entrevIni');
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDatos();
  }, []);

  const handleNuevaEntrada = () => {
    navigate('/entrevIni');
  };

  const handleEntrevPdf = (idUsuario) => {
    navigate('/EntrevDiseño', { state: { idUsuario }});
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Pat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Mat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datos.map((dato, index) => (
            <tr key={index} onClick={() => handleEntrevPdf(dato.idUsuario)} className="cursor-pointer hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{dato.idEntrevIni}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.puesto}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.turno}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.fecha}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.folio.numFolio}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleNuevaEntrada}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      >
        Nueva Entrada
      </button>
    </div>
  );
};

export default TablaEntrevistas;