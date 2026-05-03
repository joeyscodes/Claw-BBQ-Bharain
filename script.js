/* ================================================
   CLAW BBQ BAHRAIN – PREMIUM WEBSITE SCRIPT
   3D Hero, IntersectionObserver, Form Confirmation
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------
  // 1. LOADER (only on index)
  // -----------------------------------------------
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 600);
    });
    document.body.style.overflow = 'hidden';
  }

  // -----------------------------------------------
  // 2. NAVBAR SCROLL EFFECT
  // -----------------------------------------------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const hero = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navbar.classList.remove('scrolled');
        else navbar.classList.add('scrolled');
      });
    }, { threshold: 0 });
    if (hero) observer.observe(hero);
    else navbar.classList.add('scrolled');
  }

  // -----------------------------------------------
  // 3. MOBILE HAMBURGER MENU
  // -----------------------------------------------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // -----------------------------------------------
  // 4. SCROLL REVEAL
  // -----------------------------------------------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // -----------------------------------------------
  // 5. RESERVATION FORM WITH CONFIRMATION
  // -----------------------------------------------
  const form = document.getElementById('reservationForm');
  const confirmMsg = document.getElementById('confirmationMsg');
  if (form && confirmMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      confirmMsg.style.display = 'block';
      confirmMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // form.submit(); // Uncomment for production
    });
  }

  // -----------------------------------------------
  // 6. THREE.JS 3D HERO (only on index.html & desktop)
  // -----------------------------------------------
  const canvas = document.getElementById('hero-canvas');
  if (canvas && window.innerWidth > 768) {  // only run on desktop
    // Ensure Three.js is loaded (CDN in HTML)
    if (typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a121c);
    // scene.fog = new THREE.Fog(0x0a121c, 5, 20);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.5, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0x404066);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xe87d2f, 1.5, 15);
    pointLight.position.set(2, 2, 4);
    scene.add(pointLight);
    const backLight = new THREE.PointLight(0x335577, 0.8);
    backLight.position.set(-2, -1, -3);
    scene.add(backLight);

    // --- 3D Crab Claw Model (built from primitives) ---
    const clawGroup = new THREE.Group();

    // Material: metallic dark orange
    const clawMat = new THREE.MeshStandardMaterial({
      color: 0xe05a00,
      roughness: 0.4,
      metalness: 0.7
    });
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xffaa33,
      roughness: 0.3,
      metalness: 0.3
    });

    // Main claw body (large sphere + pincer shapes)
    const baseSphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), clawMat);
    baseSphere.position.set(0, 0, 0);
    clawGroup.add(baseSphere);

    // Left pincer
    const leftPincer = new THREE.Group();
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8), clawMat);
    leftArm.position.set(-0.8, 0.4, 0);
    leftArm.rotation.z = Math.PI/5;
    leftPincer.add(leftArm);
    const leftTip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 8), innerMat);
    leftTip.position.set(-1.3, 1.0, 0);
    leftTip.rotation.z = Math.PI/4;
    leftPincer.add(leftTip);
    clawGroup.add(leftPincer);

    // Right pincer
    const rightPincer = new THREE.Group();
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8), clawMat);
    rightArm.position.set(0.8, 0.4, 0);
    rightArm.rotation.z = -Math.PI/5;
    rightPincer.add(rightArm);
    const rightTip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 8), innerMat);
    rightTip.position.set(1.3, 1.0, 0);
    rightTip.rotation.z = -Math.PI/4;
    rightPincer.add(rightTip);
    clawGroup.add(rightPincer);

    // Smaller arm segment (connecting to base)
    const armConnector = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.5, 8), clawMat);
    armConnector.position.set(0, -0.6, 0);
    clawGroup.add(armConnector);

    scene.add(clawGroup);

    // --- Floating Ember Particles (3D sparks) ---
    const particleCount = 250;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i*3] = (Math.random() - 0.5) * 8;
      positions[i*3+1] = Math.random() * 6 - 2;
      positions[i*3+2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 0.5 + 0.1;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xff6600,
      size: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particlesGeometry, particleMat);
    scene.add(particles);

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = performance.now() * 0.001; // seconds

      // Rotate claw slowly
      clawGroup.rotation.y += 0.003;
      clawGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
      clawGroup.rotation.z = Math.cos(elapsedTime * 0.3) * 0.1;

      // Animate particles upward and reset
      const positionsArr = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positionsArr[i*3+1] += 0.02; // rise
        if (positionsArr[i*3+1] > 4) {
          positionsArr[i*3+1] = -2;
          positionsArr[i*3] = (Math.random() - 0.5) * 8;
          positionsArr[i*3+2] = (Math.random() - 0.5) * 6;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        // If resized to mobile, stop rendering (canvas hidden by CSS)
        renderer.setSize(0, 0);
      } else {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }

});
