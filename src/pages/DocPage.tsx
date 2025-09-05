import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DocLayout } from "@/components/DocLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { ArrowLeft, Calendar, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
    return content
      .replace(/^# (.+$)/gm, (match, p1) => {
        const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h1 id="${id}" class="text-3xl font-bold mb-6 text-foreground">${p1}</h1>`;
      })
      .replace(/^## (.+$)/gm, (match, p1) => {
        const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h2 id="${id}" class="text-2xl font-semibold mb-4 mt-8 text-foreground">${p1}</h2>`;
      })
      .replace(/^### (.+$)/gm, (match, p1) => {
        const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h3 id="${id}" class="text-xl font-semibold mb-3 mt-6 text-foreground">${p1}</h3>`;
      })
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded text-sm font-mono bg-muted text-foreground">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-foreground leading-relaxed">')
      .replace(/^/, '<p class="mb-4 text-foreground leading-relaxed">')
      .replace(/$/, '</p>');
  };

  return (
    <DocLayout>
      <div className="flex">
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-96" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ) : notFound ? (
            <div className="max-w-4xl mx-auto px-8 py-12 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The documentation page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate(-1)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button onClick={() => navigate('/docs')}>
                  Browse Documentation
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-8 py-6">
              {/* Breadcrumb */}
              <nav className="flex items-center text-sm text-muted-foreground mb-8">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/docs')}
                  className="p-0 h-auto font-normal hover:text-foreground"
                >
                  Documentation
                </Button>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">{folder?.name}</span>
              </nav>

              {/* Page Header */}
              <header className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant="outline" className="text-xs font-medium">
                    {folder?.name}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
                  {page?.title}
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {folder?.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-doc-border-light pb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Last updated: {page?.updated_at 
                        ? new Date(page.updated_at).toLocaleDateString() 
                        : 'Unknown'
                      }
                    </span>
                  </div>
                </div>
              </header>

              {/* Content */}
              <div 
                className="doc-content text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: page?.content ? formatContent(page.content) : '' 
                }}
              />

              {/* Footer */}
              <footer className="mt-16 pt-8 border-t border-doc-border-light">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to previous page
                </Button>
              </footer>
            </div>
          )}
        </div>
        
        {/* Table of Contents */}
        {!loading && !notFound && page?.content && (
          <TableOfContents content={page.content} />
        )}
      </div>
    </DocLayout>
  );
}
}