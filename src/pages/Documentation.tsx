import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { DocLayout } from "@/components/DocLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Book, 
  ExternalLink, 
  MessageCircle, 
  Users, 
  Code, 
  Database, 
  Key, 
  Zap 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Folder {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  folder_id: string;
  is_published: boolean;
}

interface Section {
  folder: Folder;
  pages: Page[];
  icon: any;
  badge?: { text: string; variant: "default" | "secondary" | "outline" | "destructive"; };
}

const iconMap: { [key: string]: any } = {
  'get-started': Book,
  'documentation': Code,
  'agents': Zap,
  'authentication': Key,
  'apis': Database,
  'community': Users,
};

const badgeMap: { [key: string]: { text: string; variant: "default" | "secondary" | "outline" | "destructive" } } = {
  'get-started': { text: 'Start Here', variant: 'default' },
  'documentation': { text: 'Popular', variant: 'secondary' },
  'agents': { text: 'New', variant: 'outline' },
  'authentication': { text: 'Security', variant: 'destructive' },
  'apis': { text: 'v3.0', variant: 'outline' },
  'community': { text: 'Premium', variant: 'secondary' },
};

export default function Documentation() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch folders
      const { data: folders, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .order('sort_order', { ascending: true });

      if (foldersError) throw foldersError;

      // Fetch published pages
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (pagesError) throw pagesError;

      // Build sections from folders and pages
      const sectionsData = folders?.map((folder: Folder) => {
        const folderPages = pages?.filter((page: Page) => page.folder_id === folder.id) || [];
        const iconComponent = iconMap[folder.slug] || Book;
        const badgeInfo = badgeMap[folder.slug];

        return {
          folder,
          pages: folderPages,
          icon: iconComponent,
          badge: badgeInfo,
        };
      }) || [];

      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocLayout>
      <div className="px-8 py-6">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Comprehensive guides and documentation to help you get started with our platform quickly and efficiently.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="gap-2">
              <Book className="h-5 w-5" />
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <ExternalLink className="h-5 w-5" />
              View Examples
            </Button>
          </div>
        </div>

        {/* Documentation Sections */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 bg-card border-doc-border-light">
                <Skeleton className="h-8 w-8 mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {sections.map((section) => (
              <Card key={section.folder.id} className="p-6 bg-card border-doc-border-light hover:border-border transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {section.folder.name}
                    </h3>
                    {section.badge && (
                      <Badge variant={section.badge.variant} className="mt-1">
                        {section.badge.text}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {section.folder.description}
                </p>
                
                <div className="space-y-2">
                  {section.pages.slice(0, 3).map((page) => (
                    <NavLink
                      key={page.id}
                      to={`/docs/${section.folder.slug}/${page.slug}`}
                      className="block text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                      → {page.title}
                    </NavLink>
                  ))}
                  {section.pages.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{section.pages.length - 3} more pages
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Need Help Section */}
        <div className="text-center bg-card border border-doc-border-light rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Need Help?
          </h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? We're here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}