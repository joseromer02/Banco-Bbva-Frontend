import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

function Cuenta() {
    const location = useLocation();
    const navigate = useNavigate();

    const [cuenta, setCuenta] = useState({
        nombre: '',
        apellido: '',
        ci: '',
        correo: '',
        contrasena: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state && location.state.cuenta) {
            setCuenta(location.state.cuenta);
            setLoading(false);
        } else {
            setTimeout(() => {
                const cuentaData = {
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    ci: '12345678',
                    correo: 'juan.perez@example.com',
                    contrasena: '******',
                };
                setCuenta(cuentaData);
                setLoading(false); // Datos cargados
            }, 1000); // Simulamos una demora de 1 segundo
        }
    }, [location.state]);

    const handleEdit = () => {
        navigate('/editar-cuenta'); // Redirigir a la página de edición
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <div className="mt-36 mx-auto px-4 w-full flex justify-center">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full md:w-3/4 lg:w-3/5 xl:w-1/2 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">Detalles de la Cuenta</h2>
                    {loading ? (
                        <p className="text-lg text-gray-700">Cargando datos de la cuenta...</p>
                    ) : (
                        <div className="w-full">
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Nombre:</label>
                                <p className="text-lg text-gray-700">{cuenta.nombre}</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Apellido:</label>
                                <p className="text-lg text-gray-700">{cuenta.apellido}</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Correo Electrónico:</label>
                                <p className="text-lg text-gray-700">{cuenta.correo}</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">CI:</label>
                                <p className="text-lg text-gray-700">{cuenta.ci}</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Contraseña:</label>
                                <p className="text-lg text-gray-700">{cuenta.contrasena}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleEdit}
                        className="mt-6 bg-teal-600 hover:bg-teal-500 text-white shadow-lg text-lg font-bold py-3 px-6 rounded-md drop-shadow-2xl shadow-teal-500 hover:shadow-teal-400 duration-300"
                    >
                        Editar Cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cuenta;
