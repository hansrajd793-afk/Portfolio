/**
 * Hansraj D — Portfolio Application Master Controller
 * Orchestrates themes, 3D scenes, UI rendering, loaders & interactions
 */

import { portfolioData } from './portfolioData.js';
import { Hero3DScene } from './scene3d.js';
import { TechConstellation } from './constellation.js';
import { CustomCursor } from './cursor.js';
import { TerminalHUD } from './terminal.js';

class PortfolioApp {
  constructor() {
    this.data = portfolioData;
    this.currentTheme = 'dark';
    this.heroScene = null;
    this.constellation = null;
    this.cursor = null;
    this.terminal = null;

    this.init();
  }

  init() {
    this.initTheme();
    this.renderDynamicContent();
    this.initCinematicLoader();
    this.init3DScene();
    this.initConstellation();
    this.initCursor();
    this.initTerminal();
    this.bindScrollEvents();
    this.bindNavigationEvents();
    this.bindProjectTilt();
    this.initScrollReveal();

    // Set copyright year
    const yrEl = document.getElementById('copyright-year');
    if (yrEl) yrEl.textContent = this.data.personal.year;
  }

  /* ------------------------------------------------------------------------
     Theme Management
     ------------------------------------------------------------------------ */
  initTheme() {
    const savedTheme = localStorage.getItem('hd_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.currentTheme = savedTheme;
    } else {
      this.currentTheme = 'dark'; // Dark mode default as specified
    }

    document.documentElement.dataset.theme = this.currentTheme;
    this.updateThemeButton();

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = this.currentTheme;
    localStorage.setItem('hd_theme', this.currentTheme);
    this.updateThemeButton();

    if (this.heroScene) {
      this.heroScene.applyTheme(this.currentTheme);
    }

    return this.currentTheme;
  }

  updateThemeButton() {
    const themeLabel = document.getElementById('theme-label-text');
    if (themeLabel) {
      themeLabel.textContent = this.currentTheme === 'dark' ? 'Dark' : 'Light';
    }
  }

  /* ------------------------------------------------------------------------
     Dynamic UI Content Rendering (From Central Single Source of Truth)
     ------------------------------------------------------------------------ */
  renderDynamicContent() {
    // 1. Render Editorial About Highlights
    const aboutContainer = document.getElementById('about-blocks-container');
    if (aboutContainer) {
      aboutContainer.innerHTML = this.data.personal.highlights.map(item => `
        <div class="about-block-card reveal-init">
          <span class="about-block-title">${item.title}</span>
          <p class="about-block-desc">${item.description}</p>
        </div>
      `).join('');
    }

    // 2. Render Curated Featured Projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
      projectsContainer.innerHTML = this.data.featuredProjects.map((p, idx) => `
        <article class="project-exhibition-item reveal-init" id="project-${p.id}">
          <div class="project-index-num">${p.num}</div>
          
          <div class="project-info-column">
            <span class="project-category-badge">${p.category}</span>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-tagline">${p.description}</p>
            
            <ul class="project-highlights-list">
              ${p.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>

            <div class="project-tech-stack-row">
              ${p.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>

            <div class="project-links-row">
              <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary mag" data-cursor="GITHUB">
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          <div class="project-3d-window" data-cursor="INSPECT">
            <div class="window-chrome-bar">
              <div class="window-dots">
                <span class="window-dot"></span>
                <span class="window-dot"></span>
                <span class="window-dot"></span>
              </div>
              <span class="window-path">github.com/${this.data.socials.github.username}/${p.title.toLowerCase().replace(/ /g, '-')}</span>
            </div>
            <pre class="window-code-preview"><code>${p.codeSnippet}</code></pre>
          </div>
        </article>
      `).join('');
    }

    // 3. Render Learning Journey Timeline
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = this.data.journey.map(item => `
        <div class="timeline-item reveal-init">
          <div class="timeline-period">${item.period}</div>
          <h4 class="timeline-role">${item.title}</h4>
          <div class="timeline-org">${item.organization} — ${item.role}</div>
          <p class="timeline-desc">${item.description}</p>
          <div class="project-tech-stack-row">
            ${item.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // 4. Render Education & Certifications
    const eduContainer = document.getElementById('education-cards-container');
    if (eduContainer) {
      eduContainer.innerHTML = this.data.education.map(edu => `
        <div class="edu-card reveal-init">
          <span class="edu-subhead">Academic Profile</span>
          <h4 class="edu-title">${edu.degree}</h4>
          <p class="edu-note">${edu.institution}</p>
          <p class="edu-note" style="color: var(--text-muted); font-size: 0.85rem;">${edu.note}</p>
        </div>
      `).join('');
    }

    const certContainer = document.getElementById('certifications-cards-container');
    if (certContainer) {
      certContainer.innerHTML = this.data.certifications.map(cert => `
        <div class="cert-card reveal-init">
          <span class="edu-subhead">${cert.year} — Verified Track</span>
          <h4 class="edu-title">${cert.title}</h4>
          <p class="edu-note">${cert.issuer}</p>
          <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="tech-tag" style="align-self: flex-start; text-decoration: none;" data-cursor="VIEW">
            Inspect Implementation →
          </a>
        </div>
      `).join('');
    }
  }

  /* ------------------------------------------------------------------------
     Cinematic Loader
     ------------------------------------------------------------------------ */
  initCinematicLoader() {
    const loader = document.getElementById('experience-loader');
    const counter = document.getElementById('loader-counter-text');
    const bar = document.getElementById('loader-bar-fill');
    if (!loader || !counter || !bar) return;

    let progress = 0;
    const isFast = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 16) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        counter.textContent = "100";
        bar.style.width = "100%";

        setTimeout(() => {
          loader.classList.add('loaded');
        }, isFast ? 100 : 350);
      } else {
        counter.textContent = String(progress).padStart(2, '0');
        bar.style.width = `${progress}%`;
      }
    }, isFast ? 20 : 65);
  }

  /* ------------------------------------------------------------------------
     3D Scene & Constellation Initialization
     ------------------------------------------------------------------------ */
  init3DScene() {
    const canvas = document.getElementById('hero-webgl-canvas');
    if (canvas) {
      this.heroScene = new Hero3DScene(canvas);
    }
  }

  initConstellation() {
    const canvas = document.getElementById('constellation-canvas');
    const hudTitle = document.getElementById('constellation-title');
    const hudDesc = document.getElementById('constellation-desc');
    if (canvas) {
      this.constellation = new TechConstellation(canvas, hudTitle, hudDesc, this.data.skills);
    }
  }

  initCursor() {
    this.cursor = new CustomCursor();
  }

  initTerminal() {
    this.terminal = new TerminalHUD(this.data, () => this.toggleTheme());

    const terminalBtn = document.getElementById('open-terminal-btn');
    if (terminalBtn) {
      terminalBtn.addEventListener('click', () => {
        if (this.terminal) this.terminal.toggle();
      });
    }
  }

  /* ------------------------------------------------------------------------
     Scroll & Navigation
     ------------------------------------------------------------------------ */
  bindScrollEvents() {
    const header = document.getElementById('main-header');
    const progressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item-link');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Update progress bar
      if (progressBar && docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = `${pct}%`;
      }

      // Header glass appearance
      if (header) {
        header.classList.toggle('scrolled', scrollY > 40);
      }

      // Active section spy
      let currentSectionId = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 180;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
    }, { passive: true });
  }

  bindNavigationEvents() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleDrawer = (open) => {
      if (!drawer || !backdrop) return;
      drawer.classList.toggle('open', open);
      backdrop.classList.toggle('visible', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    if (menuBtn) {
      menuBtn.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('open')));
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => toggleDrawer(false));
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });
  }

  /* ------------------------------------------------------------------------
     Interactive 3D Perspective Tilt on Project Cards
     ------------------------------------------------------------------------ */
  bindProjectTilt() {
    const windows = document.querySelectorAll('.project-3d-window');
    windows.forEach(win => {
      win.addEventListener('pointermove', (e) => {
        const rect = win.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        win.style.setProperty('--ry', `${x * 14}deg`);
        win.style.setProperty('--rx', `${-y * 14}deg`);
      });

      win.addEventListener('pointerleave', () => {
        win.style.setProperty('--ry', '0deg');
        win.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll Reveal Observer
     ------------------------------------------------------------------------ */
  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-init');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.__portfolioApp = new PortfolioApp();
});
