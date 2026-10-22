-- ============================================================================
-- Validation Rule 04: Duplicate Customer Emails (Identity Uniqueness)
-- Purpose: Ensures customer accounts have distinct email addresses for account security.
-- Expected Result on Clean Data: 0 rows.
-- ============================================================================

WITH duplicate_emails AS (
    SELECT 
        LOWER(email) AS normalized_email,
        COUNT(*) AS account_count
    FROM customer
    WHERE email IS NOT NULL AND email <> ''
    GROUP BY LOWER(email)
    HAVING COUNT(*) > 1
)
SELECT 
    c.customer_id,
    c.store_id,
    c.first_name,
    c.last_name,
    c.email,
    de.account_count AS duplicate_occurrences,
    'Duplicate customer email address' AS defect_reason
FROM customer c
JOIN duplicate_emails de ON LOWER(c.email) = de.normalized_email
ORDER BY c.email, c.customer_id;
