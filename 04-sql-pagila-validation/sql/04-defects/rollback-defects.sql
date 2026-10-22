-- ============================================================================
-- Defect Rollback & Cleansing Script
-- Purpose: Restores database to clean state by deleting all injected defect records
-- ============================================================================

DELETE FROM payment WHERE payment_id IN (9902, 9903, 9906);
DELETE FROM rental WHERE rental_id IN (9901, 9905);
DELETE FROM customer WHERE customer_id = 9904;
