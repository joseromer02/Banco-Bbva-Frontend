import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';

function PagarQR() {
    const [scanResult, setScanResult] = useState('');
    const [fileScanResult, setFileScanResult] = useState('');
    const [cameraActive, setCameraActive] = useState(false);
    const navigate = useNavigate();
    let streamRef = null;

    const parseQrData = (data) => {
        const parsedData = data.split('|').reduce((acc, item) => {
            const [key, value] = item.split(':');
            acc[key] = value;
            return acc;
        }, {});
        return parsedData;
    };

    const handleScan = (data) => {
        if (data) {
            setScanResult(data);
            const parsedData = parseQrData(data);
            navigate('/procesar-pago', { state: parsedData });
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    setFileScanResult(code.data);
                    const parsedData = parseQrData(code.data);
                    navigate('/procesar-pago', { state: parsedData });
                } else {
                    alert('No se pudo escanear el QR. Por favor, intente con otra imagen.');
                }
            };
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        setCameraActive(true);

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                streamRef = stream;
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
            });

        const stopCamera = () => {
            if (streamRef) {
                streamRef.getTracks().forEach(track => track.stop());
            }
        };

        window.addEventListener('popstate', stopCamera);

        return () => {
            stopCamera();
            setCameraActive(false);
            window.removeEventListener('popstate', stopCamera);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-gray-100">
            <button
                onClick={() => navigate(-1)}
                className="fixed top-5 left-5 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-2 px-4
                    rounded-lg shadow-md drop-shadow-2xl shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow
                    duration-300 focus:outline-none focus:shadow-outline z-10 flex items-center"
                style={{ zIndex: 1000 }}
            >
                <img className="mr-2 h-6 w-6" src="/src/assets/back-svgrepo-com.svg" alt="Back"/>
                Atrás
            </button>

            <div className="w-full flex justify-center items-center mt-4">
                <img className="h-10 md:h-16 w-auto" src="/src/assets/bbva-logo-900x269.png" alt="Logo BBVA" />
            </div>

            <div className="flex flex-col items-center mt-16">
                <h1 className="text-3xl font-bold mb-8">Pagar con QR</h1>

                <div className="max-w-md w-full p-6 bg-white shadow-2xl drop-shadow-2xl shadow-sky-700 rounded-lg"
                     style={{ backgroundColor: '#004481' }}>

                    <div className="mb-6 text-center">
                        <p className="text-white mb-2">Escanea un código QR con la cámara:</p>
                        <div className="mx-auto" style={{ width: '300px', height: '300px', border: '1px solid black' }}>
                            {cameraActive && (
                                <QrReader
                                    delay={300}
                                    onError={handleError}
                                    onScan={handleScan}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="mb-6 text-center">
                        <p className="text-white mb-2">O selecciona una imagen de QR desde tu dispositivo:</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PagarQR;
