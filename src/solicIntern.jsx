import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
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
    datosFam: [
      { nombre: '', apellidos: '', fechaNac: null, parentesco: 'PADRE' },
      { nombre: '', apellidos: '', fechaNac: null, parentesco: 'MADRE' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'ESPOSO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
    ]
  });
  
  const [usuario, setUsuario] = useState(null);
  const [solInt, setSolInt] = useState(null);
  const [consent, setConsent] = useState(null);

  const user = useAuthStore((state) => state.user);
  const idFolio = user?.idFolio;
  const numFolio = user?.numFolio;
  const pdfRef = useRef();

  const fetchUsuarioFolio = async () => {
    try {
      const response = await axios.get(`http://192.168.1.68:5005/usuario/folio/${idFolio}`);
      console.log(response.data);
      setUsuario(response.data);
      setSolInt(response.data.solicitudInterna);
      setConsent(response.data.consentimiento);
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

  const handleDataFamChange = (index, field, value) => {
    const newDatosFam = [...formData.datosFam];
    
    // Asegúrate de que el objeto exista
    if (!newDatosFam[index]) {
      newDatosFam[index] = { nombre: '', apellidos: '', fechaNac: '', parentesco: '' };
    }

    // Actualiza el campo correspondiente
    newDatosFam[index][field] = value;

    setFormData((prevData) => ({
      ...prevData,
      datosFam: newDatosFam,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuario) {
        const dataToSend = {
          ...formData,
          idUsuario: usuario.idUsuario,
        };

        const { fechaNac, ...dataWithoutFechaNac } = dataToSend;

        const response = await axios.post('http://192.168.1.68:5005/solicInt', dataWithoutFechaNac);

        console.log('Data submitted successfully:', response.data);

        // Generar el PDF
        const pdfBlob = await new Promise((resolve) => {
          const input = pdfRef.current;
          html2canvas(input, { scale: 0.8 }).then((canvas) => { //A mas 'scale' más calidad tiene el pdf, pero tambien es más pesado
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'legal');
            const imgWidth = 216;
            const pageHeight = 330;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (imgHeight > pageHeight) {
                const scaleFactor = pageHeight / imgHeight;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, (imgHeight * scaleFactor) + 30);
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            }

              // Convertir el PDF a un Blob
              const pdfOutput = pdf.output('blob');
              resolve(pdfOutput);
          });
      });

      // console.log('Tipo de archivo:', pdfBlob.type); // Esto debería ser 'application/pdf'

      // Verificar el tamaño del Blob
      if (pdfBlob.size > 20 * 1024 * 1024) { // 20MB
        console.log("Tamaño del pdf",pdfBlob.size);
        console.error('El archivo PDF es demasiado grande.');
        return; // Detener el proceso si el archivo es demasiado grande
      }

      // Crear FormData para subir el PDF
      const formDataToSend = new FormData();
      formDataToSend.append('document', pdfBlob, `solicitudinterna-${numFolio}.pdf`); // Agregar el PDF
      formDataToSend.append('idUsuario', usuario.idUsuario); // Agregar idUsuario

      // Enviar el PDF al backend
      const pdfUploadResponse = await axios.post('http://192.168.1.68:5005/pdf/upload-single-doc', formDataToSend, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      console.log('PDF subido con éxito:', pdfUploadResponse.data);
      } else {
        console.error('Usuario no cargado');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  if (!consent) {
    return <div className="text-center">Por favor, firma tu consentimiento antes de continuar con este paso.</div>;
  }

  if (solInt) {
    return <div className="text-center">Ya realizaste la solicitud interna.</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
        {/* Header */}
        <div className="flex items-center mb-4">
          <img alt="ATR Nayarit Logo" className="h-31" src="logo.png" />
          <div className="w-full text-center bg-gray-200">
            <h1 className="text-xl ">SOLICITUD INTERNA</h1>
            <div className="flex space-x-2">
              <div>FECHA</div>
              <input
                className="w-full border border-gray-300 p-2"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Datos personales */}
        <div className='grid grid-rows-[auto_1fr]'>
          <div className='text-center mt-4 font-bold'>
            <label>DATOS PERSONALES</label>
          </div>
          <div className='grid grid-cols-4 gap-2'>
            <div>
              <label>APELLIDO PATERNO</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.apellidoPat} readOnly />
            </div>
            <div>
              <label>APELLIDO MATERNO</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.apellidoMat} readOnly />
            </div>
            <div>
              <label>NOMBRE (S)</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.nombre} readOnly />
            </div>
            <div className='flex items-center gap-3'>
              <label>SEXO</label>
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="H"
                  checked={usuario.sexo === 'H'}
                  readOnly
                />
                H
              </label>
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="M"
                  checked={usuario.sexo === 'M'}
                  readOnly
                />
                M
              </label>
            </div>
          </div>
          <div className='grid grid-cols-[4fr_1fr_4fr] gap-2'>
            <div>
              <label>FECHA NACIMIENTO</label>
              <input className="w-full border border-gray-300 p-2" type="date" value={usuario.fechaNac.split('T')[0]} readOnly />
            </div>
            <div>
              <label>EDAD</label>
              <input className="w-full border border-gray-300 p-2" type="number" value={usuario.edad} readOnly />
            </div>
            <div>
              <label>LUGAR NACIMIENTO</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="lugarNac"
                value={formData.lugarNac}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label>RFC</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="RFC"
                value={formData.RFC}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>CURP</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="CURP"
                value={formData.CURP}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='grid grid-cols-[2fr_3fr] gap-2'>
            <div>
              <label>NUMERO SEGURO SOCIAL</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="NSS"
                value={formData.NSS}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label>ESTADO CIVIL</label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Soltero"
                  checked={usuario.estado_civil === 'Soltero'}
                  readOnly
                />
                Soltero (a)
              </label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Casado"
                  checked={usuario.estado_civil === 'Casado'}
                  readOnly
                />
                Casado (a)
              </label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Divorciado"
                  checked={usuario.estado_civil === 'Divorciado'}
                  readOnly
                />
                Divorciado (a)
              </label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Viudo"
                  checked={usuario.estado_civil === 'Viudo'}
                  readOnly
                />
                Viudo (a)
              </label>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label>TELEFONO PERSONAL</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.tel_personal} readOnly />
            </div>
            <div>
              <label>TELEFONO DE EMERGENCIA</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.tel_emergencia} readOnly />
            </div>
          </div>
        </div>

        {/* Datos familiares */}
        <div className='grid grid-rows-[auto_1fr]'>
          <div className='text-center mt-4 font-bold'>
            <label>DATOS FAMILIARES</label>
          </div>
          <div className='grid grid-cols-[1fr_6fr_6fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label>PADRE</label>
            </div>
            <div className='text-center'>
              <label>NOMBRES</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[0].nombre}
                onChange={(e) => handleDataFamChange(0, 'nombre', e.target.value)}
              />
            </div>
            <div className='text-center'>
              <label>APELLIDOS</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[0].apellidos}
                onChange={(e) => handleDataFamChange(0, 'apellidos', e.target.value)}
              />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_6fr_6fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label>MADRE</label>
            </div>
            <div className='text-center'>
              <label>NOMBRES</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[1].nombre}
                onChange={(e) => handleDataFamChange(1, 'nombre', e.target.value)}
              />
            </div>
            <div className='text-center'>
              <label>APELLIDOS</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[1].apellidos}
                onChange={(e) => handleDataFamChange(1, 'apellidos', e.target.value)}
              />
            </div>
          </div>
          {formData.datosFam.slice(2).map((fam, index) => (
            <div className='grid grid-cols-[2fr_4fr_4fr_4fr] gap-2' key={index + 2}>
              <div className='flex flex-col items-center gap-5 justify-center mt-5'>
                <label>{fam.parentesco}</label>
              </div>
              <div className='text-center'>
                <label>NOMBRES</label>
                <input
                  className="w-full border border-gray-300 p-2"
                  type="text"
                  value={fam.nombre}
                  onChange={(e) => handleDataFamChange(index + 2, 'nombre', e.target.value)}
                />
              </div>
              <div className='text-center'>
                <label>APELLIDOS</label>
                <input
                  className="w-full border border-gray-300 p-2"
                  type="text"
                  value={fam.apellidos}
                  onChange={(e) => handleDataFamChange(index + 2, 'apellidos', e.target.value)}
                />
              </div>
              <div className='text-center'>
                <label>FECHA NAC</label>
                <input
                  className="w-full border border-gray-300 p-2"
                  type="date"
                  value={fam.fechaNac}
                  onChange={(e) => handleDataFamChange(index + 2, 'fechaNac', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Domicilio */}
        <div>
          <div className='text-center mt-4 font-bold'>
            <label>DOMICILIO ACTUAL</label>
          </div>
          <div className='grid grid-cols-[3fr_1fr_3fr] gap-2'>
            <div>
              <label>CALLE</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.calle} readOnly />
            </div>
            <div>
              <label>NUMERO</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.numero} readOnly />
            </div>
            <div>
              <label>COLONIA</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.colonia} readOnly />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_3fr_3fr] gap-2'>
            <div>
              <label>C.P.</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="CP"
                value={formData.CP}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>CIUDAD</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>ESTADO</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label>MUNICIPIO</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label>VIVE CON</label>
              <label>
                <input
                  type="radio"
                  name="viveCon"
                  value="Familia"
                  checked={formData.viveCon === 'Familia'}
                  onChange={handleChange}
                />
                Familia
              </label>
              <label>
                <input
                  type="radio"
                  name="viveCon"
                  value="Amigos"
                  checked={formData.viveCon === 'Amigos'}
                  onChange={handleChange}
                />
                Amigos
              </label>
              <label>
                <input
                  type="radio"
                  name="viveCon"
                  value="Solo (a)"
                  checked={formData.viveCon === 'Solo (a)'}
                  onChange={handleChange}
                />
                Solo (a)
              </label>
            </div>
          </div>
        </div>

        {/* Escolaridad */}
        <div className='grid grid-rows-[auto_1fr]'>
          <div className='text-center mt-4 font-bold'>
            <label>ESCOLARIDAD</label>
          </div>
          <div className='grid grid-cols-[1fr_5fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label><input type="radio" />PRIMARIA</label>
            </div>
            <div>
              <label>TECNICO EN:</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_5fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label><input type="radio" />SECUNDARIA</label>
            </div>
            <div>
              <label>LICENCIATURA EN:</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_5fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label><input type="radio" />PREPARATORIA</label>
            </div>
            <div>
              <label>INGENIERIA EN:</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Enviar Solicitud
        </button>
      </form>
    </>
  );
};

export default SolicitudInternaForm;