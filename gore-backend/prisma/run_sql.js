const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sql1 = `
  ALTER TABLE educacion_gore.instituciones_educativas 
  ADD COLUMN IF NOT EXISTS dre VARCHAR(50),
  ADD COLUMN IF NOT EXISTS ugel VARCHAR(50),
  ADD COLUMN IF NOT EXISTS gestion VARCHAR(100),
  ADD COLUMN IF NOT EXISTS centro_poblado VARCHAR(100);
`;

const sql2 = `
  UPDATE educacion_gore.instituciones_educativas 
  SET 
    dre = COALESCE(dre, 'LAMBAYEQUE'),
    ugel = COALESCE(ugel, 'CHICLAYO'),
    gestion = COALESCE(gestion, 'Pública de gestión directa'),
    centro_poblado = COALESCE(centro_poblado, '')
  WHERE dre IS NULL OR ugel IS NULL OR gestion IS NULL OR centro_poblado IS NULL;
`;

const sql3 = `
  ALTER TABLE educacion_gore.equipamiento
  ADD COLUMN IF NOT EXISTS estado_infra INT,
  ADD COLUMN IF NOT EXISTS aulas_buenas INT;
`;

const sql5 = `
  ALTER TABLE educacion_gore.recursos_humanos
  ADD COLUMN IF NOT EXISTS docentes_nombrados INT,
  ADD COLUMN IF NOT EXISTS total_matricula INT,
  ADD COLUMN IF NOT EXISTS tiene_psicologo BOOLEAN;
`;

prisma.$executeRawUnsafe(sql1)
  .then(() => {
    console.log('Columnas agregadas correctamente');
    return prisma.$executeRawUnsafe(sql2);
  })
  .then(() => console.log('Datos actualizados correctamente'))
  .then(() => prisma.$executeRawUnsafe(sql3))
  .then(() => console.log('Columnas de equipamiento agregadas correctamente'))
  .then(() => prisma.$executeRawUnsafe(sql5))
  .then(() => console.log('Columnas de recursos_humanos agregadas correctamente'))
  .then(() => console.log('SQL ejecutado correctamente'))
  .catch(err => console.error('Error:', err))
  .finally(() => prisma.$disconnect());
