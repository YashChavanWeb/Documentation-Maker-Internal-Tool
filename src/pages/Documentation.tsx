import { DocLayout } from "@/components/DocLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Code, Database, Key, Users, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  id: string;
  title: string;
  description: string;
  icon: any;
  badge: string;
  badgeVariant: "default" | "secondary" | "outline" | "destructive";
  links: Array<{ title: string; path: string; }>;
}

const iconMap: { [key: string]: any } = {
  'getting-started': Book,
  'developers': Code,
  'apis': Database,
  'authentication': Key,
  'personalize': Users,
  'insights': Zap,
};

const badgeMap: { [key: string]: { badge: string; variant: "default" | "secondary" | "outline" | "destructive" } } = {
  'getting-started': { badge: 'Start Here', variant: 'default' },
  'developers': { badge: 'Popular', variant: 'secondary' },
  'apis': { badge: 'v3.0', variant: 'outline' },
  'authentication': { badge: 'Security', variant: 'destructive' },
  'personalize': { badge: 'Premium', variant: 'secondary' },
  'insights': { badge: 'Analytics', variant: 'outline' },
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
        const badgeInfo = badgeMap[folder.slug] || { badge: 'New', variant: 'secondary' as const };

        return {
          id: folder.id,
          title: folder.name,
          description: folder.description || `Learn about ${folder.name}`,
          icon: iconComponent,
          badge: badgeInfo.badge,
          badgeVariant: badgeInfo.variant,
          links: folderPages.map((page: Page) => ({
            title: page.title,
            path: `/docs/${folder.slug}/${page.slug}`,
          })),
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome to our Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build amazing applications with our platform. 
            Get started quickly with our guides and explore our comprehensive API reference.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View API Reference
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Documentation Sections */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading documentation...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.id} className="hover:shadow-md transition-shadow border-doc-border-light">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-doc-nav-active-bg rounded-lg">
                        <Icon className="h-6 w-6 text-doc-nav-active" />
                      </div>
                      <Badge variant={section.badgeVariant}>{section.badge}</Badge>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {section.links.length > 0 ? (
                        section.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-1 group"
                          >
                            <span>{link.title}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No pages available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <div className="border-t border-doc-border-light pt-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Need Help?</h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline">
                Contact Support
              </Button>
              <Button variant="outline">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}