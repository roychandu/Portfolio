/**
 * Three.js 3D Animation Utilities v2.0
 * Creates and manages 3D scenes for the portfolio, optimized for app-frame containment.
 */

import * as THREE from 'three';

/**
 * Create a 3D particle system for hero background
 * @param {HTMLElement} container - Container element for the canvas
 * @param {Object} options - Configuration options
 */
export function createParticleScene(container, options = {}) {
    const {
        particleCount = 2500, // Increased for premium density
        speed = 1.0,
        colors = {
            light: [0x02569B, 0x0175C2, 0x13B9FD],
            dark: [0x13B9FD, 0x0175C2, 0x02569B]
        }
    } = options;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const initialPosArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const velocityArray = new Float32Array(particleCount * 3);

    const isDark = document.body.classList.contains('dark-mode');
    const themeColors = isDark ? colors.dark : colors.light;

    for (let i = 0; i < particleCount * 3; i += 3) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        
        posArray[i] = initialPosArray[i] = x;
        posArray[i + 1] = initialPosArray[i + 1] = y;
        posArray[i + 2] = initialPosArray[i + 2] = z;

        const color = new THREE.Color(themeColors[Math.floor(Math.random() * themeColors.length)]);
        colorArray[i] = color.r;
        colorArray[i + 1] = color.g;
        colorArray[i + 2] = color.b;

        velocityArray[i] = (Math.random() - 0.5) * 0.01;
        velocityArray[i + 1] = (Math.random() - 0.5) * 0.01;
        velocityArray[i + 2] = (Math.random() - 0.5) * 0.01;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation
    let frame = 0;
    let animationId;
    function animate() {
        frame += 0.001 * speed;
        
        const positions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Apply base movement
            positions[i] += velocityArray[i];
            positions[i + 1] += velocityArray[i + 1];
            positions[i + 2] += velocityArray[i + 2];

            // Boundaries
            if (Math.abs(positions[i]) > 5) velocityArray[i] *= -1;
            if (Math.abs(positions[i+1]) > 5) velocityArray[i+1] *= -1;
            if (Math.abs(positions[i+2]) > 5) velocityArray[i+2] *= -1;

            // Mouse Repulsion
            const dx = positions[i] - mouseX * 5;
            const dy = positions[i + 1] - mouseY * 5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 1.5) {
                const force = (1.5 - dist) / 1.5;
                positions[i] += dx * force * 0.1;
                positions[i + 1] += dy * force * 0.1;
            } else {
                // Smoothly return to original or base path if needed
            }
        }
        
        particlesMesh.rotation.y = frame;
        particlesGeometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });
    resizeObserver.observe(container);

    animate();

    return {
        destroy: () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('mousemove', onMouseMove);
            resizeObserver.disconnect();
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        },
        updateColors: (isDarkMode) => {
            const newColors = isDarkMode ? colors.dark : colors.light;
            const colorsArray = particlesGeometry.attributes.color.array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                const color = new THREE.Color(newColors[Math.floor(Math.random() * newColors.length)]);
                colorsArray[i] = color.r;
                colorsArray[i + 1] = color.g;
                colorsArray[i + 2] = color.b;
            }
            particlesGeometry.attributes.color.needsUpdate = true;
        }
    };
}

/**
 * Create a 3D geometric shapes scene
 * @param {HTMLElement} container - Container element for the canvas
 * @param {Object} options - Configuration options
 */
export function createGeometricScene(container, options = {}) {
    const {
        shapeCount = 5,
        rotationSpeed = 0.01,
        colors = {
            light: [0x02569B, 0x0175C2, 0x13B9FD],
            dark: [0x13B9FD, 0x0175C2, 0x02569B]
        }
    } = options;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 800;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
    );
    camera.position.z = 10;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Get current theme colors
    const isDark = document.body.classList.contains('dark-mode');
    const themeColors = isDark ? colors.dark : colors.light;

    // Create geometric shapes
    const shapes = [];
    const geometries = [
        () => new THREE.IcosahedronGeometry(1.2, 0),
        () => new THREE.OctahedronGeometry(1.2, 0),
        () => new THREE.TetrahedronGeometry(1.2, 0),
        () => new THREE.BoxGeometry(1.2, 1.2, 1.2),
        () => new THREE.SphereGeometry(1.2, 16, 16)
    ];

    for (let i = 0; i < shapeCount; i++) {
        const geometry = geometries[i % geometries.length]();
        const material = new THREE.MeshStandardMaterial({
            color: themeColors[i % themeColors.length],
            transparent: true,
            opacity: 0.3,
            wireframe: true,
            metalness: 0.5,
            roughness: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 15;
        mesh.position.z = (Math.random() - 0.5) * 5;

        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        scene.add(mesh);
        shapes.push(mesh);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation
    let animationId;
    function animate() {
        shapes.forEach((shape, index) => {
            shape.rotation.x += rotationSpeed * (index % 2 === 0 ? 1 : -1);
            shape.rotation.y += rotationSpeed * (index % 3 === 0 ? 1 : -1);
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
        });

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    }

    // Handle resize using ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });
    resizeObserver.observe(container);

    // Start animation
    animate();

    // Return cleanup function
    return {
        destroy: () => {
            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();
            shapes.forEach(shape => {
                shape.geometry.dispose();
                shape.material.dispose();
                scene.remove(shape);
            });
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        },
        updateColors: (isDarkMode) => {
            const newColors = isDarkMode ? colors.dark : colors.light;
            shapes.forEach((shape, index) => {
                shape.material.color.setHex(newColors[index % newColors.length]);
            });
        }
    };
}

/**
 * Initialize 3D scene in hero section
 * @param {string} type - Type of scene ('particles' or 'geometric')
 * @param {Object} options - Configuration options
 */
export function initHero3DScene(type = 'particles', options = {}) {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return null;

    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'threejs-canvas';
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '0';
    canvasContainer.style.left = '0';
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '100%';
    canvasContainer.style.zIndex = '0';
    heroBackground.appendChild(canvasContainer);

    // Create scene based on type
    let sceneController;
    if (type === 'geometric') {
        sceneController = createGeometricScene(canvasContainer, options);
    } else {
        sceneController = createParticleScene(canvasContainer, options);
    }

    // Watch for theme changes
    const observer = new MutationObserver(() => {
        if (sceneController && sceneController.updateColors) {
            const isDark = document.body.classList.contains('dark-mode');
            sceneController.updateColors(isDark);
        }
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    return {
        ...sceneController,
        destroy: () => {
            observer.disconnect();
            if (sceneController && sceneController.destroy) {
                sceneController.destroy();
            }
        }
    };
}

