import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import TransferForm from "./pages/TransferForm.jsx";
import CobrarQR from "./pages/CobrarQR.jsx";
import PagarQR from './pages/PagarQR.jsx';
import Billetera from './pages/Billetera.jsx';
import Actividad from './pages/Actividad.jsx';
import Cuenta from './pages/Cuenta.jsx';
import EditarCuenta from "./pages/EditarCuenta.jsx";
import ProcesarPagoQR from "./pages/ProcesarPagoQR.jsx";
import ConfirmacionPago from "./pages/ConfirmacionPago.jsx";

function AppRouter() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Router>
                <div className="min-h-screen w-full">
                    <Routes>
                        <Route path="/" element={<LandingPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/billetera"
                            element={
                                <PrivateRoute>
                                    <Billetera/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/actividad"
                            element={
                                <PrivateRoute>
                                    <Actividad/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/cuenta"
                            element={
                                <PrivateRoute>
                                    <Cuenta/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/editar-cuenta"
                            element={
                                <PrivateRoute>
                                    <EditarCuenta/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/transfer"
                            element={
                                <PrivateRoute>
                                    <TransferForm/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/cobrar-qr"
                            element={
                                <PrivateRoute>
                                    <CobrarQR />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/pagar-qr"
                            element={
                                <PrivateRoute>
                                    <PagarQR />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/procesar-pago"
                            element={
                                <PrivateRoute>
                                    <ProcesarPagoQR />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/confirmacion"
                            element={
                                <PrivateRoute>
                                    <ConfirmacionPago/>
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default AppRouter;
