import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ExamMedDiseño() {
    const [entrevIni, setEntrevIni] = useState(null);
    const location = useLocation();
    const { idUsuario } = location.state || {};

    const fetchEntrevIniData = async () => {
        try {
            const response = await axios.get(`http://172.30.189.97:5005/usuario/${idUsuario}`);
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

            pdf.save('examenmedico.pdf');
        });
    };

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <img alt="ATR Nayarit Logo" className="h-31" src="logo.png" />
                    <div className="text-center bg-gray-200">
                        <h1 className="text-xl ">EXAMEN MEDICO</h1>
                        <div className='flex flex-row'>
                            <div className="flex space-x-2">
                                <div>PLANTA</div>
                                <input className="border border-gray-300 p-2" type="text" />
                            </div>
                            <div className="flex space-x-2">
                                <div>FECHA</div>
                                <input className="border border-gray-300 p-2" type="date" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="mb-4">
                    <div className="grid grid-cols-3 gap-4">
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
                        <div>
                            <label>FECHA NACIMIENTO</label>
                            <input className="w-full border border-gray-300 p-2" type="date" />
                        </div>
                        <div className="mb-4">
                            <div className="flex flex-row gap-4">
                                <div>ESTADO CIVIL:</div>
                                <label><input type="radio" />Soltero (a)</label>
                                <label><input type="radio" />Casado (a)</label>
                                <label><input type="radio" />Unión Libre</label>
                                <label><input type="radio" />Separado (a)</label>
                                <label><input type="radio" />Viudo (a)</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col'>
                            <label>ALCOHOLISMO</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" />Si</label>
                                <label><input type="radio" />No</label>
                            </div>
                            <label>FRECUENCIA</label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div className='flex flex-col'>
                            <label>DEPORTE</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" />Si</label>
                                <label><input type="radio" />No</label>
                            </div>
                            <label>FRECUENCIA</label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div className='flex flex-col'>
                            <label>TABAQUISMO</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" />Si</label>
                                <label><input type="radio" />No</label>
                            </div>
                            <label>FRECUENCIA</label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div className='flex flex-col'>
                            <label>DROGAS</label>
                            <div className='flex flex-row gap-4'>
                                <label><input type="radio" />Si</label>
                                <label><input type="radio" />No</label>
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <label>FRECUENCIA</label>
                                    <input className="border border-gray-300 p-2" type="text" />
                                </div>
                                <div>
                                    <label>¿CUAL?</label>
                                    <input className="border border-gray-300 p-2" type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Antecedentes Familiares */}
                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">ANTECEDENTES FAMILIARES</h2>
                    {/* Encabezados */}
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        <div>
                            <label className="block text-sm">PARENTESCO</label>
                        </div>
                        <div>
                            <label className="block text-sm">EDAD</label>
                        </div>
                        <div>
                            <label className="block text-sm">ENFERMEDAD</label>
                        </div>
                        <div>
                            <label className="block text-sm">CAUSA DE MUERTE</label>
                        </div>
                    </div>
                    {/* Datos */}
                    {[
                        { label: "PADRE" },
                        { label: "MADRE" },
                        { label: "ESPOSO (A)" },
                        { label: "HERMANO (A)" },
                        { label: "HIJO (A)" },
                    ].map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                            <div>
                                <label className="block text-sm">{item.label}</label>
                            </div>
                            <div>
                                <input className="w-full border border-gray-300 p-1" type="text" />
                            </div>
                            <div>
                                <input className="w-full border border-gray-300 p-1" type="text" />
                            </div>
                            <div>
                                <input className="w-full border border-gray-300 p-1" type="text" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Planificador Familiar */}
                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">PLANIFICADOR FAMILIAR</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm ">
                                F.U.M. (FECHA DE ÚLTIMA MENSTRUACIÓN)
                            </label>
                            <input className="w-full border border-gray-300 p-1" type="date" />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                MÉTODO DE PLANIFICACIÓN FAMILIAR
                            </label>
                            <input className="w-full border border-gray-300 p-1" type="text" />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                NÚMERO TOTAL DE EMBARAZOS:
                            </label>
                            <input className="w-full border border-gray-300 p-1" type="number" />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                PARTOS:
                            </label>
                            <input className="w-full border border-gray-300 p-1" type="number" />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                CESÁREAS:
                            </label>
                            <input className="w-full border border-gray-300 p-1" type="number" />
                        </div>
                        <div>
                            <label className="block text-sm ">
                                ABORTOS:
                            </label>
                            <input className="w-full border border-gray-300 p-1" type="number" />
                        </div>
                    </div>
                </div>

                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">
                    OBSERVACIONES:
                    </h2>
                    <textarea className="w-full border border-gray-300 p-2 h-24"></textarea>
                </div>

                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">ANTECEDENTES PATOLÓGICOS</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {[
                            "Alergias",
                            "Tuberculosis",
                            "Bronquitis",
                            "Neumonia",
                            "Asma",
                            "Trastornos emocionales",
                            "Hernias",
                            "Pie plano",
                            "Epilepsia o convulsiones",
                            "Anorexia",
                            "Habito a drogas",
                            "Enf. Ojos",
                            "Enf. Oidos",
                            "Enf. Piel",
                            "Enf. Renales",
                            "Diabetes",
                            "Enf. Cardiovasculares",
                            "Varices",
                            "Hipertension arterial",
                            "Hipotension arterial",
                            "Enf. Osteoarticulares",
                            "Reumatismo",
                            "Esguinces",
                            "Fracturas",
                            "Cirugias",
                            "Enfermedades gastrointestinales",
                            "Lesiones/Suturas",
                            "Diarrea (Ultimas 2 semanas)",
                            "Actualmente en tratamiento medico/psicologico",
                        ].map((item, index) => (
                            <div key={index}>
                                <label className="block text-sm">{item.toUpperCase()}</label>
                                <div className="flex items-center">
                                    <input className="mr-4" type="checkbox" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">
                    PADECIMIENTO ACTUAL:
                    </h2>
                    <textarea className="w-full border border-gray-300 p-2 h-24"></textarea>
                </div>
            </div>
            <button onClick={exportToPDF} className="mt-4 p-2 bg-blue-500 text-white">
                Exportar a PDF
            </button>
        </>
    );
}

export default ExamMedDiseño;