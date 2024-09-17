import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditarCuenta() {
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
        // Simulación de cargar datos de la cuenta
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
        }, 1000); // Simulación de demora de 1 segundo
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCuenta({
            ...cuenta,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mostrar el mensaje de confirmación
        toast.success('Datos actualizados correctamente', {
            position: "top-right",
            autoClose: 3000, // Duración de 3 segundos
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        setTimeout(() => {
            navigate('/cuenta', { state: { cuenta } });
        }, 2500);
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <div className="mt-36 mx-auto px-4 w-full flex justify-center">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full md:w-3/4 lg:w-3/5 xl:w-1/2 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">Editar Cuenta</h2>
                    {loading ? (
                        <p className="text-lg text-gray-700">Cargando datos de la cuenta...</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Nombre:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={cuenta.nombre}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Apellido:</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={cuenta.apellido}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={cuenta.correo}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">CI:</label>
                                <input
                                    type="text"
                                    name="ci"
                                    value={cuenta.ci}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-semibold text-gray-600">Contraseña:</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    value={cuenta.contrasena}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-600 hover:bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-lg"
                                    onClick={() => navigate('/cuenta')} // Redirigir de vuelta a la página Cuenta
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-600 hover:bg-teal-500 text-white text-lg font-semibold py-3 px-6 rounded-lg"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EditarCuenta;
