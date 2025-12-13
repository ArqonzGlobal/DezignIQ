-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  gst_no TEXT,
  address TEXT,
  website TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  specifications JSONB,
  tags TEXT[],
  price DECIMAL(10, 2),
  images TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  price DECIMAL(12, 2),
  property_type TEXT CHECK (property_type IN ('Apartment', 'Individual House', 'Villa', 'Plot', 'Commercial')),
  listing_type TEXT CHECK (listing_type IN ('Buy', 'Sell', 'Rent')),
  description TEXT,
  features JSONB,
  tags TEXT[],
  images TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create professionals table
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_photo TEXT,
  company_logo TEXT,
  skill_sets TEXT[],
  specialization TEXT,
  completed_projects INTEGER DEFAULT 0,
  pricing_type TEXT CHECK (pricing_type IN ('hourly', 'package', 'project')),
  rate DECIMAL(10, 2),
  bio TEXT,
  portfolio_items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  images TEXT[],
  client_name TEXT,
  tags TEXT[],
  project_cost DECIMAL(12, 2),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'booked')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create requirements table
CREATE TABLE IF NOT EXISTS public.requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_description TEXT NOT NULL,
  quantity DECIMAL(10, 2),
  specifications TEXT,
  timeline TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'fulfilled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  sender_phone TEXT,
  enquiry_type TEXT CHECK (enquiry_type IN ('Product', 'Property', 'Project', 'Professional', 'Other')),
  reference_id UUID,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create endorsements table
CREATE TABLE IF NOT EXISTS public.endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endorser_name TEXT NOT NULL,
  endorser_company TEXT,
  testimonial TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create kyc_reviews table
CREATE TABLE IF NOT EXISTS public.kyc_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create credits_transactions table
CREATE TABLE IF NOT EXISTS public.credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'usage', 'refund')),
  amount DECIMAL(10, 2) NOT NULL,
  credits INTEGER NOT NULL,
  description TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_config table
CREATE TABLE IF NOT EXISTS public.user_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  show_projects BOOLEAN DEFAULT TRUE,
  show_properties BOOLEAN DEFAULT TRUE,
  show_professionals BOOLEAN DEFAULT TRUE,
  show_products BOOLEAN DEFAULT TRUE,
  brand_logo TEXT,
  theme_color TEXT DEFAULT '#1a7f7f',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for products
CREATE POLICY "Users can view their own products"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for properties
CREATE POLICY "Users can view their own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for professionals
CREATE POLICY "Users can view their own professional profile"
  ON public.professionals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own professional profile"
  ON public.professionals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profile"
  ON public.professionals FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for requirements
CREATE POLICY "Users can view their own requirements"
  ON public.requirements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requirements"
  ON public.requirements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requirements"
  ON public.requirements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requirements"
  ON public.requirements FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for enquiries
CREATE POLICY "Users can view their own enquiries"
  ON public.enquiries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own enquiries"
  ON public.enquiries FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for endorsements
CREATE POLICY "Users can view their own endorsements"
  ON public.endorsements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert endorsements"
  ON public.endorsements FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own endorsements"
  ON public.endorsements FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for kyc_reviews
CREATE POLICY "Users can view their own reviews"
  ON public.kyc_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert reviews"
  ON public.kyc_reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own reviews"
  ON public.kyc_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for credits_transactions
CREATE POLICY "Users can view their own transactions"
  ON public.credits_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.credits_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_config
CREATE POLICY "Users can view their own config"
  ON public.user_config FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own config"
  ON public.user_config FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own config"
  ON public.user_config FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own messages"
  ON public.chat_messages FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON public.requirements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_config_updated_at BEFORE UPDATE ON public.user_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();