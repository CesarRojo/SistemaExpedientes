import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';

function Consentimiento() {
    const user = useAuthStore((state) => state.user);
    const idFolio = user?.idFolio;
    const numFol = user?.numFolio;

    const [usuario, setUsuario] = useState(null);
    const [explorFis, setExplorFis] = useState(null);
    const [consent, setConsent] = useState(null);
    const [fecha, setFecha] = useState(''); // Estado para la fecha seleccionada

    const fetchUsuarioFolio = async () => {
        try {
            const response = await axios.get(`http://172.30.189.86:5005/usuario/folio/${idFolio}`);
            console.log("fetchUsuario for consentimiento", response.data);
            setUsuario(response.data);
            setExplorFis(response.data.exploracionFisica);
            setConsent(response.data.consentimiento);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    };

    const nombreUsuario = () => {
        return usuario?.nombre + ' ' + usuario?.apellidoPat + ' ' + usuario?.apellidoMat;
    };

    useEffect(() => {
        if (idFolio) {
            fetchUsuarioFolio();
        }
    }, [idFolio]);

    const pdfRef = useRef();

    // const exportToPDF = () => {
    //     const input = pdfRef.current;

    //     html2canvas(input, { scale: 3 }).then((canvas) => {
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

    //         pdf.save(`consentimiento-${numFol}.pdf`);
    //     });
    // };

    const enviarConsentimiento = async () => {
        if (!fecha || !usuario?.idUsuario) {
            alert('Por favor, selecciona una fecha y asegúrate de que el usuario esté cargado.');
            return;
        }

        try {
            const response = await axios.post('http://172.30.189.86:5005/consent', {
                fecha,
                idUsuario: usuario.idUsuario,
            });

            console.log('Consentimiento enviado:', response.data);

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
        formDataToSend.append('document', pdfBlob, `consentimiento-${numFol}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', usuario.idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.86:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);
        } catch (error) {
            console.error('Error al enviar el consentimiento:', error);
        }
    };

    if (!explorFis) {
        return <div className="text-center">Por favor, completa la exploración física antes de continuar con este paso.</div>;
    }

    if (consent) {
        return <div className="text-center">Ya realizaste el consentimiento.</div>;
    }

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
                {/* Header */}
                <div className="flex items-center mb-4">
                    <div className="w-full text-center bg-gray-200">
                        <h1 className="text-6xl">CONSENTIMIENTO INFORMADO</h1>
                        <h3 className="text-2xl">EXÁMENES MÉDICOS</h3>
                    </div>
                </div>

                {/* Fecha */}
                <div className="ml-80 flex space-x-2 mt-10 text-xl">
                    <div>FECHA</div>
                    <input
                        className="w-full border-b h-10 border-gray-300 text-center align-middle leading-[4]"
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)} // Actualizar el estado de la fecha
                    />
                </div>

                {/* Información */}
                <div className="grid grid-rows-2 gap-2 mt-10">
                    <div>
                        <p className="text-2xl">
                            El colaborador y/o aspirante al cargo, cuyos datos y firmas constan en este documento, da su consentimiento para que le
                            realicen las pruebas médicas y complementarias necesarias para valorar su aptitud laboral, conforme a los riesgos identificados
                            en el puesto de trabajo, y que el contenido y el resultado de la misma esté a disposición del encargado del Área de 
                            Servicios Médicos de la empresa. Se le informa que el examen médico ocupacional incluye una valoración médica y pruebas
                            complementarias, las cuales para el cargo son:
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-2xl items-center">
                        <div>
                            <ul className="text-center flex flex-col gap-6">
                                <li>Exploración física</li>
                                <li>Toma de tensión arterial</li>
                                <li>Toma de glucosa en sangre</li>
                            </ul>
                        </div>
                        <div>
                            <ul className="text-center flex flex-col gap-6">
                                <li>Examen de visión</li>
                                <li>Examen de percepción de colores</li>
                                <li>Examen de concentración</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Protesta */}
                <div>
                    <p className="text-2xl mt-10">
                        {`Yo ${nombreUsuario()}, declaro bajo protesta decir la verdad sobre mi estado de salud actual y que la información vertida por
                        mí es real, estoy consciente de que mi periodo de prueba es de 28 días y es causa de recesión laboral sin responsabilidad
                        para el patrón, el engañarlo en cuanto a enfermedades crónico-degenerativas (diabetes, hipertensión, cáncer), embarazo,
                        enfermedades neuronales, ortopédicas y pulmonares; lo anterior con fundamento en el artículo 47, fracción I de la Ley
                        Federal del Trabajo.`}
                    </p>
                </div>

                {/* Firmas */}
                <div className="grid grid-rows-2 gap-4 mt-10 text-center text-xl">
                    <div className="flex flex-col mb-15">
                        <input className="border border-gray-300 p-2" type="text" />
                        <label>Firma del interesado</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <input className="border border-gray-300 p-2" type="text" />
                            <label>Firma del dpto. médico</label>
                        </div>
                        <div className="flex flex-col">
                            <input className="border border-gray-300 p-2" type="text" />
                            <label>Firma del dpto. reclutamiento</label>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={enviarConsentimiento} className="mt-4 p-2 bg-green-500 text-white">
                Enviar Consentimiento
            </button>
        </>
    );
}

export default Consentimiento;