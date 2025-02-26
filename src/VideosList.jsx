import { useEffect, useState } from "react";

const API_URL = "http://localhost:5005/api"; // URL de la API

const VideosList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${API_URL}/videos`);
      const data = await response.json();
      setVideos(data);
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
        <div>
          {videos.map((video) => (
            <div key={video.id}>
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
