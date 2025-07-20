-- Adicionar colunas para múltiplas imagens
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS cover_image_index INTEGER DEFAULT 0;

-- Migrar imagens existentes para o novo formato
UPDATE products 
SET 
  images = CASE 
    WHEN image_url IS NOT NULL THEN ARRAY[image_url]
    ELSE ARRAY[]::TEXT[]
  END,
  cover_image_index = 0
WHERE images IS NULL;
