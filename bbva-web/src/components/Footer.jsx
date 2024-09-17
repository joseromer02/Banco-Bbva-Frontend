import React from 'react';
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div className="text-gray-200 py-8 shadow-xl mt-8"
             style={{ backgroundColor: '#004481' }}>
            <div className="container mx-auto text-center">
                <p className="text-base md:text-lg">&copy; {new Date().getFullYear()} BBVA. Todos los derechos reservados.</p>
                <div className="flex justify-center text-xs md:text-sm font-semibold space-x-4 mt-2">
                    <Link to="/privacy" className="hover:text-teal-300">Política de Privacidad</Link>
                    <Link to="/terms" className="hover:text-teal-300">Términos de Servicio</Link>
                </div>
            </div>
        </div>
    );
}

export default Footer;
