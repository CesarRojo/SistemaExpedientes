import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import SignatureModal from './Firmas';

function FondoAhorroDiseño() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const location = useLocation();
    const { idUsuario, nombre, apellidoPat, apellidoMat, numFolio, reloj } = location.state || {};

    const [usuario, setUsuario] = useState(null);
    const [fecha, setFecha] = useState('');
    
    // Estados para las firmas
    const [signatureImageConformidad, setSignatureImageConformidad] = useState('');
    const [signatureImagePresidente, setSignatureImagePresidente] = useState('');
    const [signatureImageTesorero, setSignatureImageTesorero] = useState('');
    const [signatureImageSecretario, setSignatureImageSecretario] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSignature, setCurrentSignature] = useState(null); // Para identificar qué firma se está capturando

    const fetchUsuarioFolio = async () => {
        try {
            const response = await axios.get(`http://172.30.189.95:5005/usuario/${idUsuario}`);
            setUsuario(response.data);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    };

    useEffect(() => {
        if (idUsuario) {
            fetchUsuarioFolio();
        }
    }, [idUsuario]);

    const pdfRef = useRef();

    const handleSubmit = async () => {
        try {
            // Generar el PDF
            const pdfBlob = await new Promise((resolve) => {
                const input = pdfRef.current;
                html2canvas(input, { scale: 0.8 }).then((canvas) => {
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

                    const pdfOutput = pdf.output('blob');
                    resolve(pdfOutput);
                });
            });

            // Verificar el tamaño del Blob
            if (pdfBlob.size > 20 * 1024 * 1024) {
                console.error('El archivo PDF es demasiado grande.');
                return;
            }

            // Crear FormData para subir el PDF
            const formDataToSend = new FormData();
            formDataToSend.append('document', pdfBlob, `fondoahorro-${numFolio}.pdf`);
            formDataToSend.append('idUsuario', idUsuario);

            // Enviar el PDF al backend
            const pdfUploadResponse = await axios.post('http://172.30.189.95:5005/pdf/upload-single-doc', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('PDF subido con éxito:', pdfUploadResponse.data);
            navigate('/InstrumentosDiseño', {
                state: { idUsuario, nombre, apellidoPat, apellidoMat, numFolio, reloj },
            });
        } catch (error) {
            console.error('Error al enviar el fondoAhorro:', error);
        }
    };

    const handleSignatureClick = (signatureType) => {
        setCurrentSignature(signatureType);
        setIsModalOpen(true);
    };

    const handleSignatureClose = (image) => {
        switch (currentSignature) {
            case 'conformidad':
                setSignatureImageConformidad(image);
                break;
            case 'presidente':
                setSignatureImagePresidente(image);
                break;
            case 'tesorero':
                setSignatureImageTesorero(image);
                break;
            case 'secretario':
                setSignatureImageSecretario(image);
                break;
            default:
                break;
        }
        setIsModalOpen(false);
    };

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
                    <h2 className='text-2xl mb-15'>SOLICITUD DE INGRESO AL FONDO DE AHORRO</h2>
                </div>

                {/* Datos personales */}
                <div>
                    <div className='flex flex-cols gap-20'>
                        <h4><span className='font-bold'>Nombre:</span> {`${usuario.nombre} ${usuario.apellidoPat} ${usuario.apellidoMat}`}</h4>
                        <h4><span className='font-bold'>Reloj:</span> {reloj}</h4>
                    </div>
                    <h4><span className='font-bold'>Fecha de ingreso a la planta:</span></h4>
                </div>

                {/* Fondo */}
                <div className='grid grid-rows-3 gap-4 mt-10'>
                    <div className='mb-5'>
                        <p>
                            Solicito por medio de la presente mi ingreso al Fondo de Ahorro, en virtud de cumplir con los
                            requisitos de eligibilidad, antigüedad y que es mi voluntad pertenecer a este, así mismo me
                            comprometo a cumplir con los Estatutos del Fondo de Ahorro y que mis descuentos sean automáticos del:
                        </p>
                    </div>
                    <div className='grid grid-cols-3 gap-4 text-center font-bold'>
                        <div>
                            <h3>De 0-90</h3>
                            <h3>De 3 a 12</h3>
                            <h3>De 12 +</h3>
                        </div>
                        <div>
                            <h3>Días</h3>
                            <h3>Meses</h3>
                            <h3>Meses</h3>
                        </div>
                        <div>
                            <h3>0%</h3>
                            <h3>8%</h3>
                            <h3>13%</h3>
                        </div>
                    </div>
                    <div className='grid grid-rows'>
                        <div>
                            <p>
                                Y al mismo tiempo si renuncio en forma voluntaria al trabajo, autorizo a devolverme lo que me haya
                                ahorrado y lo que la empresa otorga, quedando a disposición de la empresa los intereses correspondientes.
                            </p>
                        </div>
                        <div className='flex flex-col items-center mt-4 relative'>
                            {signatureImageConformidad && (
                                <img 
                                    src={`data:image/png;base64,${signatureImageConformidad}`} 
                                    alt="Firma de conformidad" 
                                    className="mt-2 absolute bottom-4" 
                                    style={{ width: '350px', height: 'auto' }} 
                                />
                            )}
                            <input type="text" className='w-100 z-10' onClick={() => handleSignatureClick('conformidad')} readOnly />
                            <label className='z-10'>Firmo de conformidad</label>
                        </div>
                    </div>
                </div>

                {/* Designación */}
                <div className='mt-20'>
                    <div className='mb-9'>
                        <p>
                            Por otra parte, designo como beneficiarios de esta prestación a:
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
                        <div className='flex flex-col items-center mt-4 relative'>
                            {signatureImagePresidente && (
                                <img 
                                    src={`data:image/png;base64,${signatureImagePresidente}`} 
                                    alt="Firma del presidente" 
                                    className="mt-2 absolute bottom-10" 
                                    style={{ width: '350px', height: 'auto' }} 
                                />
                            )}
                            <input type="text" className='z-10' onClick={() => handleSignatureClick('presidente')} readOnly />
                            <h3 className='font-bold z-10'>Presidente</h3>
                        </div>
                        <div className='flex flex-col items-center mt-4 relative'>
                            {signatureImageTesorero && (
                                <img 
                                    src={`data:image/png;base64,${signatureImageTesorero}`} 
                                    alt="Firma del tesorero" 
                                    className="mt-2 absolute bottom-10" 
                                    style={{ width: '350px', height: 'auto' }} 
                                />
                            )}
                            <input type="text" className='z-10' onClick={() => handleSignatureClick('tesorero')} readOnly />
                            <h3 className='font-bold z-10'>Tesorero</h3>
                        </div>
                        <div className='flex flex-col items-center mt-4 relative'>
                            {signatureImageSecretario && (
                                <img 
                                    src={`data:image/png;base64,${signatureImageSecretario}`} 
                                    alt="Firma del secretario" 
                                    className="mt-2 absolute bottom-10" 
                                    style={{ width: '350px', height: 'auto' }} 
                                />
                            )}
                            <input type="text" className='z-10' onClick={() => handleSignatureClick('secretario')} readOnly />
                            <h3 className='font-bold z-10'>Secretario</h3>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <SignatureModal onClose={handleSignatureClose} />
            )}
            <button onClick={handleSubmit} className="mt-4 p-2 bg-green-500 text-white">
                Guardar
            </button>
        </>
    );
}

export default FondoAhorroDiseño;