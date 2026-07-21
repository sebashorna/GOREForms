-- SQL para actualizar la tabla historial
-- Ejecutar este script en la base de datos PostgreSQL

-- 1. Agregar la nueva columna nombre_referencia (si no existe)
ALTER TABLE public.historial 
ADD COLUMN IF NOT EXISTS referencia VARCHAR(200);

-- 2. Eliminar las foreign keys existentes
ALTER TABLE public.historial 
DROP CONSTRAINT IF EXISTS fk_cod_modular;

ALTER TABLE public.historial 
DROP CONSTRAINT IF EXISTS fk_historial_establecimientos;

-- 3. Eliminar las columnas FK que ya no necesitamos
ALTER TABLE public.historial 
DROP COLUMN IF EXISTS id_renaes,
DROP COLUMN IF EXISTS cod_modular;

-- 4. Hacer id_usuario nullable (si no lo es)
ALTER TABLE public.historial 
ALTER COLUMN id_usuario DROP NOT NULL;

-- 5. Verificar la estructura final
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'historial'
ORDER BY ordinal_position;