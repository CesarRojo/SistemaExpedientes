import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation } from 'react-router-dom';

const ExploracionFisica = () => {
  const location = useLocation();
  const { idUsuario, nombre, apellidoPat } = location.state || {};
  const [formData, setFormData] = useState({
    peso: '',
    talla: '',
    temperatura: '',
    FR: '',
    FC: '',
    TA: '',
    finkelstein: '',
    tinel: '',
    phalen: '',
    observaciones: '',
    movAnormales: false,
    marcha: false,
    comprension: '',
    visionLejos: '',
    visionCerca: '',
    daltonismo: '',
    OI: '',
    OD: '',
    calificacion: '',
    piel: '',
    higiene: '',
    tipoPeso: '',
    lesionOcular: '',
    lesionOido: '',
    bocaDienEnc: '',
    torax: '',
    columVert: '',
    extremidades: '',
    capacEsp: '',
    calificacionFinal: '',
    idUsuario: idUsuario, // Se asigna el usuario seleccionado de la tabla anterior
  });

  const [expFisica, setExpFisica] = useState(null);
  const [examMed, setExamMed] = useState(null);

  const fetchUsuarioFolio = async () => {
    try {
      const response = await axios.get(`http://172.30.189.104:5005/usuario/${idUsuario}`);
      console.log(response.data);
      setExamMed(response.data.examenMedico);
      setExpFisica(response.data.exploracionFisica);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  useEffect(() => {
    if (idUsuario) {
      fetchUsuarioFolio();
    }
  }, [idUsuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://172.30.189.104:5005/expFisica', {
        ...formData,
        peso: parseInt(formData.peso),
        talla: parseInt(formData.talla),
        temperatura: parseInt(formData.temperatura),
        FR: parseInt(formData.FR),
        FC: parseInt(formData.FC),
        TA: parseInt(formData.TA),
        finkelstein: parseInt(formData.finkelstein),
        tinel: parseInt(formData.tinel),
        phalen: parseInt(formData.phalen),
        comprension: parseInt(formData.comprension),
        visionLejos: parseInt(formData.visionLejos),
        visionCerca: parseInt(formData.visionCerca),
        daltonismo: parseInt(formData.daltonismo),
        OI: parseInt(formData.OI),
        OD: parseInt(formData.OD),
        calificacion: parseInt(formData.calificacion),
        lesionOcular: parseInt(formData.lesionOcular),
        lesionOido: parseInt(formData.lesionOido),
        bocaDienEnc: parseInt(formData.bocaDienEnc),
        torax: parseInt(formData.torax),
        columVert: parseInt(formData.columVert),
        extremidades: parseInt(formData.extremidades),
        observaciones: formData.observaciones ? formData.observaciones : null,
      });
      console.log('Exploración Física creada:', response.data);
    } catch (error) {
      console.error('Error al crear Exploración Física:', error);
    }
  };

  if (!examMed) {
    return <div className="text-center">El examen medico es un paso obligatorio. Por favor, completa la entrevista inicial antes de continuar con el examen médico.</div>;
  }

  if (expFisica) {
    return <div className="text-center">Ya realizaste la exploracion fisica.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Exploración Física - <em>{nombre + ' ' + apellidoPat}</em></h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Peso:</label>
        <input type="number" name="peso" value={formData.peso} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Talla:</label>
        <input type="number" name="talla" value={formData.talla} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Temperatura:</label>
        <input type="number" name="temperatura" value={formData.temperatura} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Frecuencia Respiratoria (FR):</label>
        <input type="number" name="FR" value={formData.FR} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Frecuencia Cardíaca (FC):</label>
        <input type="number" name="FC" value={formData.FC} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tensión Arterial (TA):</label>
        <input type="text" name="TA" value={formData.TA} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Finkelstein:</label>
        <input type="number" name="finkelstein" value={formData.finkelstein} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tinel:</label>
        <input type="number" name="tinel" value={formData.tinel} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Phalen:</label>
        <input type="number" name="phalen" value={formData.phalen} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Observaciones:</label>
        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" name="movAnormales" checked={formData.movAnormales} onChange={handleChange} className="form-checkbox" />
          <span className="ml-2">Movimientos Anormales</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" name="marcha" checked={formData.marcha} onChange={handleChange} className="form-checkbox" />
          <span className="ml-2">Marcha</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Comprensión:</label>
        <input type="text" name="comprension" value={formData.comprension} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Visión Lejos:</label>
        <input type="text" name="visionLejos" value={formData.visionLejos} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Visión Cerca:</label>
        <input type="text" name="visionCerca" value={formData.visionCerca} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Daltonismo:</label>
        <input type="text" name="daltonismo" value={formData.daltonismo} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Ojo Izquierdo (OI):</label>
        <input type="text" name="OI" value={formData.OI} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Ojo Derecho (OD):</label>
        <input type="text" name="OD" value={ formData.OD} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Calificación:</label>
        <input type="text" name="calificacion" value={formData.calificacion} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Piel:</label>
        <input type="text" name="piel" value={formData.piel} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Higiene:</label>
        <input type="text" name="higiene" value={formData.higiene} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tipo de Peso:</label>
        <input type="text" name="tipoPeso" value={formData.tipoPeso} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Lesión Ocular:</label>
        <input type="text" name="lesionOcular" value={formData.lesionOcular} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Lesión de Oído:</label>
        <input type="text" name="lesionOido" value={formData.lesionOido} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Boca/Dientes/Encías:</label>
        <input type="text" name="bocaDienEnc" value={formData.bocaDienEnc} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tórax:</label>
        <input type="text" name="torax" value={formData.torax} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Columna Vertebral:</label>
        <input type="text" name="columVert" value={formData.columVert} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Extremidades:</label>
        <input type="text" name="extremidades" value={formData.extremidades} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Capacidad Especial:</label>
        <input type="text" name="capacEsp" value={formData.capacEsp} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </ div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Calificación Final:</label>
        <input type="text" name="calificacionFinal" value={formData.calificacionFinal} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500" />
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600">Enviar</button>
    </form>
  );
};

export default ExploracionFisica;