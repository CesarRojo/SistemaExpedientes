import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EntrevIniForm = () => {
  const [formData, setFormData] = useState({
    areaDirige: '',
    puesto: '',
    turno: '',
    actualDedica: '',
    enteroEmpleo: '',
    numIngresos: '',
    enQueArea: '',
    procesoLinea: '',
    motivoRenuncia: '',
    cant_hijos: '',
    edades_hijos: '',
    cuidador: '',
    trab_cuidador: '',
    empresa1: '',
    motivoSal1: '',
    duracion1: '',
    salario1: '',
    horario1: '',
    empresa2: '',
    motivoSal2: '',
    duracion2: '',
    salario2: '',
    horario2: '',
    tiempoSinTrab: '',
    tiempoSalida: '',
    motivoNoTrab: '',
    pendientes: '',
    renta: '',
    fonacot: '',
    infonavit: '',
    antecedentesPen: '',
    fecha: '', // Añadir campo de fecha
    image: '',
    encinte: '',
    tricky: '',
    artesanal: '',
    comprension: '',
    vista: '',
    calificacion: '',
    comentarios: '',
    bonoContr: '',
    areaOPlanta: '',
    nombre: '',
    apellidoPat: '',
    apellidoMat: '',
    sexo: '',
    edad: '',
    estado_civil: '',
    tel_personal: '',
    tel_emergencia: '',
    calle: '',
    numero: '',
    colonia: '',
    escolaridad: ''
  });

  const [numFolio, setNumFolio] = useState(null);

  useEffect(() => {
    const fetchLastFolio = async () => {
      try {
        const response = await axios.get('http://192.168.1.68:5005/folio/last');
        const lastFolio = response.data.numFolio;
        setNumFolio(lastFolio + 2);
      } catch (error) {
        console.error('Error fetching the last folio:', error);
      }
    };

    fetchLastFolio();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, numFolio };
    try {
      const response = await axios.post('http://192.168.1.68:5005/entrevIni', dataToSubmit);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const renderInput = (key) => {
    const isNumberField = ['numIngresos', 'cant_hijos', 'renta', 'fonacot', 'infonavit', 'edad', 'bonoContr'].includes(key);
    const isDateField = key === 'fecha';
    return (
      <input
        type={isDateField ? 'date' : isNumberField ? 'number' : 'text'}
        name={key}
        value={formData[key]}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700">{key}</label>
            {renderInput(key)}
          </div>
        ))}
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Enviar
      </button>
    </form>
  );
};

export default EntrevIniForm;