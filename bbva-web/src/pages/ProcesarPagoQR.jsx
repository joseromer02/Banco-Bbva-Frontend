import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bbvaApi from '../services/bbvaApi';

function ProcesarPagoQR() {
    const location = useLocation();
    const navigate = useNavigate();

    const { nombreCobrador, cuentaCobrador, bancoCobrador, monto, glosa, idQR } = location.state || {};

    // Estado para guardar la lista de cuentas
    const [cuentas, setCuentas] = useState([]);
    const [cuentaOrigen, setCuentaOrigen] = useState('');
    const [errors, setErrors] = useState({ cuentaOrigen: '' });

    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const response = await bbvaApi.get('/api/v1/cuentas/saldo');  // Llama a tu API para obtener las cuentas
                if (Array.isArray(response.data)) {
                    setCuentas(response.data);
                }
            } catch (error) {
                console.error('Error al cargar las cuentas:', error);
            }
        };

        cargarCuentas();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!cuentaOrigen) {
            setErrors({ cuentaOrigen: 'Selecciona una cuenta de origen' });
            return;
        }

        const fechaHora = new Date().toLocaleString();

        navigate('/confirmacion', {
            state: {
                cuentaOrigen,
                cuentaDestinatario: cuentaCobrador,
                monto,
                detalle: glosa,
                fechaHora,
                bancoCobrador,
                nombreCobrador,
                idQR
            }
        });
    };

    return (
        <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center">
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
                <img className="h-10 md:h-16 w-auto" src="/src/assets/bbva-logo-900x269.png" alt="Logo BBVA" style={{ marginBottom: '40px' }} />
            </div>

            <div className="max-w-md w-full p-6 bg-white shadow-2xl drop-shadow-2xl shadow-sky-700 rounded-lg"
                 style={{ backgroundColor: '#004481' }}>
                <h1 className="text-3xl font-bold text-white mb-8">Procesar Pago</h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-bold text-gray-200 mb-1 ml-1">Elige la Cuenta Origen</label>
                        <select
                            id="cuentaOrigen"
                            value={cuentaOrigen}
                            onChange={(e) => setCuentaOrigen(e.target.value)}
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Seleccione una cuenta</option>
                            {cuentas.map((cuenta) => (
                                <option key={cuenta.idCuenta} value={cuenta.numeroCuenta}>
                                    {cuenta.numeroCuenta}
                                </option>
                            ))}
                        </select>
                        {errors.cuentaOrigen && <p className="text-red-500 text-xs mt-1">{errors.cuentaOrigen}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-200 mb-1 ml-1">Nombre del Cobrador</label>
                        <input
                            type="text"
                            value={nombreCobrador || ''}
                            readOnly
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-200 mb-1 ml-1">Cuenta del Cobrador</label>
                        <input
                            type="text"
                            value={cuentaCobrador || ''}
                            readOnly
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-200 mb-1 ml-1">Banco del Cobrador</label>
                        <input
                            type="text"
                            value={bancoCobrador || ''}
                            readOnly
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-200 mb-1 ml-1">Monto</label>
                        <input
                            type="text"
                            value={monto || ''}
                            readOnly
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-200 mb-1 ml-1">Glosa</label>
                        <input
                            type="text"
                            value={glosa || ''}
                            readOnly
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold rounded-lg shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow duration-300 focus:outline-none focus:shadow-outline"
                        >
                            Realizar Pago
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProcesarPagoQR;
