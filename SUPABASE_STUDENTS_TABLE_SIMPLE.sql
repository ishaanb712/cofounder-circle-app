-- Create students table for student registration data (Simplified for testing)
CREATE TABLE IF NOT EXISTS public.landing_page_students (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    year INTEGER NOT NULL,
    course TEXT NOT NULL,
    city TEXT NOT NULL,
    career_goals TEXT[] DEFAULT '{}',
    interest_area TEXT[] DEFAULT '{}',
    interest_level TEXT,
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    availability TEXT,
    payment_terms TEXT,
    location_preference TEXT,
    extra_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT landing_page_students_pkey PRIMARY KEY (id),
    CONSTRAINT landing_page_students_user_id_key UNIQUE (user_id),
    CONSTRAINT landing_page_students_email_key UNIQUE (email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_page_students_user_id ON public.landing_page_students(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_students_email ON public.landing_page_students(email);
CREATE INDEX IF NOT EXISTS idx_landing_page_students_college ON public.landing_page_students(college);
CREATE INDEX IF NOT EXISTS idx_landing_page_students_city ON public.landing_page_students(city);
CREATE INDEX IF NOT EXISTS idx_landing_page_students_created_at ON public.landing_page_students(created_at);

-- Temporarily disable RLS for testing
ALTER TABLE public.landing_page_students DISABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_students_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_landing_page_students_updated_at 
    BEFORE UPDATE ON public.landing_page_students 
    FOR EACH ROW EXECUTE FUNCTION update_students_updated_at_column(); 