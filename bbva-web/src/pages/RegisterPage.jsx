import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { register as authRegister } from "../services/authService.js";
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('Por favor, ingresa tu nombre.'),
        apellido: Yup.string().required('Por favor, ingresa tu apellido.'),
        ci: Yup.number()
            .typeError('El C.I. debe ser un número')
            .min(1000000, 'El C.I. debe tener al menos 7 dígitos')
            .max(1000000000, 'El C.I. no debe exceder los 10 dígitos')
            .required('Por favor, ingresa tu C.I.')
            .nullable(),
        correo: Yup.string().email('Correo no válido').required('Por favor, ingresa tu correo.'),
        contrasena: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
            .max(16, 'La contraseña no debe exceder los 16 caracteres')
            .required('Por favor, ingresa tu contraseña.'),
        confirmarContrasena: Yup.string()
            .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas no coinciden')
            .required('Por favor, confirma tu contraseña.'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data) => {
        try {
            await authRegister(data);
            navigate('/login', { state: { toastMessage: '   ¡Registro exitoso! Por favor ingrese.' } });
        } catch (error) {
            setError('Error al registrarse. Por favor, inténtelo de nuevo.');
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="mt-12 mb-12 flex justify-center items-center min-h-screen bg-cover bg-center">
            <button
                onClick={() => navigate(-1)}
                className="fixed hidden md:block md:flex items-center top-5 left-10 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-3 px-4
                 rounded-lg shadow-md drop-shadow-2xl shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400
                 duration-300 focus:outline-none focus:shadow-outline"
                style={{zIndex: 1000}}
            >
                <img className="mr-2 h-7 w-7" src="/src/assets/back-svgrepo-com.svg"/>
                <a className="hidden md:block">Atrás</a>
            </button>
            <form onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="w-full max-w-lg p-6 rounded-xl shadow-2xl drop-shadow-2xl shadow-sky-700 mx-6 md:mt-0 sm:ml-0 sm:mr-0"
                  style={{backgroundColor: '#004481'}}>
                <div className="text-2xl font-bold mb-12 mt-6 flex justify-center items-center text-center">
                    <img className="h-1/2 w-1/2" src="/src/assets/BBAR.D-079fc6a6.png"/>
                </div>
                {error && <p className="text-red-500 text-xl text-center mb-4 mx-8">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="nombre">
                        Nombre(s)
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        {...register('nombre')}
                        className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.nombre && <p className="text-red-500 font-semibold">{errors.nombre.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="apellido">
                        Apellido(s)
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        {...register('apellido')}
                        className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.apellido && <p className="text-red-500 font-semibold">{errors.apellido.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="ci">
                        C.I.
                    </label>
                    <input
                        type="number"
                        id="ci"
                        {...register('ci')}
                        onKeyDown={(e) => {
                            // Previene cambiar el valor con las flechas arriba y abajo del teclado
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                e.preventDefault();
                            }
                        }}
                        className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.ci && <p className="text-red-500 font-semibold">{errors.ci.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="correo">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="correo"
                        {...register('correo')}
                        className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.correo && <p className="text-red-500 font-semibold">{errors.correo.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="contrasena">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="contrasena"
                        {...register('contrasena')}
                        className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.contrasena && <p className="text-red-500 font-semibold">{errors.contrasena.message}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="confirmarContrasena">
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        id="confirmarContrasena"
                        {...register('confirmarContrasena')}
                        className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.confirmarContrasena && <p className="text-red-500 font-semibold">{errors.confirmarContrasena.message}</p>}
                </div>
                <div className="flex items-center justify-end">
                    <button
                        type="submit"
                        className="flex items-center bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-3 px-4
                         rounded-lg shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400
                         duration-300 focus:outline-none focus:shadow-outline mt-3 mb-3"
                    >
                        Registrarse
                        <img className="ml-3 md:h-7 md:w-7 h-4 w-4" src="/src/assets/register-svgrepo-com.svg"/>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
