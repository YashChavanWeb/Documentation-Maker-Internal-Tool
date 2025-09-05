import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, FileText, Folder, Book, Settings, BarChart3, Users, HelpCircle, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";

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

const iconMap: Record<string, any> = {
  "get-started": Book,
  "documentation": FileText,
  "agents": Zap,
  "settings": Settings,
  "analytics": BarChart3,
  "community": Users,
  "help": HelpCircle,
};

export function DocSidebar({ folders, pages, loading }: DocSidebarProps) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  return (
    <Sidebar className="border-r border-doc-border-light bg-sidebar-background w-64">
      <SidebarContent className="py-6">
        {loading ? (
          <div className="space-y-4 px-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <div className="pl-4 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {folders.map((folder) => {
              const folderPages = pages.filter(page => page.folder_id === folder.id);
              const IconComponent = iconMap[folder.slug] || Folder;
              const isActive = folderPages.some(page => 
                location.pathname === `/docs/${folder.slug}/${page.slug}`
              );
              const isOpen = openSections[folder.id] ?? isActive;

              return (
                <div key={folder.id}>
                  <Collapsible
                    open={isOpen}
                    onOpenChange={(open) => setOpenSections(prev => ({
                      ...prev,
                      [folder.id]: open
                    }))}
                  >
                    <CollapsibleTrigger className="sidebar-section-title w-full text-left">
                      {folder.name}
                    </CollapsibleTrigger>

                    {folderPages.length > 0 && (
                      <CollapsibleContent className="mt-2">
                        <div className="space-y-1">
                          {folderPages.map((page) => (
                            <NavLink
                              key={page.id}
                              to={`/docs/${folder.slug}/${page.slug}`}
                              className={({ isActive }) =>
                                `sidebar-nav-item ${isActive ? "active" : ""}`
                              }
                            >
                              <FileText className="h-4 w-4" />
                              <span>{page.title}</span>
                            </NavLink>
                          ))}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              );
            })}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}