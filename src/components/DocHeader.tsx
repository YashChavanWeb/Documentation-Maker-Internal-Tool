import { Search, Github, MessageSquare, Users, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DocHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-doc-border-light bg-doc-header/95 backdrop-blur supports-[backdrop-filter]:bg-doc-header/60">
      <div className="container mx-auto px-6">
        {/* Top Bar */}
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-foreground"></div>
              <span className="text-lg font-semibold">phidata</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-input border-border focus:border-ring"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                Ctrl K
              </kbd>
            </div>
            
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask AI
            </Button>
            
            <Button variant="ghost" size="sm">
              Discord
            </Button>
            
            <Button variant="ghost" size="sm">
              Community
            </Button>
            
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span className="text-sm">agno-agi/phidata</span>
              <Badge variant="secondary" className="text-xs">202</Badge>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex h-12 items-center border-t border-doc-border-light">
          <nav className="flex gap-8">
            <a href="/docs" className="header-nav-item active">
              Documentation
            </a>
            <a href="#" className="header-nav-item text-muted-foreground">
              Examples
            </a>
            <a href="#" className="header-nav-item text-muted-foreground">
              Templates
            </a>
            <a href="#" className="header-nav-item text-muted-foreground">
              Product Updates
            </a>
            <a href="#" className="header-nav-item text-muted-foreground">
              Reference
            </a>
            <a href="#" className="header-nav-item text-muted-foreground">
              FAQs
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}