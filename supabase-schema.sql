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

-- ========================================
-- NEW DATE-BASED BOOKING SYSTEM (2-week minimum)
-- ========================================

-- Create date_bookings table for the new 2-week minimum system
CREATE TABLE IF NOT EXISTS public.date_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL CHECK (total_days >= 14), -- 2-week minimum (14 days)
    total_cost INTEGER NOT NULL CHECK (total_cost >= 700), -- in euros, 50€/day minimum (14 days * 50€ = 700€ = 70000 cents)
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    participant_name TEXT NOT NULL,
    participant_email TEXT NOT NULL,
    participant_phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    -- Ensure end_date is after start_date and within reasonable limits (2026-2027)
    CONSTRAINT check_date_range CHECK (end_date > start_date),
    CONSTRAINT check_date_years CHECK (
        start_date >= '2026-01-01' AND start_date <= '2027-12-31' AND
        end_date >= '2026-01-01' AND end_date <= '2027-12-31'
    )
);

-- Create indexes for faster queries on date ranges and overlaps
CREATE INDEX IF NOT EXISTS idx_date_bookings_date_range ON public.date_bookings (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_date_bookings_user_id ON public.date_bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_date_bookings_status ON public.date_bookings (status);
CREATE INDEX IF NOT EXISTS idx_date_bookings_start_date ON public.date_bookings (start_date);
CREATE INDEX IF NOT EXISTS idx_date_bookings_end_date ON public.date_bookings (end_date);

-- Enable RLS (Row Level Security) for date_bookings
ALTER TABLE public.date_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for date_bookings

-- Allow PUBLIC READ for availability display (no authentication required)
CREATE POLICY "Public read for date booking availability" ON public.date_bookings
    FOR SELECT 
    TO public
    USING (true);

-- Allow authenticated users to insert their own bookings
CREATE POLICY "Authenticated users can insert date bookings" ON public.date_bookings
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own bookings
CREATE POLICY "Users can update own date bookings" ON public.date_bookings
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete only their own bookings
CREATE POLICY "Users can delete own date bookings" ON public.date_bookings
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at for date_bookings
CREATE TRIGGER trigger_date_bookings_updated_at
    BEFORE UPDATE ON public.date_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to check for date range overlaps (utility for the app)
CREATE OR REPLACE FUNCTION public.check_date_booking_overlap(
    check_start_date DATE,
    check_end_date DATE,
    exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.date_bookings 
        WHERE 
            status IN ('pending', 'confirmed') -- Don't block cancelled bookings
            AND (exclude_booking_id IS NULL OR id != exclude_booking_id)
            AND NOT (
                check_end_date < start_date OR 
                check_start_date > end_date
            )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate total cost based on days (50€ per day)
CREATE OR REPLACE FUNCTION public.calculate_booking_cost(
    booking_start_date DATE,
    booking_end_date DATE
)
RETURNS INTEGER AS $$
BEGIN
    RETURN (booking_end_date - booking_start_date + 1) * 5000; -- 50€ = 5000 cents per day
END;
$$ LANGUAGE plpgsql;

-- Insert some example blocked dates (owner usage, maintenance, etc.)
INSERT INTO public.date_bookings (
    user_id, 
    start_date, 
    end_date, 
    total_days, 
    total_cost,
    status, 
    participant_name, 
    participant_email,
    notes
) VALUES 
    -- Owner maintenance period in April 2026 (2 weeks)
    ('fb21fa05-bc9c-44bb-808a-439276271bfc', '2026-04-01', '2026-04-14', 14, 700, 'confirmed', 'Juli (Owner)', 'juli@wuecamper.com', 'Initial setup and maintenance'),
    -- Owner usage in June 2026 (3 weeks) 
    ('fb21fa05-bc9c-44bb-808a-439276271bfc', '2026-06-15', '2026-07-05', 21, 1050, 'confirmed', 'Juli (Owner)', 'juli@wuecamper.com', 'Owner vacation period')
ON CONFLICT DO NOTHING;