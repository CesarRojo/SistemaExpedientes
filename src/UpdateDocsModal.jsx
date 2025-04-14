// UpdateDocsModal.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UpdateDocsModal = ({ isOpen, onClose, idUsuario, numFolio }) => {
  const initialFilesState = {
    ine: null,
    fiscal: null,
    nss: null,
    domicilio: null,
    nacimiento: null,
    curp: null,
    estudios: null, // Opcional
  };

  const [files, setFiles] = useState(initialFilesState);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

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
      const response = await axios.put(`http://172.30.189.86:5005/update-docs/${idUsuario}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
      setFiles(initialFilesState);
    } catch (err) {
      setMessage("Error al actualizar los documentos");
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

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Actualizar Documentos</h2>
        {renderDropzone("INE Representante legal", "ine")}
        {renderDropzone("Constancia Situación Fiscal", "fiscal")}
        {renderDropzone("NSS Número Seguro Social", "nss")}
        {renderDropzone("Comprobante de Domicilio", "domicilio")}
        {renderDropzone("Acta de Nacimiento", "nacimiento")}
        {renderDropzone("CURP", "curp")}
        {renderDropzone("Comprobante de Estudios", "estudios", true)}

        {message && <p className="success">{message}</p>}

        <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-200">
          {uploading ? "Subiendo..." : "Actualizar Documentos"}
        </button>
        <button onClick={onClose} className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default UpdateDocsModal;