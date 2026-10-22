-- ============================================================================
-- Pagila Database Schema (PostgreSQL 16)
-- DVD-Rental Business Model
-- ============================================================================

-- Extensions & Enums
CREATE TYPE mpaa_rating AS ENUM ('G', 'PG', 'PG-13', 'R', 'NC-17');

-- ----------------------------------------------------------------------------
-- Table: actor
-- ----------------------------------------------------------------------------
CREATE TABLE actor (
    actor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_actor_last_name ON actor(last_name);

-- ----------------------------------------------------------------------------
-- Table: category
-- ----------------------------------------------------------------------------
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- Table: country
-- ----------------------------------------------------------------------------
CREATE TABLE country (
    country_id SERIAL PRIMARY KEY,
    country VARCHAR(50) NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- Table: city
-- ----------------------------------------------------------------------------
CREATE TABLE city (
    city_id SERIAL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    country_id SMALLINT NOT NULL REFERENCES country(country_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_fk_country_id ON city(country_id);

-- ----------------------------------------------------------------------------
-- Table: address
-- ----------------------------------------------------------------------------
CREATE TABLE address (
    address_id SERIAL PRIMARY KEY,
    address VARCHAR(50) NOT NULL,
    address2 VARCHAR(50),
    district VARCHAR(20) NOT NULL,
    city_id SMALLINT NOT NULL REFERENCES city(city_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    postal_code VARCHAR(10),
    phone VARCHAR(20) NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_fk_city_id ON address(city_id);

-- ----------------------------------------------------------------------------
-- Table: language
-- ----------------------------------------------------------------------------
CREATE TABLE language (
    language_id SERIAL PRIMARY KEY,
    name CHAR(20) NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- Table: film
-- ----------------------------------------------------------------------------
CREATE TABLE film (
    film_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INTEGER,
    language_id SMALLINT NOT NULL REFERENCES language(language_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    original_language_id SMALLINT REFERENCES language(language_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    rental_duration SMALLINT DEFAULT 3 NOT NULL,
    rental_rate NUMERIC(4,2) DEFAULT 4.99 NOT NULL,
    length SMALLINT,
    replacement_cost NUMERIC(5,2) DEFAULT 19.99 NOT NULL,
    rating mpaa_rating DEFAULT 'G',
    special_features TEXT[],
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_title ON film(title);
CREATE INDEX idx_fk_language_id ON film(language_id);
CREATE INDEX idx_fk_original_language_id ON film(original_language_id);

-- ----------------------------------------------------------------------------
-- Table: film_actor
-- ----------------------------------------------------------------------------
CREATE TABLE film_actor (
    actor_id SMALLINT NOT NULL REFERENCES actor(actor_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    film_id SMALLINT NOT NULL REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (actor_id, film_id)
);
CREATE INDEX idx_fk_film_id ON film_actor(film_id);

-- ----------------------------------------------------------------------------
-- Table: film_category
-- ----------------------------------------------------------------------------
CREATE TABLE film_category (
    film_id SMALLINT NOT NULL REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    category_id SMALLINT NOT NULL REFERENCES category(category_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (film_id, category_id)
);

-- ----------------------------------------------------------------------------
-- Table: store
-- ----------------------------------------------------------------------------
CREATE TABLE store (
    store_id SERIAL PRIMARY KEY,
    manager_staff_id SMALLINT,
    address_id SMALLINT NOT NULL REFERENCES address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_unq_manager_staff_id ON store(manager_staff_id);

-- ----------------------------------------------------------------------------
-- Table: staff
-- ----------------------------------------------------------------------------
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    address_id SMALLINT NOT NULL REFERENCES address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    email VARCHAR(50),
    store_id SMALLINT NOT NULL REFERENCES store(store_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(40),
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Circular FK reference for store manager
ALTER TABLE store ADD CONSTRAINT fk_store_staff FOREIGN KEY (manager_staff_id) REFERENCES staff(staff_id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- ----------------------------------------------------------------------------
-- Table: customer
-- ----------------------------------------------------------------------------
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    store_id SMALLINT NOT NULL REFERENCES store(store_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(50),
    address_id SMALLINT NOT NULL REFERENCES address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    activebool BOOLEAN DEFAULT TRUE NOT NULL,
    create_date DATE DEFAULT CURRENT_DATE NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    active INTEGER DEFAULT 1
);
CREATE INDEX idx_fk_store_id ON customer(store_id);
CREATE INDEX idx_fk_address_id ON customer(address_id);
CREATE INDEX idx_last_name ON customer(last_name);

-- ----------------------------------------------------------------------------
-- Table: inventory
-- ----------------------------------------------------------------------------
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    film_id SMALLINT NOT NULL REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    store_id SMALLINT NOT NULL REFERENCES store(store_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_store_id_film_id ON inventory(store_id, film_id);

-- ----------------------------------------------------------------------------
-- Table: rental
-- ----------------------------------------------------------------------------
CREATE TABLE rental (
    rental_id SERIAL PRIMARY KEY,
    rental_date TIMESTAMP WITH TIME ZONE NOT NULL,
    inventory_id INTEGER NOT NULL REFERENCES inventory(inventory_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    customer_id SMALLINT NOT NULL REFERENCES customer(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    return_date TIMESTAMP WITH TIME ZONE,
    staff_id SMALLINT NOT NULL REFERENCES staff(staff_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_fk_inventory_id ON rental(inventory_id);
CREATE INDEX idx_fk_customer_id ON rental(customer_id);
CREATE INDEX idx_fk_staff_id ON rental(staff_id);

-- ----------------------------------------------------------------------------
-- Table: payment
-- ----------------------------------------------------------------------------
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    customer_id SMALLINT NOT NULL REFERENCES customer(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    staff_id SMALLINT NOT NULL REFERENCES staff(staff_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    rental_id INTEGER REFERENCES rental(rental_id) ON UPDATE CASCADE ON DELETE SET NULL,
    amount NUMERIC(5,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_fk_payment_customer_id ON payment(customer_id);
CREATE INDEX idx_fk_payment_staff_id ON payment(staff_id);
CREATE INDEX idx_fk_payment_rental_id ON payment(rental_id);
