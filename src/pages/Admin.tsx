import { useState } from "react";
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

// Mock data for demonstration
const mockContent = [
  {
    id: "1",
    title: "Getting Started",
    type: "folder",
    path: "/getting-started",
    children: [
      { id: "1-1", title: "Introduction", type: "page", path: "/docs/introduction" },
      { id: "1-2", title: "Quick Start", type: "page", path: "/docs/quickstart" },
    ]
  },
  {
    id: "2",
    title: "API Reference",
    type: "folder", 
    path: "/api",
    children: [
      { id: "2-1", title: "Content Management API", type: "page", path: "/docs/apis/content-management" },
      { id: "2-2", title: "Authentication", type: "page", path: "/docs/auth/overview" },
    ]
  }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemType, setNewItemType] = useState<"folder" | "page">("page");

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Successfully logged in to admin panel");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleSaveContent = () => {
    if (!newItemTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    toast.success(`${newItemType === "folder" ? "Folder" : "Page"} "${newItemTitle}" created successfully`);
    setNewItemTitle("");
    setNewItemContent("");
  };

  const handlePublish = (item: any) => {
    toast.success(`"${item.title}" published successfully`);
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
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button onClick={handleSaveContent} className="bg-gradient-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save {newItemType === "folder" ? "Folder" : "Page"}
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
                    {mockContent.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handlePublish(item)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {item.children && (
                          <div className="ml-6 space-y-1">
                            {item.children.map((child: any) => (
                              <div key={child.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{child.title}</span>
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