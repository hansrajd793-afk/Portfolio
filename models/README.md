# 3D Model Asset Directory

Place your 3D character model in this directory!

### Recommended File Name & Format:
- **`character.glb`** (or `character.gltf`)
- Formats supported: Binary GLTF (`.glb`) or standard GLTF (`.gltf`).
- Embedded animations (idle, breathing, running, gestures) are automatically detected and animated by the portfolio's 3D engine (`js/scene3d.js`).

### How It Works:
1. Copy your `.glb` model into this folder and name it `character.glb`.
2. The portfolio will automatically load it, center it on the cinematic pedestal, cast dynamic spotlight lighting on it, and play all embedded animations smoothly!
3. If you want to change the filename, simply update `customModelUrl` in `js/portfolioData.js`.
