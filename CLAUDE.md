# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the OpenMetal documentation site built with Docusaurus 2. It generates static documentation for OpenMetal's private cloud services, including user manuals, operator manuals, API docs, and tutorials. The site serves multiple versioned documentation sets and includes both OpenStack and bare metal guides.

## Architecture

### Core Structure
- **Docusaurus 2 Configuration**: `docusaurus.config.js` - Main site configuration with multi-instance docs setup
- **Documentation Sources**: 
  - `docs/` - Main documentation (users manual, tutorials, guides)
  - `versioned_docs/operators-manual/` - Current operator manual (v3 latest)
  - `operators_versioned_docs/` - Legacy operator manual versions (1.0, 2.0)
  - `api/` - OpenAPI specifications for API documentation

### Multi-Documentation Instance Setup
The site uses Docusaurus plugins to serve multiple documentation sets:
1. **Main docs** (`docs/`) - User manuals, tutorials, OpenMetal Central guides
2. **Operators Manual** - Versioned with current (v3), 2.0, and 1.0 versions
3. **API Documentation** - Generated from OpenAPI specs using Redocly CLI

### Sidebar Configuration
- `sidebars/sidebars.js` - Main documentation sidebar
- `sidebars/sidebarsOperators.js` - Operator manual sidebar

## Development Commands

### Local Development
```bash
npm start
# or 
yarn start
```

### Build Site
```bash
npm run build
# or
yarn build
```

### Lint Markdown
```bash
npm run lint              # Check markdown files
npm run lint-fix          # Auto-fix markdown issues
```

### API Documentation
```bash
npm run api-docs:build    # Build API docs from OpenAPI spec
npm run api-docs:serve    # Serve API docs locally
npm run api-docs:watch    # Watch for changes in OpenAPI spec
npm run api-docs:dev      # Run serve and watch in parallel
```

### Other Commands
```bash
npm run clear             # Clear Docusaurus cache
npm run serve             # Serve built site locally
npm run swizzle           # Customize Docusaurus components
npm run deploy            # Deploy to GitHub pages
```

## Content Organization

### Documentation Structure
- **Users Manual**: Step-by-step guides for end users
- **Operators Manual**: Technical operations guides (versioned by PCC releases)
- **Tutorials**: Hands-on tutorials for specific tasks
- **Bare Metal**: Hardware-specific documentation
- **Kubernetes Guides**: Container orchestration tutorials
- **Engineers Notes**: Technical implementation details
- **OpenMetal Central**: Cloud portal documentation

### Versioning Strategy
Operator manuals are versioned according to PCC (Private Cloud Core) releases:
- v3.0 (latest) - OpenStack 2023.2 (Bobcat)
- v2.0 - OpenStack Yoga
- v1.0 - OpenStack Victoria

### API Documentation
OpenAPI specs in `api/` directory are built into static HTML using Redocly CLI and served at `/api/` route.

## Styling and Theming

- Custom CSS: `src/css/custom.css`
- Client modules: `src/modules/trackers.ts`, `src/modules/chatWidget.ts`
- FontAwesome icons integrated for UI elements
- Light theme only (dark mode disabled)

## Key Features

- **Client Redirects**: Configured for URL structure changes
- **Search**: Algolia integration for site search
- **Analytics**: Google Analytics/GTAg tracking
- **Accessibility**: Custom accessibility script (`js/accessibility.js`)
- **Chat Widget**: Integrated customer support chat

## Testing and Quality

Use `markdownlint` for content quality:
- Configuration follows markdownlint-cli standards
- Run lint checks before committing documentation changes
- Auto-fix available for common markdown issues

## Common Development Patterns

When adding new documentation:
1. Add markdown files to appropriate directory in `docs/`
2. Update relevant sidebar configuration if needed
3. For operator manual changes, work in `versioned_docs/operators-manual/`
4. Run lint checks before committing
5. Test locally with `npm start`

When modifying API docs:
1. Update OpenAPI specs in `api/` directory
2. Test with `npm run api-docs:dev`
3. Rebuild with `npm run api-docs:build`