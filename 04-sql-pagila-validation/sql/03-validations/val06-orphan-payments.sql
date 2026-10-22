-- ============================================================================
-- Validation Rule 06: Orphan or Mismatched Payments
-- Purpose: Ensures payments belong to valid customers and match the customer on the rental.
-- Expected Result on Clean Data: 0 rows.
-- ============================================================================

SELECT 
    p.payment_id,
    p.customer_id AS payment_customer_id,
    p.rental_id,
    r.customer_id AS rental_customer_id,
    p.amount,
    CASE 
        WHEN c.customer_id IS NULL THEN 'Payment references non-existent customer'
        WHEN p.rental_id IS NOT NULL AND r.rental_id IS NULL THEN 'Payment references non-existent rental'
        WHEN p.rental_id IS NOT NULL AND p.customer_id <> r.customer_id THEN 'Payment customer does not match rental customer'
        ELSE 'Unidentified payment mismatch'
    END AS defect_reason
FROM payment p
LEFT JOIN customer c ON p.customer_id = c.customer_id
LEFT JOIN rental r ON p.rental_id = r.rental_id
WHERE c.customer_id IS NULL
   OR (p.rental_id IS NOT NULL AND r.rental_id IS NULL)
   OR (p.rental_id IS NOT NULL AND p.customer_id <> r.customer_id);
