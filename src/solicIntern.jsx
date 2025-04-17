import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import useAuthStore from './authStore';
import { useNavigate } from 'react-router-dom';
import RfcFacil from 'rfc-facil';

const estados = [
  { clave: "AS", nombre: "Aguascalientes" },
  { clave: "BC", nombre: "Baja California" },
  { clave: "BS", nombre: "Baja California Sur" },
  { clave: "CC", nombre: "Campeche" },
  { clave: "CS", nombre: "Chiapas" },
  { clave: "CH", nombre: "Chihuahua" },
  { clave: "CO", nombre: "Coahuila" },
  { clave: "CL", nombre: "Colima" },
  { clave: "CM", nombre: "Ciudad de México" },
  { clave: "DG", nombre: "Durango" },
  { clave: "GT", nombre: "Guanajuato" },
  { clave: "GR", nombre: "Guerrero" },
  { clave: "HG", nombre: "Hidalgo" },
  { clave: "JC", nombre: "Jalisco" },
  { clave: "MC", nombre: "México" },
  { clave: "MN", nombre: "Michoacán" },
  { clave: "MS", nombre: "Morelos" },
  { clave: "NT", nombre: "Nayarit" },
  { clave: "NL", nombre: "Nuevo León" },
  { clave: "OC", nombre: "Oaxaca" },
  { clave: "PL", nombre: "Puebla" },
  { clave: "QT", nombre: "Querétaro" },
  { clave: "QR", nombre: "Quintana Roo" },
  { clave: "SP", nombre: "San Luis Potosí" },
  { clave: "SL", nombre: "Sinaloa" },
  { clave: "SR", nombre: "Sonora" },
  { clave: "TC", nombre: "Tabasco" },
  { clave: "TS", nombre: "Tamaulipas" },
  { clave: "TL", nombre: "Tlaxcala" },
  { clave: "VZ", nombre: "Veracruz" },
  { clave: "YN", nombre: "Yucatán" },
  { clave: "ZS", nombre: "Zacatecas" }
];

function buscaVocal(str) {
  const vocales = "AEIOU";
  for (let i = 1; i < str.length; i++) {
    if (vocales.includes(str[i])) return str[i];
  }
  return "X";
}

function buscaConsonante(str) {
  const vocales = "AEIOU Ñ.";
  for (let i = 1; i < str.length; i++) {
    if (!vocales.includes(str[i])) return str[i];
  }
  return "X";
}

function cambiaPalabra(str) {
  const malas = [
    "BUEI","BUEY","CACA","CACO","CAGA","CAGO","CAKA","CAKO","COGE","COJA","COJE",
    "COJI","COJO","CULO","FETO","GUEY","JOTO","KACA","KACO","KAGA","KAGO","KOGE",
    "KOJO","KAKA","KULO","LOCA","LOCO","MAME","MAMO","MEAR","MEAS","MEON","MION",
    "MOCO","MULA","PEDA","PEDO","PENE","PUTA","PUTO","QULO","RATA","RUIN"
  ];
  if (malas.includes(str)) {
    return str[0] + "X" + str.slice(2);
  }
  return str;
}

function estadoCodigo(index) {
  return estados[index]?.clave || "NE";
}

function ultdig(curp) {
  const tabla = (c) => {
    if ("0" <= c && c <= "9") return c.charCodeAt(0) - 48;
    if ("A" <= c && c <= "N") return c.charCodeAt(0) - 55;
    if ("O" <= c && c <= "Z") return c.charCodeAt(0) - 54;
    return 0;
  };
  let dv = 0;
  for (let i = 0; i < curp.length; i++) {
    dv += tabla(curp[i]) * (18 - i);
  }
  dv %= 10;
  return dv === 0 ? 0 : 10 - dv;
}

function generaCURP({ nombre, paterno, materno, fecha, genero, estado }) {
  if (!nombre || !paterno || !fecha || !genero || estado === "") return "";

  nombre = nombre.toUpperCase().trim();
  paterno = paterno.toUpperCase().trim();
  materno = materno.toUpperCase().trim() || "X";
  genero = genero.toUpperCase();

  // Quitar prefijos comunes
  const quitar = /^(DE |DEL |LO |LOS |LA |LAS )/;
  const nombresQuitar = /^(MARIA |JOSE )/;

  nombre = nombre.replace(quitar, "").replace(nombresQuitar, "").replace(quitar, "");
  paterno = paterno.replace(quitar, "");
  materno = materno.replace(quitar, "");

  let curp = paterno[0] + buscaVocal(paterno) + materno[0] + nombre[0];
  curp = cambiaPalabra(curp);

  // Fecha en formato yyyy-mm-dd
  let dia, mes, anio;
  if (fecha.includes("/")) {
    [dia, mes, anio] = fecha.split("/");
  } else if (fecha.includes("-")) {
    [anio, mes, dia] = fecha.split("-");
  } else {
    return "";
  }

  curp += anio.slice(-2) + mes + dia;
  curp += genero === "H" || genero === "M" ? genero : "X";
  curp += estadoCodigo(parseInt(estado));

  curp += buscaConsonante(paterno) + buscaConsonante(materno) + buscaConsonante(nombre);

  // Año para homoclave
  curp += anio.startsWith("19") ? "0" : "A";

  curp += ultdig(curp);

  return curp;
}

const SolicitudInternaForm = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    lugarNac: '',
    RFC: '',
    CURP: '',
    NSS: '',
    CP: '',
    ciudad: '',
    estado: '', // Este campo se llenará desde el select
    municipio: '',
    viveCon: '',
    datosFam: [
      { nombre: '', apellidos: '', fechaNac: null, parentesco: 'PADRE' },
      { nombre: '', apellidos: '', fechaNac: null, parentesco: 'MADRE' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'ESPOSO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
      { nombre: '', apellidos: '', fechaNac: '', parentesco: 'HIJO (A)' },
    ]
  });
  
  const [usuario, setUsuario] = useState(null);
  const [solInt, setSolInt] = useState(null);
  const [consent, setConsent] = useState(null);

  const user = useAuthStore((state) => state.user);
  const idFolio = user?.idFolio;
  const numFolio = user?.numFolio;
  const pdfRef = useRef();
  const navigate = useNavigate();

  const fetchUsuarioFolio = async () => {
    try {
      const response = await axios.get(`http://172.30.189.97:5005/usuario/folio/${idFolio}`);
      console.log(response.data);
      setUsuario(response.data);
      setSolInt(response.data.solicitudInterna);
      setConsent(response.data.consentimiento);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  useEffect(() => {
    if (idFolio) {
      fetchUsuarioFolio();
    }
  }, [idFolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDataFamChange = (index, field, value) => {
    const newDatosFam = [...formData.datosFam];
    
    if (!newDatosFam[index]) {
      newDatosFam[index] = { nombre: '', apellidos: '', fechaNac: '', parentesco: '' };
    }

    newDatosFam[index][field] = value;

    setFormData((prevData) => ({
      ...prevData,
      datosFam: newDatosFam,
    }));
  };

  const generateRFC = (usuario) => {
    if (!usuario) return '';
    
    const { nombre, apellidoPat, apellidoMat, fechaNac } = usuario;
    if (!nombre || !apellidoPat || !apellidoMat || !fechaNac) return '';

    const [year, month, day] = fechaNac.split('T')[0].split('-').map(Number);
    
    // Generar el RFC usando la librería
    const rfc = RfcFacil.forNaturalPerson({
      name: nombre,
      firstLastName: apellidoPat,
      secondLastName: apellidoMat,
      day: day,
      month: month,
      year: year
    });

    return rfc;
  };

  useEffect(() => {
    if (usuario && formData.estado) {
      const rfc = generateRFC(usuario);
      const fecha = usuario.fechaNac ? usuario.fechaNac.split("T")[0] : "";
  
      // Obtener el índice del estado basado en el nombre
      const estadoIndex = estados.findIndex(estado => estado.nombre === formData.estado);
  
      // Generar CURP usando el índice
      const curpFinal = generaCURP({
        nombre: usuario.nombre || "",
        paterno: usuario.apellidoPat || "",
        materno: usuario.apellidoMat || "",
        fecha: fecha,
        genero: usuario.sexo || "",
        estado: estadoIndex.toString(), // Aquí se pasa el índice como string
      });
  
      setFormData((prevData) => ({
        ...prevData,
        CURP: curpFinal,
        RFC: rfc,
      }));
    }
  }, [usuario, formData.estado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si los campos requeridos están llenos
    const requiredFields = [
      'fecha', 'lugarNac', 'RFC', 'CURP', 'NSS', 
      'CP', 'ciudad', 'estado', 'municipio', 'viveCon'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      const missingFieldsMessage = `Faltan por llenar los siguientes campos: ${missingFields.join(', ')}`;
      alert(missingFieldsMessage);
      return; // Detener el envío si hay campos faltantes
    }

    try {
      if (usuario) {
        //Para mandar solo los datosFam que tengan los campos nombre u apellidos, si no tienen estos campos no se mandan
        const filteredDatosFam = formData.datosFam.filter(fam => 
          fam.nombre || fam.apellidos
        );

        const dataToSend = {
          ...formData,
          datosFam: filteredDatosFam,
          idUsuario: usuario.idUsuario,
        };

        const { fechaNac, ...dataWithoutFechaNac } = dataToSend;

        const response = await axios.post('http://172.30.189.97:5005/solicInt', dataWithoutFechaNac);

        console.log('Data submitted successfully:', response.data);

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

        if (pdfBlob.size > 20 * 1024 * 1024) {
          console.log("Tamaño del pdf", pdfBlob.size);
          console.error('El archivo PDF es demasiado grande.');
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('document', pdfBlob, `solicitudinterna-${numFolio}.pdf`);
        formDataToSend.append('idUsuario', usuario.idUsuario);

        const pdfUploadResponse = await axios.post('http://172.30.189.97:5005/pdf/upload-single-doc', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('PDF subido con éxito:', pdfUploadResponse.data);
        navigate('/home');
      } else {
        console.error('Usuario no cargado');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  if (!consent) {
    return <div className="text-center">Por favor, realiza tu consentimiento antes de continuar con este paso.</div>;
  }

  if (solInt) {
    return <div className="text-center">Ya realizaste la solicitud interna.</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} ref={pdfRef} className="max-w-4xl mx-auto bg-white p-6 shadow-md pdf-container">
        {/* Header */}
        <div className="flex items-center mb-4">
          <img alt="ATR Nayarit Logo" className="h-31 w-68" src="LOGO ATR_LOGO ATR NEGRO.png" />
          <div className="w-full text-center bg-gray-200">
            <h1 className="text-xl ">SOLICITUD INTERNA</h1>
            <div className="flex space-x-2">
              <div>FECHA</div>
              <input
                className="w-full border border-gray-300 p-2"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
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
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.apellidoPat} readOnly />
            </div>
            <div>
              <label>APELLIDO MATERNO</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.apellidoMat} readOnly />
            </div>
            <div>
              <label>NOMBRE (S)</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.nombre} readOnly />
            </div>
            <div className='flex items-center gap-3'>
              <label>SEXO</label>
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="H"
                  checked={usuario.sexo === 'H'}
                  readOnly
                />
                H
              </label>
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="M"
                  checked={usuario.sexo === 'M'}
                  readOnly
                />
                M
              </label>
            </div>
          </div>
          <div className='grid grid-cols-[4fr_1fr_4fr] gap-2'>
            <div>
              <label>FECHA NACIMIENTO</label>
              <input className="w-full border border-gray-300 p-2" type="date" value={usuario.fechaNac.split('T')[0]} readOnly />
            </div>
            <div>
              <label>EDAD</label>
              <input className="w-full border border-gray-300 p-2" type="number" value={usuario.edad} readOnly />
            </div>
            <div>
              <label>LUGAR NACIMIENTO</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="lugarNac"
                value={formData.lugarNac}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label>RFC</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="RFC"
                value={formData.RFC} // Mostrar el RFC generado
                readOnly // Hacerlo de solo lectura
              />
            </div>
            <div>
              <label>CURP</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="CURP"
                value={formData.CURP}
                readOnly
              />
            </div>
          </div>
          <div className='grid grid-cols-[2fr_3fr] gap-2'>
            <div>
              <label>NUMERO SEGURO SOCIAL</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="NSS"
                value={formData.NSS}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label>ESTADO CIVIL</label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Soltero"
                  checked={usuario.estado_civil === 'Soltero (a)'}
                  readOnly
                />
                Soltero (a)
              </label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Casado"
                  checked={usuario.estado_civil === 'Casado'}
                  readOnly
                />
                Casado (a)
              </label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Separado"
                  checked={usuario.estado_civil === 'Separado (a)'}
                  readOnly
                />
                Separado (a)
              </label>
              <label>
                <input
                  type="radio"
                  name="estado_civil"
                  value="Viudo"
                  checked={usuario.estado_civil === 'Viudo (a)'}
                  readOnly
                />
                Viudo (a)
              </label>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label>TELEFONO PERSONAL</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.tel_personal} readOnly />
            </div>
            <div>
              <label>TELEFONO DE EMERGENCIA</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.tel_emergencia} readOnly />
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
            <div className='text-center'>
              <label>NOMBRES</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[0].nombre}
                onChange={(e) => handleDataFamChange(0, 'nombre', e.target.value)}
              />
            </div>
            <div className='text-center'>
              <label>APELLIDOS</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[0].apellidos}
                onChange={(e) => handleDataFamChange(0, 'apellidos', e.target.value)}
              />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_6fr_6fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label>MADRE</label>
            </div>
            <div className='text-center'>
              <label>NOMBRES</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[1].nombre}
                onChange={(e) => handleDataFamChange(1, 'nombre', e.target.value)}
              />
            </div>
            <div className='text-center'>
              <label>APELLIDOS</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                value={formData.datosFam[1].apellidos}
                onChange={(e) => handleDataFamChange(1, 'apellidos', e.target.value)}
              />
            </div>
          </div>
          {formData.datosFam.slice(2).map((fam, index) => (
            <div className='grid grid-cols-[2fr_4fr_4fr_4fr] gap-2' key={index + 2}>
              <div className='flex flex-col items-center gap-5 justify-center mt-5'>
                <label>{fam.parentesco}</label>
              </div>
              <div className='text-center'>
                <label>NOMBRES</label>
                <input
                  className="w-full border border-gray-300 p-2"
                  type="text"
                  value={fam.nombre}
                  onChange={(e) => handleDataFamChange(index + 2, 'nombre', e.target.value)}
                />
              </div>
              <div className='text-center'>
                <label>APELLIDOS</label>
                <input
                  className="w-full border border-gray-300 p-2"
                  type="text"
                  value={fam.apellidos}
                  onChange={(e) => handleDataFamChange(index + 2, 'apellidos', e.target.value)}
                />
              </div>
              <div className='text-center'>
                <label>FECHA NAC</label>
                <input
                  className="w-full border border-gray-300 p-2"
                  type="date"
                  value={fam.fechaNac}
                  onChange={(e) => handleDataFamChange(index + 2, 'fechaNac', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Domicilio */}
        <div>
          <div className='text-center mt-4 font-bold'>
            <label>DOMICILIO ACTUAL</label>
          </div>
          <div className='grid grid-cols-[3fr_1fr_3fr] gap-2'>
            <div>
              <label>CALLE</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.calle} readOnly />
            </div>
            <div>
              <label>NUMERO</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.numero} readOnly />
            </div>
            <div>
              <label>COLONIA</label>
              <input className="w-full border border-gray-300 p-2" type="text" value={usuario.colonia} readOnly />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_3fr_3fr] gap-2'>
            <div>
              <label>C.P.</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="CP"
                value={formData.CP}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>CIUDAD</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>ESTADO</label>
              <select
                className="w-full border border-gray-300 p-2"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="">Selecciona un estado</option>
                {estados.map((estado) => (
                  <option key={estado.clave} value={estado.nombre}>{estado.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label>MUNICIPIO</label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center gap-2'>
              <label>VIVE CON</label>
              <label>
                <input
                  type="radio"
                  name="viveCon"
                  value="Familia"
                  checked={formData.viveCon === 'Familia'}
                  onChange={handleChange}
                />
                Familia
              </label>
              <label>
                <input
                  type="radio"
                  name="viveCon"
                  value="Amigos"
                  checked={formData.viveCon === 'Amigos'}
                  onChange={handleChange}
                />
                Amigos
              </label>
              <label>
                <input
                  type="radio"
                  name="viveCon"
                  value="Solo (a)"
                  checked={formData.viveCon === 'Solo (a)'}
                  onChange={handleChange}
                />
                Solo (a)
              </label>
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
              <label><input type="radio" checked={usuario.escolaridad === 'Primaria'} readOnly />PRIMARIA</label>
            </div>
            <div>
              <label>TECNICO EN:</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_5fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label><input type="radio" checked={usuario.escolaridad === 'Secundaria'} readOnly />SECUNDARIA</label>
            </div>
            <div>
              <label>LICENCIATURA EN:</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
          <div className='grid grid-cols-[1fr_5fr] gap-2'>
            <div className='flex items-center gap-2'>
              <label><input type="radio" checked={usuario.escolaridad === 'Bachillerato'} readOnly/>PREPARATORIA</label>
            </div>
            <div>
              <label>INGENIERIA EN:</label>
              <input className="w-full border border-gray-300 p-2" type="text" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Enviar Solicitud
        </button>
      </form>
    </>
  );
};

export default SolicitudInternaForm;