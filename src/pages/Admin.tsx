import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FileText, 
  Folder, 
  Edit, 
  Trash2, 
  Save, 
  Eye,
  Settings,
  Users,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
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

interface ContentItem {
  id: string;
  name: string;
  type: "folder" | "page";
  slug: string;
  folder_id?: string;
  is_published?: boolean;
  children?: ContentItem[];
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemType, setNewItemType] = useState<"folder" | "page">("page");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [contentStructure, setContentStructure] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch content when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchContent();
    }
  }, [isAuthenticated]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const fetchContent = async () => {
    try {
      // Fetch folders
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .order('sort_order', { ascending: true });

      if (foldersError) throw foldersError;

      // Fetch pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (pagesError) throw pagesError;

      setFolders(foldersData || []);
      setPages(pagesData || []);
      buildContentStructure(foldersData || [], pagesData || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error("Failed to fetch content");
    }
  };

  const buildContentStructure = (foldersData: Folder[], pagesData: Page[]) => {
    const structure = foldersData.map(folder => ({
      id: folder.id,
      name: folder.name,
      type: "folder" as const,
      slug: folder.slug,
      children: pagesData
        .filter(page => page.folder_id === folder.id)
        .map(page => ({
          id: page.id,
          name: page.title,
          type: "page" as const,
          slug: page.slug,
          folder_id: page.folder_id,
          is_published: page.is_published
        }))
    }));
    setContentStructure(structure);
  };

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Successfully logged in to admin panel");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleSaveContent = async () => {
    if (!newItemTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (newItemType === "page" && !selectedFolderId) {
      toast.error("Please select a folder for the page");
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(newItemTitle);

      if (newItemType === "folder") {
        const { error } = await supabase
          .from('folders')
          .insert([{ name: newItemTitle, slug, description: newItemContent || "" }]);
        
        if (error) throw error;
        toast.success(`Folder "${newItemTitle}" created successfully`);
      } else {
        const { error } = await supabase
          .from('pages')
          .insert([{
            title: newItemTitle,
            slug,
            content: newItemContent,
            folder_id: selectedFolderId,
            is_published: false
          }]);
        
        if (error) throw error;
        toast.success(`Page "${newItemTitle}" created successfully`);
      }

      // Reset form
      setNewItemTitle("");
      setNewItemContent("");
      setSelectedFolderId("");
      
      // Refresh content
      fetchContent();
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error(error.message || "Failed to save content");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (item: ContentItem) => {
    if (item.type === "page") {
      try {
        const { error } = await supabase
          .from('pages')
          .update({ is_published: !item.is_published })
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast.success(`Page "${item.name}" ${item.is_published ? 'unpublished' : 'published'} successfully`);
        fetchContent();
      } catch (error: any) {
        console.error('Error updating page:', error);
        toast.error("Failed to update page");
      }
    }
  };

  const handleDelete = async (item: ContentItem) => {
    try {
      if (item.type === "folder") {
        const { error } = await supabase.from('folders').delete().eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pages').delete().eq('id', item.id);
        if (error) throw error;
      }
      
      toast.success(`${item.type === "folder" ? "Folder" : "Page"} "${item.name}" deleted successfully`);
      fetchContent();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error("Failed to delete item");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter the admin password to access the content management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-gradient-primary hover:opacity-90">
              Login to Admin Panel
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Demo password: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-doc-border-light bg-doc-header">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-doc-header-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Content Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Logged in as Admin</Badge>
              <Button 
                variant="outline" 
                onClick={() => setIsAuthenticated(false)}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create New Content</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="item-type" className="text-sm">Type:</Label>
                <select
                  id="item-type"
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value as "folder" | "page")}
                  className="px-3 py-1 border border-input rounded-md text-sm"
                >
                  <option value="page">Page</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    New {newItemType === "folder" ? "Folder" : "Page"}
                  </CardTitle>
                  <CardDescription>
                    Create a new {newItemType === "folder" ? "folder to organize content" : "documentation page"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder={`Enter ${newItemType} title`}
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                    />
                  </div>
                  
                  {newItemType === "page" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="folder">Select Folder</Label>
                        <select
                          id="folder"
                          value={selectedFolderId}
                          onChange={(e) => setSelectedFolderId(e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md text-sm"
                          required
                        >
                          <option value="">Choose a folder...</option>
                          {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Write your documentation content here..."
                          className="min-h-[200px]"
                          value={newItemContent}
                          onChange={(e) => setNewItemContent(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {newItemType === "folder" && (
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter folder description..."
                        className="min-h-[100px]"
                        value={newItemContent}
                        onChange={(e) => setNewItemContent(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button onClick={handleSaveContent} disabled={loading} className="bg-gradient-primary">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : `Save ${newItemType === "folder" ? "Folder" : "Page"}`}
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Structure</CardTitle>
                  <CardDescription>Current documentation structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contentStructure.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {item.children && item.children.length > 0 && (
                          <div className="ml-6 space-y-1">
                            {item.children.map((child: ContentItem) => (
                              <div key={child.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{child.name}</span>
                                  {child.is_published ? (
                                    <Badge variant="default" className="text-xs">Published</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">Draft</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handlePublish(child)}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleDelete(child)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle>Site Structure</CardTitle>
                <CardDescription>Manage your documentation structure and navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Site structure management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View your documentation usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure your documentation system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}