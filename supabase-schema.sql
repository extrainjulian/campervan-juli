-- Supabase Schema for Campervan Month Bookings

-- Create month_bookings table
CREATE TABLE IF NOT EXISTS public.month_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    start_month INTEGER NOT NULL CHECK (start_month >= 1 AND start_month <= 12),
    start_year INTEGER NOT NULL CHECK (start_year >= 2026 AND start_year <= 2027),
    end_month INTEGER NOT NULL CHECK (end_month >= 1 AND end_month <= 12),
    end_year INTEGER NOT NULL CHECK (end_year >= 2026 AND end_year <= 2027),
    total_months INTEGER NOT NULL CHECK (total_months >= 1),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'booked', 'cancelled')),
    participant_name TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_month_bookings_date_range ON public.month_bookings (start_year, start_month, end_year, end_month);
CREATE INDEX IF NOT EXISTS idx_month_bookings_user_id ON public.month_bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_month_bookings_status ON public.month_bookings (status);

-- Enable RLS (Row Level Security)
ALTER TABLE public.month_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow all authenticated users to read all bookings (for availability display)
CREATE POLICY "Allow authenticated users to read all bookings" ON public.month_bookings
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow users to insert their own bookings
CREATE POLICY "Users can insert own bookings" ON public.month_bookings
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own bookings
CREATE POLICY "Users can update own bookings" ON public.month_bookings
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete only their own bookings
CREATE POLICY "Users can delete own bookings" ON public.month_bookings
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_month_bookings_updated_at
    BEFORE UPDATE ON public.month_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert some initial test data (hardcoded reservations for April, May, June 2026)
-- Note: These would typically be inserted manually or via a separate admin process
INSERT INTO public.month_bookings (
    user_id, 
    start_month, 
    start_year, 
    end_month, 
    end_year, 
    total_months, 
    status, 
    participant_name, 
    participant_email
) VALUES 
    -- April 2026 (hardcoded reservation)
    ('fb21fa05-bc9c-44bb-808a-439276271bfc', 4, 2026, 4, 2026, 1, 'booked', 'Juli (Owner)', 'juli@campervan-juli.com'),
    -- May 2026 (hardcoded reservation)  
    ('fb21fa05-bc9c-44bb-808a-439276271bfc', 5, 2026, 5, 2026, 1, 'booked', 'Juli (Owner)', 'juli@campervan-juli.com'),
    -- June 2026 (hardcoded reservation)
    ('fb21fa05-bc9c-44bb-808a-439276271bfc', 6, 2026, 6, 2026, 1, 'booked', 'Juli (Owner)', 'juli@campervan-juli.com')
ON CONFLICT DO NOTHING;