# CSS Organization Guide

This directory contains **all CSS-related files** for the application. Everything CSS-related is centralized here for better organization and maintainability.

## Directory Structure

```
styles/
├── base/              # Global base styles (reset, animations, scrollbar)
│   ├── reset.css
│   ├── animations.css
│   └── scrollbar.css
├── theme/             # Theme definition and helpers
│   ├── theme.ts       # Theme object definition
│   └── theme-helpers.ts # Type-safe theme access functions
├── mixins/           # Reusable style patterns
│   ├── common.ts
│   └── layout.ts
├── examples/         # Example components showing best practices
│   └── ExampleComponent.tsx
├── index.css         # Main CSS entry point (imported in main.tsx)
└── index.ts          # Central export point for TypeScript utilities
```

## Convention: All CSS in `styles/`

**All CSS-related files are in the `styles/` directory:**

- ✅ Base CSS files (`base/*.css`)
- ✅ Main CSS entry point (`index.css`)
- ✅ Style utilities and mixins (`utilities/`, `mixins/`)
- ✅ Theme helpers (`theme/theme-helpers.ts`)

This keeps everything organized and makes it easy to find styling-related code.

## Usage Guidelines

### 1. Use Theme Values Instead of Hardcoded Values

❌ **BAD** - Hardcoding theme values:

```tsx
const buttonStyle = css`
  background-color: oklch(0.205 0 0);
  padding: 1rem;
  border-radius: 0.625rem;
`;
```

✅ **GOOD** - Using theme directly:

```tsx
import { theme } from "@/styles";

const buttonStyle = css`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
`;
```

**Note**: Always use direct theme access (`theme.colors.primary`) instead of hardcoded values.

### 2. Use Mixins for Common Patterns

❌ **BAD** - Repeating common patterns:

```tsx
const cardStyle = css`
  background-color: ${theme.colors.card};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.md};
`;
```

✅ **GOOD** - Using mixins:

```tsx
import { cardStyle } from "@/styles";
<div css={cardStyle}>Content</div>;
```

### 3. Compose Styles with Mixins

You can combine multiple mixins and add component-specific styles:

```tsx
import { cardStyle, hoverable, focusRing } from "@/styles";
import { css } from "@emotion/react";

const interactiveCard = css`
  ${cardStyle}
  ${hoverable}
  ${focusRing}
  cursor: pointer;
`;
```

### 4. Component-Specific Styles

For component-specific styles that aren't reusable, keep them in the component file using Emotion:

```tsx
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { theme } from "@/styles";

const MyComponent = () => {
  const containerStyle = css`
    display: flex;
    gap: ${theme.spacing.md};
    background: ${theme.colors.background};
  `;

  return <div css={containerStyle}>...</div>;
};
```

## Available Utilities

### Theme Access

Access theme values directly:

- `theme.colors.*` - All color values (e.g., `theme.colors.primary`, `theme.colors.gray300`)
- `theme.spacing.*` - Spacing values (e.g., `theme.spacing.sm`, `theme.spacing.md`)
- `theme.borderRadius.*` - Border radius values
- `theme.shadows.*` - Shadow values
- `theme.typography.*` - Typography values

### Common Mixins

- `cardStyle` - Card/panel container styling
- `focusRing` - Accessible focus state
- `hoverable` - Hover state for interactive elements
- `disabled` - Disabled state styling
- `truncate` - Single-line text truncation
- `truncateLines(n)` - Multi-line text truncation
- `flexCenter` - Flexbox centering
- `flexBetween` - Flexbox space-between
- `scrollable` - Scrollable container
- `border` - Border styling (1px solid gray300)
- `borders.*` - Border utilities (gray300, top, right, bottom, left)
- `rounded.{sm|md|lg|xl|full}` - Border radius utilities
- `padding.{xs|sm|md|lg|xl|2xl}` - Padding utilities
- `margin.{xs|sm|md|lg|xl|2xl}` - Margin utilities

### Layout Mixins

- `pageContainer` - Full-width page container
- `contentContainer` - Max-width centered container
- `dashboardLayout` - Dashboard layout container
- `flexRow` - Horizontal flex layout
- `flexColumn` - Vertical flex layout
- `grid(columns, gap)` - Grid layout utility

## Examples

### Example 1: Button Component

```tsx
import { css } from "@emotion/react";
import { theme, focusRing, hoverable } from "@/styles";

const buttonStyle = css`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.primaryForeground};
  border-radius: ${theme.borderRadius.md};
  ${hoverable}
  ${focusRing}
`;
```

### Example 2: Card Component

```tsx
import { cardStyle, padding, rounded } from "@/styles";
import { css } from "@emotion/react";

const card = css`
  ${cardStyle}
  ${padding.lg}
  ${rounded.lg}
`;
```

### Example 3: Layout Component

```tsx
import { pageContainer, contentContainer, flexColumn } from "@/styles";
import { css } from "@emotion/react";

const page = css`
  ${pageContainer}
  ${contentContainer}
  ${flexColumn}
`;
```

## Migration Guide

When migrating existing components:

1. **Identify hardcoded values** - Look for color values, spacing, etc.
2. **Replace with theme values** - Use `theme.colors.*`, `theme.spacing.*`, etc.
3. **Extract common patterns** - If a pattern appears 3+ times, create a mixin
4. **Update imports** - Import from `@/styles` instead of defining locally

## Best Practices

1. **Always use theme values** - Never hardcode colors, spacing, or other theme values
2. **Compose, don't duplicate** - Use mixins and compose them rather than copying styles
3. **Keep component styles local** - Only extract to mixins if used in 3+ places
4. **Use TypeScript** - All utilities are fully typed for autocomplete
5. **Follow the structure** - Base styles in `base/`, utilities in `utilities/`, patterns in `mixins/`

## Adding New Styles

### Adding a New Theme Value

1. Add the value to `src/theme.ts`
2. Create a helper in `theme/theme-helpers.ts` if needed
3. Update the TypeScript types

### Adding a New Mixin

1. Add the mixin to the appropriate file in `mixins/`
2. Export it from `mixins/index.ts` (if you create one)
3. Document it in this README

### Adding a New Base Style

1. Add to the appropriate file in `base/`
2. Import it in `src/index.css`
3. Document any new CSS variables or classes
