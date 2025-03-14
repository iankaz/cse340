-- Create account_type enum
CREATE TYPE public.account_type AS ENUM (
    'Client',
    'Employee',
    'Admin'
); 