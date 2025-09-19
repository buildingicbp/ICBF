-- Create digital products table
CREATE TABLE IF NOT EXISTS digital_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    download_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for tracking purchases
CREATE TABLE IF NOT EXISTS product_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES digital_products(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Create download logs table
CREATE TABLE IF NOT EXISTS download_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES product_orders(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Insert the PDF product
INSERT INTO digital_products (title, description, price, file_path, file_name, download_password)
VALUES (
    'Ad Analyzer Guide',
    'Comprehensive guide for analyzing and optimizing advertisements. Perfect for marketers, business owners, and advertising professionals.',
    29.99,
    '/ad_analyzer.pdf',
    'ad_analyzer.pdf',
    'ICBF2024ADAnalyzer!'
);

-- Enable RLS (Row Level Security)
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for digital_products (public read for active products)
CREATE POLICY "Public can view active products" ON digital_products
    FOR SELECT USING (is_active = true);

-- Create policies for product_orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON product_orders
    FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert their own orders" ON product_orders
    FOR INSERT WITH CHECK (customer_email = auth.jwt() ->> 'email');

-- Create policies for download_logs (users can only see their own download logs)
CREATE POLICY "Users can view their own download logs" ON download_logs
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM product_orders 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "System can insert download logs" ON download_logs
    FOR INSERT WITH CHECK (true);
