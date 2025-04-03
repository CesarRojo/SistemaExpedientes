import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const TablaUsuarios = () => {
  const [datos, setDatos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [filtros, setFiltros] = useState({
      nombre: '',
    });
  const navigate = useNavigate();

  const fetchDatos = async () => {
    try {
      const response = await axios.get('http://172.30.189.99:5005/expFisica/fecha', {
        params: { fecha },
      });
      console.log(response.data);
      setDatos(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDatos();

    const socket = io('http://172.30.189.99:5005');

    // Escuchar el evento newExamMed
    socket.on('newExamMed', (data) => {
      // Actualizar el estado con el nuevo examen médico
      setDatos((prevDatos) => {
        return prevDatos.map((usuario) => {
          //Si algun idUsuario de la tabla coincide con el idUsuario que regresa el socket
          if (usuario.idUsuario === data.idUsuario) {
            // Actualizar el examen médico del usuario
            return {
              ...usuario,
              examenMedico: true, // O cualquier otra propiedad que necesites actualizar
              // Si necesitas más datos del examen médico, puedes agregarlos aquí
            };
          }
          return usuario;
        });
      });
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [fecha]);

  const handleExpFisica = (idUsuario, nombre, apellidoPat) => {
    navigate('/ExpFisica', { state: { idUsuario, nombre, apellidoPat }});
  };

  const handleExpFisicaDiseño = (idUsuario) => {
    navigate('/ExpFisicaDiseño', { state: { idUsuario }});
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const datosFiltrados = datos.filter((dato) => {
    const { nombre } = filtros;

    // Concatenar nombre completo para el filtro
    const nombreCompleto = `${dato.nombre} ${dato.apellidoPat} ${dato.apellidoMat}`.toLowerCase();

    return (
      (!nombre || nombreCompleto.includes(nombre.toLowerCase())) // Filtrar por nombre completo
    );
  });

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
          Filtrar por fecha:
        </label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Filtrar por nombre completo:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={filtros.nombre}
            onChange={handleFiltroChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Pat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Mat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} >
              <td className="px-6 py-4 whitespace-nowrap">{dato.idExpFis}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.createdAt.split('T')[0]}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button 
                  onClick={() => handleExpFisica(dato.usuario.idUsuario, dato.usuario.nombre, dato.usuario.apellidoPat)} 
                  className="cursor-pointer px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  Exp Fisica
                </button>
                <button 
                  onClick={() => handleExpFisicaDiseño(dato.usuario.idUsuario)} 
                  className="cursor-pointer px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  Diseño
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;