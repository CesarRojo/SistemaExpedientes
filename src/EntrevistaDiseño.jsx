import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro'; // Cambiado a html2canvas-pro

function EntrevistaDiseño() {
    const pdfRef = useRef();

    const exportToPDF = () => {
        const input = pdfRef.current;
    
        html2canvas(input, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'legal'); // Cambiado a formato oficio
            const imgWidth = 216; // Ancho de oficio en mm
            const pageHeight = 330; // Alto de oficio en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            // Ajustar la altura para que quepa en una sola página
            if (imgHeight > pageHeight) {
                const scaleFactor = pageHeight / imgHeight;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight * scaleFactor);
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
              <input className="border border-gray-300 p-2" type="text" />
            </div>
            <div className="flex space-x-2">
              <div>PUESTO:</div>
              <input className="border border-gray-300 p-2" type="text" />
            </div>
            <div className="flex space-x-2">
              <div>TURNO:</div>
              <input className="border border-gray-300 p-2" type="text" />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-4">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label>NOMBRE (S)</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>APELLIDO PATERNO</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>APELLIDO MATERNO</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>EDAD</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>SEXO</label>
              <div className="flex space-x-2">
                <label><input type="radio" name="sexo" />F</label>
                <label><input type="radio" name="sexo" />M</label>
              </div>
            </div>
          </div>
        </div>

        {/* Address and Contact Information */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>CALLE</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>NÚMERO</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>COLONIA</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label>TELÉFONO PERSONAL</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>TEL. FAMILIAR</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
        </div>

        {/* Marital Status */}
        <div className="mb-4">
          <div className="flex space-x-4">
            <div>ESTADO CIVIL:</div>
            <label><input type="checkbox" />Soltero (a)</label>
            <label><input type="checkbox" />Casado (a)</label>
            <label><input type="checkbox" />Unión Libre</label>
            <label><input type="checkbox" />Separado (a)</label>
            <label><input type="checkbox" />Viudo (a)</label>
          </div>
        </div>

        {/* Education */}
        <div className="mb-4">
          <div className="flex space-x-4">
            <div>ESCOLARIDAD:</div>
            <label><input type="checkbox" />PRIMARIA</label>
            <label><input type="checkbox" />SECUNDARIA</label>
            <label><input type="checkbox" />PREPARATORIA</label>
            <label><input type="checkbox" />OTRO</label>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
        </div>

        {/* Current Employment Status */}
        <div className="mb-4">
          <div>Actualmente, ¿A qué se dedica?</div>
          <div className="flex space-x-4">
            <label><input type="checkbox" />ESTUDIANTE</label>
            <label><input type="checkbox" />DESEMPLEADO</label>
            <label><input type="checkbox" />OTRO:</label>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
        </div>

        {/* How did you hear about the job? */}
        <div className="mb-4">
          <div>¿Cómo se enteró del Empleo?</div>
          <div className="flex space-x-4">
            <label><input type="checkbox" />REINGRESO</label>
            <label><input type="checkbox" />VOLANTE</label>
            <label><input type="checkbox" />PUBLICIDAD EN POSTE</label>
            <label><input type="checkbox" />ESPECTACULAR</label>
          </div>
          <div className="flex space-x-4">
            <label><input type="checkbox" />FACEBOOK</label>
            <label><input type="checkbox" />BONO PADRINO</label>
            <label><input type="checkbox" />ANUNCIO PARLANTE</label>
            <label><input type="checkbox" />OTRO:</label>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
        </div>

        {/* Previous Employment */}
        <div className="mb-4">
          <div>Anteriormente, ¿ha trabajado con nosotros?</div>
          <div className="flex space-x-4">
            <label><input type="checkbox" />Sí</label>
            <label><input type="checkbox" />No</label>
            <label>Número de Ingresos:</label>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
          <div className="mt-4">
            <div>¿En qué área?</div>
            <div className="flex space-x-4">
              <label><input type="checkbox" />MEDIOS</label>
              <label><input type="checkbox" />CORTE</label>
              <label><input type="checkbox" />ENSAMBLE</label>
              <label>PROCESO DE LÍNEA:</label>
              <input className="border border-gray-300 p-2" type="text" />
              <label>OTRA ÁREA:</label>
              <input className="border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className="mt-4">
            <div>Motivo de renuncia o retiro:</div>
            <input className="w-full border border-gray-300 p-2" type="text" />
          </div>
        </div>

        {/* Children Information */}
        <div className="mb-4">
          <div>¿Tienes hijos?</div>
          <div className="flex space-x-4">
            <label><input type="checkbox" />Sí</label>
            <label><input type="checkbox" />No</label>
            <div>Cuantos</div>
            <input className="border border-gray-300 p-2" type="text" />
            <div>Edades de sus hijos</div>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
          <div className="mt-4">
            <div>¿Quién los cuida?</div>
            <div className="flex space-x-4">
              <label><input type="checkbox" />ESPOSO (A)</label>
              <label><input type="checkbox" />ABUELO (A)</label>
              <label><input type="checkbox" />VECINO (A)</label>
              <label><input type="checkbox" />OTRO:</label>
              <input className="border border-gray-300 p-2" type="text" />
            </div>
          </div>
        </div>

        {/* Last Two Jobs Information */}
        <div className="mb-4">
          <div>Información de los últimos dos empleos</div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            <div>
              <label>EMPRESA</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>MOTIVO DE SALIDA</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>DURACIÓN</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>SALARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>HORARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            <div>
              <label>EMPRESA</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>MOTIVO DE SALIDA</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>DURACIÓN</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>SALARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
            <div>
              <label>HORARIO</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className="mt-4">
            <div>
                <label>¿Cuanto tiempo tienes sin trabajar? </label>
                <input className="border border-gray-300 p-2" type="text" />
            </div>
            <div>
                <label>¿Hace cuanto tiempo saliste del ultimo empleo? </label>
                <input className="border border-gray-300 p-2" type="text" />
            </div>
            <div>
                <label>¿A que se debia que no trabajaba? </label>
                <input className="border border-gray-300 p-2" type="text" />
            </div>
          </div>
        </div>

        {/* Pending Issues */}
        <div className="mb-4 grid grid-cols-2">
         <div className="">
          <div>¿Tienes algun pendiente?</div>
          <input className="border border-gray-300 p-2" type="text" />
          <div className="flex space-x-4 mt-4">
            <label>Paga Renta</label>
            <label><input type="checkbox" />Sí</label>
            <label><input type="checkbox" />No</label>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
          <div className="flex space-x-4 mt-4">
            <label>FONACOT</label>
            <label><input type="checkbox" />Sí</label>
            <label><input type="checkbox" />No</label>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
          <div className="flex space-x-4 mt-4">
            <label>INFONAVIT</label>
            <label><input type="checkbox" />Sí</label>
            <label><input type="checkbox" />No</label>
            <input className="border border-gray-300 p-2" type="text" />
          </div>
         </div>
         <div className="flex flex-col items-center justify-center">
            <label>¿Tiene Antecedentes Penales?</label>
            <div className="flex space-x-4">
                <label><input type="checkbox" />Sí</label>
                <label><input type="checkbox" />No</label>
            </div>
            <div>
                <label>Motivo</label>
                <input className="border border-gray-300 p-2" type="text" />
            </div>
         </div>
        </div>

        {/* Date */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label>FECHA:</label>
            <input className="w-full border border-gray-300 p-2" type="text" />
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
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>ENCINTE </label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>TRICKY </label>
                            <input className="border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>ARTESANAL </label>
                            <input className="border border-gray-300 p-2" type="text" />
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
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>VISTA </label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>CALIFICACION </label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
                        </div>
                        <div>
                            <label>COMENTARIOS </label>
                            <input className="w-full border border-gray-300 p-2" type="text" />
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
            <label><input type="checkbox" />Sí</label>
            <label><input type="checkbox" />No</label>
            <label>Pago bono contratacion:</label>
            <input className="w-full border border-gray-300" type="text" />
          </div>
        </div>

        {/* Area Placement */}
        <div className="mb-4">
          <div>¿A qué área o planta?</div>
          <div className="flex flex-row space-x-4">
            <div className="space-x-2">
                <label><input type="checkbox" />MEDIOS</label>
                <label><input type="checkbox" />CORTE</label>
                <label><input type="checkbox" />TP1</label>
                <label><input type="checkbox" />TP2</label>
                <label><input type="checkbox" />TP3</label>
                <label><input type="checkbox" />TP4</label>
            </div>
            <div className="space-x-2">
                <label>Nombre completo:</label>
                <input className="w-90 border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="pr-38">
                <label>Otro:</label>
                <input className="border border-gray-300 p-2" type="text" />
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