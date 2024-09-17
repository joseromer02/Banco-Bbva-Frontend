import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {Autoplay, Navigation, Pagination, EffectFade} from 'swiper/modules';

function LandingPage() {
    let navigate = useNavigate();

    useEffect(() => {
        // Capturar el token de la URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            // Almacenar el token en el localStorage
            localStorage.setItem('token', token);
            // Limpiar la URL de los parámetros de consulta
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div
                className="flex flex-col mt-8 mb-10 lg:mt-0 lg:mb-0 lg:flex-row items-center justify-center w-full space-y-6 lg:space-y-0 lg:space-x-10">
                {/* Swiper Container */}
                <img src="/src/assets/bbva-logo-900x269.png" alt="Logo BBVA" className="mt-6 mb-4 h-16 lg:h-20 mx-auto lg:hidden"/>
                <div className="w-full lg:w-1/2 h-auto flex justify-center items-center">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        centeredSlides={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        className="shadow-2xl rounded-3xl drop-shadow-2xl shadow-blue-300 bg-black w-full"
                    >
                        <SwiperSlide>
                            <img
                                src="/src/assets/ciudad-bbva-general.webp"
                                alt="BBVA Visual 1"
                                className="w-full h-auto"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="/src/assets/BBVA-Argentina-TorreBBVA-01_opt.jpg"
                                alt="BBVA Visual 2"
                                className="w-full h-auto"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="/src/assets/2021_09_06_BBVA_PE.jpg"
                                alt="BBVA Visual 3"
                                className="w-full h-auto"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="/src/assets/04.07-img 2.jpg"
                                alt="BBVA Visual 4"
                                className="w-full h-auto"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="/src/assets/Garanti-Bank-BBVA-151.jpg"
                                alt="BBVA Visual 5"
                                className="w-full h-auto"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="/src/assets/Screenshot 2024-08-21 011642.png"
                                alt="BBVA Visual 6"
                                className="w-full h-auto"
                            />
                        </SwiperSlide>
                    </Swiper>
                </div>

                {/* Text and Buttons Container */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                    <div className="mb-6 lg:mb-12 mt-8 lg:mt-0 text-center hidden lg:block">
                        <img src="/src/assets/bbva-logo-900x269.png" alt="Logo BBVA" className="h-16 lg:h-20 mx-auto"/>
                    </div>
                    <header className="text-center px-4">
                        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4 mt-8">Bienvenido a la Plataforma
                            Bancaria del Banco BBVA</h1>
                        <p className="text-gray-600 mb-6">La forma más segura y eficiente de manejar tu dinero.</p>
                        <div
                            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center
                            items-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center text-center bg-sky-700 hover:bg-sky-600 text-white font-bold py-3
                                 lg:py-3 text-lg shadow-xl drop-shadow-2xl shadow-sky-600 px-9
                                 rounded-lg hover:drop-shadow-2xl hover:shadow-sky-500 duration-300"
                            >
                                Ingresar
                                <img className="ml-2 lg:ml-3 h-6 w-6 lg:h-7 lg:w-7"
                                     src="/src/assets/sign-in-svgrepo-com.svg"/>
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="flex items-center text-center bg-teal-600 hover:bg-teal-500 text-white font-bold
                                 py-3 lg:py-3 text-lg shadow-xl drop-shadow-2xl shadow-teal-500 rounded-lg
                                  hover:drop-shadow-2xl hover:shadow-teal-400 duration-300 px-6
                                  lg:px-6"
                            >
                                Registrarse
                                <img className="ml-2 lg:ml-3 h-6 w-6 lg:h-7 lg:w-7"
                                     src="/src/assets/register-svgrepo-com.svg"/>
                            </button>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
