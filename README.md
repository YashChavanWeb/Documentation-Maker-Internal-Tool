# Documentation Maker Internal Tool

Web-based application designed to create, manage, and visualize documentation with a sleek and intuitive UI. This tool comes with integrated features like rich text editing, analytics dashboard, settings panel, and table of contents, all powered by modern web technologies.

## Features

* **Rich Text Editor**: Create and edit documentation with ease using a fully functional rich text editor.
* **Analytics Dashboard**: Get insights into user interactions and documentation usage with real-time analytics.
* **Responsive Design**: Fully responsive interface to ensure smooth user experience across all devices.
* **Modular Architecture**: Organize your project with reusable components and hooks for better scalability and maintainability.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone github.com/YashChavanWeb/Documentation-Maker-Internal-Tool.git

# Step 2: Navigate to the project directory.
cd cd Documentation-Maker-Internal-Tool

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Directory Structure

Here’s an overview of the key files and directories:

```
Directory structure:
└── yashchavanweb-documentation-maker-internal-tool/
    ├── README.md
    ├── public/
    │   └── robots.txt
    ├── src/
    │   ├── App.css
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   ├── vite-env.d.ts
    │   ├── components/
    │   │   ├── AnalyticsDashboard.tsx
    │   │   ├── DocHeader.tsx
    │   │   ├── DocLayout.tsx
    │   │   ├── DocSidebar.tsx
    │   │   ├── PreviewModal.tsx
    │   │   ├── RichTextEditor.tsx
    │   │   ├── SettingsPanel.tsx
    │   │   ├── TableOfContents.tsx
    │   │     
    │   ├── hooks/
    │   │   ├── use-mobile.tsx
    │   │   ├── use-toast.ts
    │   │   └── useAnalytics.tsx
    │   │  
    │   ├── integrations/
    │   │   └── supabase/
    │   │       ├── client.ts
    │   │       └── types.ts
    │   ├── lib/
    │   │   └── utils.ts
    │   │  
    │   └── pages/
    │       ├── Admin.tsx
    │       ├── DocPage.tsx
    │       ├── Documentation.tsx
    │       ├── Index.tsx
    │       └── NotFound.tsx
    └── supabase/
        ├── config.toml
        └── migrations/
            └── 20250903174759_bb0fcb15-b23f-4940-b01b-64f750ca3d64.sql

```

