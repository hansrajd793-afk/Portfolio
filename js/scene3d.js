/**
 * Hansraj D — Cinematic 3D Scene Engine & GLTF/GLB Animation System
 * 
 * Features:
 * 1. Dedicated GLTF/GLB Model Loader with automatic AnimationMixer (ready for user's 3D model)
 * 2. High-Tech Cyber Gyroscopic Core & Holographic Kinetic Sculpture (while awaiting custom model)
 * 3. Overhead volumetric theatrical spotlight tracking cursor kinematics
 * 4. Ambient cyber particle flux & reflective pedestal
 * 5. Full support for Dark (Cyber Luminescence) and Light (Titanium Teal) themes
 * 6. Offscreen rendering pause via IntersectionObserver
 */

export class Hero3DScene {
  constructor(canvasElement, customModelConfig = null) {
    this.canvas = canvasElement;
    this.customModelConfig = customModelConfig || {
      customModelUrl: "models/character.glb",
      scale: 1.2,
      positionY: 0
    };

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.lights = {};
    this.mixer = null; // THREE.AnimationMixer for user custom model
    this.clock = new THREE.Clock();
    this.customModel = null;
    this.cyberCoreGroup = null;
    this.gimbalRings = [];
    this.particles = null;
    this.volumetricCone = null;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isVisible = true;
    this.isMobile = window.innerWidth < 820;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.time = 0;

    this.init();
  }

  init() {
    if (!this.canvas || typeof THREE === 'undefined') {
      console.warn('Three.js or Canvas element not available');
      return;
    }

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: !this.isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
    } catch (err) {
      console.error('WebGL initialization failed:', err);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x07080d, 0.075);

    // Camera setup
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    this.camera.position.set(this.isMobile ? 0 : 2.4, 1.8, this.isMobile ? 8.5 : 6.8);
    this.camera.lookAt(this.isMobile ? 0 : 1.2, 1.5, 0);

    this.setupLighting();
    this.buildGroundPedestal();
    this.buildCyberSculpture();
    this.buildParticles();

    // Check & load user custom model if available
    this.tryLoadCustomModel(this.customModelConfig.customModelUrl);

    // Expose model loader to window for instant testing
    window.loadCustom3DModel = (url) => this.tryLoadCustomModel(url);

    this.bindEvents();
    this.applyTheme(document.documentElement.dataset.theme || 'dark');
    this.animate(0);
  }

  setupLighting() {
    // Ambient light
    this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(this.lights.ambient);

    // Overhead theatrical spotlight (Cyber Cyan / Aurora)
    const spotX = this.isMobile ? 0 : 2.4;
    this.lights.spot = new THREE.SpotLight(0x00f2fe, 4.2, 18, Math.PI / 5.5, 0.85, 1.2);
    this.lights.spot.position.set(spotX, 6.8, 1.2);
    this.lights.spotTarget = new THREE.Object3D();
    this.lights.spotTarget.position.set(spotX, 1.2, 0);
    this.scene.add(this.lights.spotTarget);
    this.lights.spot.target = this.lights.spotTarget;
    this.scene.add(this.lights.spot);

    // Back / Rim light (Electric Indigo)
    this.lights.rim = new THREE.PointLight(0x6366f1, 2.4, 14);
    this.lights.rim.position.set(this.isMobile ? -2 : 0, 2.8, -2.8);
    this.scene.add(this.lights.rim);

    // Front fill light (Mint Aurora)
    this.lights.fill = new THREE.DirectionalLight(0x10e7b2, 0.5);
    this.lights.fill.position.set(0, 3, 5);
    this.scene.add(this.lights.fill);

    // Volumetric spotlight cone
    const coneGeom = new THREE.ConeGeometry(2.5, 6.8, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.volumetricCone = new THREE.Mesh(coneGeom, coneMat);
    this.volumetricCone.position.set(spotX, 3.4, 1.2);
    this.scene.add(this.volumetricCone);
  }

  buildGroundPedestal() {
    const pedGroup = new THREE.Group();
    const posX = this.isMobile ? 0 : 2.4;
    pedGroup.position.set(posX, -0.45, 0);

    // Central circular pedestal
    const discGeom = new THREE.CylinderGeometry(2.6, 2.8, 0.12, 48);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0e111a,
      roughness: 0.3,
      metalness: 0.85
    });
    const disc = new THREE.Mesh(discGeom, discMat);
    disc.position.y = -0.06;
    pedGroup.add(disc);

    // Outer Glowing Ring (Cyan)
    const ringGeom = new THREE.RingGeometry(2.5, 2.58, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    pedGroup.add(ring);

    // Inner Glowing Ring (Mint)
    const innerRingGeom = new THREE.RingGeometry(1.6, 1.64, 36);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x10e7b2,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.02;
    pedGroup.add(innerRing);

    this.scene.add(pedGroup);
  }

  /* ------------------------------------------------------------------------
     Cyber Gyroscopic Core & Kinetic Holographic Sculpture
     ------------------------------------------------------------------------ */
  buildCyberSculpture() {
    this.cyberCoreGroup = new THREE.Group();
    this.cyberCoreGroup.position.x = this.isMobile ? 0 : 2.4;
    this.cyberCoreGroup.position.y = 1.5;

    // 1. Central Pulsating Quantum Core Orb
    const coreGeom = new THREE.SphereGeometry(0.55, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x07080d,
      roughness: 0.15,
      metalness: 0.9,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.45
    });
    this.coreMesh = new THREE.Mesh(coreGeom, coreMat);
    this.cyberCoreGroup.add(this.coreMesh);

    // 2. Wireframe Icosahedron Holographic Cage
    const icoGeom = new THREE.IcosahedronGeometry(0.95, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    this.icoMesh = new THREE.Mesh(icoGeom, icoMat);
    this.cyberCoreGroup.add(this.icoMesh);

    // 3. Inner Crystalline Octahedron
    const octaGeom = new THREE.OctahedronGeometry(0.75, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: 0x10e7b2,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.octaMesh = new THREE.Mesh(octaGeom, octaMat);
    this.cyberCoreGroup.add(this.octaMesh);

    // 4. Counter-Rotating Gyroscopic Gimbal Rings
    const ringRadii = [1.35, 1.6, 1.85];
    const ringColors = [0x00f2fe, 0x10e7b2, 0x6366f1];

    ringRadii.forEach((r, idx) => {
      const gRingGeom = new THREE.TorusGeometry(r, 0.02, 16, 64);
      const gRingMat = new THREE.MeshStandardMaterial({
        color: ringColors[idx],
        roughness: 0.2,
        metalness: 0.8,
        emissive: ringColors[idx],
        emissiveIntensity: 0.35
      });
      const gRing = new THREE.Mesh(gRingGeom, gRingMat);
      gRing.rotation.x = (idx * Math.PI) / 3;
      gRing.rotation.y = (idx * Math.PI) / 4;
      this.cyberCoreGroup.add(gRing);

      this.gimbalRings.push({
        mesh: gRing,
        speedX: (idx % 2 === 0 ? 0.008 : -0.006) * (idx + 1),
        speedY: (idx % 2 === 0 ? -0.007 : 0.009) * (idx + 1),
        speedZ: 0.004 * (idx + 1)
      });
    });

    // 5. Floating Orbital Data Satellites
    this.satellites = [];
    for (let i = 0; i < 4; i++) {
      const satGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const satMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
      const sat = new THREE.Mesh(satGeom, satMat);
      this.cyberCoreGroup.add(sat);
      this.satellites.push({
        mesh: sat,
        orbitRadius: 2.15,
        speed: 1.2 + i * 0.4,
        phase: (i * Math.PI) / 2
      });
    }

    this.scene.add(this.cyberCoreGroup);
  }

  buildParticles() {
    const count = this.isMobile ? 70 : 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 6.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: this.isMobile ? 0.03 : 0.035,
      transparent: true,
      opacity: 0.65
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  /* ------------------------------------------------------------------------
     User 3D Model Loader (GLTF/GLB) with Animation Mixing
     ------------------------------------------------------------------------ */
  tryLoadCustomModel(url) {
    if (typeof THREE.GLTFLoader === 'undefined') {
      console.info('GLTFLoader ready when user supplies 3D model.');
      return;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        console.log('✓ Custom 3D Model loaded successfully:', url);

        // Hide fallback cyber sculpture
        if (this.cyberCoreGroup) {
          this.cyberCoreGroup.visible = false;
        }

        // Remove old model if replacing
        if (this.customModel) {
          this.scene.remove(this.customModel);
        }

        this.customModel = gltf.scene;

        // Auto-scale & position
        const targetScale = this.customModelConfig.scale || 1.0;
        this.customModel.scale.set(targetScale, targetScale, targetScale);
        this.customModel.position.set(
          this.isMobile ? 0 : 2.4,
          this.customModelConfig.positionY || -0.4,
          0
        );

        // Enable shadows and enhance materials
        this.customModel.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        this.scene.add(this.customModel);

        // Setup Animations if present
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.customModel);
          gltf.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            action.play();
          });
          console.log(`✓ Playing ${gltf.animations.length} animation tracks for custom model.`);
        }
      },
      undefined,
      (err) => {
        // Fallback remains active seamlessly
        console.info('Awaiting user custom model at', url, '(Kinetic Cyber Sculpture active)');
      }
    );
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    window.addEventListener('pointermove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }
  }

  onResize() {
    if (!this.renderer || !this.camera || !this.canvas) return;
    this.isMobile = window.innerWidth < 820;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);

    const targetX = this.isMobile ? 0 : 2.4;
    if (this.cyberCoreGroup) this.cyberCoreGroup.position.x = targetX;
    if (this.customModel) this.customModel.position.x = targetX;
    if (this.lights.spot) this.lights.spot.position.x = targetX;
    if (this.lights.spotTarget) this.lights.spotTarget.position.x = targetX;
    if (this.volumetricCone) this.volumetricCone.position.x = targetX;
  }

  applyTheme(theme) {
    if (!this.scene) return;
    const isLight = theme === 'light';

    if (isLight) {
      this.scene.fog.color.setHex(0xf8fafc);
      this.lights.ambient.intensity = 0.95;
      this.lights.spot.intensity = 2.2;
      this.lights.spot.color.setHex(0x0284c7);
      this.lights.rim.intensity = 1.4;
      this.lights.rim.color.setHex(0x0d9488);
      if (this.volumetricCone) this.volumetricCone.material.opacity = 0.03;
      if (this.particles) this.particles.material.color.setHex(0x0284c7);
    } else {
      this.scene.fog.color.setHex(0x07080d);
      this.lights.ambient.intensity = 0.35;
      this.lights.spot.intensity = 4.2;
      this.lights.spot.color.setHex(0x00f2fe);
      this.lights.rim.intensity = 2.4;
      this.lights.rim.color.setHex(0x6366f1);
      if (this.volumetricCone) this.volumetricCone.material.opacity = 0.05;
      if (this.particles) this.particles.material.color.setHex(0x00f2fe);
    }
  }

  animate(timestamp) {
    requestAnimationFrame((t) => this.animate(t));
    if (!this.isVisible || !this.renderer) return;

    const delta = this.clock.getDelta();
    this.time = timestamp * 0.001;
    const motion = this.prefersReducedMotion ? 0.1 : 1.0;

    // Smooth cursor interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 1. Update AnimationMixer if custom model has skeletal animations
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // 2. Custom model subtle cursor tracking
    if (this.customModel) {
      this.customModel.rotation.y = (this.mouse.x * 0.45) * motion;
      this.customModel.rotation.x = (-this.mouse.y * 0.15) * motion;
    }

    // 3. Fallback Cyber Sculpture kinetic animations
    if (this.cyberCoreGroup && this.cyberCoreGroup.visible) {
      // Harmonic breathing float
      this.cyberCoreGroup.position.y = 1.5 + Math.sin(this.time * 1.8) * 0.08 * motion;

      // Track cursor gently
      this.cyberCoreGroup.rotation.y += ((this.mouse.x * 0.6) - this.cyberCoreGroup.rotation.y) * 0.06;
      this.cyberCoreGroup.rotation.x += ((-this.mouse.y * 0.3) - this.cyberCoreGroup.rotation.x) * 0.06;

      // Core pulsating glow
      if (this.coreMesh) {
        const pulse = 1 + Math.sin(this.time * 3) * 0.05 * motion;
        this.coreMesh.scale.set(pulse, pulse, pulse);
      }

      // Icosahedron & Octahedron counter-rotation
      if (this.icoMesh) {
        this.icoMesh.rotation.y = this.time * 0.4 * motion;
        this.icoMesh.rotation.z = this.time * 0.25 * motion;
      }
      if (this.octaMesh) {
        this.octaMesh.rotation.y = -this.time * 0.6 * motion;
        this.octaMesh.rotation.x = this.time * 0.3 * motion;
      }

      // Gyroscopic gimbal rings
      this.gimbalRings.forEach((ring) => {
        ring.mesh.rotation.x += ring.speedX * motion;
        ring.mesh.rotation.y += ring.speedY * motion;
        ring.mesh.rotation.z += ring.speedZ * motion;
      });

      // Satellites orbiting
      if (this.satellites) {
        this.satellites.forEach((sat) => {
          const angle = this.time * sat.speed + sat.phase;
          sat.mesh.position.x = Math.cos(angle) * sat.orbitRadius;
          sat.mesh.position.z = Math.sin(angle) * sat.orbitRadius;
          sat.mesh.position.y = Math.sin(angle * 2) * 0.4;
          sat.mesh.rotation.y += 0.02 * motion;
        });
      }
    }

    // 4. Spotlight deflection matching cursor
    if (this.lights.spot && this.volumetricCone) {
      const baseSpotX = this.isMobile ? 0 : 2.4;
      const spotOffset = baseSpotX + this.mouse.x * 1.3 * motion;
      this.lights.spot.position.x += (spotOffset - this.lights.spot.position.x) * 0.04;
      this.volumetricCone.position.x = this.lights.spot.position.x;
    }

    // 5. Scroll camera parallax
    const scrollY = window.scrollY || window.pageYOffset;
    if (this.camera) {
      const scrollParallax = Math.min(scrollY / window.innerHeight, 1) * 0.5 * motion;
      this.camera.position.y = 1.8 + scrollParallax;
    }

    // 6. Dust particles slow drift
    if (this.particles) {
      this.particles.rotation.y = this.time * 0.03 * motion;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
