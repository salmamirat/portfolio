# Salma Mirat — Pink Rider portfolio

React + Vite portfolio using Three.js and GSAP ScrollTrigger.

## Run locally

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite. For production, run `npm run build`; deploy the `dist` directory to a static host. `npm run preview` serves the production build locally.

## Content

- `src/content.js`: contact links and the three projects from the supplied CV.
- `src/App.jsx`: hero, About, Skills, Projects, Experience/Education, and Contact.
- `src/styles.css`: responsive section layouts.
- `src/hero.css` and `src/usePinkRider.js`: original Pink Rider styling and canvas reveal, with React lifecycle cleanup.
- `src/Sculpture.jsx`: Three.js sculpture with GSAP scroll rotation, offscreen rendering suspension, reduced-motion support, and resource cleanup.
- `original-hero.html`: preserved standalone version.

The original two portrait URLs are used directly. Google Fonts and portraits need internet access. The project artwork is illustrative, not a screenshot of the actual applications. Project source links currently point to Salma's GitHub profile because the CV did not include individual repository URLs. Contact uses a mailto link and copy-email button; no backend is needed.

Text reveals and section entrances use GSAP ScrollTrigger. Reduced-motion preferences disable scroll animation and autonomous motion. A decorative fallback is shown if WebGL is unavailable.

References: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Three.js cleanup](https://threejs.org/manual/pages/cleanup.html).
