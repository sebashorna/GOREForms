-- Agregar columnas faltantes a la tabla equipamiento
ALTER TABLE educacion_gore.equipamiento
ADD COLUMN IF NOT EXISTS estado_infra INT,
ADD COLUMN IF NOT EXISTS aulas_buenas INT;

-- Agregar columnas faltantes a la tabla recursos_humanos
-- Nota: docentes_contratados se mapea a docentes_asignados (ya existe)
ALTER TABLE educacion_gore.recursos_humanos
ADD COLUMN IF NOT EXISTS docentes_nombrados INT,
ADD COLUMN IF NOT EXISTS total_matricula INT,
ADD COLUMN IF NOT EXISTS tiene_psicologo BOOLEAN;
