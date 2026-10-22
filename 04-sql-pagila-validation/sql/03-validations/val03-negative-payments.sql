-- ============================================================================
-- Validation Rule 03: Negative or Zero Payments (Financial Integrity)
-- Purpose: Ensures every customer payment transaction contains a strictly positive amount.
-- Expected Result on Clean Data: 0 rows.
-- ============================================================================

SELECT 
    p.payment_id,
    p.customer_id,
    p.rental_id,
    p.amount,
    p.payment_date,
    CASE 
        WHEN p.amount < 0 THEN 'Negative payment amount'
        WHEN p.amount = 0 THEN 'Zero dollar payment'
        WHEN p.amount IS NULL THEN 'NULL payment amount'
        ELSE 'Invalid amount'
    END AS defect_reason
FROM payment p
WHERE p.amount <= 0 
   OR p.amount IS NULL;
