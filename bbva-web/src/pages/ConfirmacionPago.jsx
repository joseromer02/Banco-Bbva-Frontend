import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ConfirmacionPago() {
    const location = useLocation();
    const navigate = useNavigate();
    const comprobanteRef = useRef(null);

    // Acceder a los datos pasados a través de la navegación
    const {
        cuentaOrigen,
        cuentaDestinatario,
        monto,
        detalle,
        fechaHora,
        bancoCobrador,
        nombreCobrador,
        idQR
    } = location.state || {};

    if (!cuentaOrigen || !cuentaDestinatario || !monto) {
        return <p>Error: No se encontraron los datos del pago.</p>;
    }

    const handleDownloadPNG = () => {
        const comprobanteElement = comprobanteRef.current;
        if (!comprobanteElement) {
            toast.error('Error al encontrar el elemento comprobante.');
            return;
        }

        html2canvas(comprobanteElement, { scale: 2 })
            .then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'comprobante_pago.png';
                link.click();
            })
            .catch((error) => {
                toast.error('Error al generar la imagen del comprobante');
            });
    };

    const handleDownloadPDF = () => {
        const comprobanteElement = comprobanteRef.current;
        if (!comprobanteElement) {
            toast.error('Error al encontrar el elemento comprobante.');
            return;
        }

        html2canvas(comprobanteElement, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 210; // A4 width in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save('comprobante_pago.pdf');
            })
            .catch((error) => {
                toast.error('Error al generar el PDF del comprobante');
            });
    };

    const handleContinueClick = () => {
        navigate('/dashboard');
    };

    return (
        <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <img className="mt-16 mb-6 h-10 md:h-16 w-auto" src="/src/assets/bbva-logo-900x269.png" alt="Logo BBVA" />

            <div className="p-6 bg-white shadow-2xl drop-shadow-2xl shadow-sky-700 rounded-lg" style={{ backgroundColor: '#004481' }}>
                <h1 className="text-3xl font-bold text-center text-white mb-6">Pago Realizado Exitosamente</h1>
                <div ref={comprobanteRef} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Comprobante de Pago</h2>
                    <p className="mb-2"><strong>Cuenta Origen:</strong> {cuentaOrigen}</p>
                    <p className="mb-2"><strong>Nombre del Destinatario:</strong> {nombreCobrador}</p>
                    <p className="mb-2"><strong>Cuenta Destinatario:</strong> {cuentaDestinatario}</p>
                    <p className="mb-2"><strong>Monto:</strong> {monto} Bs</p>
                    <p className="mb-2"><strong>Detalle:</strong> {detalle || 'Sin detalle'}</p>
                    <p className="mb-2"><strong>Fecha y Hora:</strong> {fechaHora}</p>
                    <p className="mb-2"><strong>Banco Cobrador:</strong> {bancoCobrador}</p>
                </div>

                <div className="mt-8 flex justify-around">
                    <button
                        onClick={handleDownloadPNG}
                        className="bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-2 px-4 rounded-lg shadow-md drop-shadow-2xl shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow duration-300 focus:outline-none focus:shadow-outline"
                    >
                        Descargar PNG
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-2 px-4 rounded-lg shadow-md drop-shadow-2xl shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow duration-300 focus:outline-none focus:shadow-outline"
                    >
                        Descargar PDF
                    </button>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleContinueClick}
                        className="mt-4 py-3 px-6 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold rounded-lg shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow duration-300 focus:outline-none focus:shadow-outline"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmacionPago;
