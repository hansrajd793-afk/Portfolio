/**
 * Hansraj D — Developer Terminal HUD Easter Egg
 * Interactive command line interface for developers & evaluators
 */

export class TerminalHUD {
  constructor(portfolioData, onThemeToggle) {
    this.data = portfolioData;
    this.onThemeToggle = onThemeToggle;

    this.container = document.getElementById('terminal-hud');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.closeBtn = document.getElementById('terminal-close-btn');

    this.history = [];
    this.historyIndex = -1;

    this.init();
  }

  init() {
    if (!this.container || !this.input) return;

    // Toggle shortcut ` or ~
    window.addEventListener('keydown', (e) => {
      if ((e.key === '`' || e.key === '~') && document.activeElement !== this.input) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.container.classList.contains('active')) {
        this.close();
      }
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleCommand(this.input.value);
        this.input.value = '';
      }
    });

    this.print("HD-OS Terminal v2.6.0 [Interactive Portfolio Engine]");
    this.print("Type 'help' to inspect available system commands.");
  }

  toggle() {
    if (this.container.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.container.classList.add('active');
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.container.classList.remove('active');
  }

  print(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    this.print(`> ${rawCmd}`);

    switch (cmd) {
      case 'help':
        this.print("Available commands:");
        this.print("  whoami        - Display identity and developer profile");
        this.print("  projects      - List curated featured repositories");
        this.print("  skills        - List verified technical core stack");
        this.print("  contact       - Display direct contact coordinates");
        this.print("  theme         - Toggle cinematic dark / editorial light mode");
        this.print("  github        - Jump directly to Hansraj's GitHub profile");
        this.print("  linkedin      - Jump directly to Hansraj's LinkedIn profile");
        this.print("  clear         - Clear terminal console output");
        this.print("  exit          - Close this terminal HUD");
        break;

      case 'whoami':
        this.print(`Identity: ${this.data.personal.name}`);
        this.print(`Role: ${this.data.personal.role}`);
        this.print(`Mission: "${this.data.personal.tagline}"`);
        this.print(`Status: ${this.data.personal.status}`);
        break;

      case 'projects':
      case 'open --portfolio':
        this.print("Curated Showcase Repositories:");
        this.data.featuredProjects.forEach((p) => {
          this.print(`  [${p.num}] ${p.title} — ${p.category} (${p.technologies.slice(0, 3).join(', ')})`);
        });
        this.print("Navigating to work exhibition...");
        window.location.hash = '#projects';
        break;

      case 'skills':
        this.print("Verified Production Stack:");
        const skillList = this.data.skills.map(s => s.name).join(" • ");
        this.print(`  ${skillList}`);
        break;

      case 'contact':
        this.print("Contact Information:");
        this.print(`  Email:    ${this.data.personal.email}`);
        this.print(`  Phone:    ${this.data.personal.phone}`);
        this.print(`  GitHub:   ${this.data.socials.github.url}`);
        this.print(`  LinkedIn: ${this.data.socials.linkedin.url}`);
        break;

      case 'theme':
        if (typeof this.onThemeToggle === 'function') {
          const newTheme = this.onThemeToggle();
          this.print(`Theme toggled to: ${newTheme.toUpperCase()}`);
        }
        break;

      case 'github':
        this.print("Opening GitHub in new tab...");
        window.open(this.data.socials.github.url, '_blank');
        break;

      case 'linkedin':
        this.print("Opening LinkedIn in new tab...");
        window.open(this.data.socials.linkedin.url, '_blank');
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      case 'exit':
        this.close();
        break;

      case 'hansraj':
        this.print("Welcome to Hansraj D's portfolio. Built with code, curiosity, and high performance.");
        break;

      default:
        this.print(`Command not recognized: "${rawCmd}". Type 'help' for reference.`);
        break;
    }
  }
}
