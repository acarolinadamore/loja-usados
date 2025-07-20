-- Criar bucket para imagens dos produtos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Política para permitir upload de imagens
CREATE POLICY "Permitir upload de imagens" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Política para permitir visualização pública das imagens
CREATE POLICY "Permitir visualização pública" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Adicionar coluna para múltiplas imagens na tabela products
ALTER TABLE products ADD COLUMN images TEXT[];

-- Atualizar produtos existentes para usar array de imagens
UPDATE products SET images = ARRAY[image_url] WHERE image_url IS NOT NULL;
