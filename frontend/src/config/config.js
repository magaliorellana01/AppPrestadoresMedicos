// URL y clave para servicio de clima — usa variables de entorno cuando estén disponibles
export const API_WEATHER_URL = import.meta.env.VITE_WEATHER_URL || "https://weather.visualcrossing.com/VisualCrossingWebServices";
export const API_WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY || "KLWL75QXN8G66AT6B6445DXNR";
