# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

OrgGraph is an organizational maturity assessment tool that visualizes business process completion through three complementary views:

- **Graph View**: D3.js force-directed network visualization showing hierarchical business structure
- **Checklist View**: Interactive task tree with cascading completion logic  
- **Dashboard View**: Progress metrics and category breakdowns
- **Home View**: Overview dashboard with progress summary

The core concept is translating a complex checklist of business processes into visual representations that provide instant assessment of operational maturity.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build and type checking
npm run build

# Start production server
npm start

# Lint code
npm run lint

# TypeScript type checking only
npm run type-check
```

## Architecture Overview

### Data Architecture
The entire application is driven by a single hierarchical data object (`OrgNode`) that represents:
- **7 main business categories** (Corporate & Governance, Finance & Accounting, etc.)
- **20+ subcategories** (Business Formation, Financial Setup, Recruitment & Hiring, etc.)  
- **50+ individual tasks** (leaf nodes with specific actionable items)

Each node contains:
- `id`: Unique identifier (e.g., "2.1.3")
- `name`: Display name
- `isComplete`: Boolean completion status
- `children`: Array of child nodes (empty for leaf tasks)

### State Management
- **React Context** (`DataContext`) provides global state management
- **localStorage persistence** automatically saves/loads user progress
- **Immutable updates** using deep cloning to maintain data integrity
- **Cascading logic**: Parent completion affects children and vice versa

### Core Business Logic

#### Cascading Completion Rules
Located in `src/lib/utils.ts`:
- Completing a parent node marks all children as complete
- Uncompleting a parent marks all children as incomplete  
- Completing the last child automatically completes the parent
- Uses `updateNodeCompletion()` for all state changes

#### Progress Calculations
- **Node weight**: `1 + sum of all children weights` (determines visual sizing)
- **Completion percentage**: `completed leaf nodes / total leaf nodes`
- **Color mapping**: Red (0%) → Yellow (50%) → Green (100%)

### Component Architecture

#### Graph Visualization (`src/components/graph/GraphVisualization.tsx`)
- **D3.js force-directed simulation** with custom node sizing and coloring
- **Interactive controls**: zoom, pan, drag nodes, click for details
- **Real-time updates** when data changes in other views
- Uses `convertToGraphData()` to transform hierarchical data into graph format

#### Checklist Tree (`src/components/checklist/ChecklistTree.tsx`)  
- **Recursive component** that renders collapsible, indented hierarchy
- **Checkbox interactions** trigger cascading completion logic
- **Visual indicators**: icons, progress percentages, completion styling
- Auto-expands first 2 levels for better UX

#### Data Context (`src/context/DataContext.tsx`)
- **Centralized state management** with React Context
- **localStorage integration** for session persistence  
- **Utility methods**: `updateNode()`, `getProgress()`, `getCategoryProgress()`, `resetAllData()`

## Key Technical Considerations

### D3.js Integration
- Graph component uses `useRef` for D3 DOM manipulation
- Zoom behavior stored in ref to enable programmatic control
- Force simulation configured for hierarchical data visualization
- TypeScript types extend D3's simulation interfaces
- **Error handling**: Fallback dimensions (800x600) prevent crashes when container has zero size

### Progress Synchronization  
- All views share the same DataContext state
- Changes in one view instantly reflect in others
- Color schemes and progress bars update in real-time
- **localStorage integration**: Hydration-safe loading with `isLoaded` state to prevent mismatches

### Error Handling & Stability
- **ErrorBoundary component** (`src/components/ui/ErrorBoundary.tsx`) wraps critical components
- **Graceful degradation**: Components handle missing data and edge cases
- **Build process**: Clean configuration without conflicting lockfiles or problematic postinstall scripts

### Railway Deployment
- **Multi-stage Dockerfile**: Custom Docker build with deps/build/runtime stages for optimal resource usage
- **Docker layer caching**: Leverages Docker's build caching to reduce build time and memory consumption
- **Memory optimization**: NODE_OPTIONS --max-old-space-size=1024 configured for Railway's container constraints
- **Security**: Non-root nodejs user (uid/gid 1001) for secure container runtime
- **railway.json**: DOCKERFILE builder configuration with health checks and restart policies
- **next.config.js**: Standalone output with image optimization and security headers
- **Stable dependencies**: React 18.2.0, Next.js 14.2.31, Tailwind v3.4.16 for deployment reliability
- **Build context optimization**: .dockerignore excludes unnecessary files to reduce Docker context size
- Health checks configured on root endpoint with 300s timeout and retry policies

## Data Structure

The organizational data is stored in `src/data/organizationalData.ts` as a comprehensive hierarchy covering:

1. **Corporate & Governance**: Business formation, legal compliance, investor management
2. **Finance & Accounting**: Financial setup, accounting processes, financial management  
3. **Human Resources**: Recruitment, onboarding, employee management
4. **Sales & Marketing**: Strategy, online presence, lead generation
5. **Operations & Product**: Development, supply chain, customer support
6. **Technology & IP**: Infrastructure, intellectual property
7. **Risk & Insurance**: Insurance management, litigation

## Common Modification Patterns

### Adding New Business Categories
1. Update `src/data/organizationalData.ts` with new hierarchy structure
2. Ensure proper `id` format (e.g., "8", "8.1", "8.1.1")  
3. Test cascading logic with new nodes

### Modifying Progress Calculations
- Core logic in `src/lib/utils.ts`
- `calculateProgress()` handles percentage calculations
- `getCompletionColor()` manages visual color mapping
- `updateNodeCompletion()` manages cascading state changes

### UI Theme Adjustments
- Global styles in `src/app/globals.css` (dark slate theme)
- Color utilities in `src/lib/utils.ts`
- Tailwind classes throughout components use slate color palette

### D3.js Visualization Updates
- Node sizing logic uses weight calculations
- Force simulation parameters in `GraphVisualization.tsx`
- Interactive behaviors (zoom, drag, hover) configured in D3 event handlers

## Troubleshooting Common Issues

### Development Server Issues
- **Clean build cache**: `rm -rf .next node_modules/.cache` before restart
- **Lockfile conflicts**: Remove conflicting `bun.lock` files from parent directories
- **Port conflicts**: Server automatically uses available ports (3000, 3001, etc.)

### Graph Visualization Problems
- **Empty container**: GraphVisualization includes fallback dimensions (800x600)
- **D3 errors**: ErrorBoundary component catches and displays errors gracefully
- **Performance**: Large datasets handled by D3 force simulation optimization

### localStorage Hydration
- DataContext uses `isLoaded` state to prevent hydration mismatches
- Initial data loads from localStorage after component mount
- Data persistence occurs only after initial hydration completes

### Build and Deployment
- **TypeScript**: Strict mode enabled - all type errors must be resolved before deployment
- **Next.js compatibility**: Use next.config.js (not .ts) for Next.js 14 compatibility
- **Tailwind configuration**: Use v3 syntax (@tailwind directives) in globals.css, not v4 @import
- **Railway deployment**: Uses standalone output with nixpacks.toml for optimal performance
- **Dependency management**: Prefer stable versions (React 18, Next.js 14) over bleeding-edge for production
- **Security patches**: Keep dependencies updated for security vulnerabilities
- **Build cache**: Add tsconfig.tsbuildinfo to .gitignore to prevent Docker layer conflicts

### Railway-Specific Deployment Issues
- **Exit code 240**: Memory constraints or dependency conflicts - resolved with custom Dockerfile and optimized resource allocation
- **Docker build failures**: Previously caused by build cache files (tsconfig.tsbuildinfo) or nixpacks resource limitations
- **Multi-stage build solution**: Separates dependency installation, build, and runtime phases for better memory management
- **Resource optimization**: Custom Dockerfile with explicit NODE_OPTIONS memory limits (1024MB) and build caching
- **Build context optimization**: .dockerignore reduces Docker context size and build time
- **Dependency optimization**: Move type definitions to devDependencies to reduce runtime bundle size
- **Configuration compatibility**: Use next.config.js (not .ts) for Next.js 14, Tailwind v3 syntax, Docker builder vs nixpacks

### Docker Deployment Architecture
- **Stage 1 (base)**: Node.js 18 Alpine with environment variables and working directory setup
- **Stage 2 (deps)**: Isolated dependency installation with npm ci optimizations and cache cleaning
- **Stage 3 (builder)**: Application build stage copying dependencies and source code
- **Stage 4 (runner)**: Production runtime with non-root user, minimal surface area, and security hardening
- **Layer caching**: Optimized for Railway's build caching to minimize rebuild time and resource usage