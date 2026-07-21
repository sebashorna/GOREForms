import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const usuarios = [
    {
        usuario: "admin",
        correo: "admin@gore.gob.pe",
        password: "admin123",
        rol: "ADMIN"
    },
    {
        usuario: "salud",
        correo: "salud@gore.gob.pe",
        password: "salud123",
        rol: "SALUD"
    },
    {
        usuario: "educacion",
        correo: "educacion@gore.gob.pe",
        password: "educacion123",
        rol: "EDUCACION"
    },
    {
        usuario: "historial",
        correo: "historial@gore.gob.pe",
        password: "historial123",
        rol: "HISTORIAL"
    }
];

async function main() {
    console.log("🌱 Iniciando seed de usuarios...");

    for (const u of usuarios) {
        const password_hash = await bcrypt.hash(u.password, 10);

        const existente = await prisma.usuarios.findUnique({
            where: { usuario: u.usuario }
        });

        if (existente) {
            console.log(`   ↻ Usuario '${u.usuario}' ya existe, saltando...`);
            continue;
        }

        await prisma.usuarios.create({
            data: {
                usuario: u.usuario,
                correo: u.correo,
                password_hash,
                rol: u.rol,
                estado: true,
                intentos_fallidos: 0
            }
        });

        console.log(`   ✓ Usuario '${u.usuario}' creado (rol: ${u.rol})`);
    }

    console.log("✅ Seed completado exitosamente");
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });