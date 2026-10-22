-- ============================================================================
-- Validation Rule 05: Overlapping Rentals for Same Inventory Item
-- Purpose: Ensures the same physical copy of a DVD cannot be rented out to multiple
--          customers concurrently before being returned.
-- Expected Result on Clean Data: 0 rows.
-- ============================================================================

SELECT 
    r1.inventory_id,
    f.title AS film_title,
    r1.rental_id AS rental_1_id,
    r1.customer_id AS customer_1_id,
    r1.rental_date AS rental_1_start,
    r1.return_date AS rental_1_return,
    r2.rental_id AS rental_2_id,
    r2.customer_id AS customer_2_id,
    r2.rental_date AS rental_2_start,
    r2.return_date AS rental_2_return,
    'Physical copy rented to customer 2 before customer 1 returned it' AS defect_reason
FROM rental r1
JOIN rental r2 ON r1.inventory_id = r2.inventory_id 
              AND r1.rental_id < r2.rental_id
JOIN inventory i ON r1.inventory_id = i.inventory_id
JOIN film f ON i.film_id = f.film_id
WHERE r1.rental_date < COALESCE(r2.return_date, '9999-12-31'::TIMESTAMPTZ)
  AND r2.rental_date < COALESCE(r1.return_date, '9999-12-31'::TIMESTAMPTZ);
