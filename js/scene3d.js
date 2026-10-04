/**
 * Hansraj D — Luxury Chrome 3D Engine & GLTF/GLB Animation System
 * (Inspired by Pinterest Luxury Dark UI Reference)
 * 
 * Features:
 * 1. 3D Model positioned directly BEHIND hero typography & interactive with cursor
 * 2. Dedicated GLTF/GLB Model Loader with automatic AnimationMixer (ready for user's model)
 * 3. Fallback: 3D Chrome 4-Point Astral Star & Metallic Kinetic Sculpture matching Pinterest reference
 * 4. Specular chrome lighting with overhead theatrical spotlight
 * 5. Theme adaptation (Obsidian Chrome Dark <-> Editorial Gallery Light)
 * 6. Offscreen rendering pause via IntersectionObserver
 */

export class Hero3DScene {
  constructor(canvasElement, customModelConfig = null) {
    this.canvas = canvasElement;
    this.customModelConfig = customModelConfig || {
      customModelUrl: "models/character.glb",
      scale: 1.4,
      positionY: -0.2
    };

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.lights = {};
    this.mixer = null; // THREE.AnimationMixer for user custom model
    this.clock = new THREE.Clock();
    this.customModel = null;
    this.starSculptureGroup = null;
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
      this.renderer.toneMappingExposure = 1.25;
    } catch (err) {
      console.error('WebGL initialization failed:', err);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050507, 0.08);

    // Camera setup - Centered directly behind the hero text
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 50);
    this.camera.position.set(0, 0.1, this.isMobile ? 7.2 : 5.8);
    this.camera.lookAt(0, 0, 0);

    this.setupLighting();
    this.buildChromeAstralSculpture();
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
    this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(this.lights.ambient);

    // Overhead theatrical specular spotlight (Pure Starlight Chrome)
    this.lights.spot = new THREE.SpotLight(0xffffff, 5.0, 16, Math.PI / 4.5, 0.85, 1.2);
    this.lights.spot.position.set(0, 6.2, 1.5);
    this.lights.spotTarget = new THREE.Object3D();
    this.lights.spotTarget.position.set(0, 0, 0);
    this.scene.add(this.lights.spotTarget);
    this.lights.spot.target = this.lights.spotTarget;
    this.scene.add(this.lights.spot);

    // Chrome Rim Light (Cold Specular Silver)
    this.lights.rim = new THREE.PointLight(0xe2e2e8, 3.2, 14);
    this.lights.rim.position.set(-2.5, 2.5, -2.5);
    this.scene.add(this.lights.rim);

    // Front fill light (Soft Mercury)
    this.lights.fill = new THREE.DirectionalLight(0xffffff, 0.7);
    this.lights.fill.position.set(2, 3, 5);
    this.scene.add(this.lights.fill);

    // Volumetric spotlight cone
    const coneGeom = new THREE.ConeGeometry(2.4, 6.5, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.volumetricCone = new THREE.Mesh(coneGeom, coneMat);
    this.volumetricCone.position.set(0, 3.1, 1.5);
    this.scene.add(this.volumetricCone);
  }

  /* ------------------------------------------------------------------------
     Chrome 4-Point Astral Star & Metallic Kinetic Matrix
     (Matching Pinterest Reference Image)
     ------------------------------------------------------------------------ */
  buildChromeAstralSculpture() {
    this.starSculptureGroup = new THREE.Group();
    // Positioned directly behind the center of the hero text
    this.starSculptureGroup.position.set(0, 0.1, -0.4);

    // Materials - Pure High-Reflectivity Specular Chrome
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x222228,
      roughness: 0.08,
      metalness: 0.96,
      envMapIntensity: 2.0
    });

    const wireChromeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    // 1. Chrome 4-Point Star (The iconic star from Pinterest ref)
    const starShape = new THREE.Shape();
    const outerR = 1.35;
    const innerR = 0.32;
    const points = 4;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const extrudeSettings = {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };

    const starGeom = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    starGeom.center();
    this.starMesh = new THREE.Mesh(starGeom, chromeMat);
    this.starSculptureGroup.add(this.starMesh);

    // Secondary smaller offset 4-point star
    const starGeom2 = new THREE.ExtrudeGeometry(starShape, { ...extrudeSettings, depth: 0.15 });
    starGeom2.center();
    this.starMesh2 = new THREE.Mesh(starGeom2, wireChromeMat);
    this.starMesh2.scale.set(1.2, 1.2, 1.2);
    this.starMesh2.rotation.z = Math.PI / 4;
    this.starSculptureGroup.add(this.starMesh2);

    // 2. Concentric Orbiting Chrome Gimbal Rings
    const ringRadii = [1.8, 2.15];
    ringRadii.forEach((r, idx) => {
      const ringGeom = new THREE.TorusGeometry(r, 0.018, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4dc,
        roughness: 0.12,
        metalness: 0.95
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = (idx * Math.PI) / 3;
      ring.rotation.y = (idx * Math.PI) / 4;
      this.starSculptureGroup.add(ring);

      this.gimbalRings.push({
        mesh: ring,
        speedX: (idx % 2 === 0 ? 0.007 : -0.005) * (idx + 1),
        speedY: (idx % 2 === 0 ? -0.006 : 0.008) * (idx + 1)
      });
    });

    // 3. Floating Chrome Satellite Sparkles
    this.sparkles = [];
    for (let i = 0; i < 6; i++) {
      const spGeom = new THREE.OctahedronGeometry(0.08, 0);
      const spMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 0.98
      });
      const sp = new THREE.Mesh(spGeom, spMat);
      this.starSculptureGroup.add(sp);
      this.sparkles.push({
        mesh: sp,
        orbitRadius: 2.2 + (i % 3) * 0.3,
        speed: 0.8 + i * 0.3,
        phase: (i * Math.PI) / 3
      });
    }

    this.scene.add(this.starSculptureGroup);
  }

  buildParticles() {
    const count = this.isMobile ? 60 : 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: this.isMobile ? 0.025 : 0.03,
      transparent: true,
      opacity: 0.55
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

        // Hide fallback chrome sculpture
        if (this.starSculptureGroup) {
          this.starSculptureGroup.visible = false;
        }

        // Remove old model if replacing
        if (this.customModel) {
          this.scene.remove(this.customModel);
        }

        this.customModel = gltf.scene;

        // Auto-scale & position directly behind the hero text
        const targetScale = this.customModelConfig.scale || 1.3;
        this.customModel.scale.set(targetScale, targetScale, targetScale);
        this.customModel.position.set(0, this.customModelConfig.positionY || -0.2, -0.3);

        // Enhance materials
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
        console.info('Awaiting user custom model at', url, '(Chrome Astral Star active)');
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
  }

  applyTheme(theme) {
    if (!this.scene) return;
    const isLight = theme === 'light';

    if (isLight) {
      this.scene.fog.color.setHex(0xfbfbfa);
      this.lights.ambient.intensity = 0.95;
      this.lights.spot.intensity = 2.4;
      this.lights.rim.intensity = 1.2;
      this.lights.rim.color.setHex(0x555560);
      if (this.volumetricCone) this.volumetricCone.material.opacity = 0.02;
      if (this.particles) this.particles.material.color.setHex(0x222228);
    } else {
      this.scene.fog.color.setHex(0x050507);
      this.lights.ambient.intensity = 0.45;
      this.lights.spot.intensity = 5.0;
      this.lights.rim.intensity = 3.2;
      this.lights.rim.color.setHex(0xe2e2e8);
      if (this.volumetricCone) this.volumetricCone.material.opacity = 0.04;
      if (this.particles) this.particles.material.color.setHex(0xffffff);
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

    // 2. Custom model subtle cursor tracking behind text
    if (this.customModel) {
      this.customModel.rotation.y = (this.mouse.x * 0.5) * motion;
      this.customModel.rotation.x = (-this.mouse.y * 0.2) * motion;
      this.customModel.position.y = (this.customModelConfig.positionY || -0.2) + Math.sin(this.time * 1.5) * 0.04 * motion;
    }

    // 3. Fallback Chrome Astral Sculpture Animations (Behind text)
    if (this.starSculptureGroup && this.starSculptureGroup.visible) {
      // Harmonic breathing float
      this.starSculptureGroup.position.y = 0.1 + Math.sin(this.time * 1.6) * 0.06 * motion;

      // Track cursor gently
      this.starSculptureGroup.rotation.y += ((this.mouse.x * 0.65) - this.starSculptureGroup.rotation.y) * 0.06;
      this.starSculptureGroup.rotation.x += ((-this.mouse.y * 0.35) - this.starSculptureGroup.rotation.x) * 0.06;

      // Slow majestic rotation of the 4-point star
      if (this.starMesh) {
        this.starMesh.rotation.z = Math.sin(this.time * 0.4) * 0.12 * motion;
      }
      if (this.starMesh2) {
        this.starMesh2.rotation.z = Math.PI / 4 - this.time * 0.15 * motion;
      }

      // Gyroscopic gimbal rings
      this.gimbalRings.forEach((ring) => {
        ring.mesh.rotation.x += ring.speedX * motion;
        ring.mesh.rotation.y += ring.speedY * motion;
      });

      // Sparkles orbiting
      if (this.sparkles) {
        this.sparkles.forEach((sp) => {
          const angle = this.time * sp.speed + sp.phase;
          sp.mesh.position.x = Math.cos(angle) * sp.orbitRadius;
          sp.mesh.position.y = Math.sin(angle) * sp.orbitRadius * 0.7;
          sp.mesh.position.z = Math.sin(angle * 1.5) * 0.4;
          sp.mesh.rotation.y += 0.03 * motion;
        });
      }
    }

    // 4. Spotlight deflection matching cursor
    if (this.lights.spot && this.volumetricCone) {
      const spotOffset = this.mouse.x * 1.4 * motion;
      this.lights.spot.position.x += (spotOffset - this.lights.spot.position.x) * 0.04;
      this.volumetricCone.position.x = this.lights.spot.position.x;
    }

    // 5. Scroll camera parallax
    const scrollY = window.scrollY || window.pageYOffset;
    if (this.camera) {
      const scrollParallax = Math.min(scrollY / window.innerHeight, 1) * 0.4 * motion;
      this.camera.position.y = 0.1 + scrollParallax;
    }

    // 6. Starlight particles slow drift
    if (this.particles) {
      this.particles.rotation.y = this.time * 0.02 * motion;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
