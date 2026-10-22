-- ============================================================================
-- Business Report 04: Films Never Rented
-- Uncovers dead inventory and zero-revenue titles to guide catalog pruning
-- ============================================================================

SELECT 
    f.film_id,
    f.title,
    cat.name AS category_name,
    f.rating,
    f.rental_rate,
    f.replacement_cost,
    COUNT(i.inventory_id) AS total_copies_in_stock
FROM film f
JOIN film_category fc ON f.film_id = fc.film_id
JOIN category cat ON fc.category_id = cat.category_id
JOIN inventory i ON f.film_id = i.film_id
LEFT JOIN rental r ON i.inventory_id = r.inventory_id
WHERE r.rental_id IS NULL
GROUP BY f.film_id, f.title, cat.name, f.rating, f.rental_rate, f.replacement_cost
ORDER BY f.replacement_cost DESC, f.title ASC;
