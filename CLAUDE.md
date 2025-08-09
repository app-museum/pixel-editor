# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pixel art editor built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The application allows users to create pixel art with drawing tools, color palettes, undo/redo functionality, and export capabilities. The interface is localized in Japanese.

## Development Commands

- `npm run dev`: Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build`: Build the application for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code linting

## Architecture and Key Components

### Core Application Structure
- **Single-page application**: The entire pixel editor is contained in `app/page.tsx`
- **React functional component**: Uses hooks for state management (no external state library)
- **Canvas-based editing**: Grid-based pixel editing with 16x16, 32x32, or 64x64 canvas sizes

### Key Features Implemented
- **Drawing tools**: Pen, eraser, and flood fill
- **Color system**: Predefined palette + custom color picker
- **History management**: Undo/redo with 50-state limit using timestamp-based history
- **Local persistence**: Save/load artwork to localStorage
- **Export functionality**: PNG export using HTML5 canvas
- **Responsive design**: Works on desktop and mobile with touch support

### State Management Pattern
The application uses React's built-in state management with:
- Grid state as 2D string array storing hex colors
- History state with deep cloning for undo/redo
- Tool and color selection state
- Canvas size state that dynamically adjusts grid

### Styling Architecture
- **Tailwind CSS v4**: Uses the new v4 architecture
- **Component styling**: Inline Tailwind classes with responsive variants
- **Design system**: Uses shadcn/ui components setup (configured in `components.json`)
- **Utility function**: `lib/utils.ts` provides `cn()` helper for className merging

### Touch and Mouse Interaction
- Mouse events for desktop: mousedown, mouseenter, mouseup
- Touch events for mobile: touchstart, touchmove, touchend
- Global event listeners for proper drawing state management
- Coordinate calculation for touch position mapping

### Keyboard Shortcuts
Implemented shortcuts:
- Ctrl/Cmd+Z: Undo
- Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y: Redo  
- Ctrl/Cmd+S: Save to localStorage
- Ctrl/Cmd+O: Load from localStorage
- Ctrl/Cmd+E: Export as PNG

## Development Notes

### Performance Considerations
- Uses `useMemo` for grid rendering optimization
- Event handlers wrapped in `useCallback` to prevent unnecessary re-renders
- History limited to 50 states to prevent memory issues

### Code Patterns
- Extensive use of TypeScript for type safety
- Functional programming patterns with immutable state updates
- React best practices with proper dependency arrays and cleanup

### UI Framework Setup
- Configured for shadcn/ui with "new-york" style
- Tailwind v4 with CSS variables enabled
- Lucide React for icons (though currently using emoji icons)
- Path aliases configured: `@/components`, `@/lib`, `@/ui`, `@/hooks`

When working on this codebase, maintain the existing patterns of functional React components, TypeScript typing, and the current Japanese localization in the UI.