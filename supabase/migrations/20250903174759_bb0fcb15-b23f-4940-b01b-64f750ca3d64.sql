-- Create folders table
CREATE TABLE public.folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.folders(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  folder_id UUID REFERENCES public.folders(id),
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(slug, folder_id)
);

-- Enable Row Level Security
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, no auth required for documentation)
CREATE POLICY "Folders are viewable by everyone" 
ON public.folders 
FOR SELECT 
USING (true);

CREATE POLICY "Pages are viewable by everyone" 
ON public.pages 
FOR SELECT 
USING (is_published = true);

-- Admin policies (allow all operations without auth for now)
CREATE POLICY "Allow all folder operations" 
ON public.folders 
FOR ALL 
USING (true);

CREATE POLICY "Allow all page operations" 
ON public.pages 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_folders_slug ON public.folders(slug);
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_folder_id ON public.pages(folder_id);
CREATE INDEX idx_folders_parent_id ON public.folders(parent_id);

-- Insert sample data
INSERT INTO public.folders (name, slug, description) VALUES 
  ('Getting Started', 'getting-started', 'Learn the basics and get up and running quickly'),
  ('Developer Resources', 'developers', 'Comprehensive guides and references for developers'),
  ('API Reference', 'apis', 'Detailed documentation for all our REST APIs'),
  ('Authentication', 'authentication', 'Secure your applications with flexible auth methods'),
  ('Personalization', 'personalize', 'Create personalized experiences for your users'),
  ('Data & Insights', 'insights', 'Analyze your data and gain insights');

INSERT INTO public.pages (title, slug, content, folder_id, is_published) VALUES 
  ('Introduction', 'introduction', '# Introduction\n\nWelcome to our platform documentation. This guide will help you get started quickly and efficiently.', 
   (SELECT id FROM public.folders WHERE slug = 'getting-started'), true),
  ('Quick Start Guide', 'quickstart', '# Quick Start Guide\n\nGet up and running in minutes with our step-by-step guide.', 
   (SELECT id FROM public.folders WHERE slug = 'getting-started'), true),
  ('API Overview', 'api', '# API Overview\n\nOur REST API provides programmatic access to all platform features.', 
   (SELECT id FROM public.folders WHERE slug = 'developers'), true),
  ('Content Management API', 'content-management', '# Content Management API\n\nManage your content programmatically with our comprehensive API.', 
   (SELECT id FROM public.folders WHERE slug = 'apis'), true),
  ('Authentication Overview', 'overview', '# Authentication Overview\n\nSecure your applications with our flexible authentication system.', 
   (SELECT id FROM public.folders WHERE slug = 'authentication'), true);