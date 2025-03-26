import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from './authStore';
// import { io } from 'socket.io-client';

const ExamenMedico = () => {
  const [formData, setFormData] = useState({
    planta: '',
    fecha: '',
    fechaNac: '',
    alcoholismo: null,
    frecuenciaAlcoholismo: '',
    deporte: null,
    frecuenciaDeporte: '',
    tabaquismo: null,
    frecuenciaTabaquismo: '',
    drogas: null,
    frecuenciaDrogas: '',
    cualDroga: '',
    observaciones: '',
    fechaUltMens: '', 
    metPlanFam: '',   
    numEmb: '',       
    partos: '',       
    cesareas: '',     
    abortos: '',      
    otraEnferm: '',
    antecFam: [{ parentesco: '', edad: '', enfermedad: '', causaMuerte: '' }],
    selecAntecPatolog: [],
  });
  
  const user = useAuthStore((state) => state.user);
  const idFolio = user?.idFolio;

  const [antecedentesPatologicos, setAntecedentesPatologicos] = useState([]);
  const [entrevistaInicial, setEntrevistaInicial] = useState(null);
  const [examMed, setExamMed] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configurar Socket.IO
  // useEffect(() => {
  //   const socket = io('http://172.30.189.87:5005'); // Asegúrate de que la URL sea correcta

  //   // Escuchar el evento newEntrevIni
  //   socket.on('newEntrevIni', (data) => {
  //     console.log('Nuevo evento de entrevista inicial:', data);
  //     //No serviría de mucho usar un socket aqui, ya que la emisión del back se envia a todos los usuarios y por tanto si hay 2 o más
  //     //personas haciendo el examen medico se les actualizaría el componente a todos. (Comprobado)
  //   });

  //   // Limpiar la conexión al desmontar el componente
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const fetchAntecedentesPatologicos = async () => {
    try {
      const response = await axios.get('http://172.30.189.87:5005/antecPatolog');
      setAntecedentesPatologicos(response.data);
    } catch (error) {
      console.error('Error al obtener antecedentes patológicos:', error);
    }
  };

  const fetchUsuarioFolio = async () => {
    try {
      const response = await axios.get(`http://172.30.189.87:5005/usuario/folio/${idFolio}`);
      console.log(response.data.entrevistaInicial);
      setUsuario(response.data);
      setEntrevistaInicial(response.data.entrevistaInicial);
      setExamMed(response.data.examenMedico);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAntecedentesPatologicos();
    if (idFolio) {
      fetchUsuarioFolio();
    }
  }, [idFolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAntecFamChange = (index, e) => {
    const { name, value } = e.target;
    const newAntecFam = [...formData.antecFam];

    if (name === 'edad') {
        newAntecFam[index][name] = parseInt(value, 10);
    } else {
        newAntecFam[index][name] = value;
    }

    setFormData((prev) => ({ ...prev, antecFam: newAntecFam }));
  };

  const addAntecFam = () => {
    setFormData((prev) => ({
      ...prev,
      antecFam: [...prev.antecFam, { parentesco: '', edad: '', enfermedad: '', causaMuerte: '' }],
    }));
  };

  const handleCheckboxChange = (id) => {
    setFormData((prev) => {
      const isSelected = prev.selecAntecPatolog.includes(id);
      if (isSelected) {
        return {
          ...prev,
          selecAntecPatolog: prev.selecAntecPatolog.filter((item) => item !== id),
        };
      } else {
        return {
          ...prev,
          selecAntecPatolog: [...prev.selecAntecPatolog, id],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://172.30.189.87:5005/examMedico', {
                examMedicoData: {
                    planta: formData.planta,
                    fecha: new Date(formData.fecha),
                    alcoholismo: formData.alcoholismo === 'si' ? formData.frecuenciaAlcoholismo : null,
                    deporte: formData.deporte === 'si' ? formData.frecuenciaDeporte : null,
                    tabaquismo: formData.tabaquismo === 'si' ? formData.frecuenciaTabaquismo : null,
                    drogas: formData.drogas === 'si' ? `${formData.cualDroga}, ${formData.frecuenciaDrogas}` : null,
                    observaciones: formData.observaciones.trim() ? formData.observaciones : null,
                    fechaUltMens: new Date(formData.fechaUltMens),
                    metPlanFam: formData.metPlanFam.trim() ? formData.metPlanFam : null,
                    numEmb: formData.numEmb ? parseInt(formData.numEmb) : null,
                    partos: formData.partos ? parseInt(formData.partos) : null,
                    cesareas: formData.cesareas ? parseInt(formData.cesareas) : null,
                    abortos: formData.abortos ? parseInt(formData.abortos) : null,
                    otraEnferm: formData.otraEnferm.trim() ? formData.otraEnferm : null,
                    idUsuario: usuario.idUsuario,
                },
                antecFam: formData.antecFam,
                selecAntecPatolog: formData.selecAntecPatolog,
            });
            console.log('Examen Médico creado:', response.data);
        } catch (error) {
            console.error('Error al crear Examen Médico:', error);
        }
    };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (!entrevistaInicial) {
    return <div className="text-center">Por favor, completa la entrevista inicial antes de continuar con este paso.</div>;
  }

  if (examMed) {
    return <div className="text-center">Ya realizaste el examen médico.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Examen Médico</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Planta: <span className="text-red-500">*</span></label>
        <input type="text" name="planta" placeholder="Planta" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fecha: <span className="text-red-500">*</span></label>
        <input type="date" name="fecha" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>
      
      {/* Campos de usuario (solo lectura) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nombre:</label>
        <input type="text" value={usuario?.nombre || ''} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Apellido Paterno:</label>
        <input type="text" value={usuario?.apellidoPat || ''} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Apellido Materno:</label>
        <input type="text" value={usuario?.apellidoMat || ''} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Estado Civil:</label>
        <input type="text" value={usuario?.estado_civil || ''} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento:</label>
        <input type="date" name="fechaNac" value={usuario.fechaNac.split('T')[0]} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      {/* Alcoholismo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Alcoholismo:</label>
        <div className="flex items-center">
          <label className="mr-4">
            <input type="radio" name="alcoholismo" value="si" onChange={() => setFormData((prev) => ({ ...prev, alcoholismo: 'si' }))} />
            Sí
          </label>
          <label>
            <input type="radio" name="alcoholismo" value="no" onChange={() => setFormData((prev) => ({ ...prev, alcoholismo: 'no' }))} />
            No
          </label>
        </div>
        {formData.alcoholismo === 'si' && (
          <div>
            <input
              type="text"
              name="frecuenciaAlcoholismo"
              placeholder="Frecuencia"
              value={formData.frecuenciaAlcoholismo}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Deporte */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Deporte:</label>
        <div className="flex items-center">
          <label className="mr-4">
            <input type="radio" name="deporte" value="si" onChange={() => setFormData((prev) => ({ ...prev, deporte: 'si' }))} />
            Sí
          </label>
          <label>
            <input type="radio" name="deporte" value="no" onChange={() => setFormData((prev) => ({ ...prev, deporte: 'no' }))} />
            No
          </label>
        </div>
        {formData.deporte === 'si' && (
          <div>
            <input
              type="text"
              name="frecuenciaDeporte"
              placeholder="Frecuencia"
              value={formData.frecuenciaDeporte}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Tabaquismo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tabaquismo:</label>
        <div className="flex items-center">
          <label className="mr-4">
            <input type="radio" name="tabaquismo" value="si" onChange={() => setFormData((prev) => ({ ...prev, tabaquismo: 'si' }))} />
            Sí
          </label>
          <label>
            <input type="radio" name="tabaquismo" value="no" onChange={() => setFormData((prev) => ({ ...prev, tabaquismo: 'no' }))} />
            No
          </label>
        </div>
        {formData.tabaquismo === 'si' && (
          <div>
            <input
              type="text"
              name="frecuenciaTabaquismo"
              placeholder="Frecuencia"
              value={formData.frecuenciaTabaquismo}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Drogas */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Drogas:</label>
        <div className="flex items-center">
          <label className="mr-4">
            <input type="radio" name="drogas" value="si" onChange={() => setFormData((prev) => ({ ...prev, drogas: 'si' }))} />
            Sí
          </label>
          <label>
            <input type="radio" name="drogas" value="no" onChange={() => setFormData((prev) => ({ ...prev, drogas: 'no' }))} />
            No
          </label>
        </div>
        {formData.drogas === 'si' && (
          <div>
            <input
              type="text"
              name="frecuenciaDrogas"
              placeholder="Frecuencia"
              value={formData.frecuenciaDrogas}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
            <input
              type="text"
              name="cualDroga"
              placeholder="¿Cual?"
              value={formData.cualDroga}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Observaciones:</label>
        <textarea name="observaciones" placeholder="Observaciones" onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fecha Último Menstruo:</label>
        <input type="date" name="fechaUltMens" value={formData.fechaUltMens} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Método de Planificación Familiar:</label>
        <input type="text" name="metPlanFam" value={formData.metPlanFam} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Número de Embarazos:</label>
        <input type="number" name="numEmb" value={formData.numEmb} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Número de Partos:</label>
        <input type="number" name="partos" value={formData.partos} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Número de Cesáreas:</label>
        <input type="number" name="cesareas" value={formData.cesareas} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Número de Abortos:</label>
        <input type="number" name="abortos" value={formData.abortos} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Otra Enfermedad</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Especificar otra enfermedad:</label>
        <input type="text" name="otraEnferm" value={formData.otraEnferm} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Antecedentes Familiares <span className="text-red-500">*</span></h3>
      {formData.antecFam.map((fam, index) => (
        <div key={index} className="mb-4 border p-2 rounded">
          <input
            type="text"
            name="parentesco"
            placeholder="Parentesco"
            value={fam.parentesco}
            onChange={(e) => handleAntecFamChange(index, e)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
          <input
            type="number"
            name="edad"
            placeholder="Edad"
            value={fam.edad}
            onChange={(e) => handleAntecFamChange(index, e)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            name="enfermedad"
            placeholder="Enfermedad"
            value={fam.enfermedad}
            onChange={(e) => handleAntecFamChange(index, e)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            name="causaMuerte"
            placeholder="Causa de Muerte"
            value={fam.causaMuerte}
            onChange={(e) => handleAntecFamChange(index, e)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
        </div>
      ))}
      <button type="button" onClick={addAntecFam} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Agregar Antecedente Familiar</button>

      <h3 className="text-lg font-semibold mb-2">Selección de Antecedentes Patológicos</h3>
      {antecedentesPatologicos.map((patolog) => (
        <div key={patolog.idAntecPatolog} className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.selecAntecPatolog.includes(patolog.idAntecPatolog)}
              onChange={() => handleCheckboxChange(patolog.idAntecPatolog)}
              className="mr-2"
            />
            {patolog.nombre}
          </label>
        </div>
      ))}

      <button type="submit" className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Enviar</button>
    </form>
  );
};

export default ExamenMedico;