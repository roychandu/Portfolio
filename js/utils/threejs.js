/**
 * Create a premium 3D Neural/Connective Graph scene
 * @param {HTMLElement} container - Container element for the canvas
 * @param {Object} options - Configuration options
 */
export function createNeuralScene(container, options = {}) {
    const {
        particleCount = 100,
        connectionDistance = 2.5,
        speed = 0.5,
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
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles/Nodes
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    
    const isDark = document.body.classList.contains('dark-mode');
    const themeColors = isDark ? colors.dark : colors.light;

    for (let i = 0; i < particleCount; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: themeColors[Math.floor(Math.random() * themeColors.length)],
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(particleGeometry, material);
        
        mesh.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );

        mesh.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02 * speed,
                (Math.random() - 0.5) * 0.02 * speed,
                (Math.random() - 0.5) * 0.02 * speed
            )
        };

        scene.add(mesh);
        particles.push(mesh);
    }

    // Lines/Connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: isDark ? 0x13B9FD : 0x02569B,
        transparent: true,
        opacity: 0.2
    });
    
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lineMesh);

    // Mouse interaction
    let mouse = new THREE.Vector2(-1000, -1000);
    const onMouseMove = (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation
    let animationId;
    function animate() {
        // Find line connections
        let vertexIndex = 0;
        const positions = linesGeometry.attributes.position.array;
        
        // Raycaster for mouse interaction
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const mouseIntersects = new THREE.Vector3();
        raycaster.ray.at(5, mouseIntersects);

        for (let i = 0; i < particleCount; i++) {
            const p1 = particles[i];
            
            // Move particles
            p1.position.add(p1.userData.velocity);

            // Bounds check
            if (Math.abs(p1.position.x) > 6) p1.userData.velocity.x *= -1;
            if (Math.abs(p1.position.y) > 6) p1.userData.velocity.y *= -1;
            if (Math.abs(p1.position.z) > 6) p1.userData.velocity.z *= -1;

            // Mouse interaction (gentle attraction)
            const distToMouse = p1.position.distanceTo(mouseIntersects);
            if (distToMouse < 2) {
                const attraction = mouseIntersects.clone().sub(p1.position).multiplyScalar(0.01);
                p1.position.add(attraction);
            }

            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const distance = p1.position.distanceTo(p2.position);

                if (distance < connectionDistance) {
                    positions[vertexIndex++] = p1.position.x;
                    positions[vertexIndex++] = p1.position.y;
                    positions[vertexIndex++] = p1.position.z;
                    positions[vertexIndex++] = p2.position.x;
                    positions[vertexIndex++] = p2.position.y;
                    positions[vertexIndex++] = p2.position.z;
                }
            }
        }

        linesGeometry.attributes.position.needsUpdate = true;
        linesGeometry.setDrawRange(0, vertexIndex / 3);
        
        // Rotate the whole scene slightly
        scene.rotation.y += 0.001;
        scene.rotation.x += 0.0005;

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
            particles.forEach(p => {
                p.geometry.dispose();
                p.material.dispose();
            });
            linesGeometry.dispose();
            lineMaterial.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        },
        updateColors: (isDarkMode) => {
            const newColors = isDarkMode ? colors.dark : colors.light;
            particles.forEach(p => {
                p.material.color.setHex(newColors[Math.floor(Math.random() * newColors.length)]);
            });
            lineMaterial.color.setHex(isDarkMode ? 0x13B9FD : 0x02569B);
        }
    };
}

/**
 * Initialize 3D scene in hero section
 * @param {string} type - Type of scene ('particles', 'geometric', or 'neural')
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
    } else if (type === 'neural') {
        sceneController = createNeuralScene(canvasContainer, options);
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

/**
 * Existing сцены logic below (keeping for compatibility)
 */
export function createParticleScene(container, options = {}) {
    const {
        particleCount = 2500,
        speed = 1.0,
        colors = {
            light: [0x02569B, 0x0175C2, 0x13B9FD],
            dark: [0x13B9FD, 0x0175C2, 0x02569B]
        }
    } = options;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const velocityArray = new Float32Array(particleCount * 3);

    const isDark = document.body.classList.contains('dark-mode');
    const themeColors = isDark ? colors.dark : colors.light;

    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 10;

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
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let animationId;
    function animate() {
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] += velocityArray[i];
            positions[i + 1] += velocityArray[i + 1];
            positions[i + 2] += velocityArray[i + 2];

            if (Math.abs(positions[i]) > 5) velocityArray[i] *= -1;
            if (Math.abs(positions[i + 1]) > 5) velocityArray[i + 1] *= -1;
            if (Math.abs(positions[i + 2]) > 5) velocityArray[i + 2] *= -1;
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        particlesMesh.rotation.y += 0.001 * speed;
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    }
    animate();

    return {
        destroy: () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        },
        updateColors: (isDark) => {
            const newColors = isDark ? colors.dark : colors.light;
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const shapes = [];
    const geometries = [
        new THREE.IcosahedronGeometry(1.2, 0),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.BoxGeometry(1.2, 1.2, 1.2)
    ];

    const isDark = document.body.classList.contains('dark-mode');
    const themeColors = isDark ? colors.dark : colors.light;

    for (let i = 0; i < shapeCount; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: themeColors[i % themeColors.length],
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const mesh = new THREE.Mesh(geometries[i % geometries.length], material);
        mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 5);
        scene.add(mesh);
        shapes.push(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    let animationId;
    function animate() {
        shapes.forEach((shape, index) => {
            shape.rotation.x += rotationSpeed;
            shape.rotation.y += rotationSpeed;
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
        });
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    }
    animate();

    return {
        destroy: () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        },
        updateColors: (isDark) => {
            const newColors = isDark ? colors.dark : colors.light;
            shapes.forEach((shape, index) => {
                shape.material.color.setHex(newColors[index % newColors.length]);
            });
        }
    };
}

