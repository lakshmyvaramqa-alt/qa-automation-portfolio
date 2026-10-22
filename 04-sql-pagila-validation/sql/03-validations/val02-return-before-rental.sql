-- ============================================================================
-- Validation Rule 02: Return Date Before Rental Date (Temporal Anomaly)
-- Purpose: Ensures a movie cannot be returned prior to when it was checked out.
-- Expected Result on Clean Data: 0 rows.
-- ============================================================================

SELECT 
    r.rental_id,
    r.customer_id,
    r.inventory_id,
    r.rental_date,
    r.return_date,
    ROUND(EXTRACT(EPOCH FROM (r.return_date - r.rental_date)) / 3600, 2) AS duration_hours_negative,
    'Return date precedes rental date' AS defect_reason
FROM rental r
WHERE r.return_date IS NOT NULL
  AND r.return_date < r.rental_date;
