import { DocLayout } from "@/components/DocLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Code, Database, Key, Users, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics and get up and running quickly with our platform.",
    icon: Book,
    badge: "Start Here",
    badgeVariant: "default" as const,
    links: [
      { title: "Introduction", path: "/docs/introduction" },
      { title: "Quick Start Guide", path: "/docs/quickstart" },
      { title: "Installation", path: "/docs/installation" },
    ],
  },
  {
    id: "developers",
    title: "Developer Resources",
    description: "Comprehensive guides and references for developers building with our APIs.",
    icon: Code,
    badge: "Popular",
    badgeVariant: "secondary" as const,
    links: [
      { title: "API Overview", path: "/docs/developers/api" },
      { title: "SDKs & Libraries", path: "/docs/developers/sdk" },
      { title: "Webhooks", path: "/docs/developers/webhooks" },
    ],
  },
  {
    id: "apis",
    title: "API Reference",
    description: "Detailed documentation for all our REST APIs and endpoints.",
    icon: Database,
    badge: "v3.0",
    badgeVariant: "outline" as const,
    links: [
      { title: "Content Management API", path: "/docs/apis/content-management" },
      { title: "Content Delivery API", path: "/docs/apis/content-delivery" },
      { title: "Analytics API", path: "/docs/apis/analytics" },
    ],
  },
  {
    id: "authentication",
    title: "Authentication",
    description: "Secure your applications with our flexible authentication methods.",
    icon: Key,
    badge: "Security",
    badgeVariant: "destructive" as const,
    links: [
      { title: "Authentication Overview", path: "/docs/auth/overview" },
      { title: "API Keys", path: "/docs/auth/api-keys" },
      { title: "OAuth 2.0", path: "/docs/auth/oauth" },
    ],
  },
  {
    id: "personalize",
    title: "Personalization",
    description: "Create personalized experiences for your users with advanced targeting.",
    icon: Users,
    badge: "Premium",
    badgeVariant: "secondary" as const,
    links: [
      { title: "User Profiles", path: "/docs/personalize/profiles" },
      { title: "Recommendations", path: "/docs/personalize/recommendations" },
    ],
  },
  {
    id: "insights",
    title: "Data & Insights",
    description: "Analyze your data and gain insights with our powerful analytics tools.",
    icon: Zap,
    badge: "Analytics",
    badgeVariant: "outline" as const,
    links: [
      { title: "Analytics Overview", path: "/docs/insights/analytics" },
      { title: "Custom Reporting", path: "/docs/insights/reporting" },
    ],
  },
];

export default function Documentation() {
  return (
    <DocLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome to our Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build amazing applications with our platform. 
            Get started quickly with our guides and explore our comprehensive API reference.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View API Reference
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} className="hover:shadow-md transition-shadow border-doc-border-light">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-doc-nav-active-bg rounded-lg">
                      <Icon className="h-6 w-6 text-doc-nav-active" />
                    </div>
                    <Badge variant={section.badgeVariant}>{section.badge}</Badge>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {section.links.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-1 group"
                      >
                        <span>{link.title}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="border-t border-doc-border-light pt-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Need Help?</h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline">
                Contact Support
              </Button>
              <Button variant="outline">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}