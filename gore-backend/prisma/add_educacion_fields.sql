-- Agregar columnas faltantes a instituciones_educativas
ALTER TABLE educacion_gore.instituciones_educativas 
ADD COLUMN IF NOT EXISTS dre VARCHAR(50),
ADD COLUMN IF NOT EXISTS ugel VARCHAR(50),
ADD COLUMN IF NOT EXISTS gestion VARCHAR(100),
ADD COLUMN IF NOT EXISTS centro_poblado VARCHAR(100);

-- Actualizar registros existentes con valores por defecto
UPDATE educacion_gore.instituciones_educativas 
SET 
  dre = COALESCE(dre, 'LAMBAYEQUE'),
  ugel = COALESCE(ugel, 'CHICLAYO'),
  gestion = COALESCE(gestion, 'Pública de gestión directa'),
  centro_poblado = COALESCE(centro_poblado, '')
WHERE dre IS NULL OR ugel IS NULL OR gestion IS NULL OR centro_poblado IS NULL;