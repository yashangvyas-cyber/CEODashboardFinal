-- Run this in your Supabase SQL Editor to add multi-currency support

-- Add currency to deals (defaulting existing deals to USD)
ALTER TABLE deals 
ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';

-- Add currency to invoices (defaulting existing invoices to USD)
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';
