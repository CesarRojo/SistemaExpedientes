import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';

function ListaVerifDiseño() {
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
        formDataToSend.append('document', pdfBlob, `verificar-${numFolio}.pdf`); // Agregar el PDF
        formDataToSend.append('idUsuario', idUsuario); // Agregar idUsuario

        // Enviar el PDF al backend
        const pdfUploadResponse = await axios.post('http://172.30.189.100:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);

        // Redirigir a /TemarioInduc con los datos del usuario
        navigate('/FonacotDiseño', {
            state: { idUsuario, nombre, apellidoPat, apellidoMat, numFolio },
        });
        } catch (error) {
            console.error('Error al enviar la lista de verificacion:', error);
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
                {/* Header */}
                <div className='text-center'>
                    <img alt="ATR Nayarit Logo" className="h-31 mx-auto" src="LOGO ATR_LOGO ATR NEGRO.png" />
                    <h1 className='text-4xl mb-5'>Autosistemas de Torreon, S.A. de C.V.</h1>
                    <h2 className='text-2xl mb-15 bg-gray-300'>LISTA DE VERIFICACION DE DOCUMENTOS</h2>
                </div>

                {/* Datos personales */}
                <div className="mb-4">
                    <p><span className="font-bold">Nombre:</span> <span className="bg-yellow-300">{`${usuario.nombre} ${usuario.apellidoPat} ${usuario.apellidoMat}`}</span></p>
                    <p><span className="font-bold">No. De reloj:</span> <span className="bg-yellow-300">{usuario.folio.numFolio}</span></p>
                    <p><span className="font-bold">Departamento:</span> <span className="bg-yellow-300">{usuario.entrevistaInicial.areaDirige}</span></p>
                    <p><span className="font-bold">Puesto:</span> <span className="bg-yellow-300">{usuario.entrevistaInicial.puesto}</span></p>
                    <p><span className="font-bold">Fecha:</span> 
                        <span className="bg-yellow-300">
                            <input 
                                type="date" 
                                className="border border-gray-300 rounded-md mx-2 px-2 py-1" 
                            /> 
                        </span>
                    </p>
                </div>
                <div className="mt-6 flex">
                    <div className='grid grid-rows'>
                        <div className="">
                            <h3 className="font-bold">SOLICITUD DE EMPLEO</h3>
                            <ul className="list-none mt-2">
                                <li className="mt-3 flex justify-between">
                                    <span>DATOS PERSONALES</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>DATOS FAMILIARES</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>REFERENCIAS PERSONALES</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>ESCOLARIDAD</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>EMPLEOS ANTERIORES</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>INFORMACION GENERAL</span>
                                </li>
                            </ul>
                        </div>
                        <div className="">
                            <h3 className="font-bold">DOCUMENTOS DE CONTRATACION</h3>
                            <ul className="list-none">
                                <li className="mt-1 flex justify-between">
                                    <span>a) COPIA DE ACTA DE NACIMIENTO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>b) ORIGINAL DE COMPROBANTE DOMICILIO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>c) ORIGINAL DE LA CARTA DE NO ANTECEDENTES PENALES</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>d) COPIA DEL CERTIFICADO DE ESTUDIOS</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>e) COPIA DE IDENTIFICACION OFICIAL</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>f) COPIA DE CARTA DE RECOMENDACION</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>g) COPIA DEL CURP</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>h) COPIA CON EL NUMERO DE IMSS</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>i) COPIA DEL RFC O CONSTANCIA DE EXISTENCIA EXPEDIDOS POR EL SAT</span>
                                </li>
                            </ul>
                        </div>
                        <div className="">
                            <h3 className="font-bold">DOCUMENTACION DE EXPEDIENTE</h3>
                            <ul className="list-none">
                                <li className="mt-1 flex justify-between">
                                    <span>a) CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO DETERMINADO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>b) CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO INDETERMINADO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>SOLICITUD DE INGRESO AL FONDO DE AHORRO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>LISTADO DE INSTRUMENTOS DE TRABAJO PARA CONTRATACION</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>ACUERDO DE ADHESION AL BANCO DE SERVICIOS DE NOMINA</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>CONSENTIMIENTO-CERTIFICADO INDIVIDUAL PARA LA POLIZA DE SEGURO DE VIDA</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>TEMARIO DE INDUCCION PARA NUEVOS INGRESOS</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>LISTA DE VERIFICACION DE DOCUMENTOS</span>
                                </li>
                            </ul>
                        </div>
                        <div className="">
                            <h3 className="font-bold">AREAS CRITICAS</h3>
                            <ul className="list-none">
                                <li className="mt-1 flex justify-between">
                                    <span>PASAPORTE DE PERSONAL DE NUEVO INGRESO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>FORMATO DE INFORMACION DEL SOLICITANTE PARA SU INGRESO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>CEDULA DE IDENTIFICACION DE PERSONAL DE AREAS CRITICAS</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>FORMATO DE VERIFICACION DE DOMICILIO DE PERSONAL CRITICO</span>
                                </li>
                                <li className="mt-2 flex justify-between">
                                    <span>FICHA DE VERIFICACION DE REFERENCIAS LABORALES</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="ml-4 text-center">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="border border-black px-2 py-1">CUMPLE</th>
                                    <th className="border border-black px-2 py-1">NO CUMPLE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="h-6"></td>
                                    <td className="h-6"></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="h-6"></td>
                                    <td className="h-6"></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="h-6"></td>
                                    <td className="h-6"></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                                <tr>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                    <td className="border border-black h-8"><input type="checkbox" name="" id="" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center mt-15">
                    <div className='flex flex-col items-center mt-4'>
                        <input type="text" className='w-100' />
                        <label>Nombre y firma del verificador</label>
                    </div>
                </div>
            </div>
            <button onClick={handleSubmit} className="mt-4 p-2 bg-green-500 text-white">
                Guardar
            </button>
        </>
    );
}

export default ListaVerifDiseño;