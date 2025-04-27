-- Fix the contactperson column name case in the partners table
ALTER TABLE partners RENAME COLUMN contactperson TO "contactPerson";
