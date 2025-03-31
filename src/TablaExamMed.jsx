import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx

const TablaExamMed = () => {
  const [datos, setDatos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
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
        const response = await axios.get('http://172.30.189.99:5005/examMedico/fecha', {
          params: { fecha },
        });
        console.log(response.data);
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDatos();
  }, [fecha]);


  const handleEntrevPdf = (idUsuario) => {
    navigate('/EntrevDiseño', { state: { idUsuario } });
  };

  const handleExportarExcel = () => {
    const datosParaExportar = datos.map((dato) => ({
      ID: dato.idExamMed,
      Nombre: dato.usuario.nombre,
      ApellidoPaterno: dato.usuario.apellidoPat,
      ApellidoMaterno: dato.usuario.apellidoMat,
      drogas: dato.drogas ? dato.drogas : "Ninguna",
      observaciones: dato.observaciones ? dato.observaciones : "Ninguna",
      Fecha: dato.fecha.split('T')[0],
    //   Folio: dato.usuario.folio.numFolio,
    }));

    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar);
    const libroDeTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'Entrevistas');

    XLSX.writeFile(libroDeTrabajo, `ExamenMedico-${fecha}.xlsx`);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const datosFiltrados = datos.filter((dato) => {
    const { nombre, drogas, observaciones } = filtros;

    // Concatenar nombre completo para el filtro
    const nombreCompleto = `${dato.usuario.nombre} ${dato.usuario.apellidoPat} ${dato.usuario.apellidoMat}`.toLowerCase();

    return (
      (!nombre || nombreCompleto.includes(nombre.toLowerCase())) && // Filtrar por nombre completo
      (!drogas || dato.puesto.toLowerCase().includes(drogas.toLowerCase())) &&
      (!observaciones || dato.turno.toLowerCase().includes(observaciones.toLowerCase()))
    //   (!folio || dato.usuario.folio.numFolio.toString().includes(folio)) // Filtrar folio como número
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

      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Pat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Mat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drogas</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} onClick={() => handleEntrevPdf(dato.usuario.idUsuario)} className="cursor-pointer hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{dato.idExamMed}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.apellidoPat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.apellidoMat}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.drogas ? dato.drogas : "Ninguna"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.observaciones ? dato.observaciones : "Ninguna"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.fecha.split('T')[0]}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.folio.numFolio}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaExamMed;