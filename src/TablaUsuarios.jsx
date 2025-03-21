import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const TablaUsuarios = () => {
  const [datos, setDatos] = useState([]);
  const navigate = useNavigate();

  const fetchDatos = async () => {
    try {
      const response = await axios.get('http://172.30.189.93:5005/usuario');
      console.log(response.data);
      setDatos(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDatos();

    const socket = io('http://172.30.189.93:5005');

    // Escuchar el evento newEntrevIni
    socket.on('newExamMed', (data) => {
      console.log('Nuevo evento de examen medico:', data);
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleExpFisica = (idUsuario, nombre, apellidoPat) => {
    navigate('/ExpFisica', { state: { idUsuario, nombre, apellidoPat }});
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
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrevista Inicial</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examen Medico</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exploracion Fisica</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitud Interna</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datos.map((dato, index) => (
            <tr key={index} onClick={() => handleExpFisica(dato.idUsuario, dato.nombre, dato.apellidoPat)} className="cursor-pointer hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.fecha}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.entrevistaInicial ? 'text-green-600' : 'text-red-600'}`}>{dato.entrevistaInicial ? "Hecha" : "No hecha"}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.examenMedico ? 'text-green-600' : 'text-red-600'}`}>{dato.examenMedico ? "Hecho" : "No hecho"}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.exploracionFisica ? 'text-green-600' : 'text-red-600'}`}>{dato.exploracionFisica ? "Hecha" : "No hecha"}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.solicitudInterna ? 'text-green-600' : 'text-red-600'}`}>{dato.solicitudInterna ? "Hecha" : "No hecha"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;