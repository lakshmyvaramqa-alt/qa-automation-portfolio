-- ============================================================================
-- Defect Injection Script
-- Purpose: Deliberately injects business-rule defects to verify that our
--          data validation suite detects every anomaly.
--
-- Can be wrapped in a transaction (BEGIN ... ROLLBACK) or cleansed via rollback-defects.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Defect 1 (Targets Rule 02: val02-return-before-rental.sql)
-- Injects a rental with a return date preceding the rental date by 2 days
-- ----------------------------------------------------------------------------
INSERT INTO rental (rental_id, rental_date, inventory_id, customer_id, return_date, staff_id)
VALUES (9901, '2005-06-10 14:00:00+00', 1, 1, '2005-06-08 10:00:00+00', 1)
ON CONFLICT (rental_id) DO UPDATE SET
    rental_date = EXCLUDED.rental_date,
    return_date = EXCLUDED.return_date;

-- ----------------------------------------------------------------------------
-- Defect 2 (Targets Rule 03: val03-negative-payments.sql)
-- Injects negative and zero-dollar payments
-- ----------------------------------------------------------------------------
INSERT INTO payment (payment_id, customer_id, staff_id, rental_id, amount, payment_date)
VALUES 
    (9902, 1, 1, 1, -15.99, '2005-06-10 14:05:00+00'),
    (9903, 2, 2, 2, 0.00, '2005-06-10 14:10:00+00')
ON CONFLICT (payment_id) DO UPDATE SET
    amount = EXCLUDED.amount;

-- ----------------------------------------------------------------------------
-- Defect 3 (Targets Rule 04: val04-duplicate-emails.sql)
-- Injects a customer account duplicating MARY.SMITH@sakilacustomer.org
-- ----------------------------------------------------------------------------
INSERT INTO customer (customer_id, store_id, first_name, last_name, email, address_id, activebool)
VALUES (9904, 1, 'IMPOSTOR', 'SMITH', 'MARY.SMITH@sakilacustomer.org', 5, TRUE)
ON CONFLICT (customer_id) DO UPDATE SET
    email = EXCLUDED.email;

-- ----------------------------------------------------------------------------
-- Defect 4 (Targets Rule 05: val05-overlapping-rentals.sql)
-- Injects an overlapping rental on inventory_id 1 during an active checkout period
-- (Rental 21 was out from 2005-05-28 to 2005-05-31; this checkout overlaps on 2005-05-29)
-- ----------------------------------------------------------------------------
INSERT INTO rental (rental_id, rental_date, inventory_id, customer_id, return_date, staff_id)
VALUES (9905, '2005-05-29 12:00:00+00', 1, 4, '2005-06-02 12:00:00+00', 1)
ON CONFLICT (rental_id) DO UPDATE SET
    rental_date = EXCLUDED.rental_date,
    return_date = EXCLUDED.return_date;

-- ----------------------------------------------------------------------------
-- Defect 5 (Targets Rule 06: val06-orphan-payments.sql)
-- Injects a payment where the paying customer does not match the customer on the rental
-- (Rental 1 belongs to customer 1; payment 9906 is recorded against customer 3 for rental 1)
-- ----------------------------------------------------------------------------
INSERT INTO payment (payment_id, customer_id, staff_id, rental_id, amount, payment_date)
VALUES (9906, 3, 1, 1, 9.99, '2005-06-11 10:00:00+00')
ON CONFLICT (payment_id) DO UPDATE SET
    customer_id = EXCLUDED.customer_id;
