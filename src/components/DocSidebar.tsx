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

interface DocSection {
  id: string;
  title: string;
  icon: typeof Book;
  items: {
    id: string;
    title: string;
    path: string;
  }[];
}

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    items: [
      { id: "introduction", title: "Introduction", path: "/docs/introduction" },
      { id: "quickstart", title: "Quick Start", path: "/docs/quickstart" },
      { id: "installation", title: "Installation", path: "/docs/installation" },
    ],
  },
  {
    id: "developers",
    title: "Developers",
    icon: Code,
    items: [
      { id: "api-overview", title: "API Overview", path: "/docs/developers/api" },
      { id: "sdk", title: "SDKs", path: "/docs/developers/sdk" },
      { id: "webhooks", title: "Webhooks", path: "/docs/developers/webhooks" },
    ],
  },
  {
    id: "apis",
    title: "APIs",
    icon: Database,
    items: [
      { id: "content-management", title: "Content Management API", path: "/docs/apis/content-management" },
      { id: "content-delivery", title: "Content Delivery API", path: "/docs/apis/content-delivery" },
      { id: "analytics", title: "Analytics API", path: "/docs/apis/analytics" },
    ],
  },
  {
    id: "authentication",
    title: "Authentication",
    icon: Key,
    items: [
      { id: "auth-overview", title: "Overview", path: "/docs/auth/overview" },
      { id: "api-keys", title: "API Keys", path: "/docs/auth/api-keys" },
      { id: "oauth", title: "OAuth", path: "/docs/auth/oauth" },
    ],
  },
  {
    id: "personalize",
    title: "Personalize",
    icon: Users,
    items: [
      { id: "user-profiles", title: "User Profiles", path: "/docs/personalize/profiles" },
      { id: "recommendations", title: "Recommendations", path: "/docs/personalize/recommendations" },
    ],
  },
  {
    id: "insights",
    title: "Data and Insights",
    icon: Zap,
    items: [
      { id: "analytics-overview", title: "Analytics Overview", path: "/docs/insights/analytics" },
      { id: "reporting", title: "Reporting", path: "/docs/insights/reporting" },
    ],
  },
];

export function DocSidebar() {
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
  const isParentActive = (section: DocSection) => 
    section.items.some(item => isActive(item.path));

  return (
    <Sidebar className="border-r border-doc-border-light">
      <SidebarContent className="p-0">
        <div className="p-4 border-b border-doc-border-light">
          <h2 className="text-lg font-semibold text-foreground">Documentation</h2>
        </div>
        
        <div className="p-2 space-y-1">
          {docSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections.has(section.id);
            const hasActiveChild = isParentActive(section);
            
            return (
              <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                    hasActiveChild && "bg-doc-nav-active-bg text-doc-nav-active"
                  )}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && <span>{section.title}</span>}
                    </div>
                    {!isCollapsed && (
                      isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                {!isCollapsed && (
                  <CollapsibleContent className="ml-6 mt-1 space-y-1">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => cn(
                          "block px-3 py-1.5 text-sm text-muted-foreground rounded-md transition-colors hover:bg-accent hover:text-foreground",
                          isActive && "bg-doc-nav-active-bg text-doc-nav-active font-medium"
                        )}
                      >
                        {item.title}
                      </NavLink>
                    ))}
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