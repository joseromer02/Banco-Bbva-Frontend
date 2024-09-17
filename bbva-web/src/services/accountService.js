import bbvaApi from './bbvaApi';
import {toast} from "react-toastify";

export const getSaldo = async () => {
    try {
        const response = await bbvaApi.get('/api/v1/cuentas/saldo');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            const cuentas = response.data.map(cuenta => ({
                ...cuenta,
                saldo: parseFloat(cuenta.saldo).toLocaleString('es-BO', {
                    minimumFractionDigits: 2, // Mantén dos decimales
                    maximumFractionDigits: 2
                })
            }));
            return cuentas; // Retorna el array completo de cuentas
        }
        return [];
    } catch (error) {
        console.error('Error al obtener los detalles de la cuenta', error);
        throw error; // O manejar de otra manera que prefieras
    }
};

export const crearCuenta = async () => {
    try {
        const response = await bbvaApi.post('/api/v1/cuentas/crear');
        toast.success("Cuenta creada con éxito", {
            position: "bottom-right",
            autoClose: 3000, // 3 segundos
            theme: "colored"
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la cuenta', error);
        toast.error("Error al crear la cuenta", {
            position: "bottom-right",
            autoClose: 3000, // 3 segundos
            theme: "colored"
        });
        throw error; // O manejar de otra manera que prefieras
    }
};