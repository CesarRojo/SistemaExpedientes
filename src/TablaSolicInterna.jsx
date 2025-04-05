import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx

const TablaSolicInterna = () => {
  const getFechaHoy = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados, así que sumamos 1
    const año = hoy.getFullYear();
    const fechaHoy = `${año}-${mes}-${dia}`; // Formato "YYYY-MM-DD"
    return fechaHoy;
  }

  const [datos, setDatos] = useState([]);
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
    const fetchDatos = async () => {
      try {
        const response = await axios.get('http://172.30.189.106:5005/usuario/fecha', {
          params: { fechaInicio, fechaFin },
        });
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDatos();
  }, [fechaInicio, fechaFin]);

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
          SolicitudInterna: dato.solicitudInterna ? "Hecha" : "No hecha",
        }));
    
        const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar);
        const libroDeTrabajo = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'SolicitudInterna');
    
        XLSX.writeFile(libroDeTrabajo, `SolicitudesInternas-${fecha}.xlsx`);
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

  const handleSolicIntPdf = (idUsuario) => {
    navigate('/SolicIntDiseño', { state: { idUsuario } });
  };

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

      <p className='text-sm text-center font-bold'>Selecciona un usuario para VER su solicitud interna (Recuerda que el entrevistado es quien lo realiza)</p>

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
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solic. Interna</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} onClick={() => handleSolicIntPdf(dato.idUsuario)} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.numIngreso && dato.entrevistaInicial.numIngreso > 0 ? "Si" : "No"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.puesto}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.turno}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.createdAt.split('T')[0]}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.folio.numFolio}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${dato.solicitudInterna ? 'text-green-600' : 'text-red-600'}`}>{dato.solicitudInterna ? "Hecho" : "No hecho"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicInterna;