import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';

function FonacotDiseño() {
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
            const response = await axios.get(`http://192.168.1.68:5005/usuario/${idUsuario}`);
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
            // const response = await axios.post('http://192.168.1.68:5005/consent', {
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
        formDataToSend.append('document', pdfBlob, `fonacot-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://192.168.1.68:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);

        // Redirigir a /TemarioInduc con los datos del usuario
        navigate('/CtmDiseño', {
            state: { idUsuario, nombre, apellidoPat, apellidoMat, numFolio },
        });
        } catch (error) {
            console.error('Error al enviar el fonacot:', error);
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
                <div className="flex justify-between items-center mb-8 mt-30">
                    <img alt="ATR Nayarit Division Sumitomo Electric Group logo" className="h-21" src="LOGO ATR_LOGO ATR AZUL.png"/>
                    <img alt="Instituto Fonacot logo" className="h-21" src="fonacot.png"/>
                </div>
                <div className='mt-10'>
                    <h1 className="text-center text-4xl mb-10">
                        CONSTANCIA NO CREDITO FONACOT
                    </h1>
                    <p className="mb-4">
                        Yo 
                        <span className="border-b border-black">
                        {` ${usuario.nombre} ${usuario.apellidoPat} ${usuario.apellidoMat} `}
                        </span>
                        hago constar que actualmente NO cuento con ningún CREDITO FONACOT otorgado o en proceso de aprobación.
                    </p>
                    <p className="mb-8">
                        Estoy consciente que de ocultar lo contrario, los descuentos que no me sean aplicados en su tiempo normal serán descontados en una sola exhibición. 
                        Al igual acepto que de ser necesario, el saldo pendiente de dicho adeudo me será descontado de mi finiquito y/o liquidación final.
                    </p>
                </div>
                <div className="text-center mt-15">
                    <div className='flex flex-col items-center mt-4'>
                        <label>Firma del empleado</label>
                        <input type="text" className='w-100' />
                    </div>
                </div>
                <div className="text-center mt-15">
                    <div className='flex flex-col items-center mt-4'>
                        <label>No. Empleado</label>
                        <label className='border-b border-black w-100'>{usuario.folio.numFolio}</label>
                    </div>
                </div>
                <div className="text-center mt-15">
                    <div className='flex flex-col items-center mt-4'>
                        <label>Fecha de ingreso</label>
                        <input 
                            type="date" 
                            className="border border-gray-300 rounded-md mx-2 px-2 py-1" 
                        /> 
                    </div>
                </div>
            </div>
            <button onClick={handleSubmit} className="mt-4 p-2 bg-green-500 text-white">
                Guardar
            </button>
        </>
    );
}

export default FonacotDiseño;