# Component Library Design

## Purpose

Minimal internal review surface for shared primitives.

## Layout

- Narrow content column
- Generous left and right padding
- Minimal copy
- No unnecessary cards

## Preview Presentation Rules

Every component page should use a consistent preview structure, but not every component needs an extra card or wrapper.

Every component page should start with a `Demo` section. Demo is the interactive playground for the component. The preview and controls should sit together inside one bordered frame, with compact controls attached above the preview. The existing reference sections should remain below for scanning and comparison.

- Use segmented controls for small option sets.
- Use dropdowns or form controls when the option set is larger.
- Use toggles or checkboxes for binary settings.
- Treat preview context as a special control: align it to the right of the Demo control bar, omit the visible label, and use a cohesive icon set with accessible labels. Do not force the SDUI icon set when it lacks clear device/context icons.
- Demo controls are component-library chrome, not product UI. Keep them compact, polished, monochrome, and visually distinct from product buttons, pills, and inputs.
- Give the Demo control bar enough inset padding that labels never feel pinned to the frame edge.
- Let the component behave naturally inside the Demo where useful, like typing in a composer or clicking feedback.
- Do not store Demo state in the URL unless that is explicitly requested later.

Use a neutral preview canvas when the component needs surrounding context to make sense.

Good examples:

- Small controls
- Form fields
- Composer states
- Floating entry points
- Isolated buttons, pills, prompts, and inputs

Show the component directly when the component is already a surface. Demo is the exception: even surface components should still appear inside the unified Demo frame because the frame represents the review tool, not the product component.

Good examples:

- Headers
- Chat containers
- Chat panels
- Side panels
- Action cards
- Plan cards
- Booking panels

The goal is not to put everything inside a card. The goal is to make each preview feel intentional, readable, and close to how the component appears in the real product.

Avoid card-in-card presentation unless the outer frame is clearly simulating product context.

## Component Reality Rule

Component library pages should reflect the real component, not a wishful version of it.

- Demo controls should map to real component props, states, or behavior.
- Reference examples should show supported product states, not one-off page-only versions.
- Do not add component-library-only variants that imply the product component already supports something it does not.
- If the desired Demo or example needs behavior the component does not support, call it out to the user before implementing so they can confirm whether to refactor the component, adjust the library expectation, or treat it as a future concept.
- If a component's current structure does not match the intended product mental model, raise that mismatch instead of hiding it with preview-only styling or mock data.

## Preview Sizing Rules

Component library previews should use the real product context when component behavior depends on container width.

- The page reading column should not decide component width.
- Chat-context components should default to the collapsed 400px chat panel context.
- Add a mobile/collapsed/expanded context control when a component meaningfully changes between the mobile full-width surface, the 400px desktop panel, and the expanded panel.
- Treat browser resizing as QA for the component library page itself. Treat the Demo context control as QA for the product component state.
- Mobile previews should simulate a phone-width product context instead of preserving the 400px desktop panel.
- Use the real side-panel context widths for booking and side-panel examples.
- Atomic primitives can stay at natural size when they do not depend on the chat panel container.
- Expanded chat and side-panel demos may widen beyond the normal reading column so the preview reflects product reality.
- Avoid arbitrary `max-width` wrappers for chat headers, composers, messages, action cards, plan cards, and side panels.

## State Layout Rules

Show one state per row when the state represents a meaningful product moment.

Good examples:

- Specialist recommendations
- Live handoffs
- Booking panels
- Side panel use cases
- Concierge panel states
- Container variants
- Composer states
- Message types

Use multi-column grids only for small visual inventories where quick comparison is the main goal.

Good examples:

- Icons
- Badges
- Tags
- Button state matrices
- Pills
- Small controls

In short: product moments use rows; atomic inventories can use grids.

## Shared Pattern Pages

Use shared pages for reusable UI patterns, then show product-specific examples inside those pages.

- Action card is the shared pattern for recommended next steps. Hiring, Premium, and future use cases should appear as examples on the Action card page unless they become meaningfully different components.
- Side panel is a shared container capability for focused tasks alongside the chat. Booking is one use case inside the Side panel page, not the base pattern itself.
- Keep product-specific examples discoverable through clear section headings on the shared page before adding a separate sidebar page.

## State Spacing Rules

Product-moment rows need generous vertical whitespace so each state reads as its own scenario.

- Use `PreviewMomentStack` for product-moment state lists.
- Use `PreviewMoment` for each individual row.
- Keep roughly 48px between a major section heading (`h2`) and the first example row (`h3`).
- Keep roughly 64px between product-moment rows.
- Keep roughly 24px between a state heading and the previewed component.
- Use tighter spacing only for small atomic inventories where density helps comparison.

## Styling Boundary

Component library styling should improve the review page only. It should not change the real product component unless the user explicitly asks to update the component itself.

- Put component-library-only layout, spacing, and typography in the component library page or scoped `.component-library-*` styles.
- Avoid broad tag selectors like `.component-library-chrome h2` because they can restyle real product components rendered inside the library.
- Do not change shared component internals just to make a review page look cleaner.
- If a preview needs more breathing room, add it around the preview, not inside the product component.
- If a product component looks wrong in both the library and the real prototype, call that out before changing the component itself.

## Documentation Typography

- Keep the component page introduction styling unchanged.
- Use `ComponentLibraryBodyCopy` for section descriptions and Usage copy: 15px, regular weight, 22px line height, and default dark text.
- Keep documentation typography separate from VCA product typography.
- Components rendered inside previews should continue to use their existing VCA tokens and styles.

## Sections

- Component name
- States
- Preview

## Heading Semantics

- Use `h1` for the component page title.
- Use `h2` for major preview sections.
- Use `PreviewExampleHeading` for titled examples inside a preview.
- Use `h3` for peer examples, like container variants or message types.
- Use `h4` for nested example groups, like button variants inside a size.
- Keep tiny state captions, like `default`, `hover`, and `disabled`, as plain text.

## First Primitive

### Button

- Default
- Hover
- Active
- Focus Visible
- Disabled
