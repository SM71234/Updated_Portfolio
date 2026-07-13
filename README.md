# Sankalp Misal — Professional Portfolio

A premium, high-performance portfolio website showcasing projects, skills, certifications, and professional experience. Designed with a custom dark theme, interactive layouts, and fluid micro-animations.

Live Preview: [http://localhost:8080/](http://localhost:8080/)

---

## 🛠️ Tech Stack & Architecture

This project is built using a modern, production-grade frontend architecture:

### Core Framework & SSR
* **React 19**: Powered by React's latest features and optimizations.
* **TanStack Start**: A full-stack React framework featuring fast server-side rendering (SSR), hydration, and routing.
* **TanStack Router**: File-based client-side routing located inside the `src/routes` directory.
* **TanStack Query**: High-performance asynchronous data fetching and cache management.

### Styling & Motion
* **Tailwind CSS v4**: Next-generation CSS framework utility classes for glassmorphism panels, dark mode layouts, and custom grid systems.
* **Framer Motion**: Immersive page transitions, swipe gestures for projects, hover triggers, and timeline entrance effects.
* **Lucide React**: Modern, scalable vector icons.

### User Interface & Accessibility
* **Radix UI Primitives**: Fully accessible, unstyled UI primitives powering custom dialogs, dropdowns, tooltips, and navigation drawers.
* **Cmdk**: Fast, accessible command-menu popup interface.
* **Sonner**: Custom interactive toast notifications.

---

## 📂 Project Structure

```
├── .lovable/             # Lovable configuration metadata
├── public/               # Static assets (favicons, resume PDF, etc.)
├── src/
│   ├── assets/           # Project images, hero workspace graphics
│   ├── components/
│   │   ├── site/         # Core layout layouts (Navbar, PageShell, AuroraBackground, CursorGlow)
│   │   └── ui/           # Accessible custom-styled UI blocks (cards, buttons, inputs)
│   ├── hooks/            # Custom React hooks (e.g. use-mobile)
│   ├── lib/              # Utilities, logs, and error-handling wrappers
│   ├── routes/           # TanStack file-based routes mapping directly to URL segments
│   ├── router.tsx        # Router setup & context registration
│   ├── server.ts         # Server-side wrap entry point
│   ├── start.ts          # Client-side bootstrap file
│   └── styles.css        # Core custom CSS rules and theme variables
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite dev server and bundler config
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
Clone this repository and install the dependencies:
```bash
git clone https://github.com/SM71234/Updated_Portfolio.git
cd Updated_Portfolio
npm install
```

### Run the Development Server
Launch the local development environment:
```bash
npm run dev
```
Open **[http://localhost:8080/](http://localhost:8080/)** in your browser.

### Build for Production
Compile and bundle client-side and server-side assets:
```bash
npm run build
```
The compiled output is located inside the `.output` folder, optimized and ready for cloud deployment.
