import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bbvaApi from '../services/bbvaApi';  // Asegúrate de que este servicio esté correctamente configurado
import MostrarQR from './MostrarQR';  // Asegúrate de tener este componente para mostrar el QR

function CobrarQR() {
    const [amount, setAmount] = useState('');
    const [cuentas, setCuentas] = useState([]);
    const [cuentaOrigen, setCuentaOrigen] = useState('');
    const [detallePago, setDetallePago] = useState('');
    const [nombreCobrador, setNombreCobrador] = useState(''); // Nuevo campo para el nombre del cobrador
    const [errors, setErrors] = useState({ amount: '', cuentaOrigen: '' });
    const [showQRCodeScreen, setShowQRCodeScreen] = useState(false);  // Nueva bandera para mostrar la pantalla QR
    const navigate = useNavigate();
    const bancoCobrador = 1000; // Valor predeterminado del banco del cobrador

    // Cargar las cuentas y el nombre del cobrador
    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const response = await bbvaApi.get('/api/v1/cuentas/saldo'); // Cambia la URL según tu API
                if (Array.isArray(response.data)) {
                    setCuentas(response.data);
                } else {
                    console.error('La respuesta no es un array:', response.data);
                }
            } catch (error) {
                console.error('Error al cargar las cuentas:', error);
                toast.error('Error al cargar las cuentas');
            }
        };

        // Consulta adicional para obtener el nombre del cobrador
        const cargarNombreCobrador = async () => {
            try {
                const response = await bbvaApi.get('/api/v1/usuarios'); // Ajusta tu API según sea necesario
                setNombreCobrador(response.data.nombre);
            } catch (error) {
                console.error('Error al cargar el nombre del cobrador:', error);
                toast.error('Error al cargar el nombre del cobrador');
            }
        };

        cargarCuentas();
        cargarNombreCobrador();
    }, []);

    const handleGenerateClick = () => {
        let hasError = false;
        const newErrors = { amount: '', cuentaOrigen: '' };

        if (!cuentaOrigen) {
            newErrors.cuentaOrigen = 'Selecciona una cuenta de origen';
            hasError = true;
        }
        if (!amount) {
            newErrors.amount = 'Ingresa el monto en Bs';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // Generar un ID QR aleatorio
        const idQR = Math.random().toString(36).substring(2, 12);

        setErrors({ amount: '', cuentaOrigen: '' });
        setShowQRCodeScreen(true);  // Muestra la pantalla QR

        // Pasar todos los datos al componente MostrarQR
        return (
            <MostrarQR
                cuentaOrigen={cuentaOrigen}
                amount={amount}
                detallePago={detallePago}
                nombreCobrador={nombreCobrador}
                bancoCobrador={bancoCobrador}
                idQR={idQR}
                onBack={() => setShowQRCodeScreen(false)}  // Volver a la pantalla principal
            />
        );
    };

    if (showQRCodeScreen) {
        return (
            <MostrarQR
                cuentaOrigen={cuentaOrigen}
                amount={amount}
                detallePago={detallePago}
                nombreCobrador={nombreCobrador}  // Pasar el nombre del cobrador
                bancoCobrador={bancoCobrador}    // Pasar el banco del cobrador
                idQR={Math.random().toString(36).substring(2, 12)}  // Generar idQR aleatorio
                onBack={() => setShowQRCodeScreen(false)}  // Volver a la pantalla principal
            />
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-100">
            {/* Botón Atrás */}
            <button
                onClick={() => navigate(-1)}
                className="fixed hidden md:block md:flex top-5 left-10 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-3 px-4
                    rounded-lg shadow-md drop-shadow-2xl shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow
                    duration-300 focus:outline-none focus:shadow-outline z-10"
                style={{ zIndex: 1000 }}
            >
                <img className="mr-2 md:h-7 md:w-7 h-4 w-4" src="/src/assets/back-svgrepo-com.svg" alt="Back" />
                Atrás
            </button>

            {/* Logo y formulario */}
            <div className="flex justify-center">
                <img className="mt-10 h-10 md:h-16 w-auto" src="/src/assets/bbva-logo-900x269.png" alt="Logo BBVA" />
            </div>

            <form className="max-w-md md:mx-auto mt-12 mb-16 mx-6 p-6 bg-white shadow-2xl drop-shadow-2xl shadow-sky-700 rounded-lg"
                  style={{ backgroundColor: '#004481' }}>
                <h2 className="text-3xl text-white mb-1">Cobrar</h2>
                <h2 className="text-4xl text-white font-bold mb-8">con QR</h2>

                {/* Selector de Cuenta Origen */}
                <div className="mb-4">
                    <label htmlFor="cuentaOrigen" className="block text-sm font-bold text-gray-200 mb-1 ml-1">N.° Cuenta Origen</label>
                    <select id="cuentaOrigen"
                            value={cuentaOrigen}
                            onChange={(e) => setCuentaOrigen(e.target.value)}
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Seleccione una cuenta</option>
                        {cuentas.map((cuenta) => (
                            <option key={cuenta.idCuenta} value={cuenta.numeroCuenta}>{cuenta.numeroCuenta}</option>
                        ))}
                    </select>
                    {errors.cuentaOrigen && <p className="text-red-500 text-xs mt-1">{errors.cuentaOrigen}</p>}
                </div>

                {/* Monto */}
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-bold text-gray-200 mb-1 ml-1">Monto (Bs.)</label>
                    <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Ingrese el monto en Bs"
                    />
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>

                {/* Detalle del Pago */}
                <div className="mb-4">
                    <label htmlFor="detallePago" className="block text-sm font-bold text-gray-200 mb-1 ml-1">Detalle del Pago (Opcional)</label>
                    <input
                        type="text"
                        id="detallePago"
                        value={detallePago}
                        onChange={(e) => setDetallePago(e.target.value)}
                        className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Ingrese el detalle del pago"
                    />
                </div>

                {/* Botón Generar QR */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleGenerateClick}
                        className="py-3 px-4 mt-4 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold rounded-lg shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow duration-300 focus:outline-none focus:shadow-outline"
                    >
                        Generar QR
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CobrarQR;
