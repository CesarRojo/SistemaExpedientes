import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';

function ValeMaterialDiseño() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const location = useLocation();
    const { idUsuario, nombre, apellidoPat, apellidoMat, numFolio } = location.state || {};

    const [usuario, setUsuario] = useState(null);
    const [explorFis, setExplorFis] = useState(null);
    const [consent, setConsent] = useState(null);
    const [fecha, setFecha] = useState(''); // Estado para la fecha seleccionada

    const fetchUsuarioFolio = async () => {
        try {
            const response = await axios.get(`http://172.30.189.100:5005/usuario/${idUsuario}`);
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
            // const response = await axios.post('http://172.30.189.100:5005/consent', {
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
        formDataToSend.append('document', pdfBlob, `vale-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.100:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);

        // Redirigir a /TemarioInduc con los datos del usuario
        navigate('/TablaFondoAhorro');
        } catch (error) {
            console.error('Error al enviar el vale:', error);
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
                <div className="grid grid-cols-[2fr_3fr_2fr] w-full mb-6">
                    <img alt="ATR Nayarit logo" className="mr-2 h-15" src="LOGO ATR_LOGO ATR AZUL.png"/>
                    <div className='text-center w-full'>
                        <h1 className="text-blue-700 font-bold">AUTOSISTEMAS DE TORREON, S.A. DE C.V.</h1>
                        <h2 className="text-blue-700">VALE DE MATERIAL</h2>
                    </div>
                    <img alt="Company logo" className='h-18 w-28 justify-self-center' src="sumitomo-logo.png"/>
                </div>
                <div className="mb-4">
                    <div className="flex justify-between mb-2">
                        <div>
                            <span className="font-bold">{`NOMBRE: ${usuario.nombre} ${usuario.apellidoPat} ${usuario.apellidoMat}`}</span>
                        </div>
                        <div>
                            <span className="font-bold">FECHA:</span>
                            <input type="date" />
                        </div>
                        <div>
                            <span className="font-bold">{`NO. GAFETE: ${usuario.folio.numFolio}`}</span>
                        </div>
                    </div>
                    <p className="text-justify">
                    Recibo material por medio de este vale y me comprometo a devolverlo cuando me retire de la empresa. Y en caso de perdida de material 
                    estoy en pleno conocimiento de que se me descontará por via nomina, Firmando de Aceptar lo antes descrito.
                    </p>
                </div>
                <table className="w-full border-collapse border border-black mb-4">
                    <thead>
                        <tr>
                            <th className="border border-black px-2 py-1">No.</th>
                            <th className="border border-black px-2 py-1">Articulo</th>
                            <th className="border border-black px-2 py-1">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black px-2 py-1 text-center">1</td>
                            <td className="border border-black px-2 py-1">Casaca</td>
                            <td className="border border-black px-2 py-1 text-right">$ 50.00</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-2 py-1 text-center">2</td>
                            <td className="border border-black px-2 py-1">Gafete</td>
                            <td className="border border-black px-2 py-1 text-right">$ 25.00</td>
                        </tr>
                    </tbody>
                </table>
                <div className="text-center">
                    <input type="text" className='border-b border-black w-100 mt-10'/>
                    <p>Firma de Recibido</p>
                </div>
            </div>
            <button onClick={handleSubmit} className="mt-4 p-2 bg-green-500 text-white">
                Guardar
            </button>
        </>
    );
}

export default ValeMaterialDiseño;