import React, { useEffect } from 'react';

const SignatureModal = ({ onClose }) => {
  const handleSignatureCaptured = (image) => {
    onClose(image);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'sigImageData') {
        handleSignatureCaptured(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-99">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <iframe
          src="src/sigweb.html" // Asegúrate de que la ruta sea correcta
          width="1200"
          height="330"
          title="Signature"
          style={{ border: 'none' }}
        />
        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default SignatureModal;