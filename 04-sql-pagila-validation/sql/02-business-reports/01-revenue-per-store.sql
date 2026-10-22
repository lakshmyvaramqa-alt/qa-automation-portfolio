-- ============================================================================
-- Business Report 01: Revenue Per Store
-- Summary of gross revenue, transaction counts, and store performance
-- ============================================================================

SELECT 
    s.store_id,
    c.city AS store_city,
    co.country AS store_country,
    st.first_name || ' ' || st.last_name AS manager_name,
    COUNT(p.payment_id) AS total_transactions,
    SUM(p.amount) AS total_revenue,
    ROUND(AVG(p.amount), 2) AS average_ticket_size,
    ROUND(SUM(p.amount) * 100.0 / SUM(SUM(p.amount)) OVER (), 2) AS revenue_share_percentage
FROM store s
JOIN address a ON s.address_id = a.address_id
JOIN city c ON a.city_id = c.city_id
JOIN country co ON c.country_id = co.country_id
JOIN staff st ON s.manager_staff_id = st.staff_id
JOIN staff emp ON s.store_id = emp.store_id
JOIN payment p ON emp.staff_id = p.staff_id
GROUP BY s.store_id, c.city, co.country, st.first_name, st.last_name
ORDER BY total_revenue DESC;
