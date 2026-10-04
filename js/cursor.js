/**
 * Hansraj D — Innovative Cybernetic HUD Reticle Cursor
 * Precision targeting reticle with live telemetry, velocity physics & lock-on kinetics
 * (Desktop / Fine Pointer Only)
 */

export class CustomCursor {
  constructor() {
    this.cursorEl = document.getElementById('cyber-cursor');
    this.telemetryEl = document.getElementById('cursor-telemetry');
    this.badgeEl = document.getElementById('cursor-badge');
    
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.pos = { x: this.mouse.x, y: this.mouse.y };
    this.prevPos = { x: this.mouse.x, y: this.mouse.y };
    this.velocity = 0;
    this.angle = 0;

    if (!this.isTouch && this.cursorEl) {
      this.init();
    }
  }

  init() {
    window.addEventListener('pointermove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (this.telemetryEl) {
        this.telemetryEl.textContent = `TRK // [${String(Math.round(e.clientX)).padStart(4, '0')}:${String(Math.round(e.clientY)).padStart(4, '0')}]`;
      }
    }, { passive: true });

    // Interactive Hover Lock-On
    document.addEventListener('pointerover', (e) => {
      const interactiveEl = e.target.closest('a, button, [data-cursor], .mag, .project-3d-window');
      const cursorDataEl = e.target.closest('[data-cursor]');

      if (cursorDataEl) {
        const actionLabel = cursorDataEl.getAttribute('data-cursor') || "INSPECT";
        this.cursorEl.classList.add('hovering-target');
        if (this.badgeEl) {
          this.badgeEl.textContent = `[ ${actionLabel} ]`;
        }
      } else if (interactiveEl) {
        this.cursorEl.classList.add('hovering-target');
        if (this.badgeEl) {
          this.badgeEl.textContent = "[ ACTIVATE ]";
        }
      } else {
        this.cursorEl.classList.remove('hovering-target');
      }
    });

    // Shockwave click effect
    window.addEventListener('pointerdown', () => {
      if (this.cursorEl) {
        this.cursorEl.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) scale(0.85)`;
      }
    });

    window.addEventListener('pointerup', () => {
      if (this.cursorEl) {
        this.cursorEl.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) scale(1)`;
      }
    });

    // Magnetic buttons
    const magneticElements = document.querySelectorAll('.mag');
    magneticElements.forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        if (this.prefersReducedMotion) return;
        const rect = btn.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.28;
        const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.35;
        btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });

    this.render();
  }

  render() {
    requestAnimationFrame(() => this.render());

    // Fluid spring inertia
    const ease = 0.22;
    this.pos.x += (this.mouse.x - this.pos.x) * ease;
    this.pos.y += (this.mouse.y - this.pos.y) * ease;

    // Velocity calculation for kinetic deformation
    const dx = this.pos.x - this.prevPos.x;
    const dy = this.pos.y - this.prevPos.y;
    this.velocity = Math.hypot(dx, dy);
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;

    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
    }
  }
}
