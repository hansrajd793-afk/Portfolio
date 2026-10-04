/**
 * Hansraj D — Interactive Tech Stack Constellation
 * Dynamic Spatial Network Canvas
 * 
 * Features:
 * - Fluid organic node positioning with orbital harmonic drift
 * - Interactive node hovering with physics attraction & network ray illumination
 * - Responsive coordinate mapping for mobile, tablet, and widescreen displays
 * - Real-time HUD info card updater presenting verified repository usage context
 */

export class TechConstellation {
  constructor(canvasElement, hudTitleEl, hudDescEl, skillsData) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.hudTitle = hudTitleEl;
    this.hudDesc = hudDescEl;
    this.skills = skillsData;

    this.nodes = [];
    this.hoveredNode = null;
    this.mouse = { x: -9999, y: -9999 };
    this.isVisible = false;
    this.time = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    this.buildNetwork();
    this.bindEvents();
    this.animate(0);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Recompute orbital resting positions
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radiusX = Math.min(this.width * 0.38, 380);
    const radiusY = Math.min(this.height * 0.36, 180);

    this.nodes.forEach((node, i) => {
      const angle = (i / this.skills.length) * Math.PI * 2 - Math.PI / 2;
      node.baseX = centerX + Math.cos(angle) * radiusX + (node.jitterX || 0);
      node.baseY = centerY + Math.sin(angle) * radiusY + (node.jitterY || 0);
      node.x = node.baseX;
      node.y = node.baseY;
    });
  }

  buildNetwork() {
    this.nodes = this.skills.map((skill, index) => {
      const angle = (index / this.skills.length) * Math.PI * 2 - Math.PI / 2;
      const radiusX = Math.min((this.width || 600) * 0.38, 380);
      const radiusY = Math.min((this.height || 400) * 0.36, 180);
      const jitterX = (Math.random() - 0.5) * 40;
      const jitterY = (Math.random() - 0.5) * 30;

      return {
        ...skill,
        index,
        jitterX,
        jitterY,
        baseX: (this.width / 2 || 300) + Math.cos(angle) * radiusX + jitterX,
        baseY: (this.height / 2 || 200) + Math.sin(angle) * radiusY + jitterY,
        x: 0,
        y: 0,
        radius: 7,
        targetRadius: 7,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.8 + Math.random() * 0.6
      };
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
    }, { passive: true });

    this.canvas.addEventListener('pointermove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;

      let found = null;
      for (const node of this.nodes) {
        const dist = Math.hypot(node.x - this.mouse.x, node.y - this.mouse.y);
        if (dist < 32) {
          found = node;
          break;
        }
      }

      this.hoveredNode = found;
      this.updateHUD(found);
    });

    this.canvas.addEventListener('pointerleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.hoveredNode = null;
      this.updateHUD(null);
    });

    // IntersectionObserver to avoid rendering when scrolled out
    const observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(this.canvas);
  }

  updateHUD(node) {
    if (!this.hudTitle || !this.hudDesc) return;

    if (node) {
      this.hudTitle.textContent = `${node.name} — [${node.category}]`;
      this.hudDesc.textContent = `${node.description} (${node.context})`;
    } else {
      this.hudTitle.textContent = "Tech Stack Constellation";
      this.hudDesc.textContent = "Hover any node to inspect verified implementation details and architectural connections.";
    }
  }

  animate(timestamp) {
    requestAnimationFrame((t) => this.animate(t));
    if (!this.isVisible) return;

    this.time = timestamp * 0.001;
    const motion = this.prefersReducedMotion ? 0 : 1;
    const theme = document.documentElement.dataset.theme || 'dark';
    const isLight = theme === 'light';

    const fgColor = isLight ? '#08080a' : '#ffffff';
    const mutedColor = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.16)';
    const accentColor = isLight ? '#08080a' : '#ffffff';

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Compute active network set
    const activeNames = new Set();
    if (this.hoveredNode) {
      activeNames.add(this.hoveredNode.name);
      (this.hoveredNode.connectedTo || []).forEach(name => activeNames.add(name));
    }

    // 1. Update node physics & positions
    this.nodes.forEach((node) => {
      const floatX = Math.cos(this.time * node.driftSpeed + node.driftPhase) * 10 * motion;
      const floatY = Math.sin(this.time * node.driftSpeed * 0.9 + node.driftPhase) * 10 * motion;
      node.x = node.baseX + floatX;
      node.y = node.baseY + floatY;

      const isHovered = this.hoveredNode && this.hoveredNode.name === node.name;
      const isRelated = this.hoveredNode && activeNames.has(node.name);

      node.targetRadius = isHovered ? 13 : isRelated ? 9 : 6.5;
      node.radius += (node.targetRadius - node.radius) * 0.15;
    });

    // 2. Draw Connection Lines
    this.nodes.forEach((node) => {
      (node.connectedTo || []).forEach((targetName) => {
        const target = this.nodes.find(n => n.name === targetName);
        if (!target) return;

        const isHighlighted = this.hoveredNode && activeNames.has(node.name) && activeNames.has(target.name);

        this.ctx.beginPath();
        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(target.x, target.y);

        if (isHighlighted) {
          this.ctx.strokeStyle = accentColor;
          this.ctx.lineWidth = 1.8;
          this.ctx.globalAlpha = 0.9;
        } else if (this.hoveredNode) {
          this.ctx.strokeStyle = mutedColor;
          this.ctx.lineWidth = 0.8;
          this.ctx.globalAlpha = 0.12;
        } else {
          this.ctx.strokeStyle = mutedColor;
          this.ctx.lineWidth = 1;
          this.ctx.globalAlpha = 0.35;
        }

        this.ctx.stroke();
      });
    });

    // 3. Draw Nodes and Labels
    this.nodes.forEach((node) => {
      const isHovered = this.hoveredNode && this.hoveredNode.name === node.name;
      const isActive = !this.hoveredNode || activeNames.has(node.name);

      this.ctx.globalAlpha = isActive ? 1 : 0.25;

      // Glow halo on hovered node
      if (isHovered) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.18)';
        this.ctx.fill();
      }

      // Outer ring
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = isHovered ? accentColor : fgColor;
      this.ctx.fill();

      // Node label
      this.ctx.fillStyle = fgColor;
      this.ctx.font = `${isHovered ? '600' : '400'} 11px 'JetBrains Mono', monospace`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.name.toUpperCase(), node.x, node.y + node.radius + 18);
    });

    this.ctx.globalAlpha = 1;
  }
}
