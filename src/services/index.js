export const getAllHistoriasClinicas = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/historias-clinicas`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener las Historias Clínicas.`);
    }

    const data = await response.json();
    return data;
};

export const getHistoriaClinicaByID = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/historias-clinicas/${id}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener la Historia Clínica.`);
    }

    const data = await response.json();
    return data.historiaClinica;
};

export const getSituacionTerapeuticaByMultipleParams = async (input) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/situaciones-terapeuticas/search?input=${input}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener la Situación Terapéutica.`);
    }

    const data = await response.json();
    return data;
};

export const createSituacionTerapeutica = async (form) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/situaciones-terapeuticas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo crear la Situación Terapéutica.`);
    }

    const data = await response.json();
    return data;
};
export const getSituacionTerapeuticaByID = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/situaciones-terapeuticas/${id}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener la Situación Terapéutica.`);
    }
    const data = await response.json();
    return data;
};
export const createNovedadTerapeutica = async (id, nota) => {
     const response = await fetch(
    `${import.meta.env.VITE_API_URL}/situaciones-terapeuticas/${id}/novedades`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  return await response.json();
};

export const updateSituacionTerapeutica = async (id, updates) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/situaciones-terapeuticas/${id}`,
        {
            method: "PUT", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }


    return await response.json();
};