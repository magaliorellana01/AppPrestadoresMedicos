export const getAllHistoriasClinicas = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/historias-clinicas`)
    .then((res) => res.json())
    .catch((error) => console.error("Error fetching historias clinicas:", error));
  return response;
};

export const getHistoriaClinicaByID = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/historias-clinicas/${id}`)
    .then((res) => res.json())
    .catch((error) => console.error("Error fetching historia clinica:", error));
  return response;
};
