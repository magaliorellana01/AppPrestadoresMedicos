
// Función helper para crear regex que ignore tildes y case
const createAccentInsensitiveRegex = (text) => {
  const normalized = normalizeText(text);
  // Escapar caracteres especiales de regex
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Crear regex que coincida con variantes con y sin tildes desde el inicio
  const regexPattern = escaped
      .replace(/a/g, '[aáàäâ]')
      .replace(/e/g, '[eéèëê]')
      .replace(/i/g, '[iíìïî]')
      .replace(/o/g, '[oóòöô]')
      .replace(/u/g, '[uúùüû]')
      .replace(/n/g, '[nñ]');
  // Agregar ^ al inicio para que coincida desde el principio del texto
  return `^${regexPattern}`;
};

// Función helper para normalizar texto removiendo tildes
const normalizeText = (text) => {
  return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
};


module.exports = {
  createAccentInsensitiveRegex,
  normalizeText
};