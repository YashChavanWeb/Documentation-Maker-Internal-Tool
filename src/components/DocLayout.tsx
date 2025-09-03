import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DocSidebar } from "./DocSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface DocLayoutProps {
  children: ReactNode;
}

export function DocLayout({ children }: DocLayoutProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSidebarContent();
  }, []);

  const fetchSidebarContent = async () => {
    try {
      // Fetch folders
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .order('sort_order', { ascending: true });

      if (foldersError) throw foldersError;

      // Fetch published pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (pagesError) throw pagesError;

      setFolders(foldersData || []);
      setPages(pagesData || []);
    } catch (error) {
      console.error('Error fetching sidebar content:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DocSidebar folders={folders} pages={pages} loading={loading} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-doc-border-light bg-doc-header flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 hover:bg-accent rounded-md transition-colors">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <h1 className="text-xl font-semibold text-doc-header-foreground">Documentation</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-10 bg-background border-doc-border-light"
                />
              </div>
              <Button variant="outline" size="sm">
                Changelog
              </Button>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}