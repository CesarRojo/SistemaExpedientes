import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';

function TemarioDiseño() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const location = useLocation();
    const { idUsuario, nombre, apellidoPat, apellidoMat, numFolio } = location.state || {};

    console.log(idUsuario);

    const [usuario, setUsuario] = useState(null);
    const [explorFis, setExplorFis] = useState(null);
    const [consent, setConsent] = useState(null);
    const [fecha, setFecha] = useState(''); // Estado para la fecha seleccionada

    const fetchUsuarioFolio = async () => {
        try {
            const response = await axios.get(`http://172.30.189.94:5005/usuario/${idUsuario}`);
            console.log("fetchUsuario for instrumentos", response.data);
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
        if (idUsuario) {
            fetchUsuarioFolio();
        }
    }, [idUsuario]);

    const pdfRef = useRef();

    const handleSubmit = async () => {

        try {
            // const response = await axios.post('http://172.30.189.94:5005/consent', {
            //     fecha,
            //     idUsuario: usuario.idUsuario,
            // });

            // console.log('Consentimiento enviado:', response.data);

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
        formDataToSend.append('document', pdfBlob, `temario-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.94:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);

        // Redirigir a /TemarioInduc con los datos del usuario
        navigate('/ListaVerifDiseño', {
            state: { idUsuario, nombre, apellidoPat, apellidoMat, numFolio },
        });
        } catch (error) {
            console.error('Error al enviar el temario:', error);
        }
    };

    if (!explorFis) {
        return <div className="text-center">Por favor, completa la exploración física antes de continuar con este paso.</div>;
    }

    // if (consent) {
    //     return <div className="text-center">Ya realizaste el consentimiento.</div>;
    // }

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
                {/* Header */}
                <div className='text-center'>
                    <img alt="ATR Nayarit Logo" className="h-31 mx-auto" src="LOGO ATR_LOGO ATR NEGRO.png" />
                    <h1 className='text-4xl mb-5'>Autosistemas de Torreon, S.A. de C.V.</h1>
                    <h2 className='text-2xl mb-15 bg-gray-300'>TEMARIO DE INDUCCION PARA NUEVOS EMPLEADOS</h2>
                </div>

                {/* Datos personales */}
                <div className="mb-4">
                    <p><span className="font-bold">Nombre:</span> <span className="bg-yellow-300">{`${usuario.nombre} ${usuario.apellidoPat} ${usuario.apellidoMat}`}</span></p>
                    <p><span className="font-bold">No. De reloj:</span> <span className="bg-yellow-300">{usuario.folio.numFolio}</span></p>
                    <p><span className="font-bold">Departamento:</span> <span className="bg-yellow-300">{usuario.entrevistaInicial.areaDirige}</span></p>
                    <p><span className="font-bold">Fecha:</span> 
                        <span className="bg-yellow-300">
                            <input 
                                type="date" 
                                className="border border-gray-300 rounded-md mx-2 px-2 py-1" 
                            /> 
                        </span>
                    </p>
                </div>

                <p className="mb-8">
                    Por la presente hago constar que recibí dentro del curso de inducción proporcionado por la Empresa Autosistemas de Torreón, S.A. de C.V., 
                    los temas enlistados a continuación los cuales fueron claramente entendidos por mi por lo confirmo la aceptación de los mismos dentro del 
                    Contrato Individual de Trabajo.
                </p>
                <table className="w-full border-collapse border border-black mb-8">
                    <thead>
                        <tr>
                            <th className="border border-black px-2 py-1">TEMA</th>
                            <th className="border border-black px-2 py-1">RECIBIDO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black px-2 py-1">Salarios y beneficios</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Control de Asistencia</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política Antidrogas</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política de uso de Medios Electrónicos</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política para uso de Redes Sociales</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política Laboral</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política de Salud y Seguridad</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política de Prevención de Factores de Riesgo Psicosocial</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política de Confidencialidad</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Protección de Datos Personales</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Aviso de privacidad</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Reglamento interior de trabajo</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política de No Conflicto de intereses</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Designación de Beneficiarios</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Código de Conducta</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política Antisoborno</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Política Anticorrupción</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1">Línea de ayuda para denuncia de problemas de cumplimiento</td>
                            <td className="border border-black px-2 py-1"></td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-center mt-8">
                    <p className="mb-8">DE CONFORMIDAD</p>
                    <div className='flex flex-col items-center mt-4'>
                        <input type="text" className='w-100' />
                        <label>Firma del empleado</label>
                    </div>
                </div>
            </div>
            <button onClick={handleSubmit} className="mt-4 p-2 bg-green-500 text-white">
                Guardar
            </button>
        </>
    );
}

export default TemarioDiseño;