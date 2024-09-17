import React from 'react';
import Header from '../components/Header.jsx';

function Billetera() {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <div className="mt-36 mx-auto px-4 w-full flex justify-center">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full md:w-3/4 lg:w-3/5 xl:w-1/2 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">Billetera</h2>
                    <p className="text-lg text-gray-700">Aquí puedes ver la información de tu billetera.</p>
                </div>
            </div>
        </div>
    );
}

export default Billetera;
