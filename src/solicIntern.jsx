import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from './authStore';

const SolicitudInternaForm = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    lugarNac: '',
    RFC: '',
    CURP: '',
    NSS: '',
    CP: '',
    ciudad: '',
    estado: '',
    municipio: '',
    viveCon: '',
    datosFam: [{ nombre: '', apellidos: '', fechaNac: '', parentesco: '' }]
  });
  
  const [usuario, setUsuario] = useState(null);
  const [solInt, setSolInt] = useState(null);
  const [expFisica, setExpFisica] = useState(null);

  const user = useAuthStore((state) => state.user);
  const idFolio = user?.idFolio;

  const fetchUsuarioFolio = async () => {
    try {
      const response = await axios.get(`http://172.30.189.86:5005/usuario/folio/${idFolio}`);
      console.log(response.data);
      setUsuario(response.data);
      setSolInt(response.data.solicitudInterna);
      setExpFisica(response.data.exploracionFisica);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  useEffect(() => {
    if (idFolio) {
      fetchUsuarioFolio();
    }
  }, [idFolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDataFamChange = (index, e) => {
    const { name, value } = e.target;
    const newDatosFam = [...formData.datosFam];
    newDatosFam[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      datosFam: newDatosFam,
    }));
  };

  const addDataFam = () => {
    setFormData((prevData) => ({
      ...prevData,
      datosFam: [...prevData.datosFam, { nombre: '', apellidos: '', fechaNac: '', parentesco: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Asegurarse de que el usuario esté cargado
      if (usuario) {
        // Agregar idUsuario al formData
        const dataToSend = {
          ...formData,
          idUsuario: usuario.idUsuario, // Agregar idUsuario
        };

        // Eliminar fechaNac del usuario antes de enviar
        const { fechaNac, ...dataWithoutFechaNac } = dataToSend;

        const response = await axios.post('http://172.30.189.86:5005/solicInt', dataWithoutFechaNac);
        console.log('Data submitted successfully:', response.data);
      } else {
        console.error('Usuario no cargado');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  if (!expFisica) {
    return <div className="text-center">Por favor, completa la exploracion fisica antes de continuar con este paso.</div>;
  }

  if (solInt) {
    return <div className="text-center">Ya realizaste la solicitud interna.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Solicitud Interna</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha: <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lugar de Nacimiento: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="lugarNac"
            value={formData.lugarNac}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">RFC: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="RFC"
            value={formData.RFC}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CURP: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="CURP"
            value={formData.CURP}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NSS: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="NSS"
            value={formData.NSS}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CP: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="CP"
            value={formData.CP}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ciudad: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Municipio: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vive con: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="viveCon"
            value={formData.viveCon}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <h3 className="text-xl font-semibold mt-6">Datos Familiares <span className="text-red-500">*</span></h3>
        {formData.datosFam.map((dataFam, index) => (
          <div key={index} className="border p-4 rounded-md mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={dataFam.nombre}
              onChange={(e) => handleDataFamChange(index, e)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700">Apellidos:</label>
            <input
              type="text"
              name="apellidos"
              value={dataFam.apellidos}
              onChange={(e) => handleDataFamChange(index, e)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fechaNac"
              value={dataFam.fechaNac}
              onChange={(e) => handleDataFamChange(index, e)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700">Parentesco:</label>
            <input
              type="text"
              name="parentesco"
              value={dataFam.parentesco}
              onChange={(e) => handleDataFamChange(index, e)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addDataFam}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Agregar Datos Familiares
        </button>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default SolicitudInternaForm;