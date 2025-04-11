import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';

function FondoAhorroDiseño() {
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
            console.log("fetchUsuario for fondoAhorro", response.data);
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
        formDataToSend.append('document', pdfBlob, `fondoahorro-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.94:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);

        // Redirigir a /InstrumentosDiseño con los datos del usuario
        navigate('/InstrumentosDiseño', {
            state: { idUsuario, nombre, apellidoPat, apellidoMat, numFolio },
        });
        } catch (error) {
            console.error('Error al enviar el fondoAhorro:', error);
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
                    <h2 className='text-2xl mb-15'>SOLICITUD DE INGRESO AL FONDO DE AHORRO</h2>
                </div>

                {/* Datos personales */}
                <div>
                    <div className='flex flex-cols gap-20'>
                        <h4><span className='font-bold'>Nombre:</span> {`${usuario.nombre} ${usuario.apellidoPat} ${usuario.apellidoMat}`}</h4>
                        <h4><span className='font-bold'>Reloj:</span> {usuario.folio.numFolio}</h4>
                    </div>
                    <h4><span className='font-bold'>Fecha de ingreso a la planta:</span></h4>
                </div>

                {/* Fondo */}
                <div className='grid grid-rows-3 gap-4 mt-10'>
                    <div className='mb-5'>
                        <p>
                            Solicito por medio de la presente mi ingreso al Fondo de Ahorro, en virtud de cumplir con los
                            requisitos de eligibilidad, antiguedad y que es mi voluntad pertenecer a este asi mismo me
                            comprometo a cumplir con los Estatos del Fondo de Ahorro y que mis descuentos sean automaticos del:
                        </p>
                    </div>
                    <div className='grid grid-cols-3 gap-4 text-center font-bold'>
                        <div>
                            <h3>De 0-90</h3>
                            <h3>De 3 a 12</h3>
                            <h3>De 12 +</h3>
                        </div>
                        <div>
                            <h3>Dias</h3>
                            <h3>Meses</h3>
                            <h3>Meses</h3>
                        </div>
                        <div>
                            {/* Estos porcentajes cambian dependiendo si es administrativo u operador **hacerlos dinamicos */}
                            <h3>0%</h3>
                            <h3>8%</h3>
                            <h3>13%</h3>
                        </div>
                    </div>
                    <div className='grid grid-rows'>
                        <div>
                            <p>
                                Y al mismo tiempo si renuncio en forma voluntaria al trabajo, autorizo a devolverme lo que me haya
                                ahorrado y lo que la empresa otorga, quedando a disposicion de la empresa los intereses correspondientes
                            </p>
                        </div>
                        <div className='flex flex-col items-center mt-4'>
                            <input type="text" className='w-100' />
                            <label>Firmo de conformidad</label>
                        </div>
                    </div>
                </div>

                {/* Designacion */}
                <div className='mt-20'>
                    <div className='mb-9'>
                        <p>
                            Por otra parte, designo como beneficiarios de esta prestacion a:
                        </p>
                    </div>
                    <div className='grid grid-cols-[2fr_1fr_1fr] gap-4 mt-4 text-center font-bold'>
                        <div>
                            <h3>Nombre</h3>
                            <input type="text" className='w-100' />
                            <input type="text" className='w-100' />
                        </div>
                        <div>
                            <h3>Parentesco</h3>
                            <input type="text" className='w-30' />
                            <input type="text" className='w-30' />
                        </div>
                        <div>
                            <h3>Porcentaje</h3>
                            <input type="text" className='w-30'/>
                            <input type="text" className='w-30'/>
                        </div>
                    </div>
                </div>

                {/* Firmas */}
                <div className='grid grid-rows-[1fr_4fr] mt-20 text-center'>
                    <h3 className='font-bold'>Autorizado por el comité</h3>
                    <div className='grid grid-cols-3 mt-10'>
                        <div>
                            <h3 className='font-bold'>Presidente</h3>
                            <input type="text" />
                        </div>
                        <div>
                            <h3 className='font-bold'>Tesorero</h3>
                            <input type="text" />
                        </div>
                        <div>
                            <h3 className='font-bold'>Secretario</h3>
                            <input type="text" />
                        </div>
                        
                    </div>
                </div>
            </div>
            <button onClick={handleSubmit} className="mt-4 p-2 bg-green-500 text-white">
                Guardar
            </button>
        </>
    );
}

export default FondoAhorroDiseño;