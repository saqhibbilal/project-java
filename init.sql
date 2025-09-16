-- Database initialization script for TrackSpring
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main database (already created by POSTGRES_DB env var)
-- But we can add any additional setup here if needed

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE trackspring_db TO trackspring_user;

-- Create any additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS trackspring_schema;

-- Set default search path
-- ALTER DATABASE trackspring_db SET search_path TO trackspring_schema, public;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'TrackSpring database initialized successfully!';
END $$;
