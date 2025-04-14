import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';

function CtmDiseño() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const location = useLocation();
    const { idUsuario, nombre, apellidoPat, apellidoMat, numFolio } = location.state || {};

    const [usuario, setUsuario] = useState(null);
    const [explorFis, setExplorFis] = useState(null);
    const [salario, setSalario] = useState('');
    const [consent, setConsent] = useState(null);
    const [fecha, setFecha] = useState(''); // Estado para la fecha seleccionada

    const fetchUsuarioFolio = async () => {
        try {
            const response = await axios.get(`http://172.30.189.86:5005/usuario/${idUsuario}`);
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
            // const response = await axios.post('http://172.30.189.86:5005/consent', {
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
        formDataToSend.append('document', pdfBlob, `ctm-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.86:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);

        // Redirigir a /TablaFondoAhorro porque este es el ultimo paso
        navigate('/ValeDiseño', {
            state: { idUsuario, numFolio }
        });
        } catch (error) {
            console.error('Error al enviar el ctm:', error);
        }
    };

    // if (!explorFis) {
    //     return <div className="text-center">Por favor, completa la exploración física antes de continuar con este paso.</div>;
    // }

    // if (consent) {
    //     return <div className="text-center">Ya realizaste el consentimiento.</div>;
    // }

    if (!usuario) {
        return <div className="text-center">Cargando datos del usuario...</div>;
    }

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
                <div className="text-center mb-4">
                    <h1 className="font-bold text-lg">SOLICITUD DE INGRESO</h1>
                </div>
                <div className="text-left mb-4">
                    <p className="font-bold">C. SECRETARIO GENERAL</p>
                    <p className="font-bold">DEL SINDICATO ESTATAL</p>
                </div>
                <div className="text-left mb-4">
                    <p className="font-bold">PRESENTE</p>
                </div>
                <div className="text-justify mb-4">
                    <p>
                        El que suscribe, por mi propia voluntad y en ejercicio de un derecho Ciudadano, conociendo el alcance de los Estatutos que rigen como Ley interna a este Sindicato Estatal denominado SETRENAY, por medio de la presente me permite hacer formal solicitud de ingreso como miembro activo del mismo, a través de la Sección de la empresa AUTOSISTEMAS DE TORREON S.A. DE C.V. PLANTA TEPIC, con sede en Avenida Aguamilpa No.53, Ciudad Industrial Nayarita, C.P. 63173, en la Ciudad de Tepic, Nayarit, comprometiéndome a cumplir y hacer cumplir los Estatutos, Acuerdos de los Consejos y Congresos del Comité Ejecutivo Estatal, así como los acuerdos de las Asambleas de la Sección, estando presentes o ausentes, para todos los efectos legales llenos los siguientes:
                    </p>
                </div>
                <div className="text-center mb-4">
                    <h2 className="font-bold text-lg">DATOS PERSONALES</h2>
                </div>
                <div className="mb-4">
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">NOMBRE Y APELLIDOS</label>
                        <input type="text" className="border-b border-black flex-grow" value={`${usuario.nombre} ${usuario.apellidoPat} ${usuario.apellidoMat}`} readOnly/>
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">NACIONALIDAD</label>
                        <input type="text" className="border-b border-black flex-grow" />
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/6 font-bold">EDAD</label>
                        <input type="text" className="border-b border-black flex-grow" />
                        <label className="w-1/6 font-bold text-center">SEXO</label>
                        <input type="text" className="border-b border-black flex-grow" />
                        <label className="w-1/6 font-bold text-center">ESTADO CIVIL</label>
                        <input type="text" className="border-b border-black flex-grow" value={usuario.estado_civil} readOnly/>
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">GRADO DE ESTUDIOS</label>
                        <input type="text" className="border-b border-black flex-grow" />
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">ORIGINARIO DE</label>
                        <input type="text" className="border-b border-black flex-grow" />
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">OCUPACIÓN O CARGO</label>
                        <input type="text" className="border-b border-black flex-grow" />
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">SALARIO DIARIO</label>
                        <input type="text" className="border-b border-black flex-grow" value={salario} onChange={(e) => { //Al escribir renderiza el componente cada vez???
                            setSalario(e.target.value);
                        }} />
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">EMPRESA</label>
                        <input type="text" className="border-b border-black flex-grow" />
                    </div>
                    <div className="flex mb-2">
                        <label className="w-1/3 font-bold">PATRON</label>
                        <input type="text" className="border-b border-black flex-grow" />
                    </div>
                </div>
                <div className="text-justify mb-4">
                    <p>
                        Con mi firma acredito mi expresa voluntad de pertenecer al Sindicato y no tengo impedimentos legales que me impida solidarizarme al mismo.
                    </p>
                </div>
                <div className="w-full text-center mb-4">
                    <p>
                        Tepic, Nayarit,  
                        <input type="date" className="border-b border-black" /> 
                    </p>
                </div>
                <div className="flex justify-around mt-35">
                    <div className="text-center">
                        <input type="text" className="border-b border-black flex-grow w-70" />
                        <p className="font-bold">SECRETARIO DE ORGANIZACIÓN</p>
                        <p className="font-bold">Y ESTADISTICA</p>
                    </div>
                    <div className="text-center">
                        <input type="text" className="border-b border-black flex-grow w-70" />
                        <p className="font-bold">FIRMA DEL INTERESADO</p>
                    </div>
                </div>
            </div>
            <button onClick={handleSubmit} className="mt-4 p-2 bg-green-500 text-white">
                Guardar
            </button>
        </>
    );
}

export default CtmDiseño;