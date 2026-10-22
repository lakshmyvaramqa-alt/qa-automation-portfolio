-- ============================================================================
-- Pagila Realistic Seed Dataset
-- Clean baseline data for validation and reporting
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Countries
-- ----------------------------------------------------------------------------
INSERT INTO country (country_id, country) VALUES
(1, 'United States'),
(2, 'Canada'),
(3, 'United Kingdom'),
(4, 'Australia'),
(5, 'Germany'),
(6, 'France'),
(7, 'Japan');
SELECT setval('country_country_id_seq', 7);

-- ----------------------------------------------------------------------------
-- Cities
-- ----------------------------------------------------------------------------
INSERT INTO city (city_id, city, country_id) VALUES
(1, 'New York', 1),
(2, 'Los Angeles', 1),
(3, 'Toronto', 2),
(4, 'London', 3),
(5, 'Sydney', 4),
(6, 'Berlin', 5),
(7, 'Paris', 6),
(8, 'Tokyo', 7);
SELECT setval('city_city_id_seq', 8);

-- ----------------------------------------------------------------------------
-- Addresses
-- ----------------------------------------------------------------------------
INSERT INTO address (address_id, address, district, city_id, postal_code, phone) VALUES
(1, '47 MySakila Drive', 'Alberta', 1, '10001', '14033335568'),
(2, '28 MySQL Boulevard', 'QLD', 2, '90001', '6172235589'),
(3, '23 Workhaven Lane', 'Alberta', 1, '10002', '14033335569'),
(4, '1411 Lillydale Drive', 'QLD', 2, '90002', '6172235590'),
(5, '1913 Hanoi Way', 'England', 4, 'SW1A1', '44123456789'),
(6, '1121 Loja Avenue', 'California', 2, '90210', '13105551234'),
(7, '692 Joliet Street', 'Attika', 1, '10003', '12125559876'),
(8, '1566 Inegl Manor', 'Ontario', 3, 'M5V2T6', '14165554321'),
(9, '53 Idlib Boulevard', 'Berlin', 6, '10115', '49301234567'),
(10, '1697 Tan-Tan Terrace', 'Ile-de-France', 7, '75001', '33142685555'),
(11, '368 Hinnawa Way', 'Tokyo', 8, '100-0001', '81355551234'),
(12, '1497 Yuzhou Drive', 'California', 2, '94102', '14155558888');
SELECT setval('address_address_id_seq', 12);

-- ----------------------------------------------------------------------------
-- Stores & Staff
-- ----------------------------------------------------------------------------
-- Insert stores first without manager_staff_id to avoid circular constraint
INSERT INTO store (store_id, address_id) VALUES
(1, 1),
(2, 2);
SELECT setval('store_store_id_seq', 2);

INSERT INTO staff (staff_id, first_name, last_name, address_id, email, store_id, active, username, password) VALUES
(1, 'Mike', 'Hillyer', 3, 'Mike.Hillyer@sakilastaff.com', 1, TRUE, 'Mike', '8cb2237d0679ca88db6464eac60da96345513964'),
(2, 'Jon', 'Stephens', 4, 'Jon.Stephens@sakilastaff.com', 2, TRUE, 'Jon', '8cb2237d0679ca88db6464eac60da96345513964');
SELECT setval('staff_staff_id_seq', 2);

-- Set manager_staff_id on stores
UPDATE store SET manager_staff_id = 1 WHERE store_id = 1;
UPDATE store SET manager_staff_id = 2 WHERE store_id = 2;

-- ----------------------------------------------------------------------------
-- Languages
-- ----------------------------------------------------------------------------
INSERT INTO language (language_id, name) VALUES
(1, 'English             '),
(2, 'Italian             '),
(3, 'Japanese            '),
(4, 'Mandarin            '),
(5, 'French              '),
(6, 'German              ');
SELECT setval('language_language_id_seq', 6);

-- ----------------------------------------------------------------------------
-- Categories
-- ----------------------------------------------------------------------------
INSERT INTO category (category_id, name) VALUES
(1, 'Action'),
(2, 'Animation'),
(3, 'Children'),
(4, 'Classics'),
(5, 'Comedy'),
(6, 'Documentary'),
(7, 'Drama'),
(8, 'Family'),
(9, 'Foreign'),
(10, 'Games'),
(11, 'Horror'),
(12, 'Music'),
(13, 'New'),
(14, 'Sci-Fi'),
(15, 'Sports'),
(16, 'Travel');
SELECT setval('category_category_id_seq', 16);

-- ----------------------------------------------------------------------------
-- Actors
-- ----------------------------------------------------------------------------
INSERT INTO actor (actor_id, first_name, last_name) VALUES
(1, 'PENELOPE', 'GUINESS'),
(2, 'NICK', 'WAHLBERG'),
(3, 'ED', 'CHASE'),
(4, 'JENNIFER', 'DAVIS'),
(5, 'JOHNNY', 'LOLLOBRIGIDA'),
(6, 'BETTE', 'NICHOLSON'),
(7, 'GRACE', 'MOSTEL'),
(8, 'MATTHEW', 'JOHANSSON'),
(9, 'JOE', 'SWANK'),
(10, 'CHRISTIAN', 'GABLE');
SELECT setval('actor_actor_id_seq', 10);

-- ----------------------------------------------------------------------------
-- Films
-- ----------------------------------------------------------------------------
INSERT INTO film (film_id, title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features) VALUES
(1, 'ACADEMY DINOSAUR', 'An Epic Drama of a Feminist And a Mad Scientist who must Battle a Teacher in The Canadian Rockies', 2006, 1, 6, 0.99, 86, 20.99, 'PG', ARRAY['Deleted Scenes', 'Behind the Scenes']),
(2, 'ACE GOLDFINGER', 'A Astounding Epistle of a Database Administrator And a Explorer who must Find a Car in Ancient China', 2006, 1, 3, 4.99, 48, 12.99, 'G', ARRAY['Trailers', 'Deleted Scenes']),
(3, 'ADAPTATION HOLES', 'A Astounding Reflection of a Lumberjack And a Car who must Sink a Lumberjack in A Baloon', 2006, 1, 7, 2.99, 50, 18.99, 'NC-17', ARRAY['Trailers', 'Commentaries']),
(4, 'AFFAIR PREJUDICE', 'A Fanciful Documentary of a Frisbee And a Lumberjack who must Chase a Monkey in A Shark Tank', 2006, 1, 5, 2.99, 117, 26.99, 'G', ARRAY['Commentaries', 'Behind the Scenes']),
(5, 'AFRICAN EGG', 'A Fast-Paced Documentary of a Pastry Chef And a Dentist who must Pursue a Forensic Psychologist in The Gulf of Mexico', 2006, 1, 6, 2.99, 130, 22.99, 'G', ARRAY['Deleted Scenes']),
(6, 'AGENT TRUMAN', 'A Intrepid Panorama of a Robot And a Boy who must Escape a Sumo Wrestler in Ancient Japan', 2006, 1, 3, 4.99, 169, 17.99, 'PG', ARRAY['Trailers', 'Behind the Scenes']),
(7, 'AIRPLANE SIERRA', 'A Touching Saga of a Hunter And a Butler who must Discover a Butler in A Jet Boat', 2006, 1, 6, 4.99, 62, 28.99, 'PG-13', ARRAY['Trailers', 'Deleted Scenes']),
(8, 'AIRPORT POLLOCK', 'A Epic Tale of a Moose And a Girl who must Confront a Monkey in Ancient India', 2006, 1, 6, 4.99, 54, 15.99, 'R', ARRAY['Trailers']),
(9, 'ALABAMA DEVIL', 'A Thoughtful Panorama of a Database Administrator And a Mad Scientist who must Outgun a Mad Scientist in A Jet Boat', 2006, 1, 3, 2.99, 114, 21.99, 'PG-13', ARRAY['Behind the Scenes']),
(10, 'ALADDIN CALENDAR', 'A Action-Packed Tale of a Man And a Lumberjack who must Reach a Astronaut in A Shark Tank', 2006, 1, 6, 4.99, 63, 24.99, 'NC-17', ARRAY['Trailers', 'Deleted Scenes']),
(11, 'ALAMO VIDEOTAPE', 'A Boring Epistle of a Butler And a Cat who must Fight a Pastry Chef in A MySQL Convention', 2006, 1, 6, 0.99, 126, 16.99, 'G', ARRAY['Commentaries', 'Behind the Scenes']),
(12, 'ALASKA PHANTOM', 'A Fanciful Saga of a Hunter And a Pastry Chef who must Vanquish a Boy in A Baloon', 2006, 1, 6, 0.99, 136, 22.99, 'PG', ARRAY['Commentaries', 'Deleted Scenes']),
(13, 'ALI FOREVER', 'A Action-Packed Drama of a Dentist And a Crocodile who must Battle a Database Administrator in The Canadian Rockies', 2006, 1, 4, 4.99, 150, 21.99, 'PG', ARRAY['Deleted Scenes', 'Behind the Scenes']),
(14, 'ALICE FANTASIA', 'A Emotional Drama of a A Shark And a Database Administrator who must Vanquish a Pioneer in A Baloon', 2006, 1, 6, 0.99, 94, 23.99, 'NC-17', ARRAY['Trailers', 'Deleted Scenes']),
(15, 'ALIEN CENTER', 'A Brilliant Drama of a Cat And a Mad Scientist who must Battle a Feminist in A MySQL Convention', 2006, 1, 5, 2.99, 46, 10.99, 'NC-17', ARRAY['Trailers', 'Commentaries']),
-- Films intentionally never rented (for business report 04 validation)
(16, 'UNRENTED PHANTOM', 'A Mystery of a film that was ordered into inventory but never checked out by any customer', 2006, 1, 5, 4.99, 100, 19.99, 'PG', ARRAY['Trailers']),
(17, 'SHELF WARMER', 'A Drama of a film that sits on the store shelf perpetually without rentals', 2006, 1, 4, 0.99, 110, 14.99, 'G', ARRAY['Behind the Scenes']);
SELECT setval('film_film_id_seq', 17);

-- ----------------------------------------------------------------------------
-- Film Categories & Actors
-- ----------------------------------------------------------------------------
INSERT INTO film_category (film_id, category_id) VALUES
(1, 6), (2, 11), (3, 6), (4, 1), (5, 8),
(6, 9), (7, 5), (8, 11), (9, 11), (10, 15),
(11, 9), (12, 12), (13, 1), (14, 4), (15, 14),
(16, 7), (17, 5);

INSERT INTO film_actor (actor_id, film_id) VALUES
(1, 1), (2, 1), (3, 2), (4, 3), (5, 4),
(6, 5), (7, 6), (8, 7), (9, 8), (10, 9),
(1, 10), (2, 11), (3, 12), (4, 13), (5, 14),
(6, 15), (7, 16), (8, 17);

-- ----------------------------------------------------------------------------
-- Customers
-- ----------------------------------------------------------------------------
INSERT INTO customer (customer_id, store_id, first_name, last_name, email, address_id, activebool, create_date, active) VALUES
(1, 1, 'MARY', 'SMITH', 'MARY.SMITH@sakilacustomer.org', 5, TRUE, '2006-02-14', 1),
(2, 1, 'PATRICIA', 'JOHNSON', 'PATRICIA.JOHNSON@sakilacustomer.org', 6, TRUE, '2006-02-14', 1),
(3, 1, 'LINDA', 'WILLIAMS', 'LINDA.WILLIAMS@sakilacustomer.org', 7, TRUE, '2006-02-14', 1),
(4, 2, 'BARBARA', 'JONES', 'BARBARA.JONES@sakilacustomer.org', 8, TRUE, '2006-02-14', 1),
(5, 1, 'ELIZABETH', 'BROWN', 'ELIZABETH.BROWN@sakilacustomer.org', 9, TRUE, '2006-02-14', 1),
(6, 2, 'JENNIFER', 'DAVIS', 'JENNIFER.DAVIS@sakilacustomer.org', 10, TRUE, '2006-02-14', 1),
(7, 1, 'MARIA', 'MILLER', 'MARIA.MILLER@sakilacustomer.org', 11, TRUE, '2006-02-14', 1),
(8, 2, 'SUSAN', 'WILSON', 'SUSAN.WILSON@sakilacustomer.org', 12, TRUE, '2006-02-14', 1),
(9, 1, 'MARGARET', 'MOORE', 'MARGARET.MOORE@sakilacustomer.org', 5, TRUE, '2006-02-14', 1),
(10, 2, 'DOROTHY', 'TAYLOR', 'DOROTHY.TAYLOR@sakilacustomer.org', 6, TRUE, '2006-02-14', 1);
SELECT setval('customer_customer_id_seq', 10);

-- ----------------------------------------------------------------------------
-- Inventory
-- ----------------------------------------------------------------------------
INSERT INTO inventory (inventory_id, film_id, store_id) VALUES
(1, 1, 1), (2, 1, 1), (3, 1, 2),
(4, 2, 1), (5, 2, 2),
(6, 3, 1), (7, 3, 2),
(8, 4, 1), (9, 4, 2),
(10, 5, 1), (11, 5, 2),
(12, 6, 1), (13, 6, 2),
(14, 7, 1), (15, 7, 2),
(150, 8, 1), (151, 8, 2),
(160, 9, 1), (161, 9, 2),
(170, 10, 1), (171, 10, 2),
(180, 11, 1), (181, 12, 2),
(190, 13, 1), (191, 14, 2),
(200, 15, 1),
-- Inventory for films never rented
(210, 16, 1), (211, 16, 2),
(220, 17, 1);
SELECT setval('inventory_inventory_id_seq', 220);

-- ----------------------------------------------------------------------------
-- Rentals (Strictly return_date > rental_date or return_date IS NULL for active rentals)
-- ----------------------------------------------------------------------------
INSERT INTO rental (rental_id, rental_date, inventory_id, customer_id, return_date, staff_id) VALUES
(1, '2005-05-24 22:53:30+00', 1, 1, '2005-05-26 22:04:30+00', 1),
(2, '2005-05-24 22:54:33+00', 4, 2, '2005-05-28 19:40:33+00', 1),
(3, '2005-05-24 23:03:39+00', 6, 3, '2005-06-01 22:12:39+00', 1),
(4, '2005-05-24 23:04:41+00', 8, 4, '2005-06-03 01:43:41+00', 2),
(5, '2005-05-24 23:05:21+00', 10, 5, '2005-06-02 04:33:21+00', 1),
(6, '2005-05-24 23:08:07+00', 12, 6, '2005-05-27 01:32:07+00', 2),
(7, '2005-05-24 23:11:53+00', 14, 7, '2005-05-29 20:34:53+00', 1),
(8, '2005-05-24 23:31:46+00', 150, 8, '2005-05-27 23:33:46+00', 2),
(9, '2005-05-25 00:00:40+00', 160, 9, '2005-05-28 00:22:40+00', 1),
(10, '2005-05-25 00:02:21+00', 170, 10, '2005-05-31 22:44:21+00', 2),
(11, '2005-05-25 01:06:36+00', 2, 1, '2005-05-30 03:20:36+00', 1),
(12, '2005-05-25 01:10:47+00', 5, 2, '2005-05-28 04:40:47+00', 2),
(13, '2005-05-25 01:17:24+00', 7, 3, '2005-05-31 06:17:24+00', 2),
(14, '2005-05-25 01:48:41+00', 9, 4, '2005-05-27 06:11:41+00', 2),
(15, '2005-05-25 02:03:31+00', 11, 5, '2005-05-31 03:52:31+00', 1),
(16, '2005-05-25 02:40:18+00', 13, 6, '2005-05-29 03:58:18+00', 2),
(17, '2005-05-25 03:42:07+00', 15, 7, '2005-05-30 08:02:07+00', 2),
(18, '2005-05-25 04:47:31+00', 151, 8, '2005-05-31 00:58:31+00', 2),
(19, '2005-05-25 06:01:49+00', 161, 9, '2005-05-30 03:27:49+00', 2),
(20, '2005-05-25 07:27:47+00', 171, 10, '2005-05-29 07:01:47+00', 2),
-- Sequential rental on inventory 1 (returned before next rental starts - non-overlapping)
(21, '2005-05-28 10:00:00+00', 1, 2, '2005-05-31 12:00:00+00', 1),
(22, '2005-06-01 10:00:00+00', 1, 3, '2005-06-05 14:00:00+00', 1),
-- Active rentals currently out (return_date IS NULL)
(23, '2005-06-15 08:30:00+00', 180, 1, NULL, 1),
(24, '2005-06-15 09:15:00+00', 181, 2, NULL, 2);
SELECT setval('rental_rental_id_seq', 24);

-- ----------------------------------------------------------------------------
-- Payments (Positive amounts matching rental transactions)
-- ----------------------------------------------------------------------------
INSERT INTO payment (payment_id, customer_id, staff_id, rental_id, amount, payment_date) VALUES
(1, 1, 1, 1, 0.99, '2005-05-24 22:53:30+00'),
(2, 2, 1, 2, 4.99, '2005-05-24 22:54:33+00'),
(3, 3, 1, 3, 2.99, '2005-05-24 23:03:39+00'),
(4, 4, 2, 4, 2.99, '2005-05-24 23:04:41+00'),
(5, 5, 1, 5, 2.99, '2005-05-24 23:05:21+00'),
(6, 6, 2, 6, 4.99, '2005-05-24 23:08:07+00'),
(7, 7, 1, 7, 4.99, '2005-05-24 23:11:53+00'),
(8, 8, 2, 8, 4.99, '2005-05-24 23:31:46+00'),
(9, 9, 1, 9, 2.99, '2005-05-25 00:00:40+00'),
(10, 10, 2, 10, 4.99, '2005-05-25 00:02:21+00'),
(11, 1, 1, 11, 0.99, '2005-05-25 01:06:36+00'),
(12, 2, 2, 12, 4.99, '2005-05-25 01:10:47+00'),
(13, 3, 2, 13, 2.99, '2005-05-25 01:17:24+00'),
(14, 4, 2, 14, 2.99, '2005-05-25 01:48:41+00'),
(15, 5, 1, 15, 2.99, '2005-05-25 02:03:31+00'),
(16, 6, 2, 16, 4.99, '2005-05-25 02:40:18+00'),
(17, 7, 2, 17, 4.99, '2005-05-25 03:42:07+00'),
(18, 8, 2, 18, 4.99, '2005-05-25 04:47:31+00'),
(19, 9, 2, 19, 2.99, '2005-05-25 06:01:49+00'),
(20, 10, 2, 20, 4.99, '2005-05-25 07:27:47+00'),
(21, 2, 1, 21, 0.99, '2005-05-28 10:00:00+00'),
(22, 3, 1, 22, 0.99, '2005-06-01 10:00:00+00'),
(23, 1, 1, 23, 0.99, '2005-06-15 08:30:00+00'),
(24, 2, 2, 24, 0.99, '2005-06-15 09:15:00+00');
SELECT setval('payment_payment_id_seq', 24);
