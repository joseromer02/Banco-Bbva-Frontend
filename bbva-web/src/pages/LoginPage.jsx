import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const validationSchema = Yup.object().shape({
        correo: Yup.string()
            .email('El correo electrónico no es válido')
            .required('El correo electrónico es requerido'),
        contrasena: Yup.string()
            .required('La contraseña es requerida')
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const googleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    useEffect(() => {
        if (location.state?.toastMessage) {
            toast.success(location.state.toastMessage, {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored"
            });
        }
    }, [location.state]);

    const onSubmit = async (data) => {
        try {
            const response = await login(data);
            localStorage.setItem('token', response.token);
            navigate('/dashboard', { state: { toastMessage: '¡Ingreso exitoso!' } });
        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                const { status, data } = error.response;

                if (status === 401) {
                    toast.error('Contraseña incorrecta. Por favor, inténtalo de nuevo.', {
                        position: "bottom-right",
                        autoClose: 3000,
                        theme: "colored"
                    });
                } else if (status === 404) {
                    toast.error('Usuario no encontrado. Verifica tu correo electrónico.', {
                        position: "bottom-right",
                        autoClose: 3000,
                        theme: "colored"
                    });
                } else if (status === 500) {
                    toast.error('Error en el servidor. Por favor, inténtalo más tarde.', {
                        position: "bottom-right",
                        autoClose: 3000,
                        theme: "colored"
                    });
                } else {
                    toast.error(`Error: ${data.message || 'Algo salió mal. Por favor, inténtalo de nuevo.'}`, {
                        position: "bottom-right",
                        autoClose: 3000,
                        theme: "colored"
                    });
                }
            } else if (error.request) {
                // El cliente no recibió una respuesta del servidor (posiblemente un problema de red)
                toast.error('Sin respuesta del servidor. Verifica tu conexión a Internet.', {
                    position: "bottom-right",
                    autoClose: 3000,
                    theme: "colored"
                });
            } else {
                // Error en la configuración de la solicitud
                toast.error(`Error: ${error.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                    theme: "colored"
                });
            }

            console.error('Login failed', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center">
            <ToastContainer />
            <button
                onClick={() => navigate(-1)}
                className="fixed hidden md:block md:flex items-center top-5 left-10 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-3 px-4
                 rounded-lg shadow-md drop-shadow-2xl shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400
                 duration-300 focus:outline-none focus:shadow-outline"
                style={{ zIndex: 1000 }}
            >
                <img className="mr-2 md:h-7 md:w-7 h-4 w-4" src="/src/assets/back-svgrepo-com.svg" alt="Back" />
                Atrás
            </button>
            <form onSubmit={handleSubmit(onSubmit)}
                  className="w-full max-w-sm p-6 rounded-xl shadow-2xl drop-shadow-2xl shadow-sky-700 ml-4 mr-4 sm:ml-0 sm:mr-0"
                  style={{'backgroundColor': '#004481'}}>
                <div className="text-2xl font-bold mb-12 mt-6 flex justify-center items-center text-center">
                    <img className="h-1/2 w-1/2" src="/src/assets/BBAR.D-079fc6a6.png" alt="Logo"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="correo">
                        Correo Electrónico
                    </label>
                    <input
                        type="text"
                        id="correo"
                        {...register('correo')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                        focus:outline-none focus:shadow-outline shadow drop-shadow-2xl"
                    />
                    {errors.correo && <p className="text-red-500">{errors.correo.message}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="contrasena">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="contrasena"
                        {...register('contrasena')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.contrasena && <p className="text-red-500">{errors.contrasena.message}</p>}
                </div>
                <div className="flex items-center justify-end">
                    <button
                        type="submit"
                        className="flex items-center bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-3 px-4
                         rounded-lg shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400
                         duration-300 focus:outline-none focus:shadow-outline mb-3">
                        Ingresar
                        <img className="ml-2 md:h-7 md:w-7 h-6 w-6" src="/src/assets/sign-in-svgrepo-com.svg"
                             alt="Ingresar"/>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={googleLogin}
                    className="flex items-center justify-center w-full text-gray-700 font-bold py-3 px-4 rounded-lg shadow-2xl
                    hover:shadow-md bg-white duration-300 focus:outline-none focus:shadow-outline mt-3 mb-3"
                >
                    <img
                        src="/src/assets/integrations-logo-google.webp"
                        alt="Google logo"
                        className="h-6 w-6 mr-2"
                    />
                    Continuar con Google
                </button>
            </form>
        </div>
    );
}

export default LoginPage;