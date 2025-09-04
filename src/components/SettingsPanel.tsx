import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Settings, 
  Globe, 
  Palette, 
  Shield, 
  Bell,
  Save,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl: string;
  favicon: string;
  primaryColor: string;
  fontFamily: string;
  enableAnalytics: boolean;
  enableComments: boolean;
  enableSearch: boolean;
  maintenanceMode: boolean;
  publicRegistration: boolean;
  seoTitle: string;
  seoDescription: string;
  socialImageUrl: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Documentation Hub',
  siteDescription: 'Professional documentation platform',
  siteUrl: 'https://docs.example.com',
  logoUrl: '',
  favicon: '',
  primaryColor: '#3B82F6',
  fontFamily: 'Inter',
  enableAnalytics: true,
  enableComments: false,
  enableSearch: true,
  maintenanceMode: false,
  publicRegistration: false,
  seoTitle: 'Documentation Hub - Professional Docs',
  seoDescription: 'Comprehensive documentation platform for teams',
  socialImageUrl: ''
};

export function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // In a real implementation, load from Supabase or localStorage
    const saved = localStorage.getItem('doc-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, save to Supabase
      localStorage.setItem('doc-settings', JSON.stringify(settings));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documentation-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully!');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
          toast.success('Settings imported successfully!');
        } catch (error) {
          toast.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">System Settings</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
          <Button onClick={saveSettings} disabled={loading} className="bg-gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your documentation site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={settings.favicon}
                    onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Styling</CardTitle>
              <CardDescription>Customize the appearance of your documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable various features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnalytics">Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">Track page views and user behavior</p>
                </div>
                <Switch
                  id="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableComments">Comments System</Label>
                  <p className="text-sm text-muted-foreground">Allow users to comment on pages</p>
                </div>
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableComments: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableSearch">Search Functionality</Label>
                  <p className="text-sm text-muted-foreground">Enable site-wide search</p>
                </div>
                <Switch
                  id="enableSearch"
                  checked={settings.enableSearch}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableSearch: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
                </div>
                <div className="flex items-center gap-2">
                  {settings.maintenanceMode && (
                    <Badge variant="destructive">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Site Hidden
                    </Badge>
                  )}
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="publicRegistration">Public Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow public user registration</p>
                </div>
                <Switch
                  id="publicRegistration"
                  checked={settings.publicRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, publicRegistration: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
              <CardDescription>Optimize your documentation for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={settings.seoTitle}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                  placeholder="Your site title for search engines"
                />
              </div>
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seoDescription}
                  onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                  placeholder="Brief description for search engine results"
                />
              </div>
              <div>
                <Label htmlFor="socialImageUrl">Social Media Image</Label>
                <Input
                  id="socialImageUrl"
                  value={settings.socialImageUrl}
                  onChange={(e) => setSettings({ ...settings, socialImageUrl: e.target.value })}
                  placeholder="https://example.com/social-image.png"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reset All Settings</h4>
              <p className="text-sm text-muted-foreground">This will reset all settings to their default values</p>
            </div>
            <Button variant="destructive" onClick={resetSettings}>
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}