import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollTop = window.scrollY;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop - 100 <= scrollTop) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-64 pl-8">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-4">
            <List className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">On this page</span>
          </div>
          
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-left py-1 transition-colors duration-200 ${
                  item.level === 1 ? 'pl-0' :
                  item.level === 2 ? 'pl-4' : 'pl-8'
                } ${
                  activeId === item.id 
                    ? 'toc-link active' 
                    : 'toc-link'
                }`}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}