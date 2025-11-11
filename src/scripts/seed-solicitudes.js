const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

// Importar modelos
const Socio = require("../models/socio"); // Asegúrate de que esta ruta sea correcta
const Solicitud = require("../models/filtroSolicitudes"); // Asegúrate de que esta ruta sea correcta
// const Sede = require("../models/sede"); // ¡IMPORTACIÓN ELIMINADA!

const tipos = ['Reintegro', 'Autorizacion', 'Receta'];
const estados = ['Recibido', 'Observado', 'Aprobado', 'Rechazado'];

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, useUnifiedTopology: true,
        });

        console.log("✅ Conectado a Mongo para seed de solicitudes");

        // Limpieza inicial
        await Solicitud.deleteMany({});
        console.log("🧹 Colección de solicitudes limpia");

        // --- PASO 1: OBTENER DATOS DE REFERENCIA ---

        // Obtener socios
        const socios = await Socio.find({}).lean();

        if (!socios.length){
            console.log("⚠️ No hay socios en la base de datos. Finalizando seed.");
            process.exit(0);
        }

        // La lógica para obtener y verificar sedes ha sido ELIMINADA.
        
        console.log(`📊 Encontrados ${socios.length} socios.`);

        // --- PASO 2: GENERAR SOLICITUDES SIN ASIGNACIÓN DE SEDE ---

        const docs = [];

        for (const s of socios) {
            const cantidad = Math.floor(Math.random() * 3) + 1; // 1 a 3 solicitudes por socio
            for (let i = 0; i < cantidad; i++) {
                
                // La asignación de sede aleatoria ha sido ELIMINADA.
                
                docs.push({
                    nro: `${s.dni}-${i + 1}`,
                    afiliadoNombre: `${s.nombres} ${s.apellidos}`,
                    afiliadoId: s._id,
                    tipo: randomFrom(tipos),
                    estado: randomFrom(estados),
                    // campo 'sede' ELIMINADO de la solicitud
                    fechaCreacion: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)),
                });
            }
        }

        // --- PASO 3: INSERCIÓN FINAL ---
        await Solicitud.insertMany(docs);
        console.log(`✅ Insertadas ${docs.length} solicitudes de ejemplo.`);

    } catch (err) {
        console.error("❌ Error en el seed de solicitudes:", err);
        process.exit(1);
    } finally {
            await mongoose.connection.close();
            console.log("🔌 Conexión a MongoDB cerrada");
            process.exit(0);
    }
}

seed();