# Achieve Plus - Angular Frontend

This is the new, high-performance, aesthetically pleasing frontend for Achieve Plus, built with Angular 17+ (Standalone Components).

## Features Implemented
- **Glassmorphism UI**: Comprehensive design system with blur effects.
- **Bento Grid Layout**: Modern, grid-based dashboard.
- **Dark Mode 2.0**: Adaptive dark theme by default, toggleable.
- **Command Palette**: `Cmd+K` / `Ctrl+K` global search.
- **Gamification**: Visual Streak Tracker with fire animations.
- **Contextual Help**: Custom tooltips.

## Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Angular CLI

### Running the App
The old React app has been moved to `Frontend-Achieve-Legacy`. The new app is in `Frontend -Achieve+`.

1. Navigate to the folder:
   ```bash
   cd "Frontend -Achieve+"
   ```

2. Install dependencies (if not done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   (Note: Use `npm start`, not `npm run dev` as this is an Angular CLI project).

4. Open `http://localhost:4200` in your browser.

## Key Components
- `src/app/core/layout`: Main shell, Sidebar, Header.
- `src/app/features/dashboard`: The main dashboard view.
- `src/app/shared/components`: Reusable UI (GlassCard, CommandPalette, StreakTracker).
