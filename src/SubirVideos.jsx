import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';
import VideosList from './VideosList';
import './App.css';

const SubirVideos = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/ogg': ['.ogg']
    },
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError("❌ Solo se permiten archivos de video (MP4, WEBM, OGG)");
        setVideoFile(null);
      } else {
        setVideoFile(acceptedFiles[0]);
        setError(null);
      }
    }
  });

  const handleUpload = async () => {
    if (!videoFile) return setError("Selecciona un video antes de subir");

    const formData = new FormData();
    formData.append("video", videoFile);

    setUploading(true);
    try {
      const response = await axios.post("http://172.30.121.214:5005/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage(response.data.message);
      setVideoFile(null);
    } catch (err) {
      setError("Error al subir el video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {videoFile ? (
            <p className="uploaded">📹 {videoFile.name}</p>
          ) : (
            <p>🎬 Arrastra y suelta un video aquí o haz clic para subir</p>
          )}
        </div>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button onClick={handleUpload} disabled={!videoFile || uploading} className="upload-btn">
          {uploading ? "Subiendo..." : "Subir Video"}
        </button>
      </div>
    </>
  );
};

export default SubirVideos;