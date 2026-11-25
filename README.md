# GF63 / Unofficial MSI laptop concept
Developed by [Rachix Studio](https://rachixstudioweb.vercel.app/).

## Run
Node.js 20+ recommended. `npm install`, `npm run dev`, then open http://localhost:3000. `npm run typecheck` and `npm run build` verify locally. Deploy to Vercel by importing the repository as a Next.js project.

## Features
Real procedural Three.js model with independently moving chassis, deck, physical hinge, board, memory, battery, SSD and fan. ScrollTrigger drives a reversible six-stage pinned story. Configurator has hinge/explosion sliders, camera presets, orbit/zoom, lighting, airflow and inspection. Product search/filter/sort, comparison, cart, simulated checkout, inquiry and local admin are implemented. Admin at `/admin` is deliberately not linked in the public navigation. State is browser-local, not secure or production-ready. Use fictional information. No payments or email are sent.

## Limitations
The procedural geometry and SVG artwork are original illustrative approximations, not official product photography or an authentic GLB/service model. Model layout, cooling and screen imagery are illustrative. Product specs are from the supplied brief and not independently verified; demo prices and stock are fictional. Official reviews/offers are omitted. Advanced individual component camera focus, exact physical geometry, production admin/authentication, email, newsletter and payment integrations are not included. Dependency installation and browser tests were unavailable in the creation environment; run the checks above before deployment. No FPS or Lighthouse claims are made. Footer credit is shared across all routes.

Runtime fix: home storytelling uses CSS sticky positioning rather than ScrollTrigger pin spacers; GSAP still controls scroll progress.

## V4 stability audit
- Uses React Three Fiber 9.8.2 and native Three.js OrbitControls with explicit disposal; no nested Drei Html root or changing Canvas key.
- Canvas mounts only after WebGL 2 detection; includes static preview and render error boundary. Off-screen rendering is paused. GSAP no longer reparents DOM nodes.
- Product stock limits and simulated checkout inventory updates corrected.
- `npm run audit:source` checks TS/TSX syntax, declared dependencies, local imports, image references and 17 page routes. `npm run verify` also performs full typecheck and production build after npm installation.
- Source audit passed in the preparation environment. Full dependency installation, type checking, Next.js build and browser execution were not possible because the npm registry DNS lookup failed. No guarantee that runtime errors are fully eliminated.

### Browser verification checklist
1. Open `/` and scroll forward and backward through all six stages.
2. Navigate repeatedly between `/`, `/experience`, and `/products`; check browser console.
3. Exercise all configurator controls, reset repeatedly, rotate/zoom, select parts, use fullscreen, and navigate away.
4. Add items, enforce stock limits, edit stock in `/admin`, and complete a simulated checkout.
5. Save a fictional inquiry, verify it in admin, reload to check persistence.
6. Test mobile width 320px and 768px, desktop, reduced motion, and WebGL disabled.

## V5 hero restoration
Native scroll progress drives the persistent 3D scene through arrival, opening, explosion, inspection, cooling and reassembly. The sticky track uses explicit content height, not padding. Stage buttons jump to the corresponding scroll position. Homepage uses native scrolling; Lenis remains on other pages. Reduced-motion users can select stages manually. Static source audit only; browser testing remains required.
