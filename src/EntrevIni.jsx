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
    fecha: '',
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
    escolaridad: '',
    fechaNac: ''
  });

  const [numFolio, setNumFolio] = useState('');
  const [folioStatus, setFolioStatus] = useState('');

  const fetchFolio = async () => {
    try {
      const response = await axios.get(`http://172.30.189.106:5005/folio/${numFolio}`);
      if (response.data.Usuario) {
        setFolioStatus('Folio ya está siendo usado');
      } else {
        setFolioStatus('Folio disponible');
      }
    } catch (error) {
      console.error('Error fetching the folio:', error);
      setFolioStatus('Error al verificar el folio / El folio no existe');
    }
  };

  useEffect(() => {
    if (numFolio) {
      fetchFolio();
    }
  }, [numFolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFolioChange = (e) => {
    setNumFolio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      entrevIniData: {
        areaDirige: formData.areaDirige,
        puesto: formData.puesto,
        turno: formData.turno,
        actualDedica: formData.actualDedica,
        enteroEmpleo: formData.enteroEmpleo,
        numIngresos: formData.numIngresos ? parseInt(formData.numIngresos, 10) : null,
        enQueArea: formData.enQueArea ? formData.enQueArea : null,
        procesoLinea: formData.procesoLinea ? formData.procesoLinea : null,
        motivoRenuncia: formData.motivoRenuncia ? formData.motivoRenuncia : null,
        cant_hijos: formData.cant_hijos ? parseInt(formData.cant_hijos, 10) : null,
        edades_hijos: formData.edades_hijos ? formData.edades_hijos : null,
        cuidador: formData.cuidador ? formData.cuidador : null,
        trab_cuidador: formData.trab_cuidador ? formData.trab_cuidador : null,
        empresa1: formData.empresa1 ? formData.empresa1 : null,
        motivoSal1: formData.motivoSal1 ? formData.motivoSal1 : null,
        duracion1: formData.duracion1 ? formData.duracion1 : null,
        salario1: formData.salario1 ? formData.salario1 : null,
        horario1: formData.horario1 ? formData.horario1 : null,
        empresa2: formData.empresa2 ? formData.empresa2 : null,
        motivoSal2: formData.motivoSal2 ? formData.motivoSal2 : null,
        duracion2: formData.duracion2 ? formData.duracion2 : null,
        salario2: formData.salario2 ? formData.salario2 : null,
        horario2: formData.horario2 ? formData.horario2 : null,
        tiempoSinTrab: formData.tiempoSinTrab ? formData.tiempoSinTrab : null,
        tiempoSalida: formData.tiempoSalida ? formData.tiempoSalida : null,
        motivoNoTrab: formData.motivoNoTrab ? formData.motivoNoTrab : null,
        pendientes: formData.pendientes ? formData.pendientes : null,
        renta: formData.renta ? parseInt(formData.renta, 10) : null,
        fonacot: formData.fonacot ? parseInt(formData.fonacot, 10) : null,
        infonavit: formData.infonavit ? parseInt(formData.infonavit, 10) : null,
        antecedentesPen: formData.antecedentesPen ? formData.antecedentesPen : null,
        fecha: formData.fecha,
        image: formData.image,
        encinte: formData.encinte,
        tricky: formData.tricky,
        artesanal: formData.artesanal,
        comprension: formData.comprension,
        vista: formData.vista,
        calificacion: formData.calificacion,
        comentarios: formData.comentarios,
        bonoContr: formData.bonoContr ? parseInt(formData.bonoContr, 10) : null,
        areaOPlanta: formData.areaOPlanta
      },
      numFolio: parseInt(numFolio, 10),
      usuario: {
        nombre: formData.nombre,
        apellidoPat: formData.apellidoPat,
        apellidoMat: formData.apellidoMat,
        sexo: formData.sexo,
        edad: parseInt(formData.edad, 10),
        estado_civil: formData.estado_civil,
        tel_personal: formData.tel_personal,
        tel_emergencia: formData.tel_emergencia,
        calle: formData.calle,
        numero: formData.numero,
        colonia: formData.colonia,
        escolaridad: formData.escolaridad,
        fechaNac: formData.fechaNac
      },
    };
    try {
      const response = await axios.post('http://172.30.189.106:5005/entrevIni', dataToSubmit);
      console.log('Response:', response.data);
      fetchFolio();
    } catch (error) {
      console.error ('Error submitting the form:', error);
    }
  };

  const renderInput = (key) => {
    const isNumberField = ['numIngresos', 'cant_hijos', 'renta', 'fonacot', 'infonavit', 'edad', 'bonoContr'].includes(key);
    const isDateField = key === 'fecha' || key === 'fechaNac';
    const isRequiredField = !['numIngresos','enQueArea', 'procesoLinea', 'motivoRenuncia', 'cant_hijos','edades_hijos', 'cuidador', 'trab_cuidador', 'empresa1', 
      'motivoSal1', 'duracion1', 'salario1', 'horario1', 'empresa2', 'motivoSal2', 'duracion2', 'salario2', 'horario2', 'tiempoSinTrab', 'tiempoSalida', 
      'motivoNoTrab', 'pendientes', 'renta', 'fonacot', 'infonavit','antecedentesPen', 'bonoContr'].includes(key);

    return (
      <div key={key} className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          {key} {isRequiredField && <span className="text-red-500">*</span>}
        </label>
        <input
          type={isDateField ? 'date' : isNumberField ? 'number' : 'text'}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(formData).map((key) => renderInput(key))}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">numFolio</label>
          <input
            type="number"
            name="numFolio"
            value={numFolio}
            onChange={handleFolioChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-500 mt-1">{folioStatus}</span>
        </div>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Enviar
      </button>
    </form>
  );
};

export default EntrevIniForm;