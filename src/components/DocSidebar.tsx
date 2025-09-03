import { useState } from "react";
import { ChevronDown, ChevronRight, Book, Code, Settings, Users, Key, Database, FileText, Zap } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

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

interface DocSidebarProps {
  folders: Folder[];
  pages: Page[];
  loading: boolean;
}

const iconMap: { [key: string]: any } = {
  'getting-started': Book,
  'developers': Code,
  'apis': Database,
  'authentication': Key,
  'personalize': Users,
  'insights': Zap,
};

export function DocSidebar({ folders, pages, loading }: DocSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["getting-started"]));
  
  const isCollapsed = state === "collapsed";

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const isActive = (path: string) => location.pathname === path;
  
  const isParentActive = (folder: Folder) => {
    const folderPages = pages.filter(page => page.folder_id === folder.id);
    return folderPages.some(page => isActive(`/docs/${folder.slug}/${page.slug}`));
  };

  if (loading) {
    return (
      <Sidebar className="border-r border-doc-border-light">
        <SidebarContent className="p-0">
          <div className="p-4 border-b border-doc-border-light">
            <h2 className="text-lg font-semibold text-foreground">Documentation</h2>
          </div>
          <div className="p-2 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-doc-border-light">
      <SidebarContent className="p-0">
        <div className="p-4 border-b border-doc-border-light">
          <h2 className="text-lg font-semibold text-foreground">Documentation</h2>
        </div>
        
        <div className="p-2 space-y-1">
          {folders.map((folder) => {
            const Icon = iconMap[folder.slug] || Book;
            const isOpen = openSections.has(folder.id);
            const hasActiveChild = isParentActive(folder);
            const folderPages = pages.filter(page => page.folder_id === folder.id);
            
            return (
              <Collapsible key={folder.id} open={isOpen} onOpenChange={() => toggleSection(folder.id)}>
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                    hasActiveChild && "bg-doc-nav-active-bg text-doc-nav-active"
                  )}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && <span>{folder.name}</span>}
                    </div>
                    {!isCollapsed && (
                      isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                {!isCollapsed && (
                  <CollapsibleContent className="ml-6 mt-1 space-y-1">
                    {folderPages.length > 0 ? (
                      folderPages.map((page) => (
                        <NavLink
                          key={page.id}
                          to={`/docs/${folder.slug}/${page.slug}`}
                          className={({ isActive }) => cn(
                            "block px-3 py-1.5 text-sm text-muted-foreground rounded-md transition-colors hover:bg-accent hover:text-foreground",
                            isActive && "bg-doc-nav-active-bg text-doc-nav-active font-medium"
                          )}
                        >
                          {page.title}
                        </NavLink>
                      ))
                    ) : (
                      <div className="px-3 py-1.5 text-xs text-muted-foreground">
                        No pages available
                      </div>
                    )}
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}