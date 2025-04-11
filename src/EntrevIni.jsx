import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

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
    enProceso: '',
    preparado: '', 
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
  const pdfRef = useRef();

  const fetchFolio = async () => {
    try {
      const response = await axios.get(`http://172.30.189.94:5005/folio/${numFolio}`);
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
        enProceso: formData.enProceso,
        preparado: formData.preparado,
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
        fechaNac: formData.fechaNac,
        createdAt: formData.fecha,
      },
    };
    try {
      const response = await axios.post('http://172.30.189.94:5005/entrevIni', dataToSubmit);
      console.log('Response idUsuario:', response.data.idUsuario);
      fetchFolio();

      const idUsuario = response.data.idUsuario;

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
    formDataToSend.append('document', pdfBlob, `entrevistainicial-${numFolio}.pdf`); // Agregar el PDF
    formDataToSend.append('idUsuario', idUsuario); // Agregar idUsuario

    // Enviar el PDF al backend
    const pdfUploadResponse = await axios.post('http://172.30.189.94:5005/pdf/upload-single-doc', formDataToSend, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    console.log('PDF subido con éxito:', pdfUploadResponse.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const [selectedEscolaridad, setSelectedEscolaridad] = useState('');
  const [selectedActualDedica, setSelectedActualDedica] = useState('');
  const [otherActualDedica, setOtherActualDedica] = useState('');
  const [selectedEntroEmpleo, setSelectedEntroEmpleo] = useState('');
  const [enQueArea, setEnQueArea] = useState('');
  const [selectedPendiente, setSelectedPendiente] = useState('');
  const [selectedCuidador, setSelectedCuidador] = useState('');
  const [selectedAreaOPlanta, setSelectedAreaOPlanta] = useState('');
  const [workedBefore, setWorkedBefore] = useState(false);
  const [children, setChildren] = useState(false);
  const [renta, setRenta] = useState(false);
  const [fonacot, setFonacot] = useState(false);
  const [infonavit, setInfonavit] = useState(false);
  const [antecedentes, setAntecedentes] = useState(false);
  const [bono, setBono] = useState(false);
  const [otherEscolaridad, setOtherEscolaridad] = useState('');
  const [otherArea, setOtherArea] = useState('');
  const [otherCuidador, setOtherCuidador] = useState('');
  const [otherEntroEmpleo, setOtherEntroEmpleo] = useState('');

  useEffect(() => {
    if (selectedEscolaridad !== 'Otro') {
      setOtherEscolaridad('');
    }
  }, [selectedEscolaridad]);

  useEffect(() => {
    if (selectedActualDedica !== 'Otro') {
      setOtherActualDedica('');
    }
  }, [selectedActualDedica]);

  useEffect(() => {
    if (selectedCuidador !== 'Otro') {
      setOtherCuidador('');
    }
  }, [selectedCuidador]);

  useEffect(() => {
    if (selectedEntroEmpleo !== 'Otro') {
      setOtherEntroEmpleo('');
    }
  }, [selectedEntroEmpleo]);

  const handleRadioChange = (setter) => (e) => {
    setter(e.target.value);
  };

  return (
    <>
      <div className='flex flex-cols justify-center items-center'>
        <div className="w-50 flex flex-col">
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
        <div className="w-50 flex flex-col mt-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNac"
            value={formData.fechaNac}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <form ref={pdfRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <img alt="ATR Nayarit Logo" className="h-31 w-68" src="LOGO ATR_LOGO ATR NEGRO.png" />
          <div className="text-center bg-gray-200">
            <h1 className="text-xl font-bold">ENTREVISTA INICIAL | DEPARTAMENTO DE RECLUTAMIENTO</h1>
            <div className="flex space-x-2">
              <div>ÁREA QUE SE DIRIGE:</div>
              <input className="border border-gray-300 p-2" name='areaDirige' value={formData.areaDirige} onChange={handleChange} type="text" />
            </div>
            <div className="flex space-x-2">
              <div>PUESTO:</div>
              <input className="border border-gray-300 p-2" name='puesto' value={formData.puesto} onChange={handleChange} type="text" />
            </div>
            <div className="flex space-x-2">
              <div>TURNO:</div>
              <input className="border border-gray-300 p-2" name='turno' value={formData.turno} onChange={handleChange} type="text" />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-4">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label>NOMBRE (S)</label>
              <input className="w-full border border-gray-300 p-2 leading-[4] h-10" name='nombre' value={formData.nombre} onChange={handleChange} type="text" />
            </div>
            <div>
              <label>APELLIDO PATERNO</label>
              <input className="w-full border border-gray-300 p-2" name='apellidoPat' value={formData.apellidoPat} onChange={handleChange} type="text" />
            </div>
            <div>
              <label>APELLIDO MATERNO</label>
              <input className="w-full border border-gray-300 p-2" name='apellidoMat' value={formData.apellidoMat} onChange={handleChange} type="text" />
            </div>
            <div>
              <label>EDAD</label>
              <input className="w-full border border-gray-300 p-2" name='edad' value={formData.edad} onChange={handleChange} type="number" />
            </div>
            <div>
              <label>SEXO</label>
              <div className="flex space-x-2">
                <label>
                  <input type="radio" name="sexo" value="H" checked={formData.sexo === 'H'} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} />H
                </label>
                <label>
                  <input type="radio" name="sexo" value="M" checked={formData.sexo === 'M'} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} />M
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Address and Contact Information */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>CALLE</label>
              <input className="w-full border border-gray-300 p-2" name='calle' value={formData.calle} onChange={handleChange} type="text" />
            </div>
            <div>
              <label>NÚMERO</label>
              <input className="w-full border border-gray-300 p-2" name='numero' value={formData.numero} onChange={handleChange} type="number" />
            </div>
            <div>
              <label>COLONIA</label>
              <input className="w-full border border-gray-300 p-2" name='colonia' value={formData.colonia} onChange={handleChange} type="text" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label>TELÉFONO PERSONAL</label>
              <input className="w-full border border-gray-300 p-2" name='tel_personal' value={formData.tel_personal} onChange={handleChange} type="text" />
            </div> 
            <div>
              <label>TEL. FAMILIAR</label>
              <input className="w-full border border-gray-300 p-2" name='tel_emergencia' value={formData.tel_emergencia} onChange={handleChange} type="text" />
            </div>
          </div>
        </div>

        {/* Marital Status */}
        <div className="mb-4">
          <div className="flex space-x-4">
            <div>ESTADO CIVIL:</div>
            <label>
              <input type="radio" name="estadoCivil" value="Soltero (a)" checked={formData.estado_civil === 'Soltero (a)'} onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })} />Soltero (a)
            </label>
            <label>
              <input type="radio" name="estadoCivil" value="Casado" checked={formData.estado_civil === 'Casado'} onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })} />Casado (a)
            </label>
            <label>
              <input type="radio" name="estadoCivil" value="Unión Libre" checked={formData.estado_civil === 'Unión Libre'} onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })} />Unión Libre
            </label>
            <label>
              <input type="radio" name="estadoCivil" value="Separado (a)" checked={formData.estado_civil === 'Separado (a)'} onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })} />Separado (a)
            </label>
            <label>
              <input type="radio" name="estadoCivil" value="Viudo (a)" checked={formData.estado_civil === 'Viudo (a)'} onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })} />Viudo (a)
            </label>
          </div>
        </div>

        {/* Education */}
        <div className="mb-4">
          <div className="flex space-x-4">
            <div>ESCOLARIDAD:</div>
            <label>
              <input type="radio" name="escolaridad" value="Primaria" checked={selectedEscolaridad === 'Primaria'} onChange={(e) => {
                setSelectedEscolaridad(e.target.value);
                setFormData({ ...formData, escolaridad: e.target.value });
              }} />PRIMARIA
            </label>
            <label>
              <input type="radio" name="escolaridad" value="Secundaria" checked={selectedEscolaridad === 'Secundaria'} onChange={(e) => {
                setSelectedEscolaridad(e.target.value);
                setFormData({ ...formData, escolaridad: e.target.value });
              }} />SECUNDARIA
            </label>
            <label>
              <input type="radio" name="escolaridad" value="Bachillerato" checked={selectedEscolaridad === 'Bachillerato'} onChange={(e) => {
                setSelectedEscolaridad(e.target.value);
                setFormData({ ...formData, escolaridad: e.target.value });
              }} />PREPARATORIA
            </label>
            <label>
              <input type="radio" name="escolaridad" value="Otro" checked={selectedEscolaridad === 'Otro'} onChange={(e) => {
                setSelectedEscolaridad(e.target.value);
                setFormData({ ...formData, escolaridad: otherEscolaridad });
              }} />OTRO
            </label>
            <input className="border border-gray-300 p-2" type="text" value={otherEscolaridad} onChange={(e) => {
              setOtherEscolaridad(e.target.value);
              if (selectedEscolaridad === 'Otro') {
                setFormData({ ...formData, escolaridad: e.target.value });
              }
            }} readOnly={selectedEscolaridad !== 'Otro'} />
          </div>
        </div>

        {/* Current Employment Status */}
        <div className="mb-4">
          <div>Actualmente, ¿A qué se dedica?</div>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="actualDedica"
                value="Estudiante"
                checked={selectedActualDedica === 'Estudiante'}
                onChange={(e) => {
                  setSelectedActualDedica(e.target.value);
                  setFormData({ ...formData, actualDedica: e.target.value });
                }}
              />
              ESTUDIANTE
            </label>
            <label>
              <input
                type="radio"
                name="actualDedica"
                value="Desempleado"
                checked={selectedActualDedica === 'Desempleado'}
                onChange={(e) => {
                  setSelectedActualDedica(e.target.value);
                  setFormData({ ...formData, actualDedica: e.target.value });
                }}
              />
              DESEMPLEADO
            </label>
            <label>
              <input
                type="radio"
                name="actualDedica"
                value="Otro"
                checked={selectedActualDedica === 'Otro'}
                onChange={(e) => {
                  setSelectedActualDedica(e.target.value);
                  setFormData({ ...formData, actualDedica: otherActualDedica });
                }}
              />
              OTRO:
            </label>
            <input
              className="border border-gray-300 p-2"
              type="text"
              value={otherActualDedica}
              onChange={(e) => {
                setOtherActualDedica(e.target.value);
                if (selectedActualDedica === 'Otro') {
                  setFormData({ ...formData, actualDedica: e.target.value });
                }
              }}
              readOnly={selectedActualDedica !== 'Otro'}
            />
          </div>
        </div>

        {/* How did you hear about the job? */}
        <div className="mb-4">
          <div>¿Cómo se enteró del Empleo?</div>
          <div className="flex space-x-4">
            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Reingreso" 
                checked={selectedEntroEmpleo === 'Reingreso'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }} 
              />REINGRESO
            </label>
            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Volante" 
                checked={selectedEntroEmpleo === 'Volante'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }} 
              />VOLANTE
            </label>
            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Publicidad en Poste" 
                checked={selectedEntroEmpleo === 'Publicidad en Poste'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }} 
              />PUBLICIDAD EN POSTE
            </label>
            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Espectacular" 
                checked={selectedEntroEmpleo === 'Espectacular'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }} 
              />ESPECTACULAR
            </label>
          </div>
          <div className='flex space-x-4'>

            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Facebook" 
                checked={selectedEntroEmpleo === 'Facebook'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }} 
              />FACEBOOK
            </label>
            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Bono Padrino" 
                checked={selectedEntroEmpleo === 'Bono Padrino'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }} 
              />BONO PADRINO
            </label>
            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Anuncio Parlante" 
                checked={selectedEntroEmpleo === 'Anuncio Parlante'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }} 
              />ANUNCIO PARLANTE
            </label>
            <label>
              <input 
                type="radio" 
                name="enteroEmpleo" 
                value="Otro" 
                checked={selectedEntroEmpleo === 'Otro'} 
                onChange={(e) => {
                  setSelectedEntroEmpleo(e.target.value);
                  setFormData({ ...formData, enteroEmpleo: otherEntroEmpleo });
                }} 
              />OTRO:
            </label>
            <input 
              className="border border-gray-300 p-2" 
              type="text" 
              value={otherEntroEmpleo} 
              onChange={(e) => {
                setOtherEntroEmpleo(e.target.value);
                if (selectedEntroEmpleo === 'Otro') {
                  setFormData({ ...formData, enteroEmpleo: e.target.value });
                }
              }} 
              readOnly={selectedEntroEmpleo !== 'Otro'} 
            />
          </div>
        </div>

        {/* Previous Employment */}
        <div className="mb-4">
          <div>Anteriormente, ¿ha trabajado con nosotros?</div>
          <div className="flex space-x-4">
            <label>
              <input 
                type="radio" 
                name="workedBefore" 
                value="Sí" 
                checked={workedBefore} 
                onChange={() => {
                  setWorkedBefore(true); 
                  setFormData({ ...formData, numIngresos: 0, enQueArea: '', procesoLinea: '', otraArea: '', motivoRenuncia: '' }); 
                  setEnQueArea('');
                  setOtherArea('');
                }} 
              />Sí
            </label>
            <label>
              <input 
                type="radio" 
                name="workedBefore" 
                value="No" 
                checked={!workedBefore} 
                onChange={() => {
                  setWorkedBefore(false); 
                  setFormData({ ...formData, numIngresos: 0, enQueArea: '', procesoLinea: '', otraArea: '', motivoRenuncia: '' }); 
                  setEnQueArea('');
                  setOtherArea('');
                }} 
              />No
            </label>
          </div>
          <div>
            <label>Número de Ingresos:</label>
            <input 
              className="border border-gray-300 p-2" 
              type="number" 
              name="numIngresos" 
              value={formData.numIngresos} 
              onChange={handleChange} 
              readOnly={!workedBefore} 
            />
            <div className="mt-4">
              <div>¿En qué área?</div>
              <div className="flex space-x-4">
                <label>
                  <input 
                    type="radio" 
                    name="enQueArea" 
                    value="Medios" 
                    checked={enQueArea === 'Medios'} 
                    onChange={() => {
                      setEnQueArea('Medios');
                      setFormData({ ...formData, enQueArea: 'Medios' });
                    }}
                    disabled={!workedBefore} 
                  />MEDIOS
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="enQueArea" 
                    value="Corte" 
                    checked={enQueArea === 'Corte'} 
                    onChange={() => {
                      setEnQueArea('Corte');
                      setFormData({ ...formData, enQueArea: 'Corte' });
                    }}
                    disabled={!workedBefore} 
                  />CORTE
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="enQueArea" 
                    value="Ensamble" 
                    checked={enQueArea === 'Ensamble'} 
                    onChange={() => {
                      setEnQueArea('Ensamble');
                      setFormData({ ...formData, enQueArea: 'Ensamble' });
                    }}
                    disabled={!workedBefore}
                  />ENSAMBLE
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="enQueArea" 
                    value="Otro" 
                    checked={enQueArea === 'Otro'} 
                    onChange={() => {
                      setEnQueArea('Otro');
                      setFormData({ ...formData, enQueArea: otherArea }); // Guardar en formData
                    }} 
                    disabled={!workedBefore} 
                  />OTRO
                </label>
                <label>PROCESO DE LÍNEA:</label>
                <input 
                  className="border border-gray-300 p-2" 
                  type="text" 
                  name="procesoLinea" 
                  value={formData.procesoLinea} 
                  onChange={handleChange} 
                  readOnly={!workedBefore} 
                />
                <label>OTRA ÁREA:</label>
                <input 
                  className="border border-gray-300 p-2" 
                  type="text" 
                  name="otraArea" 
                  value={otherArea} 
                  onChange={(e) => {
                    setOtherArea(e.target.value);
                    if (enQueArea === 'Otro') {
                      setFormData({ ...formData, enQueArea: e.target.value }); // Guardar en formData
                    }
                  }} 
                  disabled={enQueArea !== 'Otro'}  
                />
              </div>
            </div>
            <div className="mt-4">
              <div>Motivo de renuncia o retiro:</div>
              <input 
                className="w-full border border-gray-300 p-2" 
                type="text" 
                name="motivoRenuncia" 
                value={formData.motivoRenuncia} 
                onChange={handleChange} 
                readOnly={!workedBefore} 
              />
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className="mb-4">
          <div>¿Tienes hijos?</div>
          <div className="flex space-x-4">
            <label>
              <input type="radio"  value="Sí" checked={children} onChange={() => {
                setChildren(true);
                setFormData({ ...formData, cant_hijos: '', edades_hijos: '', trab_cuidador: '' }); // Reiniciar los campos
                setSelectedCuidador(''); // Limpiar la selección de cuidador
              }} />Sí
            </label>
            <label>
              <input type="radio"  value="No" checked={!children} onChange={() => {
                setChildren(false);
                setFormData({ ...formData, cant_hijos: '', edades_hijos: '', trab_cuidador: '' }); // Reiniciar los campos si no tiene hijos
                setSelectedCuidador(''); // Limpiar la selección de cuidador
              }} />No
            </label>
            <div>Cuantos</div>
            <input className="border border-gray-300 p-2" type="text" name="cant_hijos" value={formData.cant_hijos} onChange={handleChange} readOnly={!children} />
            <div>Edades de sus hijos</div>
            <input className="border border-gray-300 p-2" type="text" name="edades_hijos" value={formData.edades_hijos} onChange={handleChange} readOnly={!children} />
          </div>
          <div className="mt-4">
            <div>¿Quién los cuida?</div>
            <div className="flex space-x-4">
              <label>
                <input 
                  type="radio" 
                  name="cuidador" 
                  value="Esposo (A)" 
                  checked={selectedCuidador === 'Esposo (A)'} 
                  onChange={() => {
                    setSelectedCuidador('Esposo (A)');
                    setFormData({ ...formData, cuidador: 'Esposo (A)' }); // Guardar en formData
                  }} 
                  disabled={!children} 
                />ESPOSO (A)
              </label>
              <label>
                <input 
                  type="radio" 
                  name="cuidador" 
                  value="Abuelo (A)" 
                  checked={selectedCuidador === 'Abuelo (A)'} 
                  onChange={() => {
                    setSelectedCuidador('Abuelo (A)');
                    setFormData({ ...formData, cuidador: 'Abuelo (A)' }); // Guardar en formData
                  }} 
                  disabled={!children} 
                />ABUELO (A)
              </label>
              <label>
                <input 
                  type="radio" 
                  name="cuidador" 
                  value="Vecino (A)" 
                  checked={selectedCuidador === 'Vecino (A)'} 
                  onChange={() => {
                    setSelectedCuidador('Vecino (A)');
                    setFormData({ ...formData, cuidador: 'Vecino (A)' }); // Guardar en formData
                  }} 
                  disabled={!children} 
                />VECINO (A)
              </label>
              <label>
                <input 
                  type="radio" 
                  name="cuidador" 
                  value="Otro" 
                  checked={selectedCuidador === 'Otro'} 
                  onChange={() => {
                    setSelectedCuidador('Otro');
                    setFormData({ ...formData, cuidador: otherCuidador }); // Guardar en formData
                  }} 
                  disabled={!children} 
                />OTRO:
              </label>
              <input 
                className="border border-gray-300 p-2" 
                type="text" 
                value={otherCuidador} 
                onChange={(e) => {
                  setOtherCuidador(e.target.value);
                  if (selectedCuidador === 'Otro') {
                    setFormData({ ...formData, cuidador: e.target.value }); // Guardar en formData
                  }
                }} 
                disabled={selectedCuidador !== 'Otro'} 
              />
              <div className="mt-4">
                <label>¿Trabaja el cuidador?</label>
                <input 
                  className="border border-gray-300 p-2" 
                  type="text" 
                  name="trab_cuidador" 
                  value={formData.trab_cuidador} 
                  onChange={handleChange} 
                  readOnly={!children} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Last Two Jobs Information */}
        <div className="mb-4">
          <div>Información de los últimos dos empleos</div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            <div>
              <label>EMPRESA</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="empresa1" value={formData.empresa1} onChange={handleChange} />
            </div>
            <div>
              <label>MOTIVO DE SALIDA</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="motivoSal1" value={formData.motivoSal1} onChange={handleChange} />
            </div>
            <div>
              <label>DURACIÓN</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="duracion1" value={formData.duracion1} onChange={handleChange} />
            </div>
            <div>
              <label>SALARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="salario1" value={formData.salario1} onChange={handleChange} />
            </div>
            <div>
              <label>HORARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="horario1" value={formData.horario1} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            <div>
              <label>EMPRESA</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="empresa2" value={formData.empresa2} onChange={handleChange} />
            </div>
            <div>
              <label>MOTIVO DE SALIDA</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="motivoSal2" value={formData.motivoSal2} onChange={handleChange} />
            </div>
            <div>
              <label>DURACIÓN</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="duracion2" value={formData.duracion2} onChange={handleChange} />
            </div>
            <div>
              <label>SALARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="salario2" value={formData.salario2} onChange={handleChange} />
            </div>
            <div>
              <label>HORARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" name="horario2" value={formData.horario2} onChange={handleChange} />
            </div>
          </div>
          <div className="mt-4">
            <div>
              <label>¿Cuanto tiempo tienes sin trabajar? </label>
              <input className="border border-gray-300 p-2" type="text" name="tiempoSinTrab" value={formData.tiempoSinTrab} onChange={handleChange} />
            </div>
            <div>
              <label>¿Hace cuanto tiempo saliste del ultimo empleo? </label>
              <input className="border border-gray-300 p-2" type="text" name="tiempoSalida" value={formData.tiempoSalida} onChange={handleChange} />
            </div>
            <div>
              <label>¿A que se debia que no trabajaba? </label>
              <input className="border border-gray-300 p-2" type="text" name="motivoNoTrab" value={formData.motivoNoTrab} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Pending Issues */}
        <div className="mb-4 grid grid-cols-2">
          <div className="">
            <div>¿Tienes algun pendiente?</div>
            <input className="border border-gray-300 p-2" type="text" name="pendientes" value={formData.pendientes} onChange={handleChange} />
            <div className="flex space-x-4 mt-4">
              <label>Paga Renta</label>
              <label>
                <input type="radio" name="renta" value="Sí" checked={renta} onChange={() => setRenta(true)} />Sí
              </label>
              <label>
                <input type="radio" name="renta" value="No" checked={!renta} onChange={() => setRenta(false)} />No
              </label>
              <input className="border border-gray-300 p-2" type="number" name="renta" value={formData.renta} onChange={handleChange} readOnly={!renta} />
            </div>
            <div className="flex space-x-4 mt-4">
              <label>FONACOT</label>
              <label>
                <input type="radio" name="fonacot" value="Sí" checked={fonacot} onChange={() => setFonacot(true)} />Sí
              </label>
              <label>
                <input type="radio" name="fonacot" value="No" checked={!fonacot} onChange={() => setFonacot(false)} />No
              </label>
              <input className="border border-gray-300 p-2" type="number" name="fonacot" value={formData.fonacot} onChange={handleChange} readOnly={!fonacot} />
            </div>
            <div className="flex space-x-4 mt-4">
              <label>INFONAVIT</label>
              <label>
                <input type="radio" name="infonavit" value="Sí" checked={infonavit} onChange={() => setInfonavit(true)} />Sí
              </label>
              <label>
                <input type="radio" name="infonavit" value="No" checked={!infonavit} onChange={() => setInfonavit(false)} />No
              </label>
              <input className="border border-gray-300 p-2" type="number" name="infonavit" value={formData.infonavit} onChange={handleChange} readOnly={!infonavit} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <label>¿Tiene Antecedentes Penales?</label>
            <div className="flex space-x-4">
              <label>
                <input type="radio"  value="Sí" checked={antecedentes} onChange={() => setAntecedentes(true)} />Sí
              </label>
              <label>
                <input type="radio"  value="No" checked={!antecedentes} onChange={() => setAntecedentes(false)} />No
              </label>
            </div>
            <div>
              <label>Motivo</label>
              <input className="border border-gray-300 p-2" type="text" name="antecedentesPen" value={formData.antecedentesPen} onChange={handleChange} readOnly={!antecedentes} />
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label>FECHA:</label>
            <input className="w-full border border-gray-300 p-2" type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
          </div>
          <div>
            <label>FIRMA DEL DPTO. RECLUTAMIENTO</label>
            <input className="w-full border-b border-gray-300 p-2" type="text" name="firmaReclutamiento" />
          </div>
        </div>

        {/* Training Department */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-center">DEPARTAMENTO DE ENTRENAMIENTO</label>
            <div className="grid grid-cols-2">
              <div>
                <div>
                  <label>IMAGE </label>
                  <input className="border border-gray-300 p-2" type="text" name="image" value={formData.image} onChange={handleChange} />
                </div>
                <div>
                  <label>ENCINTE </label>
                  <input className="border border-gray-300 p-2" type="text" name="encinte" value={formData.encinte} onChange={handleChange} />
                </div>
                <div>
                  <label>TRICKY </label>
                  <input className="border border-gray-300 p-2" type="text" name="tricky" value={formData.tricky} onChange={handleChange} />
                </div>
                <div>
                  <label>ARTESANAL </label>
                  <input className="border border-gray-300 p-2" type="text" name="artesanal" value={formData.artesanal} onChange={handleChange} />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div>
                  <label>EN PROCESO </label>
                  <input className="border border-gray-300 p-2" type="text" name="enProceso" value={formData.enProceso} onChange={handleChange} />
                </div>
                <div>
                  <label> PREPARADO </label>
                  <input className="border border-gray-300 p-2" type="text" name="preparado" value={formData.preparado} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div>
              <label>FIRMA DEL ENTRENADOR</label>
              <input className="w-full border-b border-gray-300 p-2" type="text" name="firmaEntrenador" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-center">DEPARTAMENTO MEDICO</label>
            <div className="">
              <div>
                <div>
                  <label>COMPRENSION </label>
                  <input className="w-full border border-gray-300 p-2" type="text" name="comprension" value={formData.comprension} onChange={handleChange} />
                </div>
                <div>
                  <label>VISTA </label>
                  <input className="w-full border border-gray-300 p-2" type="text" name="vista" value={formData.vista} onChange={handleChange} />
                </div>
                <div>
                  <label>CALIFICACION </label>
                  <input className="w-full border border-gray-300 p-2" type="text" name="calificacion" value={formData.calificacion} onChange={handleChange} />
                </div>
                <div>
                  <label>COMENTARIOS </label>
                  <input className="w-full border border-gray-300 p-2" type="text" name="comentarios" value={formData.comentarios} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div>
              <label>FIRMA ENFERMERIA</label>
              <input className="w-full border-b border-gray-300 p-2" type="text" name="firmaEnfermeria" />
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mb-4">
          <div>¿Es Recomendado?</div>
          <div className="flex space-x-4">
            <label>
              <input type="radio" value="Sí" checked={bono} onChange={() => setBono(true)} />Sí
            </label>
            <label>
              <input type="radio" value="No" checked={!bono} onChange={() => setBono(false)} />No
            </label>
            <label>Pago bono contratacion:</label>
            <input className="w-full border border-gray-300" type="number" name="bonoContr" value={formData.bonoContr} onChange={handleChange} readOnly={!bono} />
            <label>Reloj de quien lo recomendó</label>
            <input className="w-full border border-gray-300" type="number" name="bonoContr" value={''} onChange={handleChange} readOnly={!bono} />
          </div>
        </div>

        {/* Area Placement */}
        <div className="mb-4">
          <div>¿A qué área o planta?</div>
          <div className="flex flex-row space-x-4">
            <div className="space-x-2">
              <label>
                <input 
                  type="radio" 
                  name="areaOPlanta" 
                  value="Medios" 
                  checked={selectedAreaOPlanta === 'Medios'} 
                  onChange={(e) => {
                    setSelectedAreaOPlanta(e.target.value);
                    setFormData({ ...formData, areaOPlanta: e.target.value });
                  }} 
                />MEDIOS
              </label>
              <label>
                <input 
                  type="radio" 
                  name="areaOPlanta" 
                  value="Corte" 
                  checked={selectedAreaOPlanta === 'Corte'} 
                  onChange={(e) => {
                    setSelectedAreaOPlanta(e.target.value);
                    setFormData({ ...formData, areaOPlanta: e.target.value });
                  }} 
                />CORTE
              </label>
              <label>
                <input 
                  type="radio" 
                  name="areaOPlanta" 
                  value="TP1" 
                  checked={selectedAreaOPlanta === 'TP1'} 
                  onChange={(e) => {
                    setSelectedAreaOPlanta(e.target.value);
                    setFormData({ ...formData, areaOPlanta: e.target.value });
                  }} 
                />TP1
              </label>
              <label>
                <input 
                  type="radio" 
                  name="areaOPlanta" 
                  value="TP2" 
                  checked={selectedAreaOPlanta === 'TP2'} 
                  onChange={(e) => {
                    setSelectedAreaOPlanta(e.target.value);
                    setFormData({ ...formData, areaOPlanta: e.target.value });
                  }} 
                />TP2
              </label>
              <label>
                <input 
                  type="radio" 
                  name="areaOPlanta" 
                  value="TP3" 
                  checked={selectedAreaOPlanta === 'TP3'} 
                  onChange={(e) => {
                    setSelectedAreaOPlanta(e.target.value);
                    setFormData({ ...formData, areaOPlanta: e.target.value });
                  }} 
                />TP3
              </label>
              <label>
                <input 
                  type="radio" 
                  name="areaOPlanta" 
                  value="TP4" 
                  checked={selectedAreaOPlanta === 'TP4'} 
                  onChange={(e) => {
                    setSelectedAreaOPlanta(e.target.value);
                    setFormData({ ...formData, areaOPlanta: e.target.value });
                  }} 
                />TP4
              </label>
            </div>
            <div className="space-x-2">
              <label>Nombre completo:</label>
              <input 
                className="w-90 border border-gray-300 p-2" 
                type="text" 
                name="nombreCompleto" 
                value={formData.nombreCompleto} 
                onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })} 
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="pr-38">
              <label>Otro:</label>
              <input 
                className="border border-gray-300 p-2" 
                type="text" 
                name="otroArea" 
                value={formData.otroArea} 
                onChange={(e) => setFormData({ ...formData, otroArea: e.target.value })} 
                readOnly={selectedAreaOPlanta !== 'Otro'} 
              />
            </div>
            <div>
              <label className="pr-14">Firma:</label>
              <input 
                className="w-90 border-b border-gray-300 p-2" 
                type="text" 
                name="firmaArea" 
                value={formData.firmaArea} 
                onChange={(e) => setFormData({ ...formData, firmaArea: e.target.value })} 
              />
            </div>
          </div>
        </div>
      </form>
      <button 
        type="submit" 
        className="mt-4 p-2 bg-blue-500 text-white"
        onClick={() => pdfRef.current.dispatchEvent(new Event('submit', { bubbles: true }))} // Llama a submit del formulario
      >
        Enviar Entrevista Inicial
      </button>
    </>
  );
};

export default EntrevIniForm;