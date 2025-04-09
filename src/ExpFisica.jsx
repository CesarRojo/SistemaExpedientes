import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useLocation } from 'react-router-dom';
import useAuthStore from './authStore';

const ExploracionFisica = () => {
  const location = useLocation();
  const { idUsuario, nombre, apellidoPat } = location.state || {};
  const user = useAuthStore((state) => state.user);
  const numFolio = user?.numFolio;
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
    movAnormales: '',
    marcha: '',
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
    idUsuario: idUsuario,
  });

  const [expFisica, setExpFisica] = useState(null);
  const [examMed, setExamMed] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const pdfRef = useRef();

  const fetchUsuarioFolio = async () => {
    try {
      const response = await axios.get(`http://172.30.189.106:5005/usuario/${idUsuario}`);
      setUsuario(response.data);
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
  
    // Si el radio seleccionado es "Otro", actualiza el campo comprension
    if (name === 'comprension' && value === 'Otro') {
      setFormData((prev) => ({
        ...prev,
        comprension: '', // Limpiar el valor de comprension para que el input de texto pueda ser usado
      }));
    } else if (name === 'comprensionOtro') {
      // Si se está escribiendo en el input de texto, actualiza comprension
      setFormData((prev) => ({
        ...prev,
        comprension: value, // Guardar el valor del input de texto en comprension
      }));
    } else {
      // Para otros campos, actualiza normalmente
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { nombreCompleto, realizadoPor, ...dataToSend } = formData; // Omitir los campos
      const response = await axios.post('http://172.30.189.106:5005/expFisica', {
        ...dataToSend,
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
        createdAt: usuario.createdAt,
      });
      
      console.log('Exploración Física creada:', response.data);

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
        formDataToSend.append('document', pdfBlob, `exploracionfisica-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', usuario.idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.106:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);
    } catch (error) {
      if (error.response) {
    // La solicitud se realizó y el servidor respondió con un código de estado
    // que está fuera del rango de 2xx
    console.error('Error en la respuesta del servidor:', error.response.data);
  } else if (error.request) {
    // La solicitud se realizó pero no se recibió respuesta
    console.error('No se recibió respuesta del servidor:', error.request);
  } else {
    // Algo sucedió al configurar la solicitud que provocó un error
    console.error('Error al configurar la solicitud:', error.message);
  }
    }
  };

  if (!examMed) {
    return <div className="text-center">Por favor, completa el examen medico antes de continuar con este paso.</div>;
  }

  if (expFisica) {
    return <div className="text-center">Ya realizaste la exploracion fisica.</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
        {/* Header */}
        <div className="flex items-center mb-4">
          <img alt="ATR Nayarit Logo" className="h-31" src="logo.png" />
          <div className="w-full text-center bg-gray-200">
            <h1 className="text-xl ">EXPLORACION FISICA</h1>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 mt-4 text-center text-sm">
          <div>
            <label className="block font-bold">PESO:</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="peso"
              type="text"
              value={formData.peso}
              onChange={handleChange}
            />
            <span className="block mt-1">KG</span>
          </div>
          <div>
            <label className="block font-bold">TALLA:</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="talla"
              type="text"
              value={formData.talla}
              onChange={handleChange}
            />
            <span className="block mt-1">cm</span>
          </div>
          <div>
            <label className="block font-bold">TEMPERATURA:</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="temperatura"
              type="text"
              value={formData.temperatura}
              onChange={handleChange}
            />
            <span className="block mt-1">°C</span>
          </div>
          <div>
            <label className="block font-bold">FR:</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="FR"
              type="text"
              value={formData.FR}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">FC:</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="FC"
              type="text"
              value={formData.FC}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">T/A:</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="TA"
              type="text"
              value={formData.TA}
              onChange={handleChange}
            />
            <span className="block mt-1">mm Hg</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
          <div>
            <label className="block font-bold">MANIOBRA DE FINKELSTEIN</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="finkelstein"
              type="text"
              value={formData.finkelstein}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">SIGNO DE TINEL</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="tinel"
              type="text"
              value={formData.tinel}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-bold">SIGNO DE PHALEN</label>
            <input
              className="border border-gray-300 p-1 w-full"
              name="phalen"
              type="text"
              value={formData.phalen}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-2 mb-4">
          <h2 className="text-lg mb-2">OBSERVACIONES:</h2>
          <textarea
            className="w-full border border-gray-300 p-2 h-24"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>

        {/* exploracion */}
        <div className='grid grid-rows-[1fr_auto]'>
          <div className='grid grid-cols-4 gap-2'>
            <div>
              <label className="block font-bold text-sm">MOVIMIENTOS ANORMALES</label>
              <label><input type="radio" name="movAnormales" value="Si" onChange={handleChange} />Si</label>
              <label><input type="radio" name="movAnormales" value="No" onChange={handleChange} />No</label>
              <label className="block font-bold text-sm">MARCHA</label>
              <label><input type="radio" name="marcha" value="Normal" onChange={handleChange} />Normal</label>
              <label><input type="radio" name="marcha" value="Anormal" onChange={handleChange} />Anormal</label>
            </div>
            <div>
              <label className="block font-bold text-sm">COMPRENSION</label>
              <label><input type="radio" name="comprension" value="100/90" onChange={handleChange} />100/90</label>
              <label><input type="radio" name="comprension" value="90/80" onChange={handleChange} />90/80</label>
              <label><input type="radio" name="comprension" value="80/70" onChange={handleChange} />80/70</label>
              <label><input type="radio" name="comprension" value="Otro" onChange={handleChange} />Otro</label>
              <input className="border border-gray-300 p-1 w-full" name="comprensionOtro" type="text" value={formData.comprension === '' ? '' : formData.comprension} onChange={handleChange} />
            </div>
            <div>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <div className=''>
                    <label className="block font-bold text-sm">VISION LEJOS</label>
                    <input
                      className="border border-gray-300 p-1 w-full"
                      name="visionLejos"
                      type="text"
                      value={formData.visionLejos}
                      onChange={handleChange}
                    />
                  </div>
                  <div className=''>
                    <label className="block font-bold text-sm">VISION CERCA</label>
                    <input
                      className="border border-gray-300 p-1 w-full"
                      name="visionCerca"
                      type="text"
                      value={formData.visionCerca}
                      onChange={handleChange}
                    />
                  </div>
                  <div className=''>
                    <label className="block font-bold text-sm">DALTONISMO</label>
                    <input
                      className="border border-gray-300 p-1 w-full"
                      name="daltonismo"
                      type="text"
                      value={formData.daltonismo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='flex flex-row mt-2'>
                    <label className="block font-bold text-sm">OI</label>
                    <input
                      className="border border-gray-300 p-1 w-full"
                      name="OI"
                      type="text"
                      value={formData.OI}
                      onChange={handleChange}
                    />
                    <label className="block font-bold text-sm">OD</label>
                    <input
                      className="border border-gray-300 p-1 w-full"
                      name="OD"
                      type="text"
                      value={formData.OD}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-sm">CALIFICACION</label>
                  <input
                    className="border border-gray-300 p-1 w-full"
                    name="calificacion"
                    type="text"
                    value={formData.calificacion}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className='grid grid-rows-2'>
              <div>
                <label className="block font-bold text-sm">PIEL</label>
                <label><input type="radio" name="piel" value="Hidratada" onChange={handleChange} />Hidratada</label>
                <label><input type="radio" name="piel" value="Seca" onChange={handleChange} />Seca</label>
                <label className="block font-bold text-sm">HIGIENE</label>
                <label><input type="radio" name="higiene" value="Buena" onChange={handleChange} />Buena</label>
                <label><input type="radio" name="higiene" value="Regular" onChange={handleChange} />Regular</label>
                <label><input type="radio" name="higiene" value="Mala" onChange={handleChange} />Mala</label>
              </div>
              <div>
                <label className="block font-bold text-sm">TIPO DE PESO</label>
                <div className='grid grid-cols-2 grid-rows-2'>
                  <label><input type="radio" name="tipoPeso" value="Sobrepeso" onChange={handleChange} />Sobrepeso</label>
                  <label><input type="radio" name="tipoPeso" value="Normal" onChange={handleChange} />Normal</label>
                  <label><input type="radio" name="tipoPeso" value="Obesidad" onChange={handleChange} />Obesidad</label>
                  <label><input type="radio" name="tipoPeso" value="Desnutricion" onChange={handleChange} />Desnutricion</label>
                </div>
              </div>
            </div>
          </div>
          {/* lesiones */}
          <div className='grid grid-cols-3 grid-rows-2 gap-2 justify-items-center items-center'>
            <div className='w-full'>
              <label className="block font-bold text-sm">LESIONES OCULARES</label>
              <input
                className="border border-gray-300 p-1 w-full"
                name="lesionOcular"
                type="text"
                value={formData.lesionOcular}
                onChange={handleChange}
              />
            </div>
            <div className='w-full'>
              <label className="block font-bold text-sm">BOCA, DIENTES, ENCIAS</label>
              <input
                className="border border-gray-300 p-1 w-full"
                name="bocaDienEnc"
                type="text"
                value={formData.bocaDienEnc}
                onChange={handleChange}
              />
            </div>
            <div className='w-full'>
              <label className="block font-bold text-sm">COLUMNA VERTEBRAL</label>
              <input
                className="border border-gray-300 p-1 w-full"
                name="columVert"
                type="text"
                value={formData.columVert}
                onChange={handleChange}
              />
            </div>
            <div className='w-full'>
              <label className="block font-bold text-sm">LESIONES DE OIDO</label>
              <input
                className="border border-gray-300 p-1 w-full"
                name="lesionOido"
                type="text"
                value={formData.lesionOido}
                onChange={handleChange}
              />
            </div>
            <div className='w-full'>
              <label className="block font-bold text-sm">TORAX</label>
              <input
                className="border border-gray-300 p-1 w-full"
                name="torax"
                type="text"
                value={formData.torax}
                onChange={handleChange}
              />
            </div>
            <div className='w-full'>
              <label className="block font-bold text-sm">EXTREMIDADES</label>
              <input
                className="border border-gray-300 p-1 w-full"
                name="extremidades"
                type="text"
                value={formData.extremidades}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* capacidades especiales */}
        <div className='grid grid-rows-[auto_1fr]'>
          <div className='text-center mt-4 bg-gray-200'>
            <label>CAPACIDADES ESPECIALES</label>
          </div>
          <div className='grid grid-cols-5 gap-2 justify-items-center items-center text-center'>
            <div>
              <label className='font-bold'><input type="radio" name="capacEsp" value="Nula" onChange={handleChange} /> Nula</label>
              <p>
                Los sintomas, signos o las secuelas que existen no suponen para el sujeto que las padece ningun impedimento para
                realizar las tareas basicas, complementarias y criticas del puesto.
              </p>
            </div>
            <div>
              <label className='font-bold'><input type="radio" name="capacEsp" value="Leve" onChange={handleChange} /> Leve</label>
              <p>
                Los sintomas, signos y las secuelas limitan parcialmente el desarrollo normal de las tareas criticas del puesto,
                pero no impiden la realizacion de las basicas y complementarias.
              </p>
            </div>
            <div>
              <label className='font-bold'><input type="radio" name="capacEsp" value="Moderada" onChange={handleChange} /> Moderada</label>
              <p>
                Los sintomas, signos y las secuelas suponen una limitacion importante para el sujeto a la hora de desarrollar
                las tareas criticas del puesto, pero puede realizar parcialmente las tareas basicas y complementarias.
              </p>
            </div>
            <div>
              <label className='font-bold'><input type="radio" name="capacEsp" value="Grave" onChange={handleChange} /> Grave</label>
              <p>
                Los sintomas, signos y las secuelas suponen una limitacion importante para el sujeto a la hora de desarrollar
                las tareas criticas del puesto, pero puede realizar parcialmente las tareas basicas y complementarias.
              </p>
            </div>
            <div>
              <label className='font-bold'><input type="radio" name="capacEsp" value="Muy grave" onChange={handleChange} /> Muy grave</label>
              <p>
                Los sintomas, signos y las secuelas imposibilitan al sujeto para la realizacion de las tareas basicas,
                complementarias y criticas del puesto.
              </p>
            </div>
          </div>
        </div>

        {/* calificacion */}
        <div>
          <div className='text-center mt-4 bg-gray-200'>
            <label>CALIFICACION</label>
          </div>
          <div className='grid grid-rows-3 gap-3'>
            <div className='grid grid-cols-[1fr_2fr] gap-4'>
              <label className='font-bold'><input type="radio" name="calificacionFinal" value="Apto" onChange={handleChange} /> Apto</label>
              <p>
                El trabajador podra desempeñar su tarea habitual sin ningun tipo de restriccion fisica ni laboral.
              </p>
            </div>
            <div className='grid grid-cols-[1fr_2fr] gap-4'>
              <label className='font-bold'><input type="radio" name="calificacionFinal" value="Apto con limitaciones" onChange={handleChange} /> Apto con limitaciones</label>
              <p>
                El trabajador puede desarrollar las tareas fundamentales de su puesto (puede realizar mas de 50% de
                su actividad), pero alguna no fundamental no podra desempeñarla; o solo la podra desarrollar de 
                forma parcial.
              </p>
            </div>
            <div className='grid grid-cols-[1fr_2fr] gap-4'>
              <label className='font-bold'><input type="radio" name="calificacionFinal" value="No Apto" onChange={handleChange} /> No Apto</label>
              <p>
                El trabajador, en funcion de sus caracteristicas psicofisicas <em>NO</em> puede desarrollar las tareas
                fundamentales de su puesto de trabajo, y no hay posibilidad de recuperacion.
              </p>
            </div>
          </div>
        </div>

        <div className='mt-4 grid grid-rows-[1fr_auto_2fr_auto]'>
          <div>
            <p>
              Declaro bajo protesta de decir la verdad que la informacion vertida por mi en el presente documento contiene
              la verdad de los hechos y estoy consciente que es causa de rescision del contrato laboral sin responsabilidad
              para el patron el engañarlo en cuanto a aptitudes o facultades de que carezca, lo anterior con fundamento en el
              articulo <em className='font-bold'>47 Fraccion I</em>
            </p>
          </div>
          <div>
            <label className='font-bold'>Nombre completo</label>
            <input className="border border-gray-300 p-1 w-full" type="text" name="nombreCompleto" onChange={handleChange} />
          </div>
          <div className='text-center flex flex-col justify-end items-center h-full'>
            <label>Firma</label>
          </div>
          <div>
            <label className='font-bold'>Realizado por</label>
            <input className="border border-gray-300 p-1 w-full" type="text" name="realizadoPor" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600">Enviar</button>
      </form>
    </>
  );
};

export default ExploracionFisica;