import bbvaApi from './bbvaApi';

export const getTransacciones = async (cuentaId) => {
    try {
        const response = await bbvaApi.get(`/api/v1/transacciones/cuenta/${cuentaId}`);
        return response.data; // Retorna la lista de TransaccionDto
    } catch (error) {
        console.error('Error al obtener las transacciones', error);
        throw error;
    }
};