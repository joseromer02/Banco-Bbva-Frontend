import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function MostrarQR({ cuentaOrigen, amount, detallePago, nombreCobrador, bancoCobrador }) {
    const qrRef = useRef(null);
    const [idQR, setIdQR] = useState(null);
    const navigate = useNavigate();  // Inicializa useNavigate para la redirección

    useEffect(() => {
        const randomId = Math.floor(100 + Math.random() * 900);  // Generar un número aleatorio de 3 dígitos
        setIdQR(randomId);
    }, []);  // Solo se ejecuta una vez al montar el componente

    const handleDownloadClick = () => {
        const qrElement = qrRef.current;
        if (!qrElement) {
            console.error('Elemento QR no encontrado.');
            toast.error('Error al encontrar el elemento QR.');
            return;
        }

        html2canvas(qrElement, { scale: 2 })
            .then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'qrcode.png';
                link.click();
            })
            .catch((error) => {
                console.error('Error al generar la imagen QR:', error);
                toast.error('Error al generar la imagen QR');
            });
    };

    const handleContinueClick = () => {
        navigate('/dashboard');  // Redirige al Dashboard cuando se hace clic en "Continuar"
    };

    return (
        <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="w-full flex justify-center items-center mt-4">
                <img className="h-10 md:h-16 w-auto" src="/src/assets/bbva-logo-900x269.png" alt="Logo BBVA" />
            </div>

            <div className="mt-8 p-6 bg-white shadow-2xl drop-shadow-2xl shadow-sky-700 rounded-lg" style={{ backgroundColor: '#004481' }}>
                <div ref={qrRef} style={{ padding: '16px', background: 'white' }}>
                    {idQR && (
                        <QRCode
                            value={`nombreCobrador:${nombreCobrador}|cuentaCobrador:${cuentaOrigen}|bancoCobrador:${bancoCobrador}|monto:${amount}|glosa:${detallePago}|idQR:${idQR}`}
                            size={256}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                        />
                    )}
                </div>

                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={handleDownloadClick}
                        className="py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold rounded-lg shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow duration-300 focus:outline-none focus:shadow-outline"
                    >
                        Descargar QR
                    </button>

                    <button
                        onClick={handleContinueClick}
                        className="py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold rounded-lg shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow duration-300 focus:outline-none focus:shadow-outline"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MostrarQR;
