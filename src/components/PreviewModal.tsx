import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Eye, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface PreviewModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ title, content, isOpen, onClose }: PreviewModalProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getPreviewStyles = () => {
    switch (previewMode) {
      case 'tablet':
        return 'max-w-2xl';
      case 'mobile':
        return 'max-w-sm';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview: {title}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              Desktop
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              Tablet
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              Mobile
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-gradient-subtle rounded-lg p-6">
          <div className={`mx-auto bg-card border rounded-lg p-8 ${getPreviewStyles()}`}>
            {/* Preview Content */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground border-b border-doc-border-light pb-4">
                {title}
              </h1>
              
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                  prose-headings:text-foreground 
                  prose-p:text-muted-foreground
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground
                  prose-code:bg-doc-code-bg prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-doc-code-bg prose-pre:border prose-pre:border-doc-border-light
                  prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2
                  prose-img:rounded-lg prose-img:shadow-md
                  prose-table:border prose-table:border-doc-border-light
                  prose-th:bg-muted prose-th:border prose-th:border-doc-border-light
                  prose-td:border prose-td:border-doc-border-light"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              
              {!content && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No content to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}