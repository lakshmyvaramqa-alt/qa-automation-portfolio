-- ============================================================================
-- Section 2: Joins (Queries Q06 - Q10)
-- ============================================================================

-- Q06: INNER JOIN: Films with category name and language
SELECT 
    f.film_id,
    f.title,
    c.name AS category_name,
    l.name AS language_name,
    f.rental_rate
FROM film f
INNER JOIN film_category fc ON f.film_id = fc.film_id
INNER JOIN category c ON fc.category_id = c.category_id
INNER JOIN language l ON f.language_id = l.language_id
ORDER BY c.name, f.title;

-- Q07: Multi-Table JOIN: Detailed rental transactions with customer, film, store, and staff
SELECT 
    r.rental_id,
    r.rental_date,
    c.first_name || ' ' || c.last_name AS customer_name,
    f.title AS film_title,
    s.store_id,
    st.first_name || ' ' || st.last_name AS staff_name,
    p.amount AS payment_amount
FROM rental r
JOIN customer c ON r.customer_id = c.customer_id
JOIN inventory i ON r.inventory_id = i.inventory_id
JOIN film f ON i.film_id = f.film_id
JOIN store s ON i.store_id = s.store_id
JOIN staff st ON r.staff_id = st.staff_id
LEFT JOIN payment p ON r.rental_id = p.rental_id
ORDER BY r.rental_date DESC;

-- Q08: LEFT JOIN: Customers with total rental count, including zero-activity customers
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(r.rental_id) AS total_rentals
FROM customer c
LEFT JOIN rental r ON c.customer_id = r.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.email
ORDER BY total_rentals DESC, c.last_name ASC;

-- Q09: FULL OUTER JOIN: Store and customer addresses for geographical coverage analysis
SELECT 
    a.address_id,
    a.address,
    a.district,
    s.store_id,
    c.customer_id
FROM address a
LEFT JOIN store s ON a.address_id = s.address_id
FULL OUTER JOIN customer c ON a.address_id = c.address_id
WHERE s.store_id IS NOT NULL OR c.customer_id IS NOT NULL
ORDER BY a.address_id;

-- Q10: SELF JOIN: Identify staff members working alongside colleagues in the same store
SELECT 
    s1.store_id,
    s1.first_name || ' ' || s1.last_name AS staff_member,
    s2.first_name || ' ' || s2.last_name AS store_manager
FROM staff s1
JOIN store st ON s1.store_id = st.store_id
JOIN staff s2 ON st.manager_staff_id = s2.staff_id
ORDER BY s1.store_id, s1.staff_id;
