-- Enable Row Level Security for featured_products_order table
ALTER TABLE featured_products_order ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to update their own featured product orders
-- For simplicity, we'll allow any authenticated user to update any order for now.
-- In a real application, you might want to restrict this further (e.g., only admins).
CREATE POLICY "Allow authenticated users to update featured product order" ON featured_products_order
FOR UPDATE TO authenticated
USING (true);

-- Optionally, if you want authenticated users to be able to read this table (which they already can via the join in ProductGrid)
CREATE POLICY "Allow authenticated users to read featured product order" ON featured_products_order
FOR SELECT TO authenticated
USING (true);

-- If you want authenticated users to be able to insert into this table (when a product is marked as featured)
CREATE POLICY "Allow authenticated users to insert featured product order" ON featured_products_order
FOR INSERT TO authenticated
WITH CHECK (true);

-- If you want authenticated users to be able to delete from this table (when a product is un-featured)
CREATE POLICY "Allow authenticated users to delete featured product order" ON featured_products_order
FOR DELETE TO authenticated
USING (true);
