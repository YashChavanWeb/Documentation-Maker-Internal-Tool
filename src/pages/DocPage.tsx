import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocLayout } from "@/components/DocLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  folder_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Folder {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function DocPage() {
  const { folderSlug, pageSlug } = useParams<{ folderSlug: string; pageSlug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (folderSlug && pageSlug) {
      fetchPageContent();
    }
  }, [folderSlug, pageSlug]);

  const fetchPageContent = async () => {
    try {
      // First get the folder
      const { data: folderData, error: folderError } = await supabase
        .from('folders')
        .select('*')
        .eq('slug', folderSlug)
        .single();

      if (folderError) throw folderError;

      // Then get the page
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageSlug)
        .eq('folder_id', folderData.id)
        .eq('is_published', true)
        .single();

      if (pageError) throw pageError;

      setFolder(folderData);
      setPage(pageData);
    } catch (error) {
      console.error('Error fetching page content:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-foreground">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-6 text-foreground">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2 mt-4 text-foreground">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-foreground leading-relaxed">')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <DocLayout>
        <div className="max-w-4xl mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </DocLayout>
    );
  }

  if (notFound || !page || !folder) {
    return (
      <DocLayout>
        <div className="max-w-4xl mx-auto py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The documentation page you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/docs')} className="bg-gradient-primary">
              Browse Documentation
            </Button>
          </div>
        </div>
      </DocLayout>
    );
  }

  return (
    <DocLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Breadcrumb and Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/docs')}
            className="px-0 text-muted-foreground hover:text-foreground"
          >
            Documentation
          </Button>
          <span>/</span>
          <span>{folder.name}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{page.title}</span>
        </div>

        {/* Page Header */}
        <div className="space-y-4 border-b border-doc-border-light pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2">{folder.name}</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {page.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <Badge variant="outline" className="text-xs">Published</Badge>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="prose prose-gray max-w-none">
          <div 
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: `<p class="mb-4 text-foreground leading-relaxed">${formatContent(page.content || '')}</p>` 
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="border-t border-doc-border-light pt-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Was this page helpful? Let us know!
          </div>
        </div>
      </div>
    </DocLayout>
  );
}