import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DocSidebar } from "./DocSidebar";
import { DocHeader } from "./DocHeader";
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
    <div className="min-h-screen bg-background">
      <DocHeader />
      
      <SidebarProvider>
        <div className="flex w-full">
          <DocSidebar folders={folders} pages={pages} loading={loading} />
          
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}