# Hansraj D — Personal Developer Portfolio

> Production personal portfolio for Hansraj D, featuring luxury obsidian & chrome aesthetics, interactive 3D WebGL engine, technical skills constellation, cybernetic HUD cursor, and retro arcade 404 mini-game.

Live Site: [https://hansrajd.site](https://hansrajd.site)

---

## 🌟 Key Architecture & Highlights

- **Luxury Obsidian & Chrome Aesthetics**: High-contrast monochrome palette, architectural grid backdrops, and specular chrome typography inspired by luxury dark design systems.
- **3D WebGL Engine**: Centered Three.js 3D kinetic astral sculpture positioned behind the hero headline with interactive cursor tracking and light/dark theme lighting shifts.
- **GLTF/GLB Ready**: Built-in `GLTFLoader` with automatic `AnimationMixer` to dynamically render custom 3D models placed in `models/character.glb`.
- **Interactive Tech Constellation**: 2D HTML5 canvas rendering interconnected skill nodes with real-time cursor proximity detection and technical HUD card previews.
- **Cybernetic HUD Reticle**: Desktop targeting cursor with live coordinate telemetry (`TRK // [X:Y]`), velocity interpolation, and magnetic lock-on states.
- **Developer HUD Console**: Built-in Easter egg terminal accessible by pressing the backtick (`` ` ``) key anywhere on the site.
- **Playable 404 Arcade Mini-Game**: Custom `404.html` retro void defense arcade game running at 60 FPS with local storage high score tracking.
- **Full SEO & Search Optimization**: Valid W3C XML Sitemap, `robots.txt`, and Open Graph / Twitter Card social previews.

---

## 📁 Repository Structure

```
├── 404.html               # Custom 404 page with playable Void Defender arcade game
├── CNAME                  # Custom GitHub Pages domain binding (hansrajd.site)
├── index.html             # Main portfolio entrance with full semantic structure
├── README.md              # Project documentation
├── robots.txt             # Search engine crawler directives
├── sitemap.xml            # XML sitemap protocol 0.9 compliant map
├── css/
│   ├── main.css           # Global tokens, typography, luxury theme palettes & resets
│   └── components.css     # Nav, Hero, Projects, Constellation, and responsive styles
├── js/
│   ├── app.js             # Master application coordinator and event bindings
│   ├── constellation.js   # 2D interactive canvas skill network
│   ├── cursor.js          # Cybernetic HUD targeting cursor with telemetry
│   ├── portfolioData.js   # Centralized verified data store for projects & skills
│   ├── scene3d.js         # Three.js 3D engine with GLTF/GLB loader & kinetic star
│   └── terminal.js        # Interactive developer terminal easter egg
└── models/
    └── README.md          # Guide for adding your custom 3D character model (.glb)
```

---

## 🚀 Local Development

No heavy build tools or Node runtimes required. Run with any local HTTP server:

```bash
# Using Python
python -m http.server 8080

# Or using Node npx serve
npx serve .
```

Open `http://localhost:8080` in your browser.

---

## 👤 Author

**Hansraj D**
- GitHub: [@hansrajd793-afk](https://github.com/hansrajd793-afk)
- LinkedIn: [in/hansraj-d](https://www.linkedin.com/in/hansraj-d)
- Email: [hansrajd793@gmail.com](mailto:hansrajd793@gmail.com)
