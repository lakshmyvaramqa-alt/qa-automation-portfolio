-- ============================================================================
-- Section 3: Aggregations & Grouping (Queries Q11 - Q15)
-- ============================================================================

-- Q11: Film metrics by MPAA rating: total count, average duration, and cost ranges
SELECT 
    rating,
    COUNT(*) AS film_count,
    ROUND(AVG(length), 2) AS avg_duration_minutes,
    MIN(rental_rate) AS min_rental_rate,
    MAX(rental_rate) AS max_rental_rate,
    ROUND(AVG(replacement_cost), 2) AS avg_replacement_cost
FROM film
GROUP BY rating
ORDER BY film_count DESC;

-- Q12: Total revenue, total transactions, and average transaction size per store
SELECT 
    s.store_id,
    c.city AS store_city,
    COUNT(p.payment_id) AS total_payments,
    SUM(p.amount) AS total_revenue,
    ROUND(AVG(p.amount), 2) AS avg_payment_amount
FROM store s
JOIN address a ON s.address_id = a.address_id
JOIN city c ON a.city_id = c.city_id
JOIN staff st ON s.store_id = st.store_id
JOIN payment p ON st.staff_id = p.staff_id
GROUP BY s.store_id, c.city
ORDER BY total_revenue DESC;

-- Q13: GROUP BY & HAVING: Film categories with multiple titles and average rental rate >= $2.50
SELECT 
    c.name AS category_name,
    COUNT(f.film_id) AS film_count,
    ROUND(AVG(f.rental_rate), 2) AS avg_rental_rate,
    ROUND(AVG(f.length), 1) AS avg_length
FROM category c
JOIN film_category fc ON c.category_id = fc.category_id
JOIN film f ON fc.film_id = f.film_id
GROUP BY c.name
HAVING COUNT(f.film_id) >= 1 
   AND AVG(f.rental_rate) >= 2.50
ORDER BY avg_rental_rate DESC, film_count DESC;

-- Q14: Rental count and revenue aggregated by month
SELECT 
    TO_CHAR(rental_date, 'YYYY-MM') AS rental_month,
    COUNT(*) AS total_rentals,
    COUNT(DISTINCT customer_id) AS unique_renters,
    COUNT(CASE WHEN return_date IS NULL THEN 1 END) AS currently_unreturned
FROM rental
GROUP BY TO_CHAR(rental_date, 'YYYY-MM')
ORDER BY rental_month ASC;

-- Q15: Actor catalog presence: Actors with their total film count and average rental rate
SELECT 
    a.actor_id,
    a.first_name || ' ' || a.last_name AS actor_name,
    COUNT(fa.film_id) AS film_count,
    ROUND(AVG(f.rental_rate), 2) AS avg_film_rental_rate
FROM actor a
JOIN film_actor fa ON a.actor_id = fa.actor_id
JOIN film f ON fa.film_id = f.film_id
GROUP BY a.actor_id, a.first_name, a.last_name
HAVING COUNT(fa.film_id) >= 1
ORDER BY film_count DESC, actor_name ASC;
