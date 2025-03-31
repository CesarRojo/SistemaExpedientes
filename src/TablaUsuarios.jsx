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
      const response = await axios.get('http://172.30.189.99:5005/usuario');
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
  }, []);

  const handleExpFisica = (idUsuario, nombre, apellidoPat) => {
    navigate('/ExpFisica', { state: { idUsuario, nombre, apellidoPat }});
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
            {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrevista Inicial</th> */}
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examen Medico</th>
            {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exploracion Fisica</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitud Interna</th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} onClick={() => handleExpFisica(dato.idUsuario, dato.nombre, dato.apellidoPat)} className="cursor-pointer hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.fecha.split('T')[0]}</td>
              {/* <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.entrevistaInicial ? 'text-green-600' : 'text-red-600'}`}>{dato.entrevistaInicial ? "Hecha" : "No hecha"}</td> */}
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.examenMedico ? 'text-green-600' : 'text-red-600'}`}>{dato.examenMedico ? "Hecho" : "No hecho"}</td>
              {/* <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.exploracionFisica ? 'text-green-600' : 'text-red-600'}`}>{dato.exploracionFisica ? "Hecha" : "No hecha"}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.solicitudInterna ? 'text-green-600' : 'text-red-600'}`}>{dato.solicitudInterna ? "Hecha" : "No hecha"}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;