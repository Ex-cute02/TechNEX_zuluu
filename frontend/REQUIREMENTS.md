# TechNEX_zuluu Frontend Requirements

## Overview
This document outlines all dependencies and requirements for the TechNEX_zuluu frontend application.

## Node.js & Package Manager
- **Node.js**: 18.0.0 or higher (20.x recommended)
- **npm**: 9.0.0 or higher
- **Package Manager**: npm (included with Node.js)

## Core Framework & Runtime
```json
{
  "next": "16.0.10",           // Next.js React framework
  "react": "19.2.1",           // React library
  "react-dom": "19.2.1"        // React DOM renderer
}
```

## UI & Styling Dependencies
```json
{
  "tailwindcss": "^4",                    // Utility-first CSS framework
  "@tailwindcss/postcss": "^4",          // PostCSS integration
  "class-variance-authority": "^0.7.1",   // CVA for component variants
  "clsx": "^2.1.1",                      // Conditional className utility
  "tailwind-merge": "^3.4.0",            // Tailwind class merging
  "lucide-react": "^0.562.0"             // Icon library
}
```

## Data Visualization
```json
{
  "recharts": "^3.6.0"         // Chart library for React
}
```

## HTTP Client
```json
{
  "axios": "^1.13.2"           // Promise-based HTTP client
}
```

## Development Dependencies
```json
{
  "@types/node": "^20",                    // Node.js type definitions
  "@types/react": "^19",                   // React type definitions
  "@types/react-dom": "^19",               // React DOM type definitions
  "typescript": "^5",                      // TypeScript compiler
  "eslint": "^9",                          // JavaScript/TypeScript linter
  "eslint-config-next": "16.0.10",        // Next.js ESLint configuration
  "babel-plugin-react-compiler": "1.0.0"   // React compiler plugin
}
```

## Installation Commands

### Quick Setup
```bash
# Clone and navigate to frontend
cd TechNEX_zuluu/frontend

# Install all dependencies
npm install

# Start development server
npm run dev
```

### Manual Installation
```bash
# Core dependencies
npm install next@16.0.10 react@19.2.1 react-dom@19.2.1

# UI & Styling
npm install tailwindcss@^4 @tailwindcss/postcss@^4
npm install class-variance-authority@^0.7.1 clsx@^2.1.1 tailwind-merge@^3.4.0
npm install lucide-react@^0.562.0

# Data & HTTP
npm install recharts@^3.6.0 axios@^1.13.2

# Development dependencies
npm install -D @types/node@^20 @types/react@^19 @types/react-dom@^19
npm install -D typescript@^5 eslint@^9 eslint-config-next@16.0.10
npm install -D babel-plugin-react-compiler@1.0.0
```

## Scripts Available
```json
{
  "dev": "next dev",        // Start development server
  "build": "next build",    // Build for production
  "start": "next start",    // Start production server
  "lint": "eslint"          // Run ESLint
}
```

## Project Structure
```
TechNEX_zuluu/frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard page
│   │   ├── funds/              # Fund explorer page
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ui/                 # Shadcn UI components
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── pie-chart.tsx
│   │   │   └── performance-pie-chart.tsx
│   │   └── Navigation.tsx      # Navigation component
│   ├── contexts/               # React contexts
│   │   └── ThemeContext.tsx    # Theme management
│   └── lib/                    # Utility libraries
│       ├── api.ts              # API client
│       └── utils.ts            # Utility functions
├── package.json                # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── next.config.ts             # Next.js configuration
```

## Key Features Supported

### 🎨 **UI Components**
- **Shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Comprehensive icon set
- **Theme System**: Light/dark mode support

### 📊 **Data Visualization**
- **Recharts**: Interactive charts and graphs
- **Custom Pie Charts**: Enhanced performance visualization
- **Responsive Design**: Mobile-friendly charts

### 🔄 **State Management**
- **React Context**: Theme and global state
- **React Hooks**: Local component state
- **TypeScript**: Type-safe state management

### 🌐 **API Integration**
- **Axios**: HTTP client for backend communication
- **TypeScript**: Type-safe API calls
- **Error Handling**: Comprehensive error management

## Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## Performance Optimizations
- **Next.js 16**: Latest performance improvements
- **React 19**: Concurrent features and optimizations
- **Tailwind CSS**: Purged CSS for minimal bundle size
- **TypeScript**: Compile-time optimizations
- **Code Splitting**: Automatic route-based splitting

## Development Workflow

### 🚀 **Getting Started**
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

### 🔧 **Development Commands**
```bash
# Development server with hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

### 🧪 **Quality Assurance**
```bash
# Type checking
npx tsc --noEmit

# Linting with auto-fix
npx eslint . --fix

# Build verification
npm run build
```

## Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development
NODE_ENV=development

# Production
NODE_ENV=production
```

## Troubleshooting

### Common Issues
1. **Node.js Version**: Ensure Node.js 18+ is installed
2. **Package Conflicts**: Clear node_modules and reinstall
3. **TypeScript Errors**: Run `npx tsc --noEmit` to check types
4. **Build Failures**: Check for ESLint errors

### Reset Commands
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install

# Clear Next.js cache
rm -rf .next

# Reset TypeScript cache
rm -rf .tsbuildinfo
```

## Deployment Requirements

### 🚀 **Production Build**
```bash
npm run build
npm run start
```

### 📦 **Static Export** (Optional)
```bash
# Add to next.config.ts
output: 'export'

# Build static files
npm run build
```

### 🐳 **Docker Support**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Version Compatibility Matrix

| Component | Version | Compatibility |
|-----------|---------|---------------|
| Node.js | 18.x - 20.x | ✅ Recommended |
| Next.js | 16.0.10 | ✅ Latest |
| React | 19.2.1 | ✅ Latest |
| TypeScript | 5.x | ✅ Latest |
| Tailwind | 4.x | ✅ Latest |

## Future Upgrades

### 📈 **Planned Updates**
- **Next.js 17**: When available
- **React 20**: Future releases
- **Tailwind CSS 5**: When stable
- **Additional UI Components**: As needed

### 🔄 **Migration Strategy**
1. Test in development environment
2. Update dependencies incrementally
3. Run comprehensive testing
4. Deploy with rollback plan

This requirements documentation ensures consistent development environment setup and provides clear guidance for maintaining and upgrading the frontend application.