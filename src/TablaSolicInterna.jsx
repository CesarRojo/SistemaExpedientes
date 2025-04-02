import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TablaSolicInterna = () => {
  const [datos, setDatos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [filtros, setFiltros] = useState({
    RFC: '',
    CURP: '',
    NSS: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await axios.get('http://192.168.1.68:5005/solicInt/fecha', {
          params: { fecha },
        });
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDatos();
  }, [fecha]);

  const handleExportarExcel = () => {
    const datosParaExportar = datos.map((dato) => ({
      ID: dato.idSolInt,
      Fecha: dato.fecha.split('T')[0],
      RFC: dato.RFC,
      CURP: dato.CURP,
      NSS: dato.NSS,
    }));

    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar);
    const libroDeTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'Solicitudes');

    XLSX.writeFile(libroDeTrabajo, `Solicitudes-${fecha}.xlsx`);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const datosFiltrados = datos.filter((dato) => {
    const { RFC, CURP, NSS } = filtros;

    return (
      (!RFC || dato.RFC.toLowerCase().includes(RFC.toLowerCase())) &&
      (!CURP || dato.CURP.toLowerCase().includes(CURP.toLowerCase())) &&
      (!NSS || dato.NSS.toString().includes(NSS))
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

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="RFC" className="block text-sm font-medium text-gray-700">
            Filtrar por RFC:
          </label>
          <input
            type="text"
            id="RFC"
            name="RFC"
            value={filtros.RFC}
            onChange={handleFiltroChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="CURP" className="block text-sm font-medium text-gray-700">
            Filtrar por CURP:
          </label>
          <input
            type="text"
            id="CURP"
            name="CURP"
            value={filtros.CURP}
            onChange={handleFiltroChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="NSS" className="block text-sm font-medium text-gray-700">
            Filtrar por NSS:
          </label>
          <input
            type="text"
            id="NSS"
            name="NSS"
            value={filtros.NSS}
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
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFC</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURP</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NSS</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{dato.idSolInt}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.fecha.split('T')[0]}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.RFC}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.CURP}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.NSS}</td>
              <td className="px-6 py-4 whitespace-nowrap">{dato.usuario.folio.numFolio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicInterna;