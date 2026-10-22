-- ============================================================================
-- Section 4: Subqueries (Queries Q16 - Q20)
-- ============================================================================

-- Q16: Scalar Subquery: Find films priced above the catalog-wide average rental rate
SELECT 
    film_id,
    title,
    rental_rate,
    rating,
    ROUND((SELECT AVG(rental_rate) FROM film), 2) AS catalog_avg_rate
FROM film
WHERE rental_rate > (SELECT AVG(rental_rate) FROM film)
ORDER BY rental_rate DESC, title ASC;

-- Q17: Subquery with IN: Customers who have rented films categorized as 'Documentary'
SELECT 
    customer_id,
    first_name,
    last_name,
    email
FROM customer
WHERE customer_id IN (
    SELECT DISTINCT r.customer_id
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film_category fc ON i.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    WHERE c.name = 'Documentary'
)
ORDER BY last_name ASC;

-- Q18: Correlated Subquery with EXISTS: Customers who have paid at least once for a premium rental (>= $4.00)
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email
FROM customer c
WHERE EXISTS (
    SELECT 1 
    FROM payment p 
    WHERE p.customer_id = c.customer_id 
      AND p.amount >= 4.00
)
ORDER BY c.customer_id;

-- Q19: Subquery with NOT IN: Films currently in stock at Store 1 but completely absent from Store 2
SELECT 
    f.film_id,
    f.title,
    f.rating
FROM film f
WHERE f.film_id IN (
    SELECT film_id FROM inventory WHERE store_id = 1
)
AND f.film_id NOT IN (
    SELECT film_id FROM inventory WHERE store_id = 2
)
ORDER BY f.title;

-- Q20: Correlated Subquery in SELECT: Customers with their most recent rental date & total spend
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    (
        SELECT MAX(r.rental_date) 
        FROM rental r 
        WHERE r.customer_id = c.customer_id
    ) AS last_rental_date,
    (
        SELECT COALESCE(SUM(p.amount), 0)
        FROM payment p
        WHERE p.customer_id = c.customer_id
    ) AS total_spent
FROM customer c
ORDER BY total_spent DESC;
