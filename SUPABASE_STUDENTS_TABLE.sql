-- Create students table for student registration data
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.landing_page_students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow service role to read/write all student records
CREATE POLICY "Service role can manage all students" ON public.landing_page_students
    FOR ALL USING (auth.role() = 'service_role');

-- Allow users to view their own student record
CREATE POLICY "Users can view own student record" ON public.landing_page_students
    FOR SELECT USING (auth.uid()::text = user_id);

-- Allow users to insert their own student record
CREATE POLICY "Users can insert own student record" ON public.landing_page_students
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own student record
CREATE POLICY "Users can update own student record" ON public.landing_page_students
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Allow users to delete their own student record
CREATE POLICY "Users can delete own student record" ON public.landing_page_students
    FOR DELETE USING (auth.uid()::text = user_id);

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

-- Insert sample data (optional - for testing)
-- INSERT INTO public.landing_page_students (
--     user_id, name, email, phone, college, year, course, city,
--     career_goals, interest_area, interest_level,
--     resume_url, linkedin_url, github_url, portfolio_url,
--     availability, payment_terms, location_preference, extra_text
-- ) VALUES (
--     'sample-student-id',
--     'John Student',
--     'john@student.com',
--     '1234567890',
--     'Stanford University',
--     2024,
--     'Computer Science',
--     'Stanford',
--     ARRAY['Internship', 'Project'],
--     ARRAY['Tech', 'Product'],
--     'Curious',
--     'https://example.com/resume.pdf',
--     'https://linkedin.com/in/johnstudent',
--     'https://github.com/johnstudent',
--     'https://johnstudent.com',
--     '10-20 hours/week',
--     'Both paid and unpaid',
--     'Remote only',
--     'Interested in AI and machine learning projects'
-- ); 