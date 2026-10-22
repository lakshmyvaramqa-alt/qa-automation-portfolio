-- ============================================================================
-- Validation Rule 01: Orphan Rentals (Referential Integrity)
-- Purpose: Ensures every rental is mapped to a valid customer, inventory item, and staff.
-- Expected Result on Clean Data: 0 rows.
-- ============================================================================

SELECT 
    r.rental_id,
    r.rental_date,
    r.customer_id,
    r.inventory_id,
    r.staff_id,
    CASE 
        WHEN c.customer_id IS NULL THEN 'Missing Customer'
        WHEN i.inventory_id IS NULL THEN 'Missing Inventory'
        WHEN s.staff_id IS NULL THEN 'Missing Staff'
        ELSE 'Unknown Reference Error'
    END AS defect_reason
FROM rental r
LEFT JOIN customer c ON r.customer_id = c.customer_id
LEFT JOIN inventory i ON r.inventory_id = i.inventory_id
LEFT JOIN staff s ON r.staff_id = s.staff_id
WHERE c.customer_id IS NULL 
   OR i.inventory_id IS NULL 
   OR s.staff_id IS NULL;
