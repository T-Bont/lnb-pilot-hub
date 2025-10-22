-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  num_employees INTEGER DEFAULT 0,
  budget DECIMAL(12, 2),
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE,
  available_pto_hrs DECIMAL(5, 2) DEFAULT 0,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shifts table
CREATE TABLE public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'open')),
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES public.shifts(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('leave', 'shift_pickup', 'shift_swap')),
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create flights table
CREATE TABLE public.flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number TEXT NOT NULL UNIQUE,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  num_passengers INTEGER DEFAULT 0,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments (viewable by all authenticated users)
CREATE POLICY "Departments are viewable by authenticated users"
  ON public.departments FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policies for employees
CREATE POLICY "Employees can view all employees"
  ON public.employees FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Employees can update their own profile"
  ON public.employees FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for shifts
CREATE POLICY "Shifts are viewable by authenticated users"
  ON public.shifts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Employees can create shifts"
  ON public.shifts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Employees can update shifts"
  ON public.shifts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policies for requests
CREATE POLICY "Users can view all requests"
  ON public.requests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create requests"
  ON public.requests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own requests"
  ON public.requests FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policies for flights
CREATE POLICY "Flights are viewable by authenticated users"
  ON public.flights FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert dummy data for departments
INSERT INTO public.departments (name, num_employees, budget, location) VALUES
  ('Flight Operations', 45, 2500000.00, 'New York'),
  ('Cabin Crew', 120, 1800000.00, 'Los Angeles'),
  ('Ground Services', 85, 1200000.00, 'Chicago'),
  ('Maintenance', 35, 950000.00, 'Dallas'),
  ('Customer Service', 60, 750000.00, 'Miami');

-- Insert dummy flights
INSERT INTO public.flights (flight_number, departure_time, arrival_time, num_passengers, origin, destination) VALUES
  ('LNB101', now() + interval '2 hours', now() + interval '5 hours', 156, 'New York', 'Los Angeles'),
  ('LNB202', now() + interval '4 hours', now() + interval '7 hours', 189, 'Chicago', 'Miami'),
  ('LNB303', now() + interval '1 hour', now() + interval '4 hours', 145, 'Dallas', 'New York'),
  ('LNB404', now() + interval '3 hours', now() + interval '6 hours', 167, 'Los Angeles', 'Chicago');