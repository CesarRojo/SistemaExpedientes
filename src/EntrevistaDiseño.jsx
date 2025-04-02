import { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function EntrevistaDiseño() {
    const [entrevIni, setEntrevIni] = useState(null);
    const location = useLocation();
    const { idUsuario } = location.state || {};

    const fetchEntrevIniData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.68:5005/usuario/${idUsuario}`);
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

            pdf.save('entrevista.pdf');
        });
    };

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <img alt="ATR Nayarit Logo" className="h-31" src="logo.png" />
                    <div className="text-center bg-gray-200">
                        <h1 className="text-xl font-bold">ENTREVISTA INICIAL | DEPARTAMENTO DE RECLUTAMIENTO</h1>
                        <div className="flex space-x-2">
                            <div>ÁREA QUE SE DIRIGE:</div>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.areaDirige} />
                        </div>
                        <div className="flex space-x-2">
                            <div>PUESTO:</div>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.puesto} />
                        </div>
                        <div className="flex space-x-2">
                            <div>TURNO:</div>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.turno} />
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="mb-4">
                    <div className="grid grid-cols-5 gap-4">
                        <div>
                            <label>NOMBRE (S)</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.nombre} />
                        </div>
                        <div>
                            <label>APELLIDO PATERNO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.apellidoPat} />
                        </div>
                        <div>
                            <label>APELLIDO MATERNO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.apellidoMat} />
                        </div>
                        <div>
                            <label>EDAD</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.edad} />
                        </div>
                        <div>
                            <label>SEXO</label>
                            <div className="flex space-x-2">
                                <label><input type="radio" name="sexo" defaultChecked={entrevIni?.sexo === 'H'} />H</label>
                                <label><input type="radio" name="sexo" defaultChecked={entrevIni?.sexo === 'M'} />M</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address and Contact Information */}
                <div className="mb-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label>CALLE</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.calle} />
                        </div>
                        <div>
                            <label>NÚMERO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.numero} />
                        </div>
                        <div>
                            <label>COLONIA</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.colonia} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label>TELÉFONO PERSONAL</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.tel_personal} />
                        </div>
                        <div>
                            <label>TEL. FAMILIAR</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.tel_emergencia} />
                        </div>
                    </div>
                </div>

                {/* Marital Status */}
                <div className="mb-4">
                    <div className="flex space-x-4">
                        <div>ESTADO CIVIL:</div>
                        <label><input type="checkbox" defaultChecked={entrevIni?.estado_civil === 'Soltero (a)'} />Soltero (a)</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.estado_civil === 'Casado'} />Casado (a)</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.estado_civil === 'Unión Libre'} />Unión Libre</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.estado_civil === 'Separado (a)'} />Separado (a)</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.estado_civil === 'Viudo (a)'} />Viudo (a)</label>
                    </div>
                </div>

                {/* Education */}
                <div className="mb-4">
                    <div className="flex space-x-4">
                        <div>ESCOLARIDAD:</div>
                        <label><input type="checkbox" defaultChecked={entrevIni?.escolaridad === 'Primaria'} />PRIMARIA</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.escolaridad === 'Secundaria'} />SECUNDARIA</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.escolaridad === 'Bachillerato'} />PREPARATORIA</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.escolaridad === 'Otro'} />OTRO</label>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.escolaridad === 'Otro' ? '' : ''} />
                    </div>
                </div>

                {/* Current Employment Status */}
                <div className="mb-4">
                    <div>Actualmente, ¿A qué se dedica?</div>
                    <div className="flex space-x-4">
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.actualDedica === 'Estudiante'} />ESTUDIANTE</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.actualDedica === 'Desempleado'} />DESEMPLEADO</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.actualDedica === 'Otro'} />OTRO:</label>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.actualDedica === 'Otro' ? '' : ''} />
                    </div>
                </div>

                {/* How did you hear about the job? */}
                <div className="mb-4">
                    <div>¿Cómo se enteró del Empleo?</div>
                    <div className="flex space-x-4">
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Reingreso'} />REINGRESO</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Volante'} />VOLANTE</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Publicidad en Poste'} />PUBLICIDAD EN POSTE</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Espectacular'} />ESPECTACULAR</label>
                    </div>
                    <div className="flex space-x-4">
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Facebook'} />FACEBOOK</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Bono Padrino'} />BONO PADRINO</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Anuncio Parlante'} />ANUNCIO PARLANTE</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Otro'} />OTRO:</label>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.enteroEmpleo === 'Otro' ? '' : ''} />
                    </div>
                </div>

                {/* Previous Employment */}
                <div className="mb-4">
                    <div>Anteriormente, ¿ha trabajado con nosotros?</div>
                    <div className="flex space-x-4">
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.numIngresos !== null} />Sí</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.numIngresos === null} />No</label>
                        <label>Número de Ingresos:</label>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.numIngresos} />
                    </div>
                    <div className="mt-4">
                        <div>¿En qué área?</div>
                        <div className="flex space-x-4">
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enQueArea === 'Medios'} />MEDIOS</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enQueArea === 'Corte'} />CORTE</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.enQueArea === 'Ensamble'} />ENSAMBLE</label>
                            <label>PROCESO DE LÍNEA:</label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.procesoLinea} />
                            <label>OTRA ÁREA:</label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.otraArea} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div>Motivo de renuncia o retiro:</div>
                        <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.motivoRenuncia} />
                    </div>
                </div>

                {/* Children Information */}
                <div className="mb-4">
                    <div>¿Tienes hijos?</div>
                    <div className="flex space-x-4">
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.cant_hijos > 0} />Sí</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.cant_hijos === null} />No</label>
                        <div>Cuantos</div>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.cant_hijos} />
                        <div>Edades de sus hijos</div>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.edades_hijos} />
                    </div>
                    <div className="mt-4">
                        <div>¿Quién los cuida?</div>
                        <div className="flex space-x-4">
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.cuidador === 'Esposo (A)'} />ESPOSO (A)</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.cuidador === 'Abuelo (A)'} />ABUELO (A)</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.cuidador === 'Vecino (A)'} />VECINO (A)</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.cuidador === 'Otro'} />OTRO:</label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.cuidador === 'Otro' ? '' : ''} />
                        </div>
                    </div>
                </div>

                {/* Last Two Jobs Information */}
                <div className="mb-4">
                    <div>Información de los últimos dos empleos</div>
                    <div className="grid grid-cols-5 gap-4 mt-4">
                        <div>
                            <label>EMPRESA</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.empresa1} />
                        </div>
                        <div>
                            <label>MOTIVO DE SALIDA</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.motivoSal1} />
                        </div>
                        <div>
                            <label>DURACIÓN</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.duracion1} />
                        </div>
                        <div>
                            <label>SALARIO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.salario1} />
                        </div>
                        <div>
                            <label>HORARIO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.horario1} />
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mt-4">
                        <div>
                            <label>EMPRESA</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.empresa2} />
                        </div>
                        <div>
                            <label>MOTIVO DE SALIDA</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.motivoSal2} />
                        </div>
                        <div>
                            <label>DURACIÓN</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.duracion2} />
                        </div>
                        <div>
                            <label>SALARIO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.salario2} />
                        </div>
                        <div>
                            <label>HORARIO</label>
                            <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.horario2} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div>
                            <label>¿Cuanto tiempo tienes sin trabajar? </label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.tiempoSinTrab} />
                        </div>
                        <div>
                            <label>¿Hace cuanto tiempo saliste del ultimo empleo? </label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.tiempoSalida} />
                        </div>
                        <div>
                            <label>¿A que se debia que no trabajaba? </label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.motivoNoTrab} />
                        </div>
                    </div>
                </div>

                {/* Pending Issues */}
                <div className="mb-4 grid grid-cols-2">
                    <div className="">
                        <div>¿Tienes algun pendiente?</div>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.pendientes} />
                        <div className="flex space-x-4 mt-4">
                            <label>Paga Renta</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.renta} />Sí</label>
                            <label><input type="checkbox" defaultChecked={!entrevIni?.entrevistaInicial?.renta} />No</label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <label>FONACOT</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.fonacot} />Sí</label>
                            <label><input type="checkbox" defaultChecked={!entrevIni?.entrevistaInicial?.fonacot} />No</label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <label>INFONAVIT</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.infonavit} />Sí</label>
                            <label><input type="checkbox" defaultChecked={!entrevIni?.entrevistaInicial?.infonavit} />No</label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <label>¿Tiene Antecedentes Penales?</label>
                        <div className="flex space-x-4">
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.antecedentesPen === 'Sí'} />Sí</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.antecedentesPen === 'No'} />No</label>
                        </div>
                        <div>
                            <label>Motivo</label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.antecedentesPen} />
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label>FECHA:</label>
                        <input className="w-full border border-gray-300 p-2" type="date" defaultValue={new Date(entrevIni?.entrevistaInicial?.fecha).toLocaleDateString()} />
                    </div>
                    <div>
                        <label>FIRMA DEL DPTO. RECLUTAMIENTO</label>
                        <input className="w-full border-b border-gray-300 p-2" type="text" />
                    </div>
                </div>

                {/* Training Department */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-center">DEPARTAMENTO DE ENTRENAMIENTO</label>
                        <div className="grid grid-cols-2">
                            <div>
                                <div>
                                    <label>IMAGE </label>
                                    <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.image} />
                                </div>
                                <div>
                                    <label>ENCINTE </label>
                                    <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.encinte} />
                                </div>
                                <div>
                                    <label>TRICKY </label>
                                    <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.tricky} />
                                </div>
                                <div>
                                    <label>ARTESANAL </label>
                                    <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.artesanal} />
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div>
                                    <label>EN PROCESO </label>
                                    <input className="border border-gray-300 p-2" type="text" />
                                </div>
                                <div>
                                    <label>PREPARADO </label>
                                    <input className="border border-gray-300 p-2" type="text" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label>FIRMA DEL ENTRENADOR</label>
                            <input className="w-full border-b border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-center">DEPARTAMENTO MEDICO</label>
                        <div className="">
                            <div>
                                <div>
                                    <label>COMPRENSION </label>
                                    <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.comprension} />
                                </div>
                                <div>
                                    <label>VISTA </label>
                                    <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.vista} />
                                </div>
                                <div>
                                    <label>CALIFICACION </label>
                                    <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.calificacion} />
                                </div>
                                <div>
                                    <label>COMENTARIOS </label>
                                    <input className="w-full border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.comentarios} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label>FIRMA ENFERMERIA</label>
                            <input className="w-full border-b border-gray-300 p-2" type="text" />
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="mb-4">
                    <div>¿Es Recomendado?</div>
                    <div className="flex space-x-4">
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.bonoContr === 'Sí'} />Sí</label>
                        <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.bonoContr === 'No'} />No</label>
                        <label>Pago bono contratacion:</label>
                        <input className="w-full border border-gray-300" type="text" defaultValue={entrevIni?.entrevistaInicial?.bonoContr} />
                    </div>
                </div>

                {/* Area Placement */}
                <div className="mb-4">
                    <div>¿A qué área o planta?</div>
                    <div className="flex flex-row space-x-4">
                        <div className="space-x-2">
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.areaOPlanta === 'Medios'} />MEDIOS</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.areaOPlanta === 'Corte'} />CORTE</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.areaOPlanta === 'TP1'} />TP1</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.areaOPlanta === 'TP2'} />TP2</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.areaOPlanta === 'TP3'} />TP3</label>
                            <label><input type="checkbox" defaultChecked={entrevIni?.entrevistaInicial?.areaOPlanta === 'TP4'} />TP4</label>
                        </div>
                        <div className="space-x-2">
                            <label>Nombre completo:</label>
                            <input className="w-90 border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.nombreCompleto} />
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="pr-38">
                            <label>Otro:</label>
                            <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.otroArea} />
                        </div>
                        <div>
                            <label className="pr-14">Firma:</label>
                            <input className="w-90 border-b border-gray-300 p-2" type="text" />
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

export default EntrevistaDiseño;