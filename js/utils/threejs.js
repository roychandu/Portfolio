/**
 * Three.js 3D Animation Utilities
 * Creates and manages 3D scenes for the portfolio
 */

import * as THREE from 'three';

/**
 * Create a 3D particle system for hero background
 * @param {HTMLElement} container - Container element for the canvas
 * @param {Object} options - Configuration options
 */
export function createParticleScene(container, options = {}) {
    const {
        particleCount = 1000,
        speed = 0.5,
        colors = {
            light: [0x02569B, 0x0175C2, 0x13B9FD],
            dark: [0x13B9FD, 0x0175C2, 0x02569B]
        }
    } = options;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = particleCount;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    // Get current theme colors
    const isDark = document.body.classList.contains('dark-mode');
    const themeColors = isDark ? colors.dark : colors.light;

    // Initialize particle positions and colors
    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 20;     // x
        posArray[i + 1] = (Math.random() - 0.5) * 20; // y
        posArray[i + 2] = (Math.random() - 0.5) * 20; // z

        const color = new THREE.Color(
            themeColors[Math.floor(Math.random() * themeColors.length)]
        );
        colorArray[i] = color.r;
        colorArray[i + 1] = color.g;
        colorArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation
    let frame = 0;
    function animate() {
        frame += 0.01;
        
        // Rotate particles
        particlesMesh.rotation.x = frame * 0.1;
        particlesMesh.rotation.y = frame * 0.15;

        // Animate particles
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i + 1] += Math.sin(frame + i) * 0.001 * speed;
            positions[i] += Math.cos(frame + i * 0.5) * 0.001 * speed;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // Handle window resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Return cleanup function
    return {
        destroy: () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            container.removeChild(renderer.domElement);
        },
        updateColors: (isDarkMode) => {
            const newColors = isDarkMode ? colors.dark : colors.light;
            const colorsArray = particlesGeometry.attributes.color.array;
            
            for (let i = 0; i < particlesCount * 3; i += 3) {
                const color = new THREE.Color(
                    newColors[Math.floor(Math.random() * newColors.length)]
                );
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

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 10;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Get current theme colors
    const isDark = document.body.classList.contains('dark-mode');
    const themeColors = isDark ? colors.dark : colors.light;

    // Create geometric shapes
    const shapes = [];
    const geometries = [
        () => new THREE.IcosahedronGeometry(1, 0),
        () => new THREE.OctahedronGeometry(1, 0),
        () => new THREE.TetrahedronGeometry(1, 0),
        () => new THREE.BoxGeometry(1, 1, 1),
        () => new THREE.SphereGeometry(1, 16, 16)
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
        mesh.position.x = (Math.random() - 0.5) * 15;
        mesh.position.y = (Math.random() - 0.5) * 15;
        mesh.position.z = (Math.random() - 0.5) * 10;

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
    function animate() {
        shapes.forEach((shape, index) => {
            shape.rotation.x += rotationSpeed * (index % 2 === 0 ? 1 : -1);
            shape.rotation.y += rotationSpeed * (index % 3 === 0 ? 1 : -1);
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // Handle window resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Return cleanup function
    return {
        destroy: () => {
            window.removeEventListener('resize', handleResize);
            shapes.forEach(shape => {
                shape.geometry.dispose();
                shape.material.dispose();
                scene.remove(shape);
            });
            renderer.dispose();
            container.removeChild(renderer.domElement);
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

