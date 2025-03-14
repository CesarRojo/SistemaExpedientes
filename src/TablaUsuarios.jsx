import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TablaUsuarios = () => {
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await axios.get('http://172.30.190.88:5005/usuario');
        console.log(response.data);
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

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Pat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Mat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datos.map((dato, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.telefono}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.correo}</td>
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

export default TablaUsuarios;