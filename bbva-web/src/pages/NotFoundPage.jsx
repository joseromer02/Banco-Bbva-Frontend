import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-4xl text-teal-500 font-bold mb-4">404</h1>
            <p className="mb-4">La página que estás buscando no existe.</p>
            <button
                onClick={handleGoBack}
                className="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
            >
                Volver
            </button>
        </div>
    );
}

export default NotFoundPage;
