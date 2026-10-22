-- ============================================================================
-- Section 1: Filtering & Sorting (Queries Q01 - Q05)
-- ============================================================================

-- Q01: Find family-friendly films (G or PG) with budget rental rate under $3.00, sorted by title
SELECT 
    film_id,
    title,
    rental_rate,
    rating,
    length
FROM film
WHERE rating IN ('G', 'PG')
  AND rental_rate < 3.00
ORDER BY title ASC;

-- Q02: Case-insensitive search for films describing 'Drama' or 'Mad Scientist'
SELECT 
    film_id,
    title,
    rating,
    description
FROM film
WHERE description ILIKE '%mad scientist%'
   OR description ILIKE '%drama%'
ORDER BY title;

-- Q03: Active customers with last names starting from M to S, sorted by store and last name
SELECT 
    customer_id,
    store_id,
    first_name,
    last_name,
    email
FROM customer
WHERE activebool = TRUE
  AND last_name >= 'M' 
  AND last_name < 'T'
ORDER BY store_id ASC, last_name ASC, first_name ASC;

-- Q04: Identify all currently active out-on-rental items (unreturned)
SELECT 
    rental_id,
    rental_date,
    inventory_id,
    customer_id,
    staff_id
FROM rental
WHERE return_date IS NULL
ORDER BY rental_date DESC;

-- Q05: Top 5 longest films with replacement cost between $15.00 and $25.00 (Pagination demo)
SELECT 
    film_id,
    title,
    length,
    rental_rate,
    replacement_cost
FROM film
WHERE replacement_cost BETWEEN 15.00 AND 25.00
  AND length IS NOT NULL
ORDER BY length DESC, title ASC
LIMIT 5 OFFSET 0;
