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
            const response = await axios.get(`http://172.30.189.100:5005/usuario/${idUsuario}`);
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

    // State to manage the selected option for radio buttons
    const [selectedSexo, setSelectedSexo] = useState(entrevIni?.sexo);
    const [selectedEstadoCivil, setSelectedEstadoCivil] = useState(entrevIni?.estado_civil);
    const [selectedEscolaridad, setSelectedEscolaridad] = useState(entrevIni?.escolaridad);
    const [selectedActualDedica, setSelectedActualDedica] = useState(entrevIni?.entrevistaInicial?.actualDedica);
    const [selectedEntroEmpleo, setSelectedEntroEmpleo] = useState(entrevIni?.entrevistaInicial?.enteroEmpleo);
    const [enQueArea, setEnQueArea] = useState(entrevIni?.entrevistaInicial?.enteroEmpleo);
    const [selectedPendiente, setSelectedPendiente] = useState(entrevIni?.entrevistaInicial?.pendientes);
    const [selectedCuidador, setSelectedCuidador] = useState(entrevIni?.entrevistaInicial?.cuidador);
    const [selectedAreaOPlanta, setSelectedAreaOPlanta] = useState(entrevIni?.entrevistaInicial?.areaOPlanta);
    const [workedBefore, setWorkedBefore] = useState(false);
    const [children, setChildren] = useState(false);
    const [renta, setRenta] = useState(false);
    const [fonacot, setFonacot] = useState(false);
    const [infonavit, setInfonavit] = useState(false);
    const [antecedentes, setAntecedentes] = useState(false);
    const [bono, setBono] = useState(false);
    const [otherEscolaridad, setOtherEscolaridad] = useState('');

    useEffect(() => {
        if (selectedEscolaridad !== 'Otro') {
            setOtherEscolaridad('');
        }
    }, [selectedEscolaridad]);

    const handleRadioChange = (setter) => (e) => {
        setter(e.target.value);
    };

    return (
        <>
            <div ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
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
                            <input className="w-full border border-gray-300 p-2 leading-[4] h-10" type="text" defaultValue={entrevIni?.nombre} />
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
                                <label>
                                    <input type="radio" name="sexo" value="H" checked={selectedSexo === 'H'} onChange={handleRadioChange(setSelectedSexo)} />H
                                </label>
                                <label>
                                    <input type="radio" name="sexo" value="M" checked={selectedSexo === 'M'} onChange={handleRadioChange(setSelectedSexo)} />M
                                </label>
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
                        <label>
                            <input type="radio" name="estadoCivil" value="Soltero (a)" checked={selectedEstadoCivil === 'Soltero (a)'} onChange={handleRadioChange(setSelectedEstadoCivil)} />Soltero (a)
                        </label>
                        <label>
                            <input type="radio" name="estadoCivil" value="Casado" checked={selectedEstadoCivil === 'Casado'} onChange={handleRadioChange(setSelectedEstadoCivil)} />Casado (a)
                        </label>
                        <label>
                            <input type="radio" name="estadoCivil" value="Unión Libre" checked={selectedEstadoCivil === 'Unión Libre'} onChange={handleRadioChange(setSelectedEstadoCivil)} />Unión Libre
                        </label>
                        <label>
                            <input type="radio" name="estadoCivil" value="Separado (a)" checked={selectedEstadoCivil === 'Separado (a)'} onChange={handleRadioChange(setSelectedEstadoCivil)} />Separado (a)
                        </label>
                        <label>
                            <input type="radio" name="estadoCivil" value="Viudo (a)" checked={selectedEstadoCivil === 'Viudo (a)'} onChange={handleRadioChange(setSelectedEstadoCivil)} />Viudo (a)
                        </label>
                    </div>
                </div>

                {/* Education */}
                <div className="mb-4">
                    <div className="flex space-x-4">
                        <div>ESCOLARIDAD:</div>
                        <label>
                            <input type="radio" name="escolaridad" value="Primaria" checked={selectedEscolaridad === 'Primaria'} onChange={handleRadioChange(setSelectedEscolaridad)} />PRIMARIA
                        </label>
                        <label>
                            <input type="radio" name="escolaridad" value="Secundaria" checked={selectedEscolaridad === 'Secundaria'} onChange={handleRadioChange(setSelectedEscolaridad)} />SECUNDARIA
                        </label>
                        <label>
                            <input type="radio" name="escolaridad" value="Bachillerato" checked={selectedEscolaridad === 'Bachillerato'} onChange={handleRadioChange(setSelectedEscolaridad)} />PREPARATORIA
                        </label>
                        <label>
                            <input type="radio" name="escolaridad" value="Otro" checked={selectedEscolaridad === 'Otro'} onChange={handleRadioChange(setSelectedEscolaridad)} />OTRO
                        </label>
                        <input className="border border-gray-300 p-2" type="text" value={otherEscolaridad} onChange={(e) => setOtherEscolaridad(e.target.value)} readOnly={selectedEscolaridad !== 'Otro'} />
                    </div>
                </div>

                {/* Current Employment Status */}
                <div className="mb-4">
                    <div>Actualmente, ¿A qué se dedica?</div>
                    <div className="flex space-x-4">
                        <label>
                            <input type="radio" name="actualDedica" value="Estudiante" checked={selectedActualDedica === 'Estudiante'} onChange={handleRadioChange(setSelectedActualDedica)} />ESTUDIANTE
                        </label>
                        <label>
                            <input type="radio" name="actualDedica" value="Desempleado" checked={selectedActualDedica === 'Desempleado'} onChange={handleRadioChange(setSelectedActualDedica)} />DESEMPLEADO
                        </label>
                        <label>
                            <input type="radio" name="actualDedica" value="Otro" checked={selectedActualDedica === 'Otro'} onChange={handleRadioChange(setSelectedActualDedica)} />OTRO:
                        </label>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={selectedActualDedica === 'Otro' ? '' : ''} readOnly={selectedActualDedica !== 'Otro'} />
                    </div>
                </div>

                {/* How did you hear about the job? */}
                <div className="mb-4">
                    <div>¿Cómo se enteró del Empleo?</div>
                    <div className="flex space-x-4">
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Reingreso" checked={selectedEntroEmpleo === 'Reingreso'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />REINGRESO
                        </label>
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Volante" checked={selectedEntroEmpleo === 'Volante'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />VOLANTE
                        </label>
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Publicidad en Poste" checked={selectedEntroEmpleo === 'Publicidad en Poste'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />PUBLICIDAD EN POSTE
                        </label>
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Espectacular" checked={selectedEntroEmpleo === 'Espectacular'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />ESPECTACULAR
                        </label>
                    </div>
                    <div className="flex space-x-4">
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Facebook" checked={selectedEntroEmpleo === 'Facebook'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />FACEBOOK
                        </label>
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Bono Padrino" checked={selectedEntroEmpleo === 'Bono Padrino'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />BONO PADRINO
                        </label>
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Anuncio Parlante" checked={selectedEntroEmpleo === 'Anuncio Parlante'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />ANUNCIO PARLANTE
                        </label>
                        <label>
                            <input type="radio" name="enteroEmpleo" value="Otro" checked={selectedEntroEmpleo === 'Otro'} onChange={handleRadioChange(setSelectedEntroEmpleo)} />OTRO:
                        </label>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={selectedEntroEmpleo === 'Otro' ? '' : ''} readOnly={selectedEntroEmpleo !== 'Otro'} />
                    </div>
                </div>

                {/* Previous Employment */}
                <div className="mb-4">
                    <div>Anteriormente, ¿ha trabajado con nosotros?</div>
                    <div className="flex space-x-4">
                        <label>
                            <input 
                                type="radio" 
                                name="numIngresos" 
                                value="Sí" 
                                checked={workedBefore} 
                                onChange={() => setWorkedBefore(true)} 
                            />Sí
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="numIngresos" 
                                value="No" 
                                checked={!workedBefore} 
                                onChange={() => setWorkedBefore(false)} 
                            />No
                        </label>
                    </div>
                    <div>
                        <label>Número de Ingresos:</label>
                        <input 
                            className="border border-gray-300 p-2" 
                            type="number" 
                            defaultValue={entrevIni?.entrevistaInicial?.numIngresos} 
                            readOnly={!workedBefore} 
                        />
                        <div className="mt-4">
                            <div>¿En qué área?</div>
                            <div className="flex space-x-4">
                                {['Medios', 'Corte', 'Ensamble'].map(area => (
                                    <label key={area}>
                                        <input 
                                            type="radio" 
                                            name="enQueArea" 
                                            value={area} 
                                            checked={workedBefore ? enQueArea === area : entrevIni?.entrevistaInicial?.enQueArea === area} 
                                            onChange={workedBefore ? handleRadioChange(setEnQueArea) : undefined} 
                                            readOnly={!workedBefore} 
                                        />
                                        {area}
                                    </label>
                                ))}
                                <label>PROCESO DE LÍNEA:</label>
                                <input 
                                    className="border border-gray-300 p-2" 
                                    type="text" 
                                    defaultValue={entrevIni?.entrevistaInicial?.procesoLinea} 
                                    readOnly={!workedBefore} 
                                />
                                <label>OTRA ÁREA:</label>
                                <input 
                                    className="border border-gray-300 p-2" 
                                    type="text" 
                                    defaultValue={entrevIni?.entrevistaInicial?.otraArea} 
                                    readOnly={!workedBefore} 
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div>Motivo de renuncia o retiro:</div>
                            <input 
                                className="w-full border border-gray-300 p-2" 
                                type="text" 
                                defaultValue={entrevIni?.entrevistaInicial?.motivoRenuncia} 
                                readOnly={!workedBefore} 
                            />
                        </div>
                    </div>
                </div>

                {/* Children Information */}
                <div className="mb-4">
                    <div>¿Tienes hijos?</div>
                    <div className="flex space-x-4">
                        <label>
                            <input type="radio" name="cant_hijos" value="Sí" checked={children} onChange={() => setChildren(true)} />Sí
                        </label>
                        <label>
                            <input type="radio" name="cant_hijos" value="No" checked={!children} onChange={() => setChildren(false)} />No
                        </label>
                        <div>Cuantos</div>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.cant_hijos} readOnly={!children}  />
                        <div>Edades de sus hijos</div>
                        <input className="border border-gray-300 p-2" type="text" defaultValue={entrevIni?.entrevistaInicial?.edades_hijos} readOnly={!children} />
                    </div>
                    <div className="mt-4">
                        <div>¿Quién los cuida?</div>
                        <div className="flex space-x-4">
                            <label>
                                <input 
                                    type="radio" 
                                    name="cuidador" 
                                    value="Esposo (A)" 
                                    checked={children ? selectedCuidador === 'Esposo (A)' : ''} 
                                    onChange={children ? handleRadioChange(setSelectedCuidador) : undefined} 
                                    readOnly={!children} 
                                />ESPOSO (A)
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="cuidador" 
                                    value="Abuelo (A)" 
                                    checked={children ? selectedCuidador === 'Abuelo (A)' : ''} 
                                    onChange={children ? handleRadioChange(setSelectedCuidador) : undefined} 
                                    readOnly={!children} 
                                />ABUELO (A)
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="cuidador" 
                                    value="Vecino (A)" 
                                    checked={children ? selectedCuidador === 'Vecino (A)' : ''} 
                                    onChange={children ? handleRadioChange(setSelectedCuidador) : undefined} 
                                    readOnly={!children} 
                                />VECINO (A)
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="cuidador" 
                                    value="Otro" 
                                    checked={children ? selectedCuidador === 'Otro' : ''} 
                                    onChange={children ? handleRadioChange(setSelectedCuidador) : undefined} 
                                    readOnly={!children} 
                                />OTRO:
                            </label>
                            <input 
                                className="border border-gray-300 p-2" 
                                type="text" 
                                defaultValue={selectedCuidador === 'Otro' ? '' : ''} 
                                readOnly={selectedCuidador !== 'Otro'} 
                            />
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
                            <label>
                                <input type="radio" name="renta" value="Sí" checked={renta} onChange={() => setRenta(true)}  />Sí
                            </label>
                            <label>
                                <input type="radio" name="renta" value="No" checked={!renta} onChange={() => setRenta(false)} />No
                            </label>
                            <input className="border border-gray-300 p-2" type="number" readOnly={!renta}  />
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <label>FONACOT</label>
                            <label>
                                <input type="radio" name="fonacot" value="Sí" checked={fonacot} onChange={() => setFonacot(true)} />Sí
                            </label>
                            <label>
                                <input type="radio" name="fonacot" value="No" checked={!fonacot} onChange={() => setFonacot(false)} />No
                            </label>
                            <input className="border border-gray-300 p-2" type="number" readOnly={!fonacot} />
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <label>INFONAVIT</label>
                            <label>
                                <input type="radio" name="infonavit" value="Sí" checked={infonavit} onChange={() => setInfonavit(true)} />Sí
                            </label>
                            <label>
                                <input type="radio" name="infonavit" value="No" checked={!infonavit} onChange={() => setInfonavit(false)} />No
                            </label>
                            <input className="border border-gray-300 p-2" type="number" readOnly={!infonavit} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <label>¿Tiene Antecedentes Penales?</label>
                        <div className="flex space-x-4">
                            <label>
                                <input type="radio" name="antecedentesPen" value="Sí" checked={antecedentes} onChange={() => setAntecedentes(true)} />Sí
                            </label>
                            <label>
                                <input type="radio" name="antecedentesPen" value="No" checked={!antecedentes} onChange={() => setAntecedentes(false)} />No
                            </label>
                        </div>
                        <div>
                            <label>Motivo</label>
                            <input className="border border-gray-300 p-2" type="text" readOnly={!antecedentes} />
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
                        <label>
                            <input type="radio" name="bonoContr" value="Sí" checked={bono} onChange={() => setBono(true)} />Sí
                        </label>
                        <label>
                            <input type="radio" name="bonoContr" value="No" checked={!bono} onChange={() => setBono(false)} />No
                        </label>
                        <label>Pago bono contratacion:</label>
                        <input className="w-full border border-gray-300" type="number" readOnly={!bono} />
                    </div>
                </div>

                {/* Area Placement */}
                <div className="mb-4">
                    <div>¿A qué área o planta?</div>
                    <div className="flex flex-row space-x-4">
                        <div className="space-x-2">
                            <label>
                                <input type="radio" name="areaOPlanta" value="Medios" checked={selectedAreaOPlanta === 'Medios'} onChange={handleRadioChange(setSelectedAreaOPlanta)} />MEDIOS
                            </label>
                            <label>
                                <input type="radio" name="areaOPlanta" value="Corte" checked={selectedAreaOPlanta === 'Corte'} onChange={handleRadioChange(setSelectedAreaOPlanta)} />CORTE
                            </label>
                            <label>
                                <input type="radio" name="areaOPlanta" value="TP1" checked={selectedAreaOPlanta === 'TP1'} onChange={handleRadioChange(setSelectedAreaOPlanta)} />TP1
                            </label>
                            <label>
                                <input type="radio" name="areaOPlanta" value="TP2" checked={selectedAreaOPlanta === 'TP2'} onChange={handleRadioChange(setSelectedAreaOPlanta)} />TP2
                            </label>
                            <label>
                                <input type="radio" name="areaOPlanta" value="TP3" checked={selectedAreaOPlanta === 'TP3'} onChange={handleRadioChange(setSelectedAreaOPlanta)} />TP3
                            </label>
                            <label>
                                <input type="radio" name="areaOPlanta" value="TP4" checked={selectedAreaOPlanta === 'TP4'} onChange={handleRadioChange(setSelectedAreaOPlanta)} />TP4
                            </label>
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