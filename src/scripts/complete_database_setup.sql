-- =====================================================
-- COMPLETE DATABASE SETUP SCRIPT
-- This script drops all tables, recreates them in correct order,
-- adds constraints and indexes, and populates with 10 rows each
-- =====================================================

-- Step 1: Drop all tables if they exist (in reverse dependency order)
DO $$
BEGIN
    RAISE NOTICE 'Step 1: Dropping existing tables...';
END $$;

DROP TABLE IF EXISTS movements CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS policy_exclusions CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS exclusions CASCADE;

-- Verify tables are dropped
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('exclusions', 'policies', 'policy_exclusions', 'claims', 'activities', 'movements');

    IF table_count = 0 THEN
        RAISE NOTICE '✓ All tables successfully dropped';
    ELSE
        RAISE EXCEPTION '✗ Failed to drop all tables. Found % remaining tables', table_count;
    END IF;
END $$;

-- =====================================================
-- Step 2: Create tables in dependency order
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Step 2: Creating tables...';
END $$;

-- 2.1: Create exclusions table (no dependencies)
CREATE TABLE exclusions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Added index for title searches
CREATE INDEX idx_exclusions_title ON exclusions(title);

-- Verify exclusions table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exclusions') THEN
        RAISE NOTICE '✓ Exclusions table created successfully';
    ELSE
        RAISE EXCEPTION '✗ Failed to create exclusions table';
    END IF;
END $$;

-- 2.2: Create policies table (no dependencies)
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_number VARCHAR(100) NOT NULL UNIQUE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    named_insured VARCHAR(150) NOT NULL,
    sum_insured DECIMAL(15,2) NOT NULL,
    coverage_type VARCHAR(50) NOT NULL DEFAULT 'AllRisksProperty',
    deductible DECIMAL(15,0),
    binder_ref VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expanded coverage types to be more realistic
ALTER TABLE policies ADD CONSTRAINT policies_coverage_type_check
    CHECK (coverage_type IN ('AllRisksProperty', 'NamedPerils', 'BusinessInterruption', 'CyberLiability', 'GeneralLiability'));

-- Added additional useful indexes
CREATE INDEX idx_policies_named_insured ON policies(named_insured);
CREATE INDEX idx_policies_period_start ON policies(period_start);
CREATE INDEX idx_policies_period_end ON policies(period_end);

-- Verify policies table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policies') THEN
        RAISE NOTICE '✓ Policies table created successfully';
    ELSE
        RAISE EXCEPTION '✗ Failed to create policies table';
    END IF;
END $$;

-- 2.3: Create policy_exclusions table (depends on policies and exclusions)
CREATE TABLE policy_exclusions (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    exclusion_id INTEGER NOT NULL REFERENCES exclusions(id) ON DELETE CASCADE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(policy_id, exclusion_id)
);

-- Create indexes for policy_exclusions
CREATE INDEX idx_policy_exclusions_policy_id ON policy_exclusions(policy_id);
CREATE INDEX idx_policy_exclusions_exclusion_id ON policy_exclusions(exclusion_id);

-- Verify policy_exclusions table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_exclusions') THEN
        RAISE NOTICE '✓ Policy_exclusions table created successfully';
    ELSE
        RAISE EXCEPTION '✗ Failed to create policy_exclusions table';
    END IF;
END $$;

-- 2.4: Create claims table (depends on policies)
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(100) NOT NULL UNIQUE,
    policy_id INTEGER NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    date_of_loss DATE NOT NULL,
    reported_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    cause_of_loss VARCHAR(50) NOT NULL,
    coverage VARCHAR(50) NOT NULL,
    description TEXT,
    product_lob VARCHAR(50) NOT NULL,
    insured_name VARCHAR(150),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add constraints for claims
ALTER TABLE claims ADD CONSTRAINT claims_status_check
    CHECK (status IN ('Open', 'UnderReview', 'Approved', 'Paid', 'Closed', 'SoftClosed'));

ALTER TABLE claims ADD CONSTRAINT claims_currency_check
    CHECK (currency IN ('BRL', 'USD', 'GBP', 'EUR'));

ALTER TABLE claims ADD CONSTRAINT claims_cause_of_loss_check
    CHECK (cause_of_loss IN ('EscapeOfWater', 'Fire', 'Theft', 'Storm', 'Flood', 'Earthquake', 'Vandalism'));

ALTER TABLE claims ADD CONSTRAINT claims_coverage_check
    CHECK (coverage IN ('MaterialDamage', 'BI', 'Stock', 'Fidelity', 'Other'));

ALTER TABLE claims ADD CONSTRAINT claims_product_lob_check
    CHECK (product_lob IN ('Property', 'Engineering', 'MobileDevice', 'FinancialLines'));

-- Added date validation constraint
ALTER TABLE claims ADD CONSTRAINT claims_date_validation_check
    CHECK (reported_date >= date_of_loss);

-- Create indexes for claims
CREATE INDEX idx_claims_policy_id ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_date_of_loss ON claims(date_of_loss);
CREATE INDEX idx_claims_reported_date ON claims(reported_date);

-- Verify claims table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'claims') THEN
        RAISE NOTICE '✓ Claims table created successfully';
    ELSE
        RAISE EXCEPTION '✗ Failed to create claims table';
    END IF;
END $$;

-- 2.5: Create activities table (depends on claims)
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'InProgress',
    title VARCHAR(200),
    description TEXT,
    assigned_to VARCHAR(100),
    due_date DATE,
    completed_date DATE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add constraints for activities
ALTER TABLE activities ADD CONSTRAINT activities_role_check
    CHECK (role IN ('Adjuster', 'Surveyor', 'Lawyer', 'Expert', 'Investigator'));

ALTER TABLE activities ADD CONSTRAINT activities_status_check
    CHECK (status IN ('InProgress', 'Completed', 'Pending', 'Cancelled'));

-- Added logical date constraint
ALTER TABLE activities ADD CONSTRAINT activities_date_validation_check
    CHECK (completed_date IS NULL OR completed_date >= due_date OR due_date IS NULL);

-- Create indexes for activities
CREATE INDEX idx_activities_claim_id ON activities(claim_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_due_date ON activities(due_date);
CREATE INDEX idx_activities_assigned_to ON activities(assigned_to);

-- Verify activities table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activities') THEN
        RAISE NOTICE '✓ Activities table created successfully';
    ELSE
        RAISE EXCEPTION '✗ Failed to create activities table';
    END IF;
END $$;

-- 2.6: Create movements table (depends on claims)
CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    coverage VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    movement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add constraints for movements
ALTER TABLE movements ADD CONSTRAINT movements_type_check
    CHECK (type IN ('ReserveIncrease', 'ReserveDecrease', 'Payment', 'Recovery'));

ALTER TABLE movements ADD CONSTRAINT movements_coverage_check
    CHECK (coverage IN ('MaterialDamage', 'BI', 'Stock', 'Fidelity', 'Other'));

-- Added amount validation constraint
ALTER TABLE movements ADD CONSTRAINT movements_amount_check
    CHECK (amount > 0);

-- Create indexes for movements
CREATE INDEX idx_movements_claim_id ON movements(claim_id);
CREATE INDEX idx_movements_type ON movements(type);
CREATE INDEX idx_movements_movement_date ON movements(movement_date);
CREATE INDEX idx_movements_coverage ON movements(coverage);

-- Verify movements table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'movements') THEN
        RAISE NOTICE '✓ Movements table created successfully';
    ELSE
        RAISE EXCEPTION '✗ Failed to create movements table';
    END IF;
END $$;

-- =====================================================
-- Step 3: Populate tables with 10 rows each
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Step 3: Populating tables with data...';
END $$;

-- 3.1: Populate exclusions (10 rows)
INSERT INTO exclusions (title, description) VALUES
('War and Military Action', 'Exclusion for damages caused by war, invasion, acts of foreign enemies, hostilities'),
('Nuclear Risks', 'Exclusion for nuclear reaction, nuclear radiation or radioactive contamination'),
('Terrorism', 'Exclusion for acts of terrorism as defined by applicable law'),
('Cyber Risks', 'Exclusion for losses arising from cyber attacks or data breaches'),
('Flood', 'Exclusion for damages caused by flood, surface water, or rising water table'),
('Earthquake', 'Exclusion for damages caused by earthquake, volcanic eruption, or earth movement'),
('Wear and Tear', 'Exclusion for gradual deterioration, wear and tear, or inherent vice'),
('Pollution', 'Exclusion for pollution or contamination of any kind'),
('Professional Liability', 'Exclusion for errors and omissions in professional services'),
('Employment Practices', 'Exclusion for wrongful termination, discrimination, or harassment claims');

-- Verify exclusions data
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM exclusions;
    IF row_count = 10 THEN
        RAISE NOTICE '✓ Exclusions populated successfully (% rows)', row_count;
    ELSE
        RAISE EXCEPTION '✗ Failed to populate exclusions. Expected 10 rows, found %', row_count;
    END IF;
END $$;

-- 3.2: Populate policies (10 rows) - Updated with varied coverage types
INSERT INTO policies (policy_number, period_start, period_end, named_insured, sum_insured, coverage_type, deductible, binder_ref) VALUES
('POL-2024-001', '2024-01-01', '2024-12-31', 'Global Manufacturing Ltd', 5000000.00, 'AllRisksProperty', 50000, 'BND-2024-001'),
('POL-2024-002', '2024-02-15', '2025-02-14', 'International Logistics Corp', 2500000.00, 'NamedPerils', 25000, 'BND-2024-002'),
('POL-2024-003', '2024-03-01', '2025-02-28', 'Advanced Tech Solutions Inc', 1000000.00, 'CyberLiability', 10000, 'BND-2024-003'),
('POL-2024-004', '2024-04-01', '2025-03-31', 'Digital Innovation LLC', 750000.00, 'AllRisksProperty', 15000, 'BND-2024-004'),
('POL-2024-005', '2024-05-01', '2025-04-30', 'Premier Finance Corp', 2000000.00, 'BusinessInterruption', 30000, 'BND-2024-005'),
('POL-2024-006', '2024-06-01', '2025-05-31', 'Retail Excellence Group', 1500000.00, 'GeneralLiability', 20000, 'BND-2024-006'),
('POL-2024-007', '2024-07-01', '2025-06-30', 'Healthcare Systems Ltd', 3000000.00, 'AllRisksProperty', 40000, 'BND-2024-007'),
('POL-2024-008', '2024-08-01', '2025-07-31', 'Energy Solutions Inc', 4000000.00, 'NamedPerils', 60000, 'BND-2024-008'),
('POL-2024-009', '2024-09-01', '2025-08-31', 'Construction Dynamics LLC', 2200000.00, 'AllRisksProperty', 35000, 'BND-2024-009'),
('POL-2024-010', '2024-10-01', '2025-09-30', 'Food Processing Corp', 1800000.00, 'BusinessInterruption', 25000, 'BND-2024-010');

-- Verify policies data
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM policies;
    IF row_count = 10 THEN
        RAISE NOTICE '✓ Policies populated successfully (% rows)', row_count;
    ELSE
        RAISE EXCEPTION '✗ Failed to populate policies. Expected 10 rows, found %', row_count;
    END IF;
END $$;

-- 3.3: Populate policy_exclusions (10 rows)
INSERT INTO policy_exclusions (policy_id, exclusion_id) VALUES
(1, 1), (1, 2), (2, 3), (2, 4), (3, 5),
(4, 6), (5, 7), (6, 8), (7, 9), (8, 10);

-- Verify policy_exclusions data
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM policy_exclusions;
    IF row_count = 10 THEN
        RAISE NOTICE '✓ Policy_exclusions populated successfully (% rows)', row_count;
    ELSE
        RAISE EXCEPTION '✗ Failed to populate policy_exclusions. Expected 10 rows, found %', row_count;
    END IF;
END $$;

-- 3.4: Populate claims (10 rows) - Updated with more varied data
INSERT INTO claims (claim_number, policy_id, date_of_loss, reported_date, status, currency, cause_of_loss, coverage, description, product_lob, insured_name) VALUES
('CLM-2024-001', 1, '2024-03-15', '2024-03-16', 'Open', 'USD', 'Fire', 'MaterialDamage', 'Fire damage to main production facility', 'Property', 'GigaMobile'),
('CLM-2024-002', 2, '2024-04-20', '2024-04-21', 'UnderReview', 'BRL', 'EscapeOfWater', 'MaterialDamage', 'Water damage from burst pipe in warehouse', 'Engineering', 'GigaMobile'),
('CLM-2024-003', 3, '2024-05-10', '2024-05-11', 'Approved', 'EUR', 'Theft', 'Stock', 'Theft of computer equipment from office', 'MobileDevice', 'GigaMobile'),
('CLM-2024-004', 4, '2024-06-05', '2024-06-06', 'Paid', 'USD', 'Storm', 'BI', 'Business interruption due to severe storm', 'FinancialLines', 'GigaMobile'),
('CLM-2024-005', 5, '2024-07-12', '2024-07-13', 'Closed', 'BRL', 'Vandalism', 'Fidelity', 'Vandalism damage to office building', 'Engineering', 'GigaMobile'),
('CLM-2024-006', 6, '2024-08-18', '2024-08-19', 'Open', 'GBP', 'Theft', 'Other', 'Theft of delivery vehicles', 'MobileDevice', 'GigaMobile'),
('CLM-2024-007', 7, '2024-09-22', '2024-09-23', 'UnderReview', 'EUR', 'Fire', 'MaterialDamage', 'Kitchen fire in hospital cafeteria', 'MobileDevice', 'GigaMobile'),
('CLM-2024-008', 8, '2024-10-14', '2024-10-15', 'Approved', 'USD', 'Flood', 'Stock', 'Flooding damage to inventory', 'Property', 'GigaMobile'),
('CLM-2024-009', 9, '2024-11-08', '2024-11-09', 'Open', 'BRL', 'Earthquake', 'MaterialDamage', 'Earthquake damage to construction site', 'Property', 'GigaMobile'),
('CLM-2024-010', 10, '2024-12-03', '2024-12-04', 'SoftClosed', 'USD', 'Fire', 'BI', 'Production halt due to machinery fire', 'MobileDevice', 'GigaMobile');

-- Verify claims data
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM claims;
    IF row_count = 10 THEN
        RAISE NOTICE '✓ Claims populated successfully (% rows)', row_count;
    ELSE
        RAISE EXCEPTION '✗ Failed to populate claims. Expected 10 rows, found %', row_count;
    END IF;
END $$;

-- 3.5: Populate activities (10 rows) - Updated with more varied roles and realistic dates
INSERT INTO activities (claim_id, role, status, title, description, assigned_to, due_date, completed_date) VALUES
(1, 'Adjuster', 'InProgress', 'Initial assessment', 'Initial assessment of fire damage', 'John Smith', '2024-03-25', NULL),
(2, 'Surveyor', 'Completed', 'Water damage', 'Water damage survey and documentation', 'Maria Santos', '2024-04-30', '2024-05-02'),
(3, 'Expert', 'Pending', 'IT security review', 'IT security expert review of theft circumstances', 'David Johnson', '2024-05-20', NULL),
(4, 'Adjuster', 'Completed', 'Business interruption', 'Business interruption loss calculation', 'Sarah Wilson', '2024-06-15', '2024-06-15'),
(5, 'Investigator', 'InProgress', 'Vandalism Investigation', 'Investigation of vandalism incident', 'Carlos Rodriguez', '2024-07-25', NULL),
(6, 'Lawyer', 'Pending', 'Police report', 'Police report review for vehicle theft', 'Emma Thompson', '2024-08-30', NULL),
(7, 'Adjuster', 'InProgress', 'Hospital fire', 'Hospital fire damage assessment', 'Michael Brown', '2024-10-05', NULL),
(8, 'Surveyor', 'Completed', 'Inventory', 'Inventory damage evaluation', 'Lisa Garcia', '2024-10-25', '2024-10-25'),
(9, 'Expert', 'Pending', 'Structural engineer', 'Structural engineer assessment', 'Robert Davis', '2024-11-20', NULL),
(10, 'Adjuster', 'Completed', 'Machinery damage', 'Machinery damage and BI assessment', 'Jennifer Lee', '2024-12-15', '2024-12-15');

-- Verify activities data
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM activities;
    IF row_count = 10 THEN
        RAISE NOTICE '✓ Activities populated successfully (% rows)', row_count;
    ELSE
        RAISE EXCEPTION '✗ Failed to populate activities. Expected 10 rows, found %', row_count;
    END IF;
END $$;

-- 3.6: Populate movements (10 rows)
INSERT INTO movements (claim_id, type, coverage, amount, description, movement_date) VALUES
(1, 'ReserveIncrease', 'MaterialDamage', 250000.00, 'Initial reserve for fire damage', '2024-03-17'),
(2, 'ReserveIncrease', 'MaterialDamage', 150000.00, 'Reserve for water damage repairs', '2024-04-22'),
(3, 'Payment', 'Stock', 45000.00, 'Payment for stolen computer equipment', '2024-05-15'),
(4, 'ReserveDecrease', 'BI', 75000.00, 'Reserve reduction after final assessment', '2024-06-18'),
(5, 'Recovery', 'Fidelity', 30000.00, 'Recovery from insurance investigation', '2024-07-20'),
(6, 'ReserveIncrease', 'Other', 120000.00, 'Reserve for stolen delivery vehicles', '2024-08-25'),
(7, 'Payment', 'MaterialDamage', 85000.00, 'Partial payment for hospital repairs', '2024-09-30'),
(8, 'ReserveIncrease', 'Stock', 200000.00, 'Reserve for flood-damaged inventory', '2024-10-20'),
(9, 'Payment', 'MaterialDamage', 180000.00, 'Payment for construction equipment', '2024-11-15'),
(10, 'ReserveDecrease', 'BI', 95000.00, 'Final reserve adjustment for machinery claim', '2024-12-12');

-- Verify movements data
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM movements;
    IF row_count = 10 THEN
        RAISE NOTICE '✓ Movements populated successfully (% rows)', row_count;
    ELSE
        RAISE EXCEPTION '✗ Failed to populate movements. Expected 10 rows, found %', row_count;
    END IF;
END $$;

-- =====================================================
-- Step 4: Final verification
-- =====================================================

DO $$
DECLARE
    total_tables INTEGER;
    total_rows INTEGER;
    total_indexes INTEGER;
    total_constraints INTEGER;
BEGIN
    RAISE NOTICE 'Step 4: Final verification...';

    -- Count tables
    SELECT COUNT(*) INTO total_tables
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('exclusions', 'policies', 'policy_exclusions', 'claims', 'activities', 'movements');

    -- Count total rows
    SELECT
        (SELECT COUNT(*) FROM exclusions) +
        (SELECT COUNT(*) FROM policies) +
        (SELECT COUNT(*) FROM policy_exclusions) +
        (SELECT COUNT(*) FROM claims) +
        (SELECT COUNT(*) FROM activities) +
        (SELECT COUNT(*) FROM movements)
    INTO total_rows;

    -- Count indexes
    SELECT COUNT(*) INTO total_indexes
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename IN ('exclusions', 'policies', 'policy_exclusions', 'claims', 'activities', 'movements');

    -- Count constraints
    SELECT COUNT(*) INTO total_constraints
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
    AND table_name IN ('exclusions', 'policies', 'policy_exclusions', 'claims', 'activities', 'movements')
    AND constraint_type IN ('CHECK', 'FOREIGN KEY', 'UNIQUE');

    IF total_tables = 6 AND total_rows = 60 THEN
        RAISE NOTICE '✅ DATABASE SETUP COMPLETED SUCCESSFULLY!';
        RAISE NOTICE '   - Tables created: %', total_tables;
        RAISE NOTICE '   - Total rows inserted: %', total_rows;
        RAISE NOTICE '   - Indexes created: %', total_indexes;
        RAISE NOTICE '   - Constraints applied: %', total_constraints;
        RAISE NOTICE '   - All foreign key relationships established';
        RAISE NOTICE '   - All data validation rules applied';
    ELSE
        RAISE EXCEPTION '❌ DATABASE SETUP FAILED! Tables: %, Rows: %', total_tables, total_rows;
    END IF;
END $$;
