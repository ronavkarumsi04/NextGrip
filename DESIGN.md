# NextGrip design system — Precision Studio

**Source guidance**: Apple's Human Interface Guidelines (hierarchy, clarity, accessibility, control targets); ECC web design-quality and Liquid Glass skill (used as conceptual web guidance only); Impeccable README anti-patterns and its shape → craft → audit → critique → polish workflow.

## Visual direction

Light, instrument-grade industrial interface with restrained sea-glass green used for actionable states and motion, pale warm mineral surfaces, and a generous technical specimen area. The gripper, not cards or decorative gradients, is the main visual subject.

**Colors**: Canvas `#f4f6f4`, ink `#202b30`, surface `#fff`, teal `#277668`, border `#e4e9e6`, warning `#a53d40`. Color carries meaning. E-stop is visually separate from regular commands.

**Typography**: DM Sans for human-readable product copy and IBM Plex Mono for telemetry, figures, and system labels; fallbacks specified for offline use. Typography is deliberately paired, not automatically inherited across every UI element.

**Composition**: Hero text, a large continuous simulator surface, narrower purposeful controls, and unboxed explanatory process strip. Avoid nested card grids, generic KPI charts, fake sensor data, and ungrounded decorative glass.

**Motion**: Only mechanistic jaw movement and targeted hover feedback. Reduced-motion CSS for UI transitions. Never pretend the illustration is exact CAD geometry or measured hardware behavior.

**Accessibility**: Focus-visible states, role=status announcements, text labels alongside icons, adequate touch targets, no horizontal overflow at 390px, screen reader names for the model and form controls.

**Scope**: Web CSS uses slight translucency only on control surface; it does not implement Apple's native `glassEffect()` API and is not an official Apple UI.

## Quality verification

- Keyboard-focus affordances and control labels present
- Typed `grip 45 percent` updates target and position
- Physical-looking E-stop blocks simulated motion commands until Reset
- Mobile 390px no horizontal overflow
- Node control tests pass
- A software simulation disclosure remains visible at all times
