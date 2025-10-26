-- First, add new columns to shifts table to match CSV data
ALTER TABLE public.shifts
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS job_role TEXT,
ADD COLUMN IF NOT EXISTS shift_hours NUMERIC,
ADD COLUMN IF NOT EXISTS incentive_bonus NUMERIC,
ADD COLUMN IF NOT EXISTS airport_code TEXT;

-- Update shifts table to reference destinations by airport_code
ALTER TABLE public.shifts
ADD CONSTRAINT fk_shifts_airport_code 
FOREIGN KEY (airport_code) 
REFERENCES public.destinations(airport_code);

-- Clear existing destinations and related data using CASCADE
TRUNCATE TABLE public.destinations CASCADE;

-- Insert destinations from the CSV data
INSERT INTO public.destinations (name, city, state_province, country, airport_code, latitude, longitude) VALUES
('John F. Kennedy Intl', 'New York', 'NY', 'USA', 'JFK', 40.6413, -73.7781),
('Los Angeles Intl', 'Los Angeles', 'CA', 'USA', 'LAX', 33.9416, -118.4085),
('O''Hare Intl', 'Chicago', 'IL', 'USA', 'ORD', 41.9742, -87.9073),
('Dallas/Fort Worth Intl', 'Dallas', 'TX', 'USA', 'DFW', 32.8998, -97.0403),
('Hartsfield-Jackson Intl', 'Atlanta', 'GA', 'USA', 'ATL', 33.6407, -84.4277),
('Miami Intl', 'Miami', 'FL', 'USA', 'MIA', 25.7959, -80.287),
('San Francisco Intl', 'San Francisco', 'CA', 'USA', 'SFO', 37.6213, -122.379);

-- Insert shifts from the CSV data (Open->open, Filled->scheduled)
INSERT INTO public.shifts (id, airport_code, department, job_role, shift_date, shift_start, shift_end, shift_hours, status, incentive_bonus, location) VALUES
(gen_random_uuid(), 'JFK', 'Ground crew', 'Gate Agent', '2025-11-01', '05:00', '13:00', 8, 'open', 150, 'JFK'),
(gen_random_uuid(), 'LAX', 'In-flight crew', 'Flight Attendant', '2025-11-01', '09:00', '17:00', 8, 'open', 100, 'LAX'),
(gen_random_uuid(), 'ORD', 'Ground crew', 'Baggage Handler', '2025-11-01', '14:00', '22:00', 8, 'scheduled', 100, 'ORD'),
(gen_random_uuid(), 'DFW', 'Pilots', 'First Officer', '2025-11-02', '06:00', '14:00', 8, 'open', 300, 'DFW'),
(gen_random_uuid(), 'ATL', 'Customer service', 'Ticketing Agent', '2025-11-02', '08:00', '16:00', 8, 'open', 120, 'ATL'),
(gen_random_uuid(), 'ORD', 'In-flight crew', 'Flight Attendant', '2025-11-02', '10:00', '18:00', 8, 'open', 100, 'ORD'),
(gen_random_uuid(), 'MIA', 'Ground crew', 'Ramp Agent', '2025-11-03', '22:00', '06:00', 8, 'open', 175, 'MIA'),
(gen_random_uuid(), 'JFK', 'Customer service', 'Lounge Staff', '2025-11-03', '07:00', '15:00', 8, 'scheduled', 100, 'JFK'),
(gen_random_uuid(), 'LAX', 'Pilots', 'Captain', '2025-11-03', '12:00', '20:00', 8, 'open', 400, 'LAX'),
(gen_random_uuid(), 'SFO', 'In-flight crew', 'Flight Attendant', '2025-11-04', '05:00', '13:00', 8, 'open', 100, 'SFO'),
(gen_random_uuid(), 'ORD', 'Ground crew', 'Gate Agent', '2025-11-04', '13:00', '21:00', 8, 'open', 150, 'ORD'),
(gen_random_uuid(), 'DFW', 'In-flight crew', 'Flight Attendant', '2025-11-04', '15:00', '23:00', 8, 'open', 100, 'DFW'),
(gen_random_uuid(), 'ATL', 'Ground crew', 'Baggage Handler', '2025-11-05', '04:00', '12:00', 8, 'open', 150, 'ATL'),
(gen_random_uuid(), 'JFK', 'Pilots', 'First Officer', '2025-11-05', '10:00', '18:00', 8, 'open', 300, 'JFK'),
(gen_random_uuid(), 'LAX', 'Ground crew', 'Gate Agent', '2025-11-05', '12:00', '20:00', 8, 'scheduled', 150, 'LAX'),
(gen_random_uuid(), 'ORD', 'Customer service', 'Ticketing Agent', '2025-11-06', '09:00', '17:00', 8, 'open', 120, 'ORD'),
(gen_random_uuid(), 'MIA', 'In-flight crew', 'Flight Attendant', '2025-11-06', '11:00', '19:00', 8, 'open', 100, 'MIA'),
(gen_random_uuid(), 'SFO', 'Pilots', 'Captain', '2025-11-06', '07:00', '15:00', 8, 'open', 400, 'SFO'),
(gen_random_uuid(), 'ATL', 'Ground crew', 'Ramp Agent', '2025-11-07', '15:00', '23:00', 8, 'open', 175, 'ATL'),
(gen_random_uuid(), 'JFK', 'In-flight crew', 'Flight Attendant', '2025-11-07', '10:00', '18:00', 8, 'open', 100, 'JFK');