-- Criar tabela de categorias
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image_url TEXT,
  whatsapp VARCHAR(20),
  status VARCHAR(20) DEFAULT 'Disponível',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categories (name) VALUES 
  ('Livros'),
  ('Brinquedos'),
  ('Calçados'),
  ('Roupas'),
  ('Eletrônicos'),
  ('Casa e Decoração'),
  ('Esportes');

-- Inserir alguns produtos de exemplo
INSERT INTO products (name, description, price, condition, category_id, whatsapp, status) VALUES 
  ('Livro: O Alquimista', 'Livro em ótimo estado, páginas sem rabiscos', 15.00, 'Muito Bom', 1, '11999999999', 'Disponível'),
  ('Tênis Nike Air Max', 'Tênis usado poucas vezes, tamanho 40', 120.00, 'Bom', 3, '11999999999', 'Disponível'),
  ('Boneca Barbie Vintage', 'Boneca dos anos 90, colecionável', 45.00, 'Muito Bom', 2, '11999999999', 'Disponível'),
  ('Camiseta Polo Ralph Lauren', 'Camiseta original, tamanho M', 35.00, 'Bom', 4, '11999999999', 'Disponível');
