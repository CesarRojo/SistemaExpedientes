import axios from "axios";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import useAuthStore from './authStore';

const socket = io("http://172.30.190.112:5005");

const API_URL = "http://172.30.190.112:5005/api";

const VideosList = () => {
  const [videos, setVideos] = useState([]);
  const [watchedCount, setWatchedCount] = useState(0); // Contador de videos vistos
  const markVideosAsWatched = useAuthStore((state) => state.markVideosAsWatched); // Función para marcar videos como vistos
  const user = useAuthStore((state) => state.user);
  const idFolio = user?.idFolio;

  useEffect(() => {
    fetchVideos();

    // Escuchar eventos de WebSocket
    socket.on('videoUploaded', (newVideo) => {
      console.log('Nuevo video subido siuu:', newVideo.video); //Se entra a newVideo.video porque ahi es donde están los datos del video para que se pueda cargar correctamente
      // Actualizar la lista de videos
      setVideos(prevVideos => [...prevVideos, newVideo.video]);
    });

    socket.on('videoDeleted', (id) => {
      // Actualizar la lista de videos eliminando el video correspondiente
      setVideos(prevVideos => {
        //Se entra a id.videoId porque es donde está el id del video que se quiere eliminar y se parsea a entero porque se manda como un string desde el servidor
        const updatedVideos = prevVideos.filter(video => video.idVideo !== parseInt(id.videoId));
        return updatedVideos;
      });
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
      setVideos(videos.filter((video) => video.idVideo !== id));
    } catch (error) {
      console.error("Error al eliminar el video:", error);
    }
  };

  const handleVideoEnded = () => {
    setWatchedCount(prevCount => prevCount + 1);
  };

  // Efecto para marcar videos como vistos
  useEffect(() => {
    if (watchedCount === videos.length && videos.length > 0) {
      if (idFolio) {
        markVideosAsWatched(idFolio); // Llamar a la función para actualizar el estado de vioVideos
      }
    }
  }, [watchedCount, videos.length, markVideosAsWatched, idFolio]);

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
              <video width="300" controls onEnded={handleVideoEnded}>
                <source src={`http://172.30.190.112:5005${video.path}`} type="video/mp4" />
                Tu navegador no soporta el video.
              </video>
              <button onClick={() => deleteVideo(video.idVideo)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosList;