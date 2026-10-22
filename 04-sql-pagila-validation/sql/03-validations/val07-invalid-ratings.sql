-- ============================================================================
-- Validation Rule 07: Invalid Film MPAA Ratings
-- Purpose: Ensures every film possesses a standard MPAA rating ('G', 'PG', 'PG-13', 'R', 'NC-17').
-- Expected Result on Clean Data: 0 rows.
-- ============================================================================

SELECT 
    film_id,
    title,
    rating::TEXT,
    'Film rating is not in permitted MPAA set (G, PG, PG-13, R, NC-17)' AS defect_reason
FROM film
WHERE rating::TEXT NOT IN ('G', 'PG', 'PG-13', 'R', 'NC-17')
   OR rating IS NULL;
