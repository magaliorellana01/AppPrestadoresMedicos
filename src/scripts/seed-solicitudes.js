const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Socio = require("../models/socio");
const Solicitud = require("../models/filtroSolicitudes");

const tipos = ['Reintegro', 'Autorizacion', 'Receta'];
const estados = ['Recibido', 'EnAnalisis', 'Observado', 'Aprobado', 'Rechazado'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true,
  });


console.log("Conectado a Mongo para seed de solicitudes");

await Solicitud.deleteMany({});
console.log("Coleccion de solicitudes limpia");

const socios = await Socio.find({}).lean();

if (!socios.length){
    console.log("No hay socios en la base de datos")
    process.exit(1);
}

const docs = [];

for (const s of socios) {
    const cantidad = Math.floor(Math.random() * 3) + 1; 
    for (let i = 0; i < cantidad; i++) {
      docs.push({
        nro: `SOL-${s.dni}-${i + 1}`,
        afiliadoNombre: `${s.nombres} ${s.apellidos}`,
        afiliadoId: s._id,
        tipo: randomFrom(tipos),
        estado: randomFrom(estados),
        fechaCreacion: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)),
      });
    }
  }

  await Solicitud.insertMany(docs);
  console.log(`Insertadas ${docs.length} solicitudes de ejemplo.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

