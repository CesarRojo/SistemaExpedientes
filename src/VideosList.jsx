import axios from "axios";
import { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io("http://localhost:5005");

const API_URL = "http://localhost:5005/api"; // URL de la API

const VideosList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();

    // Escuchar eventos de WebSocket
    socket.on('videoUploaded', (newVideo) => {
      console.log('Nuevo video subido siuu:', newVideo.video); //Se entra a newVideo.video porque ahi es donde están los datos del video para que se pueda cargar correctamente
      // Actualizar la lista de videos
      setVideos(prevVideos => [...prevVideos, newVideo.video]);
    });

    socket.on('videoDeleted', (id) => {
      console.log('Video eliminado:', id);
      // Actualizar la lista de videos eliminando el video correspondiente
      setVideos(prevVideos => prevVideos.filter(video => video.id !== id));
    });

    return () => {
      socket.off('videoUploaded');
      socket.off('videoDeleted');
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error("Error al obtener los videos:", error);
    }
  };

  const deleteVideo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/videos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el video");
      }

      // Eliminar el video de la lista después de que se elimine en el backend
      setVideos(videos.filter((video) => video.id !== id));
    } catch (error) {
      console.error("Error al eliminar el video:", error);
    }
  };

  return (
    <div>
      <h2>Videos Subidos</h2>
      {videos.length === 0 ? (
        <p>No hay videos subidos</p>
      ) : (
        <div className="flex flex-row">
          {videos.map((video, index) => (
            <div key={index}>
              <p>{video.filename}</p>
              <video width="300" controls>
                <source src={`http://localhost:5005${video.path}`} type="video/mp4" />
                Tu navegador no soporta el video.
              </video>
              <button onClick={() => deleteVideo(video.id)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosList;