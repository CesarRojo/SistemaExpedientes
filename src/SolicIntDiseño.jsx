import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function SolicIntDiseño() {
    const [entrevIni, setEntrevIni] = useState(null);
    const location = useLocation();
    const { idUsuario } = location.state || {};

    const fetchEntrevIniData = async () => {
        try {
            const response = await axios.get(`http://172.30.189.86:5005/usuario/${idUsuario}`);
            setEntrevIni(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching entrevista inicial data", error);
        }
    }

    useEffect(() => {
        fetchEntrevIniData();
    }, [])

    const pdfRef = useRef();

    const exportToPDF = () => {
        const input = pdfRef.current;

        html2canvas(input, { scale: 3 }).then((canvas) => {
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

            pdf.save('solInterna.pdf');
        });
    };

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
                {/* Header */}
                <div className="flex items-center mb-4">
                    <img alt="ATR Nayarit Logo" className="h-31" src="logo.png" />
                    <div className="w-full text-center bg-gray-200">
                        <h1 className="text-xl ">SOLICITUD INTERNA</h1>
                        <div className="flex space-x-2">
                            <div>FECHA</div>
                            <input className="w-full border border-gray-300 p-2" type="date" />
                        </div>
                    </div>
                </div>

                {/* Datos personales */}
                <div className='grid grid-rows-[auto_1fr]'>
                    <div className='text-center mt-4 font-bold'>
                        <label>DATOS PERSONALES</label>
                    </div>
                    <div className='grid grid-cols-4 gap-2'>
                        <div>
                            <label>APELLIDO PATERNO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>APELLIDO MATERNO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>NOMBRE (S)</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div className='flex items-center gap-3'>
                            <label>SEXO</label>
                            <label><input type="radio" />H</label>
                            <label><input type="radio" />M</label>
                        </div>
                    </div>
                    <div className='grid grid-cols-[4fr_1fr_4fr] gap-2'>
                        <div>
                            <label>FECHA NACIMIENTO</label>
                            <input className="w-full border border-gray-300 p-2" type="date" />
                        </div>
                        <div>
                            <label>EDAD</label>
                            <input className="w-full border border-gray-300 p-2" type="number" />
                        </div>
                        <div>
                            <label>LUGAR NACIMIENTO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label>RFC</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>CURP</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-[2fr_3fr] gap-2'>
                        <div>
                            <label>NUMERO SEGURO SOCIAL</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label>ESTADO CIVIL</label>
                            <label><input type="radio" />Soltero (a)</label>
                            <label><input type="radio" />Casado (a)</label>
                            <label><input type="radio" />Divorciado (a)</label>
                            <label><input type="radio" />Viudo (a)</label>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label>TELEFONO PERSONAL</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>TELEFONO DE EMERGENCIA</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                </div>

                {/* Datos familiares */}
                <div className='grid grid-rows-[auto_1fr]'>
                    <div className='text-center mt-4 font-bold'>
                        <label>DATOS FAMILIARES</label>
                    </div>
                    <div className='grid grid-cols-[1fr_6fr_6fr] gap-2'>
                        <div className='flex items-center gap-2'>
                            <label>PADRE</label>
                        </div>
                        <div>
                            <label>NOMBRES</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>APELLIDOS</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-[1fr_6fr_6fr] gap-2'>
                        <div className='flex items-center gap-2'>
                            <label>MADRE</label>
                        </div>
                        <div>
                            <label>NOMBRES</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>APELLIDOS</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-[2fr_4fr_4fr_4fr] gap-2'>
                        <div className='flex flex-col items-center gap-5 justify-center mt-5'>
                            <label>ESPOSO (A)</label>
                            <label>HIJO (A)</label>
                            <label>HIJO (A)</label>
                            <label>HIJO (A)</label>
                            <label>HIJO (A)</label>
                        </div>
                        <div>
                            <label>NOMBRES</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>APELLIDOS</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>FECHA NAC</label>
                            <input className="w-full border border-gray-300 p-2" type="date" />
                            <input className="w-full border border-gray-300 p-2" type="date" />
                            <input className="w-full border border-gray-300 p-2" type="date" />
                            <input className="w-full border border-gray-300 p-2" type="date" />
                            <input className="w-full border border-gray-300 p-2" type="date" />
                        </div>
                    </div>
                </div>

                {/* Domicilio */}
                <div>
                    <div className='text-center mt-4 font-bold'>
                        <label>DOMICILIO ACTUAL</label>
                    </div>
                    <div className='grid grid-cols-[3fr_1fr_3fr] gap-2'>
                        <div>
                            <label>CALLE</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>NUMERO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>COLONIA</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-[1fr_3fr_3fr] gap-2'>
                        <div>
                            <label>C.P.</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>CIUDAD</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>ESTADO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <label>MUNICIPIO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div className='flex items-center gap-2'>
                            <label>VIVE CON</label>
                            <label><input type="radio" />Familia</label>
                            <label><input type="radio" />Amigos</label>
                            <label><input type="radio" />Solo (a)</label>
                        </div>
                    </div>
                </div>

                {/* Escolaridad */}
                <div className='grid grid-rows-[auto_1fr]'>
                    <div className='text-center mt-4 font-bold'>
                        <label>ESCOLARIDAD</label>
                    </div>
                    <div className='grid grid-cols-[1fr_5fr] gap-2'>
                        <div className='flex items-center gap-2'>
                            <label><input type="radio" />PRIMARIA</label>
                        </div>
                        <div>
                            <label>TECNICO EN:</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-[1fr_5fr] gap-2'>
                        <div className='flex items-center gap-2'>
                            <label><input type="radio" />SECUNDARIA</label>
                        </div>
                        <div>
                            <label>LICENCIATURA EN:</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className='grid grid-cols-[1fr_5fr] gap-2'>
                        <div className='flex items-center gap-2'>
                            <label><input type="radio" />PREPARATORIA</label>
                        </div>
                        <div>
                            <label>INGENIERIA EN:</label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                </div>

            </div>
            <button onClick={exportToPDF} className="mt-4 p-2 bg-blue-500 text-white">
                Exportar a PDF
            </button>
        </>
    );
}

export default SolicIntDiseño;