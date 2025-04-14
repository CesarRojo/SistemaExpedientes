import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './App.css';

const SubirContratos = () => {
  const initialFilesState = {
    c_determinado: null,
    c_indeterminado: null,
    seguro: null,
  };

  const [files, setFiles] = useState(initialFilesState);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { idUsuario, numFolio } = location.state || {};

  const handleDrop = (field) => (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setErrors((prev) => ({
        ...prev,
        [field]: "❌ Solo se permiten archivos PDF",
      }));
      setFiles((prev) => ({ ...prev, [field]: null }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: null }));
      setFiles((prev) => ({ ...prev, [field]: acceptedFiles[0] }));
    }
  };

  const handleUpload = async () => {
    // Validate required fields
    const requiredFields = ['c_determinado', 'c_indeterminado', 'seguro'];
    const missingFields = requiredFields.filter((field) => !files[field]);
  
    if (missingFields.length > 0) {
      setErrors((prev) =>
        missingFields.reduce(
          (acc, field) => ({ ...acc, [field]: "Este campo es obligatorio" }),
          {}
        )
      );
      return;
    }
  
    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    if (idUsuario) {
      formData.append("idUsuario", idUsuario);
    }
    if (numFolio) {
      formData.append("numFolio", numFolio);
    }
  
    setUploading(true);
    try {
      const response = await axios.post("http://172.30.189.86:5005/pdf/upload-contracts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessage(response.data.message);
      setFiles(initialFilesState);
    } catch (err) {
      setMessage("Error al subir los documentos");
    } finally {
      setUploading(false);
    }
  };

  const renderDropzone = (label, field, isOptional = false) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: { "application/pdf": [".pdf"] },
      onDrop: handleDrop(field),
    });

    return (
      <div className="dropzone-container">
        <label>{label} {isOptional && "(Opcional)"}</label>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          {files[field] ? (
            <p className="uploaded">📄 {files[field].name}</p>
          ) : (
            <p>📂 Arrastra y suelta un archivo aquí o haz clic para subir</p>
          )}
        </div>
        {errors[field] && <p className="error text-red-500 font-bold">{errors[field]}</p>}
      </div>
    );
  };

  return (
    <div className="container">
      {renderDropzone("Contrato determinado", "c_determinado")}
      {renderDropzone("Contrato indeterminado", "c_indeterminado")}
      {renderDropzone("Seguro de vida", "seguro")}

      {message && <p className="success">{message}</p>}

      <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-200">
        {uploading ? "Subiendo..." : "Subir Documentos"}
      </button>
    </div>
  );
};

export default SubirContratos;