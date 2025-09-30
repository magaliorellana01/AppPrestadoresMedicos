export const getAllHistoriasClinicas = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/historias-clinicas`);
        const data = await response.json();
        return data; //Devuelve mensaje de historia de clinica
    } catch (error) {
        console.error("Error fetching historias clinicas:", error);
        return null;
    }
};

export const getHistoriaClinicaByID = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/historias-clinicas/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener la Historia Clínica.`);
        }

        const data = await response.json();
        return data.historiaClinica; 

    } catch (error) {
        console.error("Error fetching historia clinica detalle:", error);
        throw error;
    }
};