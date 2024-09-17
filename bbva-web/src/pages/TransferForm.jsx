import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bbvaApi from '../services/bbvaApi';
import {useNavigate} from "react-router-dom";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const TransferForm = () => {
    const [cuentas, setCuentas] = useState([]);
    const [bancos, setBancos] = useState([]);
    const navigate = useNavigate();
    const [cuentaOrigen, setCuentaOrigen] = useState('');
    const [saldoOrigen, setSaldoOrigen] = useState('');
    const [cuentaDestino, setCuentaDestino] = useState('');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const validationSchema = Yup.object().shape({
        cuentaOrigen: Yup.string()
            .required('Selecciona una cuenta origen'),
        cuentaDestino: Yup.number()
            .typeError('Ingresa un número de cuenta destino válido')
            .positive('El número de cuenta debe ser positivo')
            .integer('El número de cuenta debe ser un número entero')
            .required('Ingresa un número de cuenta destino válido'),
        bancoDestino: Yup.string()
            .required('Selecciona un banco destino'),
        nombre: Yup.string()
            .required('Ingresa el nombre del beneficiario')
            .max(50, 'El nombre del beneficiario no puede tener más de 50 caracteres'),
        monto: Yup.number()
            .typeError('Ingresa un monto válido')
            .positive('El monto debe ser positivo')
            .required('Ingresa el monto a transferir'),
        descripcion: Yup.string()
            .trim()
            .max(20, 'La descripción no puede tener más de 20 caracteres')
    });

    const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        const cargarCuentas = async () => {
            try {
                const response = await bbvaApi.get('/api/v1/cuentas/saldo');
                if (Array.isArray(response.data)) {
                    setCuentas(response.data);
                } else {
                    console.error('La respuesta no es un array:', response.data);
                }
                setValue('cuentaOrigen', '');
            } catch (error) {
                console.error('Error al cargar las cuentas:', error);
                toast.error('Error al cargar las cuentas');
            }
        };

        cargarCuentas();
    }, [setValue]);

    const handleCuentaOrigenChange = (e) => {
        const cuentaSeleccionada = cuentas.find(cuenta => cuenta.numeroCuenta === parseInt(e.target.value));
        setCuentaOrigen(cuentaSeleccionada.numeroCuenta);
        setSaldoOrigen(cuentaSeleccionada.saldo);
    };

    const handleTransfer = async (data) => {
        try {
            const response = await bbvaApi.post('/api/v1/transacciones/transferir', data);
            if (response.status === 201) {
                toast.success('Transferencia realizada con éxito');
                reset();
            }
        } catch (error) {
            toast.error('Error al realizar la transferencia');
            console.error('Error:', error);
        }
    };

    let contenidoSaldo, contenidoSaldoN;

    if (saldoOrigen === 0) {
        contenidoSaldo = <p className="text-xl font-bold text-rose-600 mt-2 ml-2 mb-2">Sin Saldo</p>;
        contenidoSaldoN = ''
    } else if (saldoOrigen) {
        contenidoSaldo = <p className="text-xl text-gray-200 mt-2 ml-2">Saldo: </p>;
        contenidoSaldoN = <p className="text-xl font-bold text-teal-500 mt-2 mb-2">Bs. {saldoOrigen}</p>
    } else if (saldoOrigen === '') {
        contenidoSaldo = <p className="text-xs text-rose-700"></p>;
        contenidoSaldoN = ''
    }

    return (
        <div className="relative min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="fixed hidden md:block md:flex top-5 left-10 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-3 px-4
                 rounded-lg shadow-md drop-shadow-2xl shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400 transition-shadow
                 duration-300 focus:outline-none focus:shadow-outline z-10"
                style={{zIndex: 1000}}
            >
                <img className="mr-2 md:h-7 md:w-7 h-4 w-4" src="/src/assets/back-svgrepo-com.svg" alt="Back"/>
                Atrás
            </button>
            <div className="flex justify-center">
                <img className="mt-10 h-10 md:h-16 w-auto" src="/src/assets/bbva-logo-900x269.png" alt="Back"/>
            </div>
            <form onSubmit={handleSubmit(handleTransfer)}
                  className="max-w-md md:mx-auto mt-12 mb-16 mx-6 p-6 bg-white
                    shadow-2xl drop-shadow-2xl shadow-sky-700 rounded-lg"
                  style={{'backgroundColor': '#004481'}}>
                <h2 className="text-3xl text-white mb-1">Realizar</h2>
                <h2 className="text-4xl text-white font-bold mb-8">Transferencia</h2>
                <div>
                    <label htmlFor="cuentaOrigen" className="block text-sm font-bold text-gray-200 mb-1 ml-1">N.° Cuenta
                        Origen</label>
                    <select id="cuentaOrigen"
                            {...register('cuentaOrigen')}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                    e.preventDefault();
                                }
                            }}
                            onChange={handleCuentaOrigenChange}
                            className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Seleccione una cuenta</option>
                        {Array.isArray(cuentas) && cuentas.length > 0 ? (
                            cuentas.map((cuenta, index) => (
                                <option key={cuenta.idCuenta} value={cuenta.numeroCuenta}>{cuenta.numeroCuenta}</option>
                            ))
                        ) : (
                            <option value="">No hay cuentas disponibles</option>
                        )}
                    </select>
                    {errors.cuentaOrigen && <p className="text-red-500 font-semibold">{errors.cuentaOrigen.message}</p>}
                    <div className="flex inline-flex space-x-2">
                        {contenidoSaldo}{contenidoSaldoN}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="cuentaDestino" className="block text-sm font-bold text-gray-200 mb-1 ml-1">N.°
                        Cuenta
                        Destino</label>
                    <input type="number" id="cuentaDestino" {...register('cuentaDestino')}
                           className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"/>
                    {errors.cuentaDestino && <p className="text-red-500 font-semibold">{errors.cuentaDestino.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="bancoDestino" className="block text-sm font-bold text-gray-200 mb-1 ml-1">
                        Banco Destino</label>
                    <select id="bancoDestino"
                            {...register('bancoDestino')}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                    e.preventDefault();
                                }
                            }}
                            className="block w-full px-3 py-2 border h-full rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Seleccione un banco</option>
                        {bancos.map(banco => (
                            <option key={banco.idBanco} value={banco.nombre}>{banco.nombre}</option>
                        ))}
                    </select>
                    {errors.cuentaDestino && <p className="text-red-500 font-semibold">{errors.cuentaDestino.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="nombre">
                        Nombre del Beneficiario
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
                    <label htmlFor="monto" className="block text-sm font-bold text-gray-200 mb-1 ml-1">Monto
                        (Bs.)</label>
                    <input type="number" id="monto" {...register('monto')}
                           onKeyDown={(e) => {
                               if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                   e.preventDefault();
                               }
                           }}
                           className="block w-full h-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"/>
                    {errors.monto && <p className="text-red-500 font-semibold">{errors.monto.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="descripcion" className="block text-sm font-bold text-gray-200 mb-1 ml-1">
                        Descripción (opcional)
                    </label>
                    <textarea
                        id="descripcion"
                        {...register('descripcion')}
                        className="block w-full px-3 py-2 border rounded-md shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                    {errors.descripcion && <p className="text-red-500 font-semibold">{errors.descripcion.message}</p>}
                </div>
                <div className="justify-end flex mt-8">
                    <button type="submit"
                            className="items-center py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold rounded-lg
                            shadow-lg shadow-teal-500 hover:drop-shadow-2xl hover:shadow-teal-400
                              transition-shadow duration-300 focus:outline-none focus:shadow-outline inline-flex">
                        Transferir
                        <img className="ml-2 md:h-7 md:w-7 h-4 w-4" src="/src/assets/money-send-svgrepo-com.svg"
                             alt="Back"/>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransferForm;
