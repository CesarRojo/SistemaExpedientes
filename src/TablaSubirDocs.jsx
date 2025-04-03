import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TablaSubirDocs = () => {
  const [datos, setDatos] = useState([]);
  const [docs, setDocs] = useState([]);
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
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDocs = async () => {
    try {
      const response = await axios.get('http://172.30.189.99:5005/docs');
      setDocs(response.data);
    } catch (error) {
      console.error('Error fetching docs data:', error);
    }
  };

  useEffect(() => {
    fetchDatos();
    fetchDocs();
  }, []);

  const handleSubirDocs = (idUsuario, numFolio) => {
    navigate('/SubirDocs', { state: { idUsuario, numFolio } });
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const datosFiltrados = datos.filter((dato) => {
    const { nombre } = filtros;
    const nombreCompleto = `${dato.nombre} ${dato.apellidoPat} ${dato.apellidoMat}`.toLowerCase();
    return (!nombre || nombreCompleto.includes(nombre.toLowerCase()));
  });

  // Agrupar documentos por idUsuario
  const documentosPorUsuario = docs.reduce((acc, doc) => {
    if (!acc[doc.idUsuario]) {
      acc[doc.idUsuario] = {};
    }
    acc[doc.idUsuario][doc.filename.split('-')[0]] = doc; // Usar el prefijo del filename como clave
    return acc;
  }, {});

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
            {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Pat</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Mat</th> */}
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INE</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NSS</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURP</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acta Nacimiento</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Constancia Sit Fiscal</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprob Domicilio</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprob Estudios</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combinado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => {
            const documentos = documentosPorUsuario[dato.idUsuario] || {};
            return (
              <tr
                key={index}
                onClick={() => Object.keys(documentos).length === 0 && handleSubirDocs(dato.idUsuario, dato.folio.numFolio)}
                className={`cursor-pointer hover:bg-gray-50 ${Object.keys(documentos).length > 0 ? 'bg-green-100 cursor-not-allowed' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoPat}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dato.apellidoMat}</td> */}
                <td className="px-6 py-4 whitespace-nowrap">{dato.entrevistaInicial.fecha.split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dato.folio.numFolio}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.ine ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.ine.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">No subido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.nss ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.nss.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">No subido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.curp ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.curp.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">No subido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.nacimiento ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.nacimiento.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray- 500">No subido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.fiscal ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.fiscal.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">No subido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.domicilio ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.domicilio.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">No subido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.estudios ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.estudios.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">No subido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {documentos.merged ? (
                    <a
                      href={`http://172.30.189.99:5005${documentos.merged.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    <span className="text-gray-500">No subido</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSubirDocs;