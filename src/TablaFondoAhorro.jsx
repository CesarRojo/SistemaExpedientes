import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx

const TablaFondoAhorro = () => {
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

  console.log('Fecha de inicio:', fechaInicio);
  console.log('Fecha de fin:', fechaFin);

  useEffect(() => {
    getFechaHoy();
    const fetchDatos = async () => {
      try {
        const response = await axios.get('http://172.30.189.95:5005/usuario/fecha', {
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
          const response = await axios.get('http://172.30.189.95:5005/docs/byUser', {
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

  const handleFonAhorr = async (idUsuario, nombre, apellidoPat, apellidoMat, numFolio) => {
    const documentosUsuario = docs[idUsuario] || {}; // Obtener los documentos del usuario actual

    // Definir los documentos requeridos
    const documentosRequeridos = ['ine', 'nss', 'curp', 'nacimiento', 'fiscal', 'domicilio', 'merged'];

    // Verificar si faltan documentos requeridos
    const documentosFaltantes = documentosRequeridos.filter(doc => !documentosUsuario[doc]);

    if (documentosFaltantes.length > 0) {
        // Si faltan documentos, mostrar un mensaje de alerta
        alert(`Primero debes subir tus documentos de contratacion`);
        return; // No continuar con la navegación
    }

    // Formatear el nombre como "ApellidoPat ApellidoMat, Nombres"
    const nombreCompleto = `${apellidoPat} ${apellidoMat}, ${nombre}`;
    console.log(nombreCompleto);

    try {
        // Hacer la solicitud a la API para obtener los datos del colaborador
        const response = await axios.get('http://172.30.189.95:5005/colabora/name', {
            params: { name: nombreCompleto }
        });

        const colaboraData = response.data;
        console.log("datos",colaboraData);
        console.log("datos",colaboraData[0].CB_CODIGO);

        // Aquí puedes manejar la respuesta de la API como desees
        // Por ejemplo, redirigir a la pantalla correspondiente según los documentos
        if (!documentosUsuario['fondoahorro']) {
            navigate('/FondoAhorroDiseño', { state: { idUsuario, colaboraData, numFolio, reloj: colaboraData[0].CB_CODIGO } });
        } else if (!documentosUsuario['instrumentos']) {
            navigate('/InstrumentosDiseño', { state: { idUsuario, colaboraData, numFolio, reloj: colaboraData[0].CB_CODIGO } });
        } else if (!documentosUsuario['temario']) {
            navigate('/TemarioDiseño', { state: { idUsuario, colaboraData, numFolio, reloj: colaboraData[0].CB_CODIGO } });
        } else if (!documentosUsuario['verificar']) {
            navigate('/ListaVerifDiseño', { state: { idUsuario, colaboraData, numFolio, reloj: colaboraData[0].CB_CODIGO } });
        } else if (!documentosUsuario['fonacot']) {
            navigate('/FonacotDiseño', { state: { idUsuario, colaboraData, numFolio, reloj: colaboraData[0].CB_CODIGO } });
        } else if (!documentosUsuario['ctm']) {
            navigate('/CtmDiseño', { state: { idUsuario, colaboraData, numFolio, reloj: colaboraData[0].CB_CODIGO } });
        } else if (!documentosUsuario['vale']) {
            navigate('/ValeDiseño', { state: { idUsuario, colaboraData, numFolio, reloj: colaboraData[0].CB_CODIGO } });
        } else {
            // Si todos los documentos están completos
            alert('Todos los pasos ya están completados.');
        }
    } catch (error) {
        console.error('Error fetching colabora data:', error);
        alert('Error al obtener los datos del colaborador / Este colaborador no está en el sistema TRESS.');
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
    //   FondoAhorro: dato.entrevistaInicial ? "Hecha" : "No hecha",
    }));

    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosParaExportar);
    const libroDeTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, 'FondoAhorro');

    XLSX.writeFile(libroDeTrabajo, `FondoAhorro-${fechaInicio}.xlsx`);
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

      <p className='text-sm text-center font-bold'>Selecciona un usuario para realizar su expediente interno</p>

      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead>
          <tr>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Pat</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reingreso</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Fondo Ahorro</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Instrumentos</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Temario</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Verificacion Docs</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">FONACOT</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CTM</th>
            <th className="py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vale</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datosFiltrados.map((dato, index) => (
            <tr key={index} onClick={() => handleFonAhorr(dato.idUsuario, dato.nombre, dato.apellidoPat, dato.apellidoMat, dato.folio.numFolio)} className="cursor-pointer hover:bg-gray-50">
              <td className="text-center py-4 whitespace-nowrap">{dato.idUsuario}</td>
              <td className="text-center py-4 whitespace-nowrap">{dato.nombre}</td>
              <td className="text-center py-4 whitespace-nowrap">{dato.apellidoPat}</td>
              <td className="text-center py-4 whitespace-nowrap">{dato.entrevistaInicial.numIngreso && dato.entrevistaInicial.numIngreso > 0 ? "Si" : "No"}</td>
              <td className="text-center py-4 whitespace-nowrap">{dato.entrevistaInicial.puesto}</td>
              <td className="text-center py-4 whitespace-nowrap">{dato.entrevistaInicial.turno}</td>
              <td className="text-center py-4 whitespace-nowrap">{dato.createdAt.split('T')[0]}</td>
              <td className="text-center py-4 whitespace-nowrap">{dato.folio.numFolio}</td>
              <td className="text-center px-6 py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['fondoahorro'] ? (
                  <a
                    href={`http://172.30.189.95:5005${docs[dato.idUsuario]['fondoahorro'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Detener propagación del evento
                  >
                    Ver PDF
                  </a>
                ) : (
                  <span className="text-gray-500">No disponible</span>
                )}
              </td>
              <td className="text-center py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['instrumentos'] ? (
                  <a
                    href={`http://172.30.189.95:5005${docs[dato.idUsuario]['instrumentos'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Detener propagación del evento
                  >
                    Ver PDF
                  </a>
                ) : (
                  <span className="text-gray-500">No disponible</span>
                )}
              </td>
              <td className="text-center py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['temario'] ? (
                  <a
                    href={`http://172.30.189.95:5005${docs[dato.idUsuario]['temario'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Detener propagación del evento
                  >
                    Ver PDF
                  </a>
                ) : (
                  <span className="text-gray-500">No disponible</span>
                )}
              </td>
              <td className="text-center py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['verificar'] ? (
                  <a
                    href={`http://172.30.189.95:5005${docs[dato.idUsuario]['verificar'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Detener propagación del evento
                  >
                    Ver PDF
                  </a>
                ) : (
                  <span className="text-gray-500">No disponible</span>
                )}
              </td>
              <td className="text-center py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['fonacot'] ? (
                  <a
                    href={`http://172.30.189.95:5005${docs[dato.idUsuario]['fonacot'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Detener propagación del evento
                  >
                    Ver PDF
                  </a>
                ) : (
                  <span className="text-gray-500">No disponible</span>
                )}
              </td>
              <td className="text-center py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['ctm'] ? (
                  <a
                    href={`http://172.30.189.95:5005${docs[dato.idUsuario]['ctm'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Detener propagación del evento
                  >
                    Ver PDF
                  </a>
                ) : (
                  <span className="text-gray-500">No disponible</span>
                )}
              </td>
              <td className="text-center py-4 whitespace-nowrap">
                {docs[dato.idUsuario] && docs[dato.idUsuario]['vale'] ? (
                  <a
                    href={`http://172.30.189.95:5005${docs[dato.idUsuario]['vale'].path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Detener propagación del evento
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

export default TablaFondoAhorro;