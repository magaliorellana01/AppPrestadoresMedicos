const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Configurar dotenv
dotenv.config();

// Importar modelos
const SocioModel = require("./src/models/socio");
const HistoriaClinicaModel = require("./src/models/historiaClinica");

// Datos proporcionados por el usuario
const sociosData = [
  {
    id: "1000001",
    nombres: "Sol Andrea",
    apellidos: "Noguera",
    rol: "Titular",
    nro_afiliado: "1000001",
  },
  {
    id: "1000002",
    nombres: "Magalí Fernanda",
    apellidos: "Orellana López",
    rol: "Familiar",
    nro_afiliado: "1000002",
  },
  {
    id: "1000003",
    nombres: "Iván Alejandro",
    apellidos: "Rojas",
    rol: "Titular",
    nro_afiliado: "1000003",
  },
  {
    id: "1000004",
    nombres: "Hernan Gabriel",
    apellidos: "Viltez",
    rol: "Titular",
    nro_afiliado: "1000004",
  },
  {
    id: "1000005",
    nombres: "Matias Eduardo",
    apellidos: "Carabajal",
    rol: "Titular",
    nro_afiliado: "1000005",
  },
  {
    id: "1000006",
    nombres: "Laura Beatriz",
    apellidos: "Pérez Gómez",
    rol: "Familiar",
    nro_afiliado: "1000006",
  },
  {
    id: "1000007",
    nombres: "Juan Manuel",
    apellidos: "Gómez",
    rol: "Titular",
    nro_afiliado: "1000007",
  },
  {
    id: "1000008",
    nombres: "Ana Sofía",
    apellidos: "Torres Ramírez",
    rol: "Familiar",
    nro_afiliado: "1000008",
  },
  {
    id: "1000009",
    nombres: "Carlos Alberto",
    apellidos: "Méndez",
    rol: "Titular",
    nro_afiliado: "1000009",
  },
  {
    id: "1000010",
    nombres: "María José",
    apellidos: "López Fernández",
    rol: "Familiar",
    nro_afiliado: "1000010",
  },
  {
    id: "1000011",
    nombres: "Diego Sebastián",
    apellidos: "Sánchez",
    rol: "Titular",
    nro_afiliado: "1000011",
  },
  {
    id: "1000012",
    nombres: "Valeria Inés",
    apellidos: "Ruiz",
    rol: "Familiar",
    nro_afiliado: "1000012",
  },
  {
    id: "1000013",
    nombres: "Jorge Enrique",
    apellidos: "Fernández",
    rol: "Titular",
    nro_afiliado: "1000013",
  },
  {
    id: "1000014",
    nombres: "Cecilia Mariela",
    apellidos: "Martínez Díaz",
    rol: "Familiar",
    nro_afiliado: "1000014",
  },
  {
    id: "1000015",
    nombres: "Andrés Felipe",
    apellidos: "Ramírez",
    rol: "Titular",
    nro_afiliado: "1000015",
  },
  {
    id: "1000016",
    nombres: "Lucía Carolina",
    apellidos: "Castro",
    rol: "Familiar",
    nro_afiliado: "1000016",
  },
  {
    id: "1000017",
    nombres: "Sebastián Nicolás",
    apellidos: "Rojas Morales",
    rol: "Titular",
    nro_afiliado: "1000017",
  },
  {
    id: "1000018",
    nombres: "Patricia Elena",
    apellidos: "Díaz",
    rol: "Familiar",
    nro_afiliado: "1000018",
  },
  {
    id: "1000019",
    nombres: "Fernando Javier",
    apellidos: "Morales Suárez",
    rol: "Titular",
    nro_afiliado: "1000019",
  },
  {
    id: "1000020",
    nombres: "Marcela Soledad",
    apellidos: "Ortiz",
    rol: "Familiar",
    nro_afiliado: "1000020",
  },
  {
    id: "1000021",
    nombres: "Ricardo Andrés",
    apellidos: "Herrera Ponce",
    rol: "Titular",
    nro_afiliado: "1000021",
  },
  {
    id: "1000022",
    nombres: "Verónica Paula",
    apellidos: "Ramos",
    rol: "Familiar",
    nro_afiliado: "1000022",
  },
  {
    id: "1000023",
    nombres: "Gabriel Esteban",
    apellidos: "Vega López",
    rol: "Titular",
    nro_afiliado: "1000023",
  },
  {
    id: "1000024",
    nombres: "Silvia Angélica",
    apellidos: "Acosta",
    rol: "Familiar",
    nro_afiliado: "1000024",
  },
  {
    id: "1000025",
    nombres: "Martín Alejandro",
    apellidos: "Cabrera",
    rol: "Titular",
    nro_afiliado: "1000025",
  },
  {
    id: "1000026",
    nombres: "Daniela Florencia",
    apellidos: "Bravo González",
    rol: "Familiar",
    nro_afiliado: "1000026",
  },
  {
    id: "1000027",
    nombres: "Alfredo Damián",
    apellidos: "Medina",
    rol: "Titular",
    nro_afiliado: "1000027",
  },
  {
    id: "1000028",
    nombres: "Juliana Teresa",
    apellidos: "Paredes Silva",
    rol: "Familiar",
    nro_afiliado: "1000028",
  },
  {
    id: "1000029",
    nombres: "Esteban Rodrigo",
    apellidos: "Navarro",
    rol: "Titular",
    nro_afiliado: "1000029",
  },
  {
    id: "1000030",
    nombres: "Mónica Alejandra",
    apellidos: "Salazar Torres",
    rol: "Familiar",
    nro_afiliado: "1000030",
  },
  {
    id: "1000031",
    nombres: "Adriana Beatriz",
    apellidos: "Vargas",
    rol: "Titular",
    nro_afiliado: "1000031",
  },
  {
    id: "1000032",
    nombres: "Hugo Martín",
    apellidos: "Domínguez Pérez",
    rol: "Familiar",
    nro_afiliado: "1000032",
  },
  {
    id: "1000033",
    nombres: "Raúl Eduardo",
    apellidos: "García",
    rol: "Titular",
    nro_afiliado: "1000033",
  },
  {
    id: "1000034",
    nombres: "Claudia Verónica",
    apellidos: "Benítez Ramírez",
    rol: "Familiar",
    nro_afiliado: "1000034",
  },
  {
    id: "1000035",
    nombres: "Marcos Daniel",
    apellidos: "Silva",
    rol: "Titular",
    nro_afiliado: "1000035",
  },
  {
    id: "1000036",
    nombres: "Florencia Isabel",
    apellidos: "Córdoba",
    rol: "Familiar",
    nro_afiliado: "1000036",
  },
  {
    id: "1000037",
    nombres: "Pablo Nicolás",
    apellidos: "Álvarez",
    rol: "Titular",
    nro_afiliado: "1000037",
  },
  {
    id: "1000038",
    nombres: "Tamara Julieta",
    apellidos: "Ríos Gutiérrez",
    rol: "Familiar",
    nro_afiliado: "1000038",
  },
  {
    id: "1000039",
    nombres: "Federico Andrés",
    apellidos: "Molina",
    rol: "Titular",
    nro_afiliado: "1000039",
  },
  {
    id: "1000040",
    nombres: "Rocío Belén",
    apellidos: "Serrano Díaz",
    rol: "Familiar",
    nro_afiliado: "1000040",
  },
  {
    id: "1000041",
    nombres: "Mauricio Gabriel",
    apellidos: "Giménez",
    rol: "Titular",
    nro_afiliado: "1000041",
  },
  {
    id: "1000042",
    nombres: "Natalia Soledad",
    apellidos: "Luna Fernández",
    rol: "Familiar",
    nro_afiliado: "1000042",
  },
  {
    id: "1000043",
    nombres: "Oscar Javier",
    apellidos: "Ponce",
    rol: "Titular",
    nro_afiliado: "1000043",
  },
  {
    id: "1000044",
    nombres: "Marta Alejandra",
    apellidos: "Acuña Ramírez",
    rol: "Familiar",
    nro_afiliado: "1000044",
  },
  {
    id: "1000045",
    nombres: "Tomás Emiliano",
    apellidos: "Romero",
    rol: "Titular",
    nro_afiliado: "1000045",
  },
  {
    id: "1000046",
    nombres: "Camila Eugenia",
    apellidos: "Ortiz Cabrera",
    rol: "Familiar",
    nro_afiliado: "1000046",
  },
  {
    id: "1000047",
    nombres: "Gonzalo Adrián",
    apellidos: "Peralta",
    rol: "Titular",
    nro_afiliado: "1000047",
  },
  {
    id: "1000048",
    nombres: "Julieta Vanesa",
    apellidos: "Márquez",
    rol: "Familiar",
    nro_afiliado: "1000048",
  },
  {
    id: "1000049",
    nombres: "Sergio Esteban",
    apellidos: "Aguilar Ruiz",
    rol: "Titular",
    nro_afiliado: "1000049",
  },
  {
    id: "1000050",
    nombres: "Paula Antonella",
    apellidos: "Campos",
    rol: "Familiar",
    nro_afiliado: "1000050",
  },
  {
    id: "1000051",
    nombres: "Rodrigo Javier",
    apellidos: "Espinoza Torres",
    rol: "Titular",
    nro_afiliado: "1000051",
  },
  {
    id: "1000052",
    nombres: "Mariana Daniela",
    apellidos: "Quiroga",
    rol: "Familiar",
    nro_afiliado: "1000052",
  },
  {
    id: "1000053",
    nombres: "Alejandro Luis",
    apellidos: "Godoy Ramírez",
    rol: "Titular",
    nro_afiliado: "1000053",
  },
  {
    id: "1000054",
    nombres: "Lorena Gabriela",
    apellidos: "Mendoza",
    rol: "Familiar",
    nro_afiliado: "1000054",
  },
  {
    id: "1000055",
    nombres: "Matías Hernán",
    apellidos: "Peña López",
    rol: "Titular",
    nro_afiliado: "1000055",
  },
  {
    id: "1000056",
    nombres: "Carolina Beatriz",
    apellidos: "Reyes",
    rol: "Familiar",
    nro_afiliado: "1000056",
  },
  {
    id: "1000057",
    nombres: "Facundo Ariel",
    apellidos: "Cruz Fernández",
    rol: "Titular",
    nro_afiliado: "1000057",
  },
  {
    id: "1000058",
    nombres: "Agustina Celeste",
    apellidos: "Vega",
    rol: "Familiar",
    nro_afiliado: "1000058",
  },
  {
    id: "1000059",
    nombres: "Maximiliano José",
    apellidos: "Paredes Martínez",
    rol: "Titular",
    nro_afiliado: "1000059",
  },
  {
    id: "1000060",
    nombres: "Eliana Verónica",
    apellidos: "Campos Suárez",
    rol: "Familiar",
    nro_afiliado: "1000060",
  },
];

// Arrays para generar datos aleatorios
const ciudades = [
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "La Plata",
  "Tucumán",
  "Mar del Plata",
  "Salta",
  "Santa Fe",
  "San Juan",
];
const provincias = [
  "Buenos Aires",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Salta",
  "Entre Ríos",
  "Misiones",
  "Chaco",
  "San Juan",
];
const calles = [
  "Av. Corrientes",
  "San Martín",
  "Belgrano",
  "Rivadavia",
  "Mitre",
  "Sarmiento",
  "Alsina",
  "Moreno",
  "Urquiza",
  "Av. 9 de Julio",
];
const patologias = [
  "Hipertensión arterial",
  "Diabetes mellitus tipo 2",
  "Asma bronquial",
  "Artritis reumatoidea",
  "Gastritis crónica",
  "Migraña",
  "Osteoporosis",
  "Hipotiroidismo",
  "Colesterol alto",
  "Ansiedad generalizada",
  "Lumbalgia crónica",
  "Sinusitis crónica",
  "Dermatitis atópica",
  "Reflujo gastroesofágico",
  "Fibromialgia",
  "Ninguna",
];

// Nombres femeninos típicos para determinar género
const nombresFemeninos = [
  "Sol",
  "Magalí",
  "Laura",
  "Ana",
  "María",
  "Valeria",
  "Cecilia",
  "Lucía",
  "Patricia",
  "Marcela",
  "Verónica",
  "Silvia",
  "Daniela",
  "Juliana",
  "Mónica",
  "Adriana",
  "Claudia",
  "Florencia",
  "Tamara",
  "Rocío",
  "Natalia",
  "Marta",
  "Camila",
  "Julieta",
  "Paula",
  "Mariana",
  "Lorena",
  "Carolina",
  "Agustina",
  "Eliana",
];

// Función para determinar género basado en el nombre
function determinarGenero(nombres) {
  const primerNombre = nombres.split(" ")[0];
  return nombresFemeninos.includes(primerNombre) ? "Femenino" : "Masculino";
}

// Función para generar fecha de nacimiento aleatoria
function generarFechaNacimiento() {
  const year = Math.floor(Math.random() * (2005 - 1950) + 1950); // Entre 1950 y 2005
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1; // Para evitar problemas con febrero
  return new Date(year, month, day);
}

// Función para generar teléfono
function generarTelefono() {
  const codigo = Math.floor(Math.random() * 900) + 100; // 3 dígitos
  const numero = Math.floor(Math.random() * 9000000) + 1000000; // 7 dígitos
  return `+54 ${codigo} ${numero}`;
}

// Función para generar email
function generarEmail(nombres, apellidos, nroAfiliado) {
  const nombre = nombres.split(" ")[0].toLowerCase();
  const apellido = apellidos.split(" ")[0].toLowerCase();
  const dominios = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
  const dominio = dominios[Math.floor(Math.random() * dominios.length)];

  return `${nombre}.${apellido}.${nroAfiliado}@${dominio}`;
}

// Función para generar dirección
function generarDireccion() {
  const calle = calles[Math.floor(Math.random() * calles.length)];
  const numero = Math.floor(Math.random() * 9999) + 1;
  return `${calle} ${numero}`;
}

// Función principal para poblar la base de datos
async function poblarBaseDeDatos() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Conectado a MongoDB");

    // Limpiar colecciones existentes (opcional)
    console.log("Limpiando colecciones existentes...");
    await SocioModel.deleteMany({});
    await HistoriaClinicaModel.deleteMany({});

    console.log("Creando socios e historias clínicas...");

    for (const socioData of sociosData) {
      // Generar datos adicionales para el socio
      const socioCompleto = {
        nombres: socioData.nombres,
        apellidos: socioData.apellidos,
        nro_afiliado: socioData.nro_afiliado,
        rol: socioData.rol,
        genero: determinarGenero(socioData.nombres),
        fecha_nacimiento: generarFechaNacimiento(),
        telefono: generarTelefono(),
        email: generarEmail(socioData.nombres, socioData.apellidos, socioData.nro_afiliado),
        direccion: generarDireccion(),
        ciudad: ciudades[Math.floor(Math.random() * ciudades.length)],
        provincia: provincias[Math.floor(Math.random() * provincias.length)],
        estado: "Activo",
      };

      // Crear el socio
      const socio = await SocioModel.create(socioCompleto);
      console.log(`Socio creado: ${socio.nombres} ${socio.apellidos} (${socio.nro_afiliado})`);

      // Crear historia clínica para el socio
      const patologiaAleatoria = patologias[Math.floor(Math.random() * patologias.length)];
      const historiaClinica = await HistoriaClinicaModel.create({
        patologia: patologiaAleatoria === "Ninguna" ? "" : patologiaAleatoria,
        socio: socio._id,
      });

      // Actualizar el socio con la referencia a la historia clínica
      await SocioModel.findByIdAndUpdate(socio._id, {
        historia_clinica: historiaClinica._id,
      });

      console.log(
        `Historia clínica creada para ${socio.nombres} ${socio.apellidos} - Patología: ${patologiaAleatoria}`
      );
    }

    console.log(`\n✅ Proceso completado exitosamente!`);
    console.log(
      `📊 Se crearon ${sociosData.length} socios y ${sociosData.length} historias clínicas.`
    );
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
  } finally {
    // Cerrar la conexión
    await mongoose.connection.close();
    console.log("Conexión a MongoDB cerrada");
    process.exit(0);
  }
}

// Ejecutar el script
poblarBaseDeDatos();
