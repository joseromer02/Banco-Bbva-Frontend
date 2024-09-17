import React from 'react';
import {Link} from "react-router-dom";

function Header({toggleMenu, isOpen, handleLogout}) {
    return (
        <div className="text-gray-200 fixed top-0 pt-8 w-full h-28 py-4 shadow-xl z-50"
             style={{backgroundColor: '#004481'}}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center space-x-3">
                    <img className="h-9 w-32 ml-6 mb-2" src="/src/assets/BBAR.D-079fc6a6.png" alt="Logo"/>
                </Link>
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        <svg className="h-10 w-10 pt-2 text-gray-200" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    </button>
                </div>
                <div className="hidden md:flex md:items-center space-x-6">
                    <Link to="/dashboard" className="text-2xl hover:text-teal-300">Dashboard</Link>
                    <Link to="/billetera" className="text-2xl hover:text-teal-300">Billetera</Link>
                    <Link to="/actividad" className="text-2xl hover:text-teal-300">Actividad</Link>
                    <Link to="/cuenta" className="text-2xl hover:text-teal-300">Cuenta</Link>
                </div>
                <div className="hidden md:flex md:items-center">
                    <button onClick={handleLogout}
                            className="flex items-center bg-teal-600 hover:bg-teal-500 text-white shadow-lg text-lg font-bold
                            py-3 px-4 rounded-md drop-shadow-2xl shadow-teal-500 hover:shadow-teal-400 duration-300">
                        Salir
                        <img className="ml-3 md:h-7 md:w-7 h-4 w-4" src="/src/assets/sign-out-alt-2-svgrepo-com.svg"/>
                    </button>
                </div>
            </div>

            {/* Menú desplegable en dispositivos móviles */}
            <div
                className={`fixed top-0 right-0 h-full w-44 z-40 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    transition-transform duration-300 ease-in-out`} style={{backgroundColor: '#004481'}}>
                <div className="flex flex-col items-start space-y-6 pt-16 px-4">
                    <Link to="/dashboard" onClick={toggleMenu}
                          className="text-xl text-white hover:text-teal-300">Dashboard</Link>
                    <Link to="/wallet" onClick={toggleMenu}
                          className="text-xl text-white hover:text-teal-300">Billetera</Link>
                    <Link to="/activity" onClick={toggleMenu}
                          className="text-xl text-white hover:text-teal-300">Actividad</Link>
                    <Link to="/account" onClick={toggleMenu}
                          className="text-xl text-white hover:text-teal-300">Cuenta</Link>
                    <button onClick={() => {
                        handleLogout();
                        toggleMenu();
                    }}
                            className="flex items-center bg-teal-600 hover:bg-teal-500 text-white shadow-lg text-lg font-bold
                py-3 px-3 h-12 w-24 rounded-md drop-shadow-2xl shadow-teal-500 hover:shadow-teal-400 duration-300">
                        Salir
                        <img className="ml-3 h-5 w-5" src="/src/assets/sign-out-alt-2-svgrepo-com.svg" alt="Salir"/>
                    </button>
                </div>
            </div>

            {/* Fondo oscuro cuando el menú está abierto */}
            <div className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 z-30`}
                 onClick={toggleMenu}></div>
        </div>
    );
}

export default Header;
