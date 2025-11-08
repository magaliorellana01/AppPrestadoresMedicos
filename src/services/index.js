import axios from "axios";

// Eliminar el token y limpiar estado simple
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("prestador");
};

// Instancia de Axios
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});

// Interceptor de solicitud: adjunta Authorization si hay token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: maneja 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 || error?.status === 401) {
      console.warn("Token expirado o no válido.");
      logoutUser();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Servicios
export const getAllHistoriasClinicas = async () => {
  const response = await api.get(`/historias-clinicas`);
  return response.data;
};

export const getHistoriaClinicaByID = async (id) => {
  const response = await api.get(`/historias-clinicas/${id}`);
  return response.data.historiaClinica;
};

export const getHistoriasClinicasByMultipleParams = async (input) => {
  const response = await api.get(`/historias-clinicas/search`, {
    params: { input },
  });
  return response.data;
};

export const getSituacionTerapeuticaByMultipleParams = async (input) => {
  const response = await api.get(`/situaciones-terapeuticas/search`, {
    params: { input },
  });
  return response.data;
};

export const createSituacionTerapeutica = async (form) => {
  const response = await api.post(`/situaciones-terapeuticas`, form);
  return response.data;
};

export const getSituacionTerapeuticaByID = async (id) => {
  const response = await api.get(`/situaciones-terapeuticas/${id}`);
  return response.data;
};

export const createNovedadTerapeutica = async (id, nota) => {
  const response = await api.post(`/situaciones-terapeuticas/${id}/novedades`, { nota });
  return response.data;
};

export const updateSituacionTerapeutica = async (id, updates) => {
  const response = await api.put(`/situaciones-terapeuticas/${id}`, updates);
  return response.data;
};

export const getSolicitudById = async (id) => {
  const response = await api.get(`/solicitud/${id}`);
  return response.data;
};

export const updateSolicitud = async (id, updateData) => {
  const response = await api.put(`/solicitud/${id}`, updateData);
  return response.data;
};

export const uploadArchivosSolicitud = async (id, formData) => {
  const response = await api.post(`/solicitud/${id}/archivos`, formData);
  return response.data;
};

export const login = async (cuit, password) => {
  const response = await api.post(`/prestador/login`, { cuit, password });
  // Si el backend devuelve token, lo persistimos
  const token = response?.data?.accessToken || response?.data?.token;
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  }
  return response.data;
};

// Solicitudes - listado con filtros y paginación
export const getSolicitudesFiltradas = async ({ page, size, estado, tipo }) => {
  const response = await api.get(`/filtro-solicitudes`, {
    params: {
      page,
      size,
      ...(estado ? { estado } : {}),
      ...(tipo ? { tipo } : {}),
    },
  });
  return response.data;
};

// TURNOS API
export const getTurnos = async (params = {}) => {
  const { data } = await api.get(`/turnos`, { params });
  return data;
};

export const getEspecialidades = async (params = {}) => {
  const { data } = await api.get(`/turnos/especialidades`, { params });
  return data;
};

export const createTurnosSlots = async (payload) => {
  const { data } = await api.post(`/turnos/slots`, payload);
  return data;
};

export const updateTurno = async (id, patch) => {
  const { data } = await api.patch(`/turnos/${id}`, patch);
  return data;
};

export const addNotaTurno = async (id, texto) => {
  const { data } = await api.post(`/turnos/${id}/notas`, { texto });
  return data;
};

// SEDES API
export const getSedes = async (params = {}) => {
  const { data } = await api.get(`/sedes`, { params });
  return data;
};

export const getSedeById = async (id) => {
  const { data } = await api.get(`/sedes/${id}`);
  return data;
};

export const createSede = async (payload) => {
  const { data } = await api.post(`/sedes`, payload);
  return data;
};

export const updateSede = async (id, payload) => {
  const { data } = await api.put(`/sedes/${id}`, payload);
  return data;
};

export const asignarMedicoSede = async (sedeId, medicoId) => {
  const { data } = await api.post(`/sedes/asignar-medico`, { sedeId, medicoId });
  return data;
};

// DASHBOARD SOLICITUDES API
export const getDashboardStats = async (fechaDesde, fechaHasta, prestadorId) => {
  const { data } = await api.get(`/solicitud/dashboard/stats`, {
    params: { fechaDesde, fechaHasta, prestadorId }
  });
  return data;
};

