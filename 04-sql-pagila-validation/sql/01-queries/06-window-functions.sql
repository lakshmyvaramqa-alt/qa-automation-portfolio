-- ============================================================================
-- Section 6: Window Functions (Queries Q26 - Q31)
-- ============================================================================

-- Q26: DENSE_RANK & RANK: Rank films by total rental count within each rating category
WITH film_rental_counts AS (
    SELECT 
        f.film_id,
        f.title,
        f.rating,
        COUNT(r.rental_id) AS rental_count
    FROM film f
    LEFT JOIN inventory i ON f.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY f.film_id, f.title, f.rating
)
SELECT 
    rating,
    title,
    rental_count,
    RANK() OVER (PARTITION BY rating ORDER BY rental_count DESC) AS rank_in_rating,
    DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_count DESC) AS dense_rank_in_rating
FROM film_rental_counts
ORDER BY rating, dense_rank_in_rating ASC, title ASC;

-- Q27: ROW_NUMBER: Sequence each customer's rental history sequentially to track customer journeys
SELECT 
    r.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    r.rental_id,
    r.rental_date,
    f.title AS film_rented,
    ROW_NUMBER() OVER (PARTITION BY r.customer_id ORDER BY r.rental_date ASC) AS customer_rental_number
FROM rental r
JOIN customer c ON r.customer_id = c.customer_id
JOIN inventory i ON r.inventory_id = i.inventory_id
JOIN film f ON i.film_id = f.film_id
ORDER BY r.customer_id, customer_rental_number ASC;

-- Q28: LAG: Analyze interval between consecutive rentals per customer to detect churn risk
SELECT 
    r.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    r.rental_id,
    r.rental_date,
    LAG(r.rental_date) OVER (PARTITION BY r.customer_id ORDER BY r.rental_date ASC) AS prev_rental_date,
    ROUND(
        EXTRACT(EPOCH FROM (r.rental_date - LAG(r.rental_date) OVER (PARTITION BY r.customer_id ORDER BY r.rental_date ASC))) / 86400,
        2
    ) AS days_since_last_rental
FROM rental r
JOIN customer c ON r.customer_id = c.customer_id
ORDER BY r.customer_id, r.rental_date ASC;

-- Q29: LEAD: Compare current payment with subsequent payment to identify upsell or downsell trends
SELECT 
    p.customer_id,
    p.payment_id,
    p.payment_date,
    p.amount AS current_payment,
    LEAD(p.amount) OVER (PARTITION BY p.customer_id ORDER BY p.payment_date ASC) AS next_payment,
    LEAD(p.amount) OVER (PARTITION BY p.customer_id ORDER BY p.payment_date ASC) - p.amount AS payment_difference
FROM payment p
ORDER BY p.customer_id, p.payment_date ASC;

-- Q30: Running Total (SUM OVER): Cumulative daily revenue accumulation partitioned by store
SELECT 
    DATE(p.payment_date) AS payment_day,
    st.store_id,
    SUM(p.amount) AS daily_revenue,
    SUM(SUM(p.amount)) OVER (
        PARTITION BY st.store_id 
        ORDER BY DATE(p.payment_date) ASC
    ) AS cumulative_store_revenue
FROM payment p
JOIN staff st ON p.staff_id = st.staff_id
GROUP BY DATE(p.payment_date), st.store_id
ORDER BY st.store_id, payment_day ASC;

-- Q31: NTILE(4): Quartile distribution of films by duration
SELECT 
    film_id,
    title,
    length AS duration_minutes,
    NTILE(4) OVER (ORDER BY length ASC) AS duration_quartile
FROM film
WHERE length IS NOT NULL
ORDER BY duration_quartile, duration_minutes;
