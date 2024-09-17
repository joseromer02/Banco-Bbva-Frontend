import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import backgroundImage from '../assets/Screenshot 2024-08-11 021150.png';
import {logout} from "../services/authService.js";
import refreshIcon from '../assets/refresh-ccw-svgrepo-com.svg';
import {getSaldo} from "../services/accountService";

function Dashboard() {
    const navigate = useNavigate();
    const [saldo, setSaldo] = useState('...');
    const [nroCuenta, setNroCuenta] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchBalance = () => {
        setLoading(true); // Iniciar el indicador de carga
        getSaldo()
            .then(data => {
                setTimeout(() => {
                    setSaldo(`${data.saldo} ${data.tipoMoneda}`);
                    setLoading(false); // Detener el indicador de carga
                }, 500);
            })
            .catch(error => {
                console.error('Error fetching account balance:', error);
                setTimeout(() => {
                    setSaldo('Error');
                    setLoading(false); // Detener el indicador de carga en caso de error
                }, 1000);
            });
    };

    useEffect(() => {
        // Llamar al servicio para obtener detalles de la cuenta
        getSaldo()
            .then(data => {
                // Asumiendo que la respuesta tiene las propiedades 'saldo' y 'tipoMoneda'
                setSaldo(`${data.saldo} ${data.tipoMoneda}`);
                setNroCuenta(`${data.numeroCuenta}`);
            })
            .catch(error => {
                console.error('Error fetching account balance:', error);
                setSaldo('Error al cargar');
                setNroCuenta('Error')

            });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            <div className="text-gray-200 fixed top-0 w-full py-8 shadow-lg z-50"
                 style={{'backgroundColor': '#004481'}}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex space-x-8">
                        <Link to="/dashboard" className="md:text-2xl text-lg hover:text-teal-300">
                            <img className="ml-5 mr-5 md:h-9 md:w-32 h-7 w-7" src="/src/assets/BBAR.D-079fc6a6.png"/>
                        </Link>
                        <Link to="/dashboard" className="md:text-2xl text-lg hover:text-teal-300">Dashboard</Link>
                        <Link to="/wallet" className="md:text-2xl text-lg hover:text-teal-300">Billetera</Link>
                        <Link to="/activity" className="md:text-2xl text-lg hover:text-teal-300">Actividad</Link>
                        <Link to="/account" className="md:text-2xl text-lg hover:text-teal-300">Cuenta</Link>
                    </div>
                    <button onClick={handleLogout}
                            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded">
                        Salir
                    </button>
                </div>
            </div>
            <div className="flex-1 mt-32 mx-7 flex justify-center items-center">
                {/*<div*/}
                {/*    className="bg-white p-8 pb-9 shadow-xl md:w-4/6 xl:w-4/6 2xl: rounded-xl flex justify-center items-center">*/}
                {/*    <div*/}
                {/*        className="rounded-lg lg:rounded-xl shadow-xl h-32 w-52 sm:h-40 sm:w-64 md:h-48 md:w-80 lg:h-48 lg:w-1/2 xl:h-72 xl:w-1/2 2xl:h-56 2xl:w-2/5"*/}
                {/*        style={{*/}
                {/*            backgroundImage: `url(${backgroundImage})`,*/}
                {/*            backgroundSize: 'cover',*/}
                {/*            backgroundPosition: 'center',*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <div className="flex flex-col items-end justify-end pt-4 pr-4 text-white">*/}
                {/*            <h2 className="text-sm pb-0.5 font-normal text-gray-100">Caja de Ahorro</h2>*/}
                {/*            <h2 className="text-2xl font-semibold text-white">{nroCuenta}</h2>*/}
                {/*        </div>*/}
                {/*        <div className="align-bottom flex flex-col items-end pr-4 pt-24">*/}
                {/*            <img src={refreshIcon} alt="Refresh" className="mb-2 cursor-pointer h-7 w-7"*/}
                {/*                 onClick={fetchBalance}/>*/}
                {/*            <h2 className="text-lg font-semibold text-gray-100">Saldo Total:</h2>*/}
                {/*            <h2 className="text-4xl font-bold text-white">{loading ? '...' : saldo}</h2>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            <div className="container mx-auto p-4 flex-1">
                <div className="bg-white rounded-xl shadow-xl p-8 mx-64">
                    <div className="mt-2 flex items-center justify-center space-x-2">
                        <button onClick={() => navigate('/cobrar-qr')}
                                className="flex items-center shadow-xl bg-sky-700 hover:bg-sky-600 md:text-base text-xs text-white font-bold py-2 px-3 rounded-xl">
                            Cobrar QR
                            <img className="ml-5 md:h-10 md:w-10 h-7 w-7" src="/src/assets/qr-code-svgrepo-com.svg"/>
                        </button>
                        <button onClick={() => navigate('/transferir')}
                                className="flex items-center shadow-xl bg-sky-700 hover:bg-sky-600 md:text-base text-xs text-white font-bold py-2 px-3 rounded-xl">
                            Transferir
                            <img className="ml-5 md:h-10 md:w-10 h-7 w-7" src="/src/assets/pay-svgrepo-com.svg"/>
                        </button>
                    </div>
                </div>
                <div className="mt-4 mx-3 flex justify-center">
                    <div className="md:w-4/6 w-full bg-white rounded-xl shadow-xl p-8">
                        <h2 className="md:text-3xl text-teal-700 text-center pb-5 font-bold mb-4"
                        >Historial de Transferencias</h2>
                        <div className="overflow-x-auto overflow-y-auto max-h-96">
                            <table className="shadow-md rounded-md min-w-full bg-white">
                                <thead className="bg-blue-900 text-gray-100 md:text-lg text-xs"
                                       style={{'backgroundColor': '#004481'}}>
                                <tr>
                                    <th className="py-2 rounded-tl-xl">Fecha</th>
                                    <th className="py-2">Descripción</th>
                                    <th className="py-2 rounded-tr-xl">Monto</th>
                                </tr>
                                </thead>
                                <tbody className="text-center">
                                {/*{transacciones.map((transaccion, index) => (*/}
                                {/*<tr key={index}>*/}
                                <tr>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                    <td className="border px-4 py-2">{}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
