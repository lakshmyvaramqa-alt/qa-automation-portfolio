-- ============================================================================
-- Business Report 02: Top Customers by Spend and Rental Frequency
-- Identifies VIP patrons driving business profitability
-- ============================================================================

SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email,
    ct.city,
    co.country,
    COUNT(DISTINCT r.rental_id) AS total_rentals,
    COUNT(p.payment_id) AS total_payments,
    COALESCE(SUM(p.amount), 0.00) AS total_spent,
    ROUND(AVG(p.amount), 2) AS average_spend_per_rental,
    DENSE_RANK() OVER (ORDER BY COALESCE(SUM(p.amount), 0) DESC) AS customer_rank
FROM customer c
JOIN address a ON c.address_id = a.address_id
JOIN city ct ON a.city_id = ct.city_id
JOIN country co ON ct.country_id = co.country_id
LEFT JOIN rental r ON c.customer_id = r.customer_id
LEFT JOIN payment p ON r.rental_id = p.rental_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.email, ct.city, co.country
ORDER BY total_spent DESC, total_rentals DESC
LIMIT 10;
