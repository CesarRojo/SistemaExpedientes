import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ExpFisicaDiseño() {
    const [entrevIni, setEntrevIni] = useState(null);
    const location = useLocation();
    const { idUsuario } = location.state || {};

    const fetchEntrevIniData = async () => {
        try {
            const response = await axios.get(`http://172.30.189.99:5005/usuario/${idUsuario}`);
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

            pdf.save('exploracionfisica.pdf');
        });
    };

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md">
                {/* Header */}
                <div className="flex items-center mb-4">
                    <img alt="ATR Nayarit Logo" className="h-31" src="logo.png" />
                    <div className="w-full text-center bg-gray-200">
                        <h1 className="text-xl ">EXPLORACION FISICA</h1>
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-2 mt-4 text-center text-sm">
                    <div>
                        <label className="block font-bold">PESO:</label>
                        <input className="border border-gray-300 p-1 w-full" id="peso" type="text"/>
                        <span className="block mt-1">KG</span>
                    </div>
                    <div>
                        <label className="block font-bold">TALLA:</label>
                        <input className="border border-gray-300 p-1 w-full" id="talla" type="text"/>
                        <span className="block mt-1">cm</span>
                    </div>
                    <div>
                        <label className="block font-bold">TEMPERATURA:</label>
                        <input className="border border-gray-300 p-1 w-full" id="temperatura" type="text"/>
                        <span className="block mt-1">°C</span>
                    </div>
                    <div>
                        <label className="block font-bold">FR:</label>
                        <input className="border border-gray-300 p-1 w-full" id="fr" type="text"/>
                    </div>
                    <div>
                        <label className="block font-bold">FC:</label>
                        <input className="border border-gray-300 p-1 w-full" id="fc" type="text"/>
                    </div>
                    <div>
                        <label className="block font-bold">T/A:</label>
                        <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                        <span className="block mt-1">mm Hg</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                    <div>
                        <label className="block font-bold">MANIOBRA DE FINKELSTEIN</label>
                        <input className="border border-gray-300 p-1 w-full" id="fr" type="text"/>
                    </div>
                    <div>
                        <label className="block font-bold">SIGNO DE TINEL</label>
                        <input className="border border-gray-300 p-1 w-full" id="fc" type="text"/>
                    </div>
                    <div>
                        <label className="block font-bold">SIGNO DE PHALEN</label>
                        <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                    </div>
                </div>

                <div className="pt-2 mb-4">
                    <h2 className="text-lg mb-2">
                    OBSERVACIONES:
                    </h2>
                    <textarea className="w-full border border-gray-300 p-2 h-24"></textarea>
                </div>

                {/* exploracion */}
                <div className='grid grid-rows-[1fr_auto]'>
                    <div className='grid grid-cols-4 gap-2'>
                        <div>
                            <label className="block font-bold text-sm">MOVIMIENTOS ANORMALES</label>
                            <label><input type="radio" />Si</label>
                            <label><input type="radio" />No</label>
                            <label className="block font-bold text-sm">MARCHA</label>
                            <label><input type="radio" />Normal</label>
                            <label><input type="radio" />Anormal</label>
                        </div>
                        <div>
                            <label className="block font-bold text-sm">COMPRENSION</label>
                            <label><input type="radio" />100/90</label>
                            <label><input type="radio" />90/80</label>
                            <label><input type="radio" />80/70</label>
                            <label><input type="radio" />Otro</label>
                            <input className="border border-gray-300 p-1 w-full" type="text"/>
                        </div>
                        <div>
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <div className=''>
                                        <label className="block font-bold text-sm">VISION LEJOS</label>
                                        <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                                    </div>
                                    <div className=''>
                                        <label className="block font-bold text-sm">VISION CERCA</label>
                                        <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                                    </div>
                                    <div className=''>
                                        <label className="block font-bold text-sm">DALTONISMO</label>
                                        <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                                    </div>
                                    <div className='flex flex-row mt-2'>
                                        <label className="block font-bold text-sm">OI</label>
                                        <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                                        <label className="block font-bold text-sm">OD</label>
                                        <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-bold text-sm">CALIFICACION</label>
                                    <input className="border border-gray-300 p-1 w-full" type="text"/>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-rows-2'>
                            <div>
                                <label className="block font-bold text-sm">PIEL</label>
                                <label><input type="radio" />Hidratada</label>
                                <label><input type="radio" />Seca</label>
                                <label className="block font-bold text-sm">HIGIENE</label>
                                <label><input type="radio" />Buena</label>
                                <label><input type="radio" />Regular</label>
                                <label><input type="radio" />Mala</label>
                            </div>
                            <div>
                                <label className="block font-bold text-sm">TIPO DE PESO</label>
                                <div className='grid grid-cols-2 grid-rows-2'>
                                    <label><input type="radio" />Sobrepeso</label>
                                    <label><input type="radio" />Normal</label>
                                    <label><input type="radio" />Obesidad</label>
                                    <label><input type="radio" />Desnutricion</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* lesiones */}
                    <div className='grid grid-cols-3 grid-rows-2 gap-2 justify-items-center items-center'>
                        <div className='w-full'>
                            <label className="block font-bold text-sm">LESIONES OCULARES</label>
                            <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                        </div>
                        <div className='w-full'>
                            <label className="block font-bold text-sm">BOCA, DIENTES, ENCIAS</label>
                            <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                        </div>
                        <div className='w-full'>
                            <label className="block font-bold text-sm">COLUMNA VERTEBRAL</label>
                            <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                        </div>
                        <div className='w-full'>
                            <label className="block font-bold text-sm">LESIONES DE OIDO</label>
                            <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                        </div>
                        <div className='w-full'>
                            <label className="block font-bold text-sm">TORAX</label>
                            <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                        </div>
                        <div className='w-full'>
                            <label className="block font-bold text-sm">EXTREMIDADES</label>
                            <input className="border border-gray-300 p-1 w-full" id="ta" type="text"/>
                        </div>
                    </div>
                </div>

                {/* capacidades especiales */}
                <div className='grid grid-rows-[auto_1fr]'>
                    <div className='text-center mt-4 bg-gray-200'>
                        <label>CAPACIDADES ESPECIALES</label>
                    </div>
                    <div className='grid grid-cols-5 gap-2 justify-items-center items-center text-center'>
                        <div>
                            <label className='font-bold'><input type="radio"/> Nula</label>
                            <p>
                                Los sintomas, signos o las secuelas que existen no suponen para el sujeto que las padece ningun impedimento para
                                realizar las tareas basicas, complementarias y criticas del puesto.
                            </p>
                        </div>
                        <div>
                            <label className='font-bold'><input type="radio"/> Leve</label>
                            <p>
                                Los sintomas, signos y las secuelas limitan parcialmente el desarrollo normal de las tareas criticas del puesto,
                                pero no impiden la realizacion de las basicas y complementarias.
                            </p>
                        </div>
                        <div>
                            <label className='font-bold'><input type="radio"/> Moderada</label>
                            <p>
                                Los sintomas, signos y las secuelas suponen una limitacion importante para el sujeto a la hora de desarrollar
                                las tareas criticas del puesto, pero puede realizar parcialmente las tareas basicas y complementarias.
                            </p>
                        </div>
                        <div>
                            <label className='font-bold'><input type="radio"/> Grave</label>
                            <p>
                                Los sintomas, signos y las secuelas suponen una limitacion importante para el sujeto a la hora de desarrollar
                                las tareas criticas del puesto, pero puede realizar parcialmente las tareas basicas y complementarias.
                            </p>
                        </div>
                        <div>
                            <label className='font-bold'><input type="radio"/> Muy grave</label>
                            <p>
                                Los sintomas, signos y las secuelas imposibilitan al sujeto para la realizacion de las tareas basicas,
                                complementarias y criticas del puesto.
                            </p>
                        </div>
                    </div>
                </div>

                {/* calificacion */}
                <div>
                    <div className='text-center mt-4 bg-gray-200'>
                        <label>CALIFICACION</label>
                    </div>
                    <div className='grid grid-rows-3 gap-3'>
                        <div className='grid grid-cols-[1fr_2fr] gap-4'>
                            <label className='font-bold'><input type="radio"/> Apto</label>
                            <p>
                                El trabajador podra desempeñar su tarea habitual sin ningun tipo de restriccion fisica ni laboral.
                            </p>
                        </div>
                        <div className='grid grid-cols-[1fr_2fr] gap-4'>
                            <label className='font-bold'><input type="radio"/> Apto con limitaciones</label>
                            <p>
                                El trabajador puede desarrollar las tareas fundamentales de su puesto (puede realizar mas de 50% de
                                su actividad), pero alguna no fundamental no podra desempeñarla; o solo la podra desarrollar de 
                                forma parcial.
                            </p>
                        </div>
                        <div className='grid grid-cols-[1fr_2fr] gap-4'>
                            <label className='font-bold'><input type="radio"/> No Apto</label>
                            <p>
                                El trabajador, en funcion de sus caracteristicas psicofisicas <em>NO</em> puede desarrollar las tareas
                                fundamentales de su puesto de trabajo, y no hay posibilidad de recuperacion.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='mt-4 grid grid-rows-[1fr_auto_2fr_auto]'>
                    <div>
                        <p>
                            Declaro bajo protesta de decir la verdad que la informacion vertida por mi en el presente documento contiene
                            la verdad de los hechos y estoy consciente que es causa de rescision del contrato laboral sin responsabilidad
                            para el patron el engañarlo en cuanto a aptitudes o facultades de que carezca, lo anterior con fundamento en el
                            articulo <em className='font-bold'>47 Fraccion I</em>
                        </p>
                    </div>
                    <div>
                        <label className='font-bold'>Nombre completo</label>
                        <input className="border border-gray-300 p-1 w-full" type="text"/>
                    </div>
                    <div className='text-center flex flex-col justify-end items-center h-full'>
                        <label>Firma</label>
                    </div>
                    <div>
                        <label className='font-bold'>Realizado por</label>
                        <input className="border border-gray-300 p-1 w-full" type="text"/>
                    </div>
                </div>
                
            </div> {/* Div principal */}
            <button onClick={exportToPDF} className="mt-4 p-2 bg-blue-500 text-white">
                Exportar a PDF
            </button>
        </>
    );
}

export default ExpFisicaDiseño;