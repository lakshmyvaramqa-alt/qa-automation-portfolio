-- ============================================================================
-- Section 5: Common Table Expressions (CTEs) (Queries Q21 - Q25)
-- ============================================================================

-- Q21: Basic CTE: Segment customers into activity tiers based on rental counts
WITH customer_rental_counts AS (
    SELECT 
        c.customer_id,
        c.first_name || ' ' || c.last_name AS customer_name,
        c.email,
        COUNT(r.rental_id) AS rental_count
    FROM customer c
    LEFT JOIN rental r ON c.customer_id = r.customer_id
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email
)
SELECT 
    customer_id,
    customer_name,
    rental_count,
    CASE 
        WHEN rental_count >= 4 THEN 'VIP / High Volume'
        WHEN rental_count BETWEEN 2 AND 3 THEN 'Regular'
        ELSE 'Occasional / New'
    END AS customer_tier
FROM customer_rental_counts
ORDER BY rental_count DESC, customer_name ASC;

-- Q22: Multiple CTEs: Correlating customer lifetime value with preferred rental categories
WITH customer_spend AS (
    SELECT 
        customer_id,
        SUM(amount) AS total_spend,
        COUNT(payment_id) AS payment_count
    FROM payment
    GROUP BY customer_id
),
customer_top_category AS (
    SELECT DISTINCT ON (r.customer_id)
        r.customer_id,
        c.name AS favorite_category,
        COUNT(*) AS category_rentals
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film_category fc ON i.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    GROUP BY r.customer_id, c.name
    ORDER BY r.customer_id, category_rentals DESC
)
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    COALESCE(cs.total_spend, 0) AS total_spent,
    COALESCE(cs.payment_count, 0) AS total_transactions,
    COALESCE(ctc.favorite_category, 'None') AS preferred_category
FROM customer c
LEFT JOIN customer_spend cs ON c.customer_id = cs.customer_id
LEFT JOIN customer_top_category ctc ON c.customer_id = ctc.customer_id
ORDER BY total_spent DESC;

-- Q23: CTE with Store Revenue Comparison: Comparing performance KPIs across store branches
WITH store_metrics AS (
    SELECT 
        s.store_id,
        COUNT(DISTINCT c.customer_id) AS active_customers,
        COUNT(DISTINCT r.rental_id) AS total_rentals,
        SUM(p.amount) AS total_revenue
    FROM store s
    JOIN customer c ON s.store_id = c.store_id
    JOIN staff st ON s.store_id = st.store_id
    JOIN payment p ON st.staff_id = p.staff_id
    LEFT JOIN rental r ON p.rental_id = r.rental_id
    GROUP BY s.store_id
)
SELECT 
    store_id,
    active_customers,
    total_rentals,
    total_revenue,
    ROUND(total_revenue / NULLIF(total_rentals, 0), 2) AS avg_revenue_per_rental
FROM store_metrics
ORDER BY total_revenue DESC;

-- Q24: Category Profitability CTE: Total revenue generated and revenue per film in category
WITH category_revenue AS (
    SELECT 
        c.category_id,
        c.name AS category_name,
        COUNT(DISTINCT f.film_id) AS total_films_in_cat,
        COUNT(r.rental_id) AS total_rentals,
        COALESCE(SUM(p.amount), 0) AS gross_revenue
    FROM category c
    JOIN film_category fc ON c.category_id = fc.category_id
    JOIN film f ON fc.film_id = f.film_id
    LEFT JOIN inventory i ON f.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id
    LEFT JOIN payment p ON r.rental_id = p.rental_id
    GROUP BY c.category_id, c.name
)
SELECT 
    category_name,
    total_films_in_cat,
    total_rentals,
    gross_revenue,
    ROUND(gross_revenue / NULLIF(total_films_in_cat, 0), 2) AS revenue_per_title
FROM category_revenue
ORDER BY gross_revenue DESC;

-- Q25: Recursive CTE: Generate date series to analyze daily rental trends
WITH RECURSIVE rental_dates AS (
    SELECT '2005-05-24'::DATE AS rental_day
    UNION ALL
    SELECT (rental_day + INTERVAL '1 day')::DATE
    FROM rental_dates
    WHERE rental_day < '2005-05-30'::DATE
)
SELECT 
    rd.rental_day,
    COUNT(r.rental_id) AS rentals_on_day
FROM rental_dates rd
LEFT JOIN rental r ON DATE(r.rental_date) = rd.rental_day
GROUP BY rd.rental_day
ORDER BY rd.rental_day ASC;
