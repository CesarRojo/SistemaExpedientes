import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx

const TablaUsuarios = () => {
  const getFechaHoy = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados, así que sumamos 1
    const año = hoy.getFullYear();
    const fechaHoy = `${año}-${mes}-${dia}`; // Formato "YYYY-MM-DD"
    return fechaHoy;
  }

  const [datos, setDatos] = useState([]);
  const [docs, setDocs] = useState({});
  const [fechaInicio, setFechaInicio] = useState(getFechaHoy());
  const [fechaFin, setFechaFin] = useState(getFechaHoy());
    const [filtros, setFiltros] = useState({
        nombre: '',
        puesto: '',
        turno: '',
        folio: '',
      });
  const navigate = useNavigate();

  const fetchDatos = async () => {
    try {
      const response = await axios.get('http://172.30.189.106:5005/usuario/fecha', {
        params: { fechaInicio, fechaFin },
      });
      console.log(response.data);
      setDatos(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExportarExcel = () => {
        const datosParaExportar = datos.map((dato) => ({
          ID: dato.entrevistaInicial.idEntrevIni,
          Nombre: dato.nombre,
          ApellidoPaterno: dato.apellidoPat,
          ApellidoMaterno: dato.apellidoMat,
          Reingreso: dato.entrevistaInicial.numIngreso && dato.entrevistaInicial.numIngreso > 0 ? "Si" : "No",
          Puesto: dato.entrevistaInicial.puesto,
          Turno: dato.entrevistaInicial.turno,
          Fecha: dato.createdAt.split('T')[0],
          Folio: dato.folio.numFolio,
          ExploracionFisica: dato.exploracionFisica ? "Hecha" : "No hecha",
        }));
    
        const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar);
        const libroDeTrabajo = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'ExploracionFisica');
    
        XLSX.writeFile(libroDeTrabajo, `ExploracionesFisicas-${fecha}.xlsx`);
  };

  useEffect(() => {
    fetchDatos();

    const socket = io('http://172.30.189.106:5005');

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
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    const fetchDocs = async () => {
      const idUsuarios = datos.map(dato => dato.idUsuario); // Obtener todos los idUsuario
      if (idUsuarios.length > 0) {
        try {
          const response = await axios.get('http://172.30.189.106:5005/docs/byUser', {
            params: { idUsuarios: idUsuarios.join(',') }, // Pasar los idUsuarios como un string separado por comas
          });
          const docsData = response.data.reduce((acc, doc) => {
            if (!acc[doc.idUsuario]) {
              acc[doc.idUsuario] = {};
            }
            acc[doc.idUsuario][doc.filename.split('-')[0]] = doc; // Usar el prefijo del filename como clave
            return acc;
          }, {});
          console.log("docs", docsData);
          setDocs(docsData);
        } catch (error) {
          console.error('Error fetching docs data:', error);
        }
      }
    };

    fetchDocs();
  }, [datos]);

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
    const { nombre, puesto, turno, folio } = filtros;

    // Concatenar nombre completo para el filtro
    const nombreCompleto = `${dato.nombre} ${dato.apellidoPat} ${dato.apellidoMat}`.toLowerCase();

    return (
      (!nombre || nombreCompleto.includes(nombre.toLowerCase())) && // Filtrar por nombre completo
      (!puesto || dato.entrevistaInicial.puesto.toLowerCase().includes(puesto.toLowerCase())) &&
      (!turno || dato.entrevistaInicial.turno.toLowerCase().includes(turno.toLowerCase())) &&
      (!folio || dato.folio.numFolio.toString().includes(folio)) // Filtrar folio como número
    );
  });

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
          Filtrar por fecha:
        </label>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-sm'>Fecha inicio</label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className='text-sm'>Fecha fin</label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
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
        <div>
          <label htmlFor="puesto" className="block text-sm font-medium text-gray-700">
            Filtrar por puesto:
          </label>
          <input
            type="text"
            id="puesto"
            name="puesto"
            value={filtros.puesto}
            onChange={handleFiltroChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="turno" className="block text-sm font-medium text-gray-700">
            Filtrar por turno:
          </label>
          <input
            type="text"
            id="turno"
            name="turno"
            value={filtros.turno}
            onChange={handleFiltroChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="folio" className="block text-sm font-medium text-gray-700">
            Filtrar por folio:
          </label>
          <input
            type="text"
            id="folio"
            name="folio"
            value={filtros.folio}
            onChange={handleFiltroChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

        <div className="flex space-x-4">
          <button
            onClick={handleExportarExcel}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
          >
            Exportar a Excel
          </button>
        </div>

        <p className='text-sm text-center font-bold'>Usa el boton de Exp Fisica para realizar la exploracion fisica de ese usuario o el boton de diseño para ver el pdf</p>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Pat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Mat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reingreso</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Explor. Fisica</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} >
              <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.numIngreso && dato.entrevistaInicial.numIngreso > 0 ? "Si" : "No"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.puesto}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.turno}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.createdAt.split('T')[0]}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.folio.numFolio}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.exploracionFisica ? 'text-green-600' : 'text-red-600'}`}>{dato.exploracionFisica ? "Hecho" : "No hecho"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['exploracionfisica'] ? (
                  <a
                    href={`http://172.30.189.106:5005${docs[dato.idUsuario]['exploracionfisica'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver PDF
                  </a>
                ) : (
                  <span className="text-gray-500">No disponible</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button 
                  onClick={() => handleExpFisica(dato.idUsuario, dato.nombre, dato.apellidoPat)} 
                  className="cursor-pointer px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  Exp Fisica
                </button>
                <button 
                  onClick={() => handleExpFisicaDiseño(dato.idUsuario)} 
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