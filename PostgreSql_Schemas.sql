-- User detail table (shipping address, account info, preferences)
CREATE TABLE user_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    street TEXT,
    city TEXT,
    state TEXT,
    zipcode TEXT,
    country TEXT,
    account_status TEXT CHECK (account_status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    language TEXT DEFAULT 'en',
    theme TEXT CHECK (theme IN ('light', 'dark')) DEFAULT 'light',
    account_created TIMESTAMP DEFAULT now(),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


SELECT * FROM user_details
SELECT * FROM users

CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verify_otp TEXT,
    otp_expire_at BIGINT DEFAULT 0,
	phone INT UNIQUE,
	username TEXT UNIQUE NOT NULL,
    is_acc_verified BOOLEAN DEFAULT false,
    reset_otp TEXT ,
    reset_otp_expire_at BIGINT DEFAULT 0,
    avatar TEXT,
    role TEXT CHECK (role IN ('USER','SELLER','ADMIN')) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE Users
ALTER COLUMN phone TYPE BIGINT;



-- Order history (many orders per user)
CREATE TABLE user_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now()
);

-- Wishlist (many products per user)
CREATE TABLE user_wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    shipping_address_id UUID REFERENCES user_details(id),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

SELECT * FROM products
SELECT * FROM user_wishlist
SELECT * FROM users

TRUNCATE TABLE products RESTART IDENTITY CASCADE;


ALTER TABLE products
ADD COLUMN images TEXT[];


INSERT INTO products (seller_id, name, description, price, stock, category, images)
VALUES
('d339b8ae-ad85-4ebb-a1c5-f34eee6d49c5', 'iPhone 15', 'Latest Apple smartphone', 999.99, 10, 'Electronics', ARRAY['/uploads/iphone1.png','/uploads/iphone2.png']),
('d339b8ae-ad85-4ebb-a1c5-f34eee6d49c5', 'Nike Air Max', 'Comfortable running shoes', 129.50, 25, 'Shoes', ARRAY['/uploads/nike1.png','/uploads/nike2.png']),
('d339b8ae-ad85-4ebb-a1c5-f34eee6d49c5', 'Gaming Laptop', 'High performance gaming laptop', 1799.00, 5, 'Computers', ARRAY['/uploads/laptop1.png','/uploads/laptop2.png']),
('d339b8ae-ad85-4ebb-a1c5-f34eee6d49c5', 'Smart Watch', 'Waterproof fitness smartwatch', 199.99, 30, 'Accessories', ARRAY['/uploads/watch1.png','/uploads/watch2.png']),
('d339b8ae-ad85-4ebb-a1c5-f34eee6d49c5', 'Office Chair', 'Ergonomic office chair', 249.00, 15, 'Furniture', ARRAY['/uploads/chair1.png','/uploads/chair2.png']);

INSERT INTO Users (id, name, email, password, phone, username, role, avatar)
VALUES
(gen_random_uuid(), 'Alice User', 'alice.user@example.com', 'hashed_password2', 2345678901, 'aliceuser', 'USER', '/avatars/alice.png'),
(gen_random_uuid(), 'Bob User', 'bob.user@example.com', 'hashed_password3', 3456789012, 'bobuser', 'USER', '/avatars/bob.png'),
(gen_random_uuid(), 'Charlie User', 'charlie.user@example.com', 'hashed_password4', 4567890123, 'charlieuser', 'USER', '/avatars/charlie.png'),
(gen_random_uuid(), 'Admin', 'admin@example.com', 'hashed_password5', 5678901234, 'admin', 'ADMIN', '/avatars/admin.png');

INSERT INTO orders (buyer_id, product_id, quantity, total_price, shipping_address_id)
VALUES
('89367ac9-e7c8-4343-b5c4-c0f32363ebfd', 'product-uuid-1', 1, 999.99, 'address-uuid-1'),
('c498e5ed-c4fd-4704-b5e9-abcf74f04aee', 'product-uuid-2', 2, 259.00, 'address-uuid-2'),
('d69c83af-2af3-4e8e-8ea7-2101f7eaf8e4', 'product-uuid-3', 1, 1799.00, 'address-uuid-3'),
('89367ac9-e7c8-4343-b5c4-c0f32363ebfd', 'product-uuid-4', 1, 199.99, 'address-uuid-1'),
('c498e5ed-c4fd-4704-b5e9-abcf74f04aee', 'product-uuid-5', 1, 249.00, 'address-uuid-2');

INSERT INTO user_details (user_id, street, city, state, zipcode, country)
VALUES
('d339b8ae-ad85-4ebb-a1c5-f34eee6d49c5', '123 Seller St', 'Addis Ababa', 'Addis', '1000', 'Ethiopia'),
('89367ac9-e7c8-4343-b5c4-c0f32363ebfd', '456 Main St', 'Addis Ababa', 'Addis', '1001', 'Ethiopia'),
('c498e5ed-c4fd-4704-b5e9-abcf74f04aee', '789 Market St', 'Addis Ababa', 'Addis', '1002', 'Ethiopia'),
('d69c83af-2af3-4e8e-8ea7-2101f7eaf8e4', '321 Side St', 'Addis Ababa', 'Addis', '1003', 'Ethiopia'),
('1332b425-064e-4e57-9d55-7f02b541487b', '654 High St', 'Addis Ababa', 'Addis', '1004', 'Ethiopia');

INSERT INTO orders (buyer_id, product_id, quantity, total_price, shipping_address_id)
VALUES
('89367ac9-e7c8-4343-b5c4-c0f32363ebfd', (SELECT id FROM products WHERE name='iPhone 15' LIMIT 1), 1, 999.99, '34481abe-f637-4996-a425-6e2245b5d93a'),
('c498e5ed-c4fd-4704-b5e9-abcf74f04aee', (SELECT id FROM products WHERE name='Nike Air Max' LIMIT 1), 2, 259.00, '87d1319d-b4bf-4f76-a80f-286a2580d854'),
('d69c83af-2af3-4e8e-8ea7-2101f7eaf8e4', (SELECT id FROM products WHERE name='Gaming Laptop' LIMIT 1), 1, 1799.00, '86b396a5-f1a1-45cc-a71a-0d36cec10fda'),
('89367ac9-e7c8-4343-b5c4-c0f32363ebfd', (SELECT id FROM products WHERE name='Smart Watch' LIMIT 1), 1, 199.99, '34481abe-f637-4996-a425-6e2245b5d93a'),
('c498e5ed-c4fd-4704-b5e9-abcf74f04aee', (SELECT id FROM products WHERE name='Office Chair' LIMIT 1), 1, 249.00, '87d1319d-b4bf-4f76-a80f-286a2580d854');


INSERT INTO user_wishlist (user_id, product_id)
VALUES
('89367ac9-e7c8-4343-b5c4-c0f32363ebfd', (SELECT id FROM products WHERE name='iPhone 15' LIMIT 1)),
('89367ac9-e7c8-4343-b5c4-c0f32363ebfd', (SELECT id FROM products WHERE name='Smart Watch' LIMIT 1)),
('c498e5ed-c4fd-4704-b5e9-abcf74f04aee', (SELECT id FROM products WHERE name='Nike Air Max' LIMIT 1)),
('c498e5ed-c4fd-4704-b5e9-abcf74f04aee', (SELECT id FROM products WHERE name='Office Chair' LIMIT 1)),
('d69c83af-2af3-4e8e-8ea7-2101f7eaf8e4', (SELECT id FROM products WHERE name='Gaming Laptop' LIMIT 1));


SELECT * FROM orders,products, users, user_wishlist,user_details