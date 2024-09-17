import React, {useEffect, useState, useRef} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import backgroundImage from '../assets/Screenshot 2024-08-11 021150.png';
import {logout} from "../services/authService.js";
import refreshIcon from '../assets/refresh-ccw-svgrepo-com.svg';
import {crearCuenta, getSaldo} from "../services/accountService";
import {getTransacciones} from "../services/transactionService";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    const navigate = useNavigate();
    const [saldo, setSaldo] = useState('...');
    const [nroCuenta, setNroCuenta] = useState('');
    const [cuentas, setCuentas] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);  // Ref para el menú desplegable

    useEffect(() => {
        if (location.state?.toastMessage) {
            toast.success(location.state.toastMessage, {
                position: "bottom-right",
                autoClose: 3000, // 3 segundos
                theme: "colored"
            });
        }
    }, [location.state]);

    const parseDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return new Intl.DateTimeFormat('es-BO', options).format(date).replace(',', ''); // Eliminar la coma
    };

    const formatAmount = (amount, tipoTransaccion) => {
        if (amount === null || amount === undefined) {
            return 'Monto no disponible'; // O cualquier valor por defecto que prefieras
        }

        const sign = tipoTransaccion === 'Recibido' ? '+' : '-';
        return `${sign} Bs. ${Number(amount).toLocaleString('es-BO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleAccountMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const fetchBalance = (idCuenta) => {
        setLoading(true);
        getSaldo()  // Aquí llamamos a getSaldo para obtener todas las cuentas
            .then(data => {
                const cuentaSeleccionada = data.find(cuenta => cuenta.idCuenta === idCuenta); // Encontrar la cuenta seleccionada
                if (cuentaSeleccionada) {
                    setTimeout(() => {
                        setSaldo(`${cuentaSeleccionada.tipoMoneda} ${cuentaSeleccionada.saldo}`);
                        setNroCuenta(`${cuentaSeleccionada.numeroCuenta}`);
                        setLoading(false);
                    }, 500);
                } else {
                    console.error('Cuenta no encontrada');
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching account balance:', error);
                setTimeout(() => {
                    setSaldo('Error');
                    setLoading(false);
                }, 500);
            });
    };

    const refreshBalance = () => {
        setLoading(true);
        const cuentaActual = cuentas.find(cuenta => cuenta.numeroCuenta.toString() === nroCuenta);
        if (cuentaActual) {
            fetchBalance(cuentaActual.idCuenta);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const saldoData = await getSaldo();

                if (saldoData.length > 0) { // Verifica que el array no esté vacío
                    setCuentas(saldoData); // Almacena todas las cuentas
                    const cuenta = saldoData[0]; // Selecciona la primera cuenta por defecto
                    //console.log('Cuenta seleccionada por defecto:', cuenta); // Imprime la cuenta seleccionada por defecto
                    setSaldo(`${cuenta.tipoMoneda} ${cuenta.saldo}`);
                    setNroCuenta(`${cuenta.numeroCuenta}`);
                    const transData = await getTransacciones(cuenta.idCuenta);
                    const parsedTransacciones = transData.map(trans => ({
                        ...trans,
                        fecha: parseDate(trans.fecha)
                    }));
                    setTransacciones(parsedTransacciones);
                } else {
                    console.error('La respuesta no contiene cuentas');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAccountSelection = (cuenta) => {
        setNroCuenta(cuenta.numeroCuenta);
        fetchBalance(cuenta.idCuenta);  // Pasamos el idCuenta de la cuenta seleccionada
        setMenuOpen(false);
    };

    const handleCreateAccount = async () => {
        try {
            setLoading(true);
            await crearCuenta(); // Llamada a la API para crear una cuenta
            const saldoData = await getSaldo(); // Recargar cuentas después de crear una nueva
            setCuentas(saldoData);
            if (saldoData.length > 0) {
                const nuevaCuenta = saldoData[saldoData.length - 1]; // Asume que la nueva cuenta es la última en la lista
                setNroCuenta(nuevaCuenta.numeroCuenta);
                setSaldo(`${nuevaCuenta.tipoMoneda} ${nuevaCuenta.saldo}`);
            }
            setShowModal(false); // Cerrar el modal de confirmación
            setLoading(false);
        } catch (error) {
            console.error('Error al crear cuenta:', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header toggleMenu={toggleMenu} isOpen={isOpen} handleLogout={handleLogout}/>
            <div className="mt-36 mx-auto px-4 pb-4 w-full flex justify-center">
                <ToastContainer/>
                <div
                    className="bg-white shadow-xl rounded-xl p-8 w-full md:w-3/4 lg:w-3/5 xl:w-1/2 flex justify-center items-center">
                    <div
                        className="rounded-lg lg:rounded-xl shadow-xl h-36 w-56 lg:h-60 lg:w-96 relative"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="flex flex-col items-end justify-end pt-1.5 pr-2 xl:pt-4 xl:pr-4 text-white">
                            <h2 className="text-xs lg:text-base font-normal text-gray-100">Caja de Ahorro</h2>
                            <div className="flex items-center justify-center relative">
                                <h2 className="text-sm lg:text-2xl font-semibold text-white">{nroCuenta}</h2>
                                <img
                                    onClick={toggleAccountMenu}
                                    className="ml-2 cursor-pointer md:h-6 md:w-5 h-4 w-3"
                                    src="/src/assets/bottom-arrow-svgrepo-com.svg"
                                    alt="Toggle Menu"
                                />
                                {menuOpen && (
                                    <div ref={menuRef}
                                         className="absolute right-0 mt-16 w-48 max-h-60 overflow-y-auto scrollbar-custom rounded-lg text-end items-end z-20">
                                        <ul className="py-1 text-white"
                                            style={{backgroundColor: 'rgba(2,64,121,0.87)'}}>
                                            {cuentas.map((cuenta, index) => (
                                                <li
                                                    key={index}
                                                    className={`px-4 cursor-pointer ${nroCuenta === cuenta.numeroCuenta.toString() ? 'bg-teal-600/60 text-sky-400' : 
                                                        'hover:text-sky-300 transition duration-300'}`}
                                                    onClick={() => handleAccountSelection(cuenta)}
                                                >
                                                    <a>{cuenta.numeroCuenta}</a>
                                                    <br/>
                                                    <a className="text-xs text-teal-300">Bs. {cuenta.saldo}</a>
                                                </li>
                                            ))}
                                            <li className="my-3 option-item font-bold justify-end add-acct-item flex cursor-pointer" onClick={() => setShowModal(true)}>
                                                <a className="mt-2 mr-2">Añadir Cuenta</a>
                                                <svg className="icon" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor"
                                                            strokeWidth="1.5"></circle>
                                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                                                          stroke="currentColor" strokeWidth="1.5"
                                                          strokeLinecap="round"></path>
                                                </svg>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="align-bottom flex flex-col items-end pr-3 pt-4 lg:pt-12">
                            <img src={refreshIcon} alt="Refresh"
                                 className="mb-2 cursor-pointer h-3.5 w-3.5 lg:h-7 lg:w-7"
                                 onClick={refreshBalance}/> {/* Cambiado a refreshBalance */}
                            <h2 className="text-sm lg:text-lg font-semibold text-gray-100">Saldo Total:</h2>
                            <h2 className="text-2xl lg:text-4xl font-bold text-white">{loading ? '...' : saldo}</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto px-4 pb-4 w-full flex justify-center">
                <div className="mt-4 flex items-center justify-center space-x-2 md:space-x-3">
                    <button onClick={() => navigate('/cobrar-qr')}
                            className="flex items-center shadow-lg bg-teal-600 hover:bg-teal-500 md:text-xl text-xs text-white
        font-semibold py-2 px-7 rounded-xl drop-shadow-2xl shadow-teal-500 hover:shadow-teal-400 duration-300">
                        Cobrar QR
                        <img className="ml-4 md:h-10 md:w-10 h-7 w-7" src="/src/assets/qr-code-svgrepo-com.svg"/>
                    </button>
                    <button onClick={() => navigate('/pagar-qr')}
                            className="flex items-center shadow-lg bg-teal-600 hover:bg-teal-500 md:text-xl text-xs text-white
        font-semibold py-2 px-7 rounded-xl drop-shadow-2xl shadow-teal-500 hover:shadow-teal-400 duration-300">
                        Pagar QR
                        <img className="ml-4 md:h-10 md:w-10 h-7 w-7" src="/src/assets/qr-scan-2-svgrepo-com.svg"/>
                    </button>

                </div>
            </div>
            <div className="mx-auto w-full flex justify-center">
                <button onClick={() => navigate('/transfer')}
                        className="flex items-center shadow-lg bg-sky-700 hover:bg-sky-600 md:text-2xl text-xs text-white
                             font-semibold py-3 px-28 mx-5 md:px-32 rounded-xl drop-shadow-2xl shadow-sky-500 hover:shadow-sky-400 duration-300">
                    Transferir
                    <img className="ml-4 md:h-10 md:w-10 h-7 w-7" src="/src/assets/icons8-payment-50.png"/>
                </button>
            </div>
            <div className="mb-20 mt-10 mx-auto px-4 w-full flex justify-center">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full md:w-3/4 lg:w-3/5 xl:w-1/2">
                    <h2 className="md:text-3xl text-start pb-1 font-bold mb-4" style={{color: '#004481'}}
                    >Historial de Transferencias</h2>
                    <div className="overflow-x-auto overflow-y-auto max-h-96">
                        <table className="shadow-md rounded-md min-w-full bg-white">
                            <thead className="text-gray-100 md:text-lg text-xs" style={{'backgroundColor': '#004481'}}>
                            <tr>
                                <th className="py-2 rounded-tl-xl">Fecha</th>
                                <th className="py-2">Descripción</th>
                                <th className="py-2 rounded-tr-xl">Monto</th>
                            </tr>
                            </thead>
                            <tbody className=" text-center bg-gray-50/30">
                            {transacciones.map((transaccion, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-100 px-4 py-2">{transaccion.fecha}</td>
                                    <td className="text-sm border border-gray-100 py-2">{transaccion.descripcion}</td>
                                    <td className={`text-lg font-bold border border-gray-100 px-4 py-2 ${transaccion.tipoTransaccion === 'Recibido' ? 'text-emerald-600' : 'text-pink-700'}`}>
                                        {formatAmount(transaccion.monto, transaccion.tipoTransaccion)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer/>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 shadow-lg w-2/5">
                        <h2 className="text-3xl font-semibold mb-4">Confirmar Creación de Cuenta</h2>
                        <p className="text-lg mb-12">¿Estás seguro de que deseas crear una nueva cuenta de ahorro?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-sky-700 hover:bg-sky-600 text-white text-lg font-semibold
                                    shadow-lg drop-shadow-2xl shadow-sky-500 hover:shadow-sky-400 duration-300 py-3 px-6 rounded-lg"
                                onClick={() => setShowModal(false)} // Cerrar el modal sin crear la cuenta
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg shadow-lg
                                    drop-shadow-2xl shadow-teal-500 hover:shadow-teal-400 py-3 px-6 duration-300 rounded-lg"
                                onClick={handleCreateAccount} // Llamar a la función para crear la cuenta
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;