import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from './authStore';

function ExamenMedico() {
    const [usuario, setUsuario] = useState(null);
    const [antecedentesPatologicos, setAntecedentesPatologicos] = useState([]);
    const [entrevistaInicial, setEntrevistaInicial] = useState(null);
    const [examMed, setExamMed] = useState(null);
    const [formData, setFormData] = useState({
        planta: '',
        fecha: '',
        alcoholismo: '',
        frecuenciaAlcoholismo: '',
        deporte: '',
        frecuenciaDeporte: '',
        tabaquismo: '',
        frecuenciaTabaquismo: '',
        drogas: '',
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
        antecFam: [],
        selecAntecPatolog: [],
    });
    const user = useAuthStore((state) => state.user);
    const idFolio = user?.idFolio;
    const numFolio = user?.numFolio;
    const pdfRef = useRef();

    const fetchEntrevIniData = async () => {
        try {
            const response = await axios.get(`http://172.30.189.106:5005/usuario/folio/${idFolio}`);
            setUsuario(response.data);
            setEntrevistaInicial(response.data.entrevistaInicial);
            setExamMed(response.data.examenMedico);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching entrevista inicial data", error);
        }
    }

    const fetchAntecedentesPatologicos = async () => {
      try {
        const response = await axios.get('http://172.30.189.106:5005/antecPatolog');
        setAntecedentesPatologicos(response.data);
      } catch (error) {
        console.error('Error al obtener antecedentes patológicos:', error);
      }
    };

    useEffect(() => {
        fetchEntrevIniData();
        fetchAntecedentesPatologicos();
    }, [])

    // const exportToPDF = () => {
    //     const input = pdfRef.current;

    //     html2canvas(input, { scale: 0.8 }).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'mm', 'legal');
    //         const imgWidth = 216;
    //         const pageHeight = 330;
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //         if (imgHeight > pageHeight) {
    //             const scaleFactor = pageHeight / imgHeight;
    //             pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, (imgHeight * scaleFactor) + 30);
    //         } else {
    //             pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    //         }

    //         pdf.save('examenmedicoNormal.pdf');
    //     });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Manejo de alcoholismo
        if (name === 'alcoholismo') {
            if (value === 'no') {
                setFormData((prev) => ({
                    ...prev,
                    alcoholismo: value,
                    frecuenciaAlcoholismo: '', // limpiar
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    alcoholismo: value,
                    frecuenciaAlcoholismo: '', // limpiar también aquí por si acaso
                }));
            }
            return;
        }
    
        // Manejo de deporte
        if (name === 'deporte') {
            if (value === 'no') {
                setFormData((prev) => ({
                    ...prev,
                    deporte: value,
                    frecuenciaDeporte: '', // limpiar
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    deporte: value,
                    frecuenciaDeporte: '', // limpiar también aquí por si acaso
                }));
            }
            return;
        }
    
        // Manejo de tabaquismo
        if (name === 'tabaquismo') {
            if (value === 'no') {
                setFormData((prev) => ({
                    ...prev,
                    tabaquismo: value,
                    frecuenciaTabaquismo: '', // limpiar
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    tabaquismo: value,
                    frecuenciaTabaquismo: '', // limpiar también aquí por si acaso
                }));
            }
            return;
        }
    
        // Manejo de drogas
        if (name === 'drogas') {
            if (value === 'no') {
                setFormData((prev) => ({
                    ...prev,
                    drogas: value,
                    frecuenciaDrogas: '', // limpiar
                    cualDroga: '', // limpiar
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    drogas: value,
                    frecuenciaDrogas: '', // limpiar también aquí por si acaso
                    cualDroga: '', // limpiar también aquí por si acaso
                }));
            }
            return;
        }
    
        // Actualiza el resto de los campos
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
      const { name, value, checked } = e.target;
      if (checked) {
          setFormData((prevData) => ({
              ...prevData,
              [name]: [...prevData[name], parseInt(value, 10)], // Convertir el ID a entero
          }));
      } else {
          setFormData((prevData) => ({
              ...prevData,
              [name]: prevData[name].filter((item) => item !== parseInt(value, 10)), // Filtrar el ID desmarcado
          }));
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Filtra los objetos incompletos en antecFam
        const formattedAntecFam = formData.antecFam
            .filter((item) => item.edad || item.enfermedad || item.causaMuerte)
            .map((item, index) => ({
                parentesco: item.parentesco || ["PADRE", "MADRE", "ESPOSO (A)", "HERMANO (A)", "HIJO (A)"][index],
                edad: item.edad ? parseInt(item.edad, 10) : null,
                enfermedad: item.enfermedad || '',
                causaMuerte: item.causaMuerte || '',
            }));

        // Enviar datos del examen médico al backend
        const examMedicoResponse = await axios.post('http://172.30.189.106:5005/examMedico', {
            examMedicoData: {
                planta: formData.planta,
                fecha: new Date(formData.fecha),
                alcoholismo: formData.alcoholismo === 'si' ? formData.frecuenciaAlcoholismo : null,
                deporte: formData.deporte === 'si' ? formData.frecuenciaDeporte : null,
                tabaquismo: formData.tabaquismo === 'si' ? formData.frecuenciaTabaquismo : null,
                drogas: formData.drogas === 'si' ? `${formData.cualDroga}, ${formData.frecuenciaDrogas}` : null,
                observaciones: formData.observaciones.trim() ? formData.observaciones : null,
                fechaUltMens: formData.fechaUltMens ? new Date(formData.fechaUltMens) : null,
                metPlanFam: formData.metPlanFam.trim() ? formData.metPlanFam : null,
                numEmb: formData.numEmb ? parseInt(formData.numEmb, 10) : null,
                partos: formData.partos ? parseInt(formData.partos, 10) : null,
                cesareas: formData.cesareas ? parseInt(formData.cesareas, 10) : null,
                abortos: formData.abortos ? parseInt(formData.abortos, 10) : null,
                otraEnferm: formData.otraEnferm,
                idUsuario: usuario.idUsuario,
            },
            antecFam: formattedAntecFam,
            selecAntecPatolog: formData.selecAntecPatolog,
        });

        console.log('Examen Médico creado:', examMedicoResponse.data);

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
        formDataToSend.append('document', pdfBlob, `examenmedico-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', usuario.idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.106:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);
    } catch (error) {
        console.error('Error al crear Examen Médico o subir PDF:', error);
    }
};

    const handleAntecFamChange = (index, field, value) => {
      const newAntecFam = [...formData.antecFam];
      const parentescos = ["PADRE", "MADRE", "ESPOSO (A)", "HERMANO (A)", "HIJO (A)"];
  
      // Asegurarse de que el objeto exista
      if (!newAntecFam[index]) {
          newAntecFam[index] = { parentesco: parentescos[index], edad: '', enfermedad: '', causaMuerte: '' };
      }
  
      // Actualiza el campo correspondiente
      newAntecFam[index][field] = value;
  
      // Asegurarse de que el parentesco esté asignado correctamente
      newAntecFam[index].parentesco = parentescos[index];
  
      setFormData((prevData) => ({
          ...prevData,
          antecFam: newAntecFam,
      }));
    };

    if (!entrevistaInicial) {
      return <div className="text-center">Por favor, completa la entrevista inicial antes de continuar con este paso.</div>;
    }

    if (examMed) {
      return <div className="text-center">Ya realizaste el examen médico.</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit} ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <img alt="ATR Nayarit Logo" className="h-31" src="logo.png" />
                    <div className="text-center bg-gray-200">
                        <h1 className="text-xl ">EXAMEN MEDICO</h1>
                        <div className='flex flex-row'>
                            <div className="flex space-x-2">
                                <div>PLANTA</div>
                                <input name="planta" className="border border-gray-300 p-2" type="text" onChange={handleChange} />
                            </div>
                            <div className="flex space-x-2">
                                <div>FECHA</div>
                                <input name="fecha" className="border border-gray-300 p-2" type="date" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="mb-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label>APELLIDO PATERNO</label>
                            <input name="apellidoPaterno" className="w-full border border-gray-300 p-2" type="text" value={usuario.apellidoPat} readOnly />
                        </div>
                        <div>
                            <label>APELLIDO MATERNO</label>
                            <input name="apellidoMaterno" className="w-full border border-gray-300 p-2" type="text" value={usuario.apellidoMat} readOnly />
                        </div>
                        <div>
                            <label>NOMBRE (S)</label>
                            <input name="nombre" className="w-full border border-gray-300 p-2" type="text" value={usuario.nombre} readOnly />
                        </div>
                        <div>
                            <label>FECHA NACIMIENTO</label>
                            <input name="fechaNacimiento" className="w-full border border-gray-300 p-2" type="date" value={usuario.fechaNac.split('T')[0]} readOnly />
                        </div>
                        <div className="mb-4">
                            <div className="flex flex-row gap-4">
                                <div>ESTADO CIVIL:</div>
                                <label><input type="radio" name="estadoCivil" value="soltero" onChange={handleChange} />Soltero (a)</label>
                                <label><input type="radio" name="estadoCivil" value="casado" onChange={handleChange} />Casado (a)</label>
                                <label><input type="radio" name="estadoCivil" value="unionLibre" onChange={handleChange} />Unión Libre</label>
                                <label><input type="radio" name="estadoCivil" value="separado" onChange={handleChange} />Separado (a)</label>
                                <label><input type="radio" name="estadoCivil" value="viudo" onChange={handleChange} />Viudo (a)</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col'>
                            <label>ALCOHOLISMO</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" name="alcoholismo" value="si" checked={formData.alcoholismo === 'si'} onChange={handleChange} />Si</label>
                                <label><input type="radio" name="alcoholismo" value="no" checked={formData.alcoholismo === 'no'} onChange={handleChange} />No</label>
                            </div>
                            <label>FRECUENCIA</label>
                            <input name="frecuenciaAlcoholismo" className="border border-gray-300 p-2" value={formData.frecuenciaAlcoholismo} type="text" onChange={handleChange} disabled={formData.alcoholismo !== 'si'} />
                        </div>
                        <div className='flex flex-col'>
                            <label>DEPORTE</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" name="deporte" value="si" checked={formData.deporte === 'si'} onChange={handleChange} />Si</label>
                                <label><input type="radio" name="deporte" value="no" checked={formData.deporte === 'no'} onChange={handleChange} />No</label>
                            </div>
                            <label>FRECUENCIA</label>
                            <input name="frecuenciaDeporte" className="border border-gray-300 p-2" value={formData.frecuenciaDeporte} type="text" onChange={handleChange} disabled={formData.deporte !== 'si'} />
                        </div>
                        <div className='flex flex-col'>
                            <label>TABAQUISMO</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" name="tabaquismo" value="si" checked={formData.tabaquismo === 'si'} onChange={handleChange} />Si</label>
                                <label><input type="radio" name="tabaquismo" value="no" checked={formData.tabaquismo === 'no'} onChange={handleChange} />No</label>
                            </div>
                            <label>FRECUENCIA</label>
                            <input name="frecuenciaTabaquismo" className="border border-gray-300 p-2" value={formData.frecuenciaTabaquismo} type="text" onChange={handleChange} disabled={formData.tabaquismo !== 'si'} />
                        </div>
                        <div className='flex flex-col'>
                            <label>DROGAS</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" name="drogas" value="si" checked={formData.drogas === 'si'} onChange={handleChange} />Si</label>
                                <label><input type="radio" name="drogas" value="no" checked={formData.drogas === 'no'} onChange={handleChange} />No</label>
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <label>FRECUENCIA</label>
                                    <input name="frecuenciaDrogas" className="border border-gray-300 p-2" type="text" value={formData.frecuenciaDrogas} onChange={handleChange} disabled={formData.drogas !== 'si'} />
                                </div>
                                <div>
                                    <label>¿CUAL?</label>
                                    <input name="cualDroga" className="border border-gray-300 p-2" type="text" value={formData.cualDroga} onChange={handleChange} disabled={formData.drogas !== 'si'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Antecedentes Familiares */}
                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">ANTECEDENTES FAMILIARES</h2>
                    {/* Encabezados */}
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        <div>
                            <label className="block text-sm">PARENTESCO</label>
                        </div>
                        <div>
                            <label className="block text-sm">EDAD</label>
                        </div>
                        <div>
                            <label className="block text-sm">ENFERMEDAD</label>
                        </div>
                        <div>
                            <label className="block text-sm">CAUSA DE MUERTE</label>
                        </div>
                    </div>
                    {/* Datos */}
                    {[
                        "PADRE",
                        "MADRE",
                        "ESPOSO (A)",
                        "HERMANO (A)",
                        "HIJO (A)",
                    ].map((parentesco, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                            <div>
                                <label className="block text-sm">{parentesco}</label>
                            </div>
                            <div>
                                <input className="w-full border border-gray-300 p-1" type="text" onChange={(e) => handleAntecFamChange(index, 'edad', e.target.value)} />
                            </div>
                            <div>
                                <input className="w-full border border-gray-300 p-1" type="text" onChange={(e) => handleAntecFamChange(index, 'enfermedad', e.target.value)} />
                            </div>
                            <div>
                                <input className="w-full border border-gray-300 p-1" type="text" onChange={(e) => handleAntecFamChange(index, 'causaMuerte', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Planificador Familiar */}
                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">PLANIFICADOR FAMILIAR</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm ">
                                F.U.M. (FECHA DE ÚLTIMA MENSTRUACIÓN)
                            </label>
                            <input name="fechaUltMens" className="w-full border border-gray-300 p-1" type="date" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                MÉTODO DE PLANIFICACIÓN FAMILIAR
                            </label>
                            <input name="metPlanFam" className="w-full border border-gray-300 p-1" type="text" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                NÚMERO TOTAL DE EMBARAZOS:
                            </label>
                            <input name="numEmb" className="w-full border border-gray-300 p-1" type="number" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                PARTOS:
                            </label>
                            <input name="partos" className="w-full border border-gray-300 p-1" type="number" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                CESÁREAS:
                            </label>
                            <input name="cesareas" className="w-full border border-gray-300 p-1" type="number" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                ABORTOS:
                            </label>
                            <input name="abortos" className="w-full border border-gray-300 p-1" type="number" onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">
                    OBSERVACIONES:
                    </h2>
                    <textarea name="observaciones" className="w-full border border-gray-300 p-2 h-24" onChange={handleChange}></textarea>
                </div>

                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">ANTECEDENTES PATOLÓGICOS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {antecedentesPatologicos.map((item) => (
                            <div key={item.idAntecPatolog}>
                                <label className="block text-sm">{item.nombre.toUpperCase()}</label>
                                <div className="flex items-center">
                                    <input
                                        name="selecAntecPatolog"
                                        type="checkbox"
                                        value={item.idAntecPatolog} // Enviar el ID en lugar del nombre
                                        onChange={handleCheckboxChange}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">
                    PADECIMIENTO ACTUAL:
                    </h2>
                    <textarea name="otraEnferm" className="w-full border border-gray-300 p-2 h-24" onChange={handleChange}></textarea>
                </div>
            </form>
                <button 
                    type="submit" 
                    className="mt-4 p-2 bg-blue-500 text-white"
                    onClick={() => pdfRef.current.dispatchEvent(new Event('submit', { bubbles: true }))} // Llama a submit del formulario
                >
                    Enviar Examen Médico
                </button>
        </>
    );
}

export default ExamenMedico;