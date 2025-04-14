import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TablaSubirDocs = () => {
  const getFechaHoy = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const año = hoy.getFullYear();
    return `${año}-${mes}-${dia}`;
  };

  const [datos, setDatos] = useState([]);
  const [docs, setDocs] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(getFechaHoy());
  const [fechaFin, setFechaFin] = useState(getFechaHoy());
  const [filtros, setFiltros] = useState({ nombre: '' });
  const navigate = useNavigate();

  const fetchDatos = async () => {
    try {
      const response = await axios.get('http://172.30.189.86:5005/usuario/fecha', {
        params: { fechaInicio, fechaFin },
      });
      console.log(response.data);
      setDatos(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDocs = async (idUsuarios) => {
    try {
      const response = await axios.get('http://172.30.189.86:5005/docs/byUser', {
        params: { idUsuarios: idUsuarios.join(',') }, // Pasar los idUsuarios como un string separado por comas
      });
      console.log("docs", response.data);
      setDocs(response.data);
    } catch (error) {
      console.error('Error fetching docs data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDatos(); // Actualiza el estado de `datos`
    };
    fetchData();
  }, [fechaInicio, fechaFin]); // Se ejecuta cuando cambian las fechas
  
  useEffect(() => {
    const fetchDocsForDatos = async () => {
      if (datos.length > 0) {
        const idUsuarios = datos.map((dato) => dato.idUsuario); // Obtener todos los idUsuario
        await fetchDocs(idUsuarios); // Llamar a fetchDocs con los idUsuario actualizados
      }
    };
    fetchDocsForDatos();
  }, [datos]); // Se ejecuta cuando `datos` cambia

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
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
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
            const documentosValidos = ['ine', 'nss', 'curp', 'nacimiento', 'fiscal', 'domicilio', 'estudios', 'merged'];

            // Contar solo los documentos válidos
            const documentosSubidos = Object.keys(documentos).filter((key) => documentosValidos.includes(key)).length;

            return (
              <tr
              key={index}
              onClick={() => {
                // Verificar si solicitudInterna es falso
                if (dato.solicitudInterna) {
                  handleSubirDocs(dato.idUsuario, dato.folio.numFolio);
                }else if(!dato.solicitudInterna){
                  alert("Necesitas realizar primero la solicitud interna");
                }
              }}
              className={`cursor-pointer hover:bg-gray-50 ${!dato.solicitudInterna ? 'bg-red-100 cursor-not-allowed' : ''}`}
            >
                <td className="px-6 py-4 whitespace-nowrap">{dato.idUsuario}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dato.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dato.createdAt.split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dato.folio.numFolio}</td>
                {['ine', 'nss', 'curp', 'nacimiento', 'fiscal', 'domicilio', 'estudios', 'merged'].map((docType) => (
                  <td key={docType} className="px-6 py-4 whitespace-nowrap">
                    {documentos[docType] ? (
                      <a
                        href={`http://172.30.189.86:5005${documentos[docType].path}`}
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
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSubirDocs;