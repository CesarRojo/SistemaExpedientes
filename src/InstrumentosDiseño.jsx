import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import SignatureModal from './Firmas';

function InstrumentosDiseño() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const location = useLocation();
    const { idUsuario, nombre, apellidoPat, apellidoMat, numFolio } = location.state || {};

    const [usuario, setUsuario] = useState(null);
    const [fecha, setFecha] = useState('');
    
    // Estado para la firma del empleado
    const [signatureImageEmpleado, setSignatureImageEmpleado] = useState('');
    
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
            formDataToSend.append('document', pdfBlob, `instrumentos-${numFolio}.pdf`);
            formDataToSend.append('idUsuario', idUsuario);

            // Enviar el PDF al backend
            const pdfUploadResponse = await axios.post('http://172.30.189.95:5005/pdf/upload-single-doc', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('PDF subido con éxito:', pdfUploadResponse.data);
            navigate('/TemarioDiseño', {
                state: { idUsuario, nombre, apellidoPat, apellidoMat, numFolio },
            });
        } catch (error) {
            console.error('Error al enviar los instrumentos:', error);
        }
    };

    const handleSignatureClick = () => {
        setCurrentSignature('empleado');
        setIsModalOpen(true);
    };

    const handleSignatureClose = (image) => {
        setSignatureImageEmpleado(image);
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
                    <h2 className='text-2xl mb-15 bg-gray-300'>LISTADO DE INSTRUMENTOS DE TRABAJO PARA CONTRATACION Y RETIRO DE EMPLEADOS</h2>
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
                <div className="mb-4">
                    <p>RECIBI de la Empresa Autosistemas de Torreón, S.A. de C.V. los utensilios de trabajo que a continuación describo: RECONOZCO que dicho (s) 
                        instrumento (s) de trabajo se encuentran bajo mi exclusiva responsabilidad, por lo tanto, en caso de pérdida, deterioro o perjuicio material 
                        en el (los) mismo (s) que no derive de su uso normal, me obligo a reponerlo (s) o pagar su valor indicado, facultando desde este momento a 
                        Autosistemas de Torreón, S.A. de C.V. para que efectúe las deducciones correspondientes a mi salario y/o percepciones.
                    </p>
                </div>

                <div className='flex flex-col items-center mt-4 relative'>
                    {signatureImageEmpleado && (
                        <img 
                        src={`data:image/png;base64,${signatureImageEmpleado}`} 
                        alt="Firma del empleado" 
                        className="mt-2 absolute bottom-4" 
                        style={{ width: '350px', height: 'auto' }} 
                    />
                    )}
                    <input 
                        type="text" 
                        className='w-100 z-10' 
                        onClick={handleSignatureClick} 
                        readOnly 
                    />
                    <label className='z-10'>Firma del empleado</label>
                </div>

                <div className="overflow-x-auto">
                <table className="min-w-full border border-black">
                    <thead>
                    <tr>
                        <th className="border border-black px-2 py-1 text-sm">Recibido</th>
                        <th className="border border-black px-2 py-1 text-sm">Concepto</th>
                        <th className="border border-black px-2 py-1 text-sm">Reporte de robo o perdida</th>
                        <th className="border border-black px-2 py-1 text-sm">Fecha de regreso/desactivación/destrucción</th>
                        <th className="border border-black px-2 py-1 text-sm">Recibido por:</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Gafete de Identificación</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Uniforme</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Equipo de protección</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Reglamento Interior de trabajo</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Inducción de nuevo ingreso</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Computadora de escritorio</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Computadora personal</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Usuario de correo electronico</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Telefono Celular</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Llave metalica para:</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Llave metalica para:</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Llave metalica para:</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Llave electronica para:</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Tarjetas de presentacion</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-black px-2 py-1 text-center">
                        <input type="checkbox" />
                        </td>
                        <td className="border border-black px-2 py-1">Otros</td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                        <td className="border border-black px-2 py-1"></td>
                    </tr>
                    </tbody>
                </table>
                    <div className="mt-8 mb-4">
                        <p className="font-bold text-center">En caso de baja del empleado</p>
                        <p>
                            Con fecha
                            <input 
                                type="date" 
                                className="border border-gray-300 rounded-md mx-2 px-2 py-1" 
                            /> 
                            hago entrega de las siguientes herramientas, uniformes y/o utensilios de trabajo que me fueron entregados para realizar mis funciones durante el tiempo que labore en la compañía.
                        </p>
                    </div>
                    <div className="text-center font-bold mb-4">
                        <p>DE CONFORMIDAD</p>
                    </div>
                    <div className='flex flex-col items-center mt-4 relative'>
                        {signatureImageEmpleado && (
                            <img 
                            src={`data:image/png;base64,${signatureImageEmpleado}`} 
                            alt="Firma del empleado" 
                            className="mt-2 absolute bottom-4" 
                            style={{ width: '350px', height: 'auto' }} 
                        />
                        )}
                        <input 
                            type="text" 
                            className='w-100 z-10' 
                            onClick={handleSignatureClick} 
                            readOnly 
                        />
                        <label className='z-10'>Firma del empleado</label>
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

export default InstrumentosDiseño;