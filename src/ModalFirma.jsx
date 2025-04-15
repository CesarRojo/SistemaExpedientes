import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, onSignatureCaptured }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                if (typeof SigWebSetDisplayTarget === 'function') {
                    const sigObj = SigWebSetDisplayTarget(context);
                    if (sigObj) {
                        ctxRef.current = sigObj;
                        OpenTablet(1);
                        SetTabletState(1, context);
                    } else {
                        console.error("SigWebSetDisplayTarget devolvió undefined.");
                    }
                } else {
                    console.error("SigWebSetDisplayTarget no está definido. Verifica la carga de la biblioteca.");
                }
            }
        }

        return () => {
            if (ctxRef.current) {
                SetTabletState(0);
                CloseTablet();
                ctxRef.current = null;
            }
        };
    }, [isOpen]);

    const captureSignature = () => {
        if (ctxRef.current) {
            if (typeof GetSigImageB64 === 'function') {
                GetSigImageB64((signatureImage) => {
                    if (signatureImage) {
                        onSignatureCaptured(signatureImage);
                        onClose();
                    } else {
                        console.error("No se pudo capturar la firma.");
                    }
                });
            } else {
                console.error("GetSigImageB64 no está definido. Verifica la carga de la biblioteca.");
            }
        } else {
            console.error("Contexto no disponible. Asegúrate de que el dispositivo esté inicializado correctamente.");
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
            if (typeof ClearTablet === 'function') {
                ClearTablet(); // Limpia la firma en el dispositivo
            } else {
                console.error("ClearTablet no está definido. Verifica la carga de la biblioteca.");
            }
        } else {
            console.error("Canvas no disponible.");
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 modal-v">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    ✖
                </button>
                <h2>Captura de Firma</h2>
                <div>
                    <p>Por favor, firme aquí:</p>
                    <canvas
                        ref={canvasRef}
                        id="sigPlus"
                        style={{ border: '1px solid black', width: '300px', height: '100px' }}
                    ></canvas>
                </div>
                <button onClick={captureSignature} className="mt-4 p-2 bg-blue-500 text-white">
                    Guardar Firma
                </button>
                <button onClick={clearSignature} className="mt-2 p-2 bg-red-500 text-white">
                    Limpiar Firma
                </button>
            </div>
        </div>
    ) : null;
};

export default Modal;