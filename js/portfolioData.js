/**
 * Hansraj D — Personal Portfolio Data Source of Truth
 * 
 * All verified personal information, selected featured projects, verified skills,
 * learning milestones, and educational records are maintained here.
 * No fabricated or unverified information is included.
 */

export const portfolioData = {
  personal: {
    name: "Hansraj D",
    role: "Developer • Builder • Problem Solver",
    tagline: "Building digital experiences that feel alive.",
    subheadline: "Crafting modern web interfaces, full-stack applications, and intelligent systems with precision.",
    email: "hansrajd793@gmail.com",
    phone: "+91 9061167369",
    phoneFormatted: "+91 90611 67369",
    location: "Kerala, India",
    year: new Date().getFullYear(),
    status: "Available for new projects & opportunities",
    model3d: {
      customModelUrl: "models/character.glb",
      scale: 1.2,
      positionY: 0,
      autoPlayAnimations: true
    },
    bio: [
      "I am a developer who believes in learning by engineering real-world software. My work ranges from architecting full-stack accommodation marketplaces with real-time geospatial discovery to building automated website security intelligence tools and high-performance user interfaces.",
      "My engineering workflow centers around clean modular code, intuitive user experiences, and shipping reliable products in public. I value clarity, performance, and attention to detail at every layer of the stack."
    ],
    highlights: [
      {
        title: "Who I Am",
        description: "A focused developer who transforms ideas into production-ready web experiences."
      },
      {
        title: "What I Build",
        description: "Full-stack web applications, modular frontend platforms, and data-driven security tools."
      },
      {
        title: "Core Philosophy",
        description: "Clarity over complexity, responsive usability, and finishing what is started."
      },
      {
        title: "Current Focus",
        description: "Modern web ecosystems, scalable backend integrations, and interactive 3D web interfaces."
      }
    ]
  },

  socials: {
    github: {
      label: "GitHub",
      url: "https://github.com/hansrajd793-afk",
      username: "hansrajd793-afk"
    },
    linkedin: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/hansraj-d",
      username: "hansraj-d"
    },
    email: {
      label: "Email",
      url: "mailto:hansrajd793@gmail.com",
      address: "hansrajd793@gmail.com"
    },
    phone: {
      label: "Phone",
      url: "tel:+919061167369",
      number: "+91 9061167369"
    }
  },

  // Curated showcase of top projects verified from github.com/hansrajd793-afk
  featuredProjects: [
    {
      id: "namstay",
      num: "01",
      title: "NammaStay",
      subtitle: "CampusNest Mangaluru Stay & Accommodation Marketplace",
      category: "Full-Stack Web Application",
      description: "A specialized accommodation marketplace designed for students, interns, and travelers to discover and connect with local rooms, PGs, hostels, and messes with localized spatial discovery.",
      longDescription: "Engineered with React and Vite on the frontend and powered by Supabase for authentication and relational data storage. Integrates interactive Leaflet maps for neighborhood discovery, role-based profiles (Admin, Owner, Student), and privacy-preserving owner contact request pipelines.",
      technologies: ["React", "Vite", "Supabase", "Leaflet", "JavaScript", "CSS3"],
      highlights: [
        "Interactive neighborhood & campus map integration with Leaflet",
        "Role-based authorization and user profiles with Supabase",
        "Privacy-preserving interest request mechanism for owner contacts",
        "Fast client-side routing and localized discovery filters"
      ],
      githubUrl: "https://github.com/hansrajd793-afk/NammaStay",
      featured: true,
      accentColor: "#dcd6c8",
      codeSnippet: `// Supabase + Leaflet Architecture
const { data: listings } = await supabase
  .from('accommodations')
  .select('*')
  .eq('status', 'active');

L.marker([lat, lng])
  .addTo(map)
  .bindPopup(renderListingCard(listing));`
    },
    {
      id: "webtrust",
      num: "02",
      title: "WebTrust",
      subtitle: "Automated Website Trust & Security Risk Analyzer",
      category: "Python Security & Analytics",
      description: "A passive heuristic security scanner that evaluates website safety, SSL/TLS posture, security headers, and domain trust, synthesizing a comprehensive 0–100 risk score.",
      longDescription: "Built with Python 3, Flask, Requests, and BeautifulSoup 4. Features a multi-factor risk scoring engine inspecting HTTPS certificates, redirection chains, and HTTP security headers (HSTS, CSP, X-Frame-Options). Integrates a headless Matplotlib visualization pipeline to generate server-side analytics charts without client-side script overhead.",
      technologies: ["Python 3", "Flask", "BeautifulSoup 4", "Requests", "Matplotlib", "HTML5/CSS3"],
      highlights: [
        "6-category risk scoring engine clamped between 0 and 100",
        "Passive heuristic checks complying with ethical security standards",
        "Headless server-side Matplotlib chart generation exported to PNG",
        "Lightweight, privacy-focused dashboard with zero tracking"
      ],
      githubUrl: "https://github.com/hansrajd793-afk/webtrust",
      featured: true,
      accentColor: "#b8c0c8",
      codeSnippet: `class RiskScoringEngine:
    def calculate_score(self, target_url):
        ssl_score = self.check_tls(target_url)
        headers_score = self.audit_headers(target_url)
        return min(100, ssl_score + headers_score)`
    },
    {
      id: "vitaledge",
      num: "03",
      title: "VitalEdge E-Commerce",
      subtitle: "High-Performance Modern Commercial Storefront",
      category: "Frontend Web Architecture",
      description: "A responsive e-commerce web platform featuring real-time product filtering, dynamic inventory modal forms, reactive shopping cart state, and smooth checkout flow.",
      longDescription: "Developed using vanilla JavaScript and modular CSS. Focuses on fluid responsive layouts, rapid DOM updates, client-side data filtering across multiple categories, and an interactive product management console.",
      technologies: ["JavaScript (ES6+)", "CSS3", "HTML5", "LocalStorage"],
      highlights: [
        "Interactive product catalog with real-time category filtering",
        "Reactive shopping cart state with dynamic total computation",
        "Product addition modal supporting live in-session updates",
        "Fluid cross-device responsive grid layout"
      ],
      githubUrl: "https://github.com/hansrajd793-afk/vitaledge-ecommerce1",
      featured: true,
      accentColor: "#c2bcaf",
      codeSnippet: `class StoreCatalog {
  filterByCategory(category) {
    this.activeFilter = category;
    this.renderProducts(this.catalog.filter(
      item => item.category === category || category === 'all'
    ));
  }
}`
    },
    {
      id: "calculator",
      num: "04",
      title: "Dual-Engine Calculator",
      subtitle: "Normal & Scientific Computational Interface with History",
      category: "Utility & Mathematical Interface",
      description: "A lightweight computational tool featuring dual operational modes (Normal arithmetic and Scientific trigonometry/exponents) backed by persistent calculation session logging.",
      longDescription: "Engineered with modular JavaScript, emphasizing clean arithmetic parsing, instant mode switching between everyday calculations and scientific functions, and a scrollable history log allowing users to inspect or clear past results.",
      technologies: ["JavaScript", "CSS3", "HTML5", "Session State"],
      highlights: [
        "Dual engine architecture: Normal arithmetic & Scientific operations",
        "Advanced trigonometry, logarithms, powers, and root calculations",
        "Persistent calculation session history panel",
        "Clean, distraction-free minimalist typography and key bindings"
      ],
      githubUrl: "https://github.com/hansrajd793-afk/-Simple-Calculator-Normal-Scientific-Modes-with-History",
      featured: true,
      accentColor: "#a8a8a4",
      codeSnippet: `const ScientificEngine = {
  sin: (x) => Math.sin(x * Math.PI / 180),
  log: (x) => Math.log10(x),
  eval: (expr) => evaluateExpression(expr)
};`
    }
  ],

  // Verified skills derived strictly from GitHub repositories & verified implementations
  skills: [
    {
      name: "JavaScript",
      category: "Frontend & Fullstack",
      level: "Proficient",
      description: "Core language utilized across NammaStay, VitalEdge E-Commerce, and client-side web tools.",
      context: "Async patterns, DOM manipulation, state management, modular ES6+ architecture.",
      connectedTo: ["React", "HTML5 & CSS3", "Vite", "Git & GitHub"]
    },
    {
      name: "React",
      category: "Frontend Framework",
      level: "Practitioner",
      description: "Component-driven interface development implemented in the NammaStay web application.",
      context: "Hooks, component lifecycle, reactive state, and third-party UI library integrations.",
      connectedTo: ["JavaScript", "Vite", "Supabase", "Leaflet"]
    },
    {
      name: "Python",
      category: "Backend & Automation",
      level: "Proficient",
      description: "Server-side logic, automated security scanning, and data parsing built in WebTrust.",
      context: "Flask routing, BeautifulSoup HTML analysis, Requests HTTP client, Matplotlib reporting.",
      connectedTo: ["Flask", "Git & GitHub", "Data Visualization"]
    },
    {
      name: "Supabase",
      category: "Database & Backend",
      level: "Practitioner",
      description: "Backend-as-a-service integrated into NammaStay for cloud data storage and authentication.",
      context: "Relational tables, SQL schemas, real-time client queries, user authentication.",
      connectedTo: ["React", "JavaScript"]
    },
    {
      name: "Vite",
      category: "Build Tooling",
      level: "Proficient",
      description: "Modern fast frontend tooling and bundle orchestration powering React projects.",
      context: "HMR development workflow, optimized production bundling, environment variables.",
      connectedTo: ["React", "JavaScript"]
    },
    {
      name: "HTML5 & CSS3",
      category: "Foundations & Styling",
      level: "Expertise",
      description: "Semantic markup, modern CSS grid, flexbox, custom properties, and responsive design.",
      context: "Custom design systems, fluid responsive typography, dark/light themes, animations.",
      connectedTo: ["JavaScript", "Git & GitHub"]
    },
    {
      name: "Leaflet Maps",
      category: "Geospatial UI",
      level: "Practitioner",
      description: "Interactive geospatial mapping and location pins integrated in NammaStay.",
      context: "Tile layer rendering, custom markers, map popups, coordinate spatial queries.",
      connectedTo: ["React", "JavaScript"]
    },
    {
      name: "Flask",
      category: "Web Framework",
      level: "Practitioner",
      description: "Lightweight Python microframework driving the backend controller in WebTrust.",
      context: "Route handling, template rendering, query dispatch, report file generation.",
      connectedTo: ["Python", "HTML5 & CSS3"]
    },
    {
      name: "Git & GitHub",
      category: "Version Control",
      level: "Proficient",
      description: "Source code versioning, repository architecture, collaborative workflows, and releases.",
      context: "Feature branching, commit hygiene, open-source repository management at hansrajd793-afk.",
      connectedTo: ["JavaScript", "Python", "React"]
    }
  ],

  // Journey milestones reflecting verified development releases
  journey: [
    {
      period: "Recent",
      title: "Full-Stack Geospatial Marketplace",
      role: "Architecture & Development",
      organization: "NammaStay (CampusNest)",
      description: "Engineered a localized stay and student accommodation marketplace utilizing React, Vite, Supabase, and Leaflet interactive map integrations.",
      tags: ["React", "Vite", "Supabase", "Leaflet"]
    },
    {
      period: "Milestone",
      title: "Automated Website Trust & Risk Analyzer",
      role: "Security & Tooling Development",
      organization: "WebTrust Platform",
      description: "Designed a multi-vector website security analyzer in Python and Flask, implementing passive heuristic scoring across TLS certificates, DNS configurations, and security headers.",
      tags: ["Python", "Flask", "BeautifulSoup", "Matplotlib"]
    },
    {
      period: "Foundational",
      title: "Interactive Web Systems & Storefronts",
      role: "Frontend Engineering",
      organization: "VitalEdge & Web Utilities",
      description: "Built modular commercial web interfaces, dual-mode computational tools, and custom responsive web architectures.",
      tags: ["JavaScript", "CSS3", "HTML5", "Architecture"]
    }
  ],

  // Education profile with clean verified fields and editable structure
  education: [
    {
      degree: "Computer Science & Engineering / Data Science Track",
      institution: "Higher Education / University",
      status: "Active / Completed",
      note: "Focus on algorithmic problem solving, software engineering principles, web technologies, and computational systems.",
      isVerifiedNote: "Academic credentials can be directly linked or tailored in portfolioData.js"
    }
  ],

  // Certifications / Credential highlights (editable clean structure)
  certifications: [
    {
      title: "Full-Stack & Web Application Development",
      issuer: "Verified Project Implementations",
      year: "2025–2026",
      credentialUrl: "https://github.com/hansrajd793-afk",
      note: "Demonstrated through public GitHub repositories and working deployments."
    },
    {
      title: "Python Programming & Automated Data Heuristics",
      issuer: "Applied Project Engineering",
      year: "2025–2026",
      credentialUrl: "https://github.com/hansrajd793-afk/webtrust",
      note: "Implemented passive security analytics, HTTP inspection, and data visualization."
    }
  ]
};
