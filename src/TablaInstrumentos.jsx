import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx

const TablaInstrumentos = () => {
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

  useEffect(() => {
    getFechaHoy();
    const fetchDatos = async () => {
      try {
        const response = await axios.get('http://192.168.1.68:5005/usuario/fecha', {
          params: { fechaInicio, fechaFin },
        });
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDatos();
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    const fetchDocs = async () => {
      const idUsuarios = datos.map(dato => dato.idUsuario); // Obtener todos los idUsuario
      if (idUsuarios.length > 0) {
        try {
          const response = await axios.get('http://192.168.1.68:5005/docs/byUser', {
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

  const handleFonAhorr = (idUsuario, nombre, apellidoPat, apellidoMat, numFolio) => {
    navigate('/InstrumentosDiseño', { state: { idUsuario, nombre, apellidoPat, apellidoMat, numFolio } });
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
    //   FondoAhorro: dato.entrevistaInicial ? "Hecha" : "No hecha",
    }));

    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar);
    const libroDeTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'ListadoInstrumentos');

    XLSX.writeFile(libroDeTrabajo, `ListadoInstrumentos-${fechaInicio}.xlsx`);
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

      <p className='text-sm text-center font-bold'>Selecciona un usuario para realizar su fondo de ahorro</p>

      <table className="min-w-full divide-y divide-gray-200 mt-4">
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
            {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrev. Inicial</th> */}
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} onClick={() => handleFonAhorr(dato.idUsuario, dato.nombre, dato.apellidoPat, dato.apellidoMat, dato.folio.numFolio)} className="cursor-pointer hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.numIngreso && dato.entrevistaInicial.numIngreso > 0 ? "Si" : "No"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.puesto}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.turno}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.createdAt.split('T')[0]}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.folio.numFolio}</td>
              {/* <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.entrevistaInicial ? 'text-green-600' : 'text-red-600'}`}>{dato.entrevistaInicial ? "Hecha" : "No hecha"}</td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['listadoinstrumentos'] ? (
                  <a
                    href={`http://192.168.1.68:5005${docs[dato.idUsuario]['listadoinstrumentos'].path}`}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInstrumentos;