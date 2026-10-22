-- ============================================================================
-- Business Report 03: Most-Rented Films
-- Identifies most popular catalog assets, category, and revenue generation
-- ============================================================================

SELECT 
    f.film_id,
    f.title,
    cat.name AS category_name,
    f.rating,
    f.rental_rate,
    COUNT(r.rental_id) AS rental_times,
    COALESCE(SUM(p.amount), 0.00) AS total_revenue_generated,
    DENSE_RANK() OVER (ORDER BY COUNT(r.rental_id) DESC, SUM(p.amount) DESC) AS popularity_rank
FROM film f
JOIN film_category fc ON f.film_id = fc.film_id
JOIN category cat ON fc.category_id = cat.category_id
JOIN inventory i ON f.film_id = i.film_id
JOIN rental r ON i.inventory_id = r.inventory_id
LEFT JOIN payment p ON r.rental_id = p.rental_id
GROUP BY f.film_id, f.title, cat.name, f.rating, f.rental_rate
ORDER BY rental_times DESC, total_revenue_generated DESC;
