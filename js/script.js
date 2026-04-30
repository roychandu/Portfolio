// --- Base Path Helper (works locally AND on GitHub Pages subdirectory) ---
function getBasePath() {
    const path = window.location.pathname;
    // Find the last '/' to get the directory of the current page
    return path.substring(0, path.lastIndexOf('/') + 1);
}

// --- Component Loader ---
async function loadSharedComponents() {
    const base = getBasePath();
    const components = [
        { id: '.top-nav', file: 'components/shared/top-nav.html' },
        { id: '.sidebar-left', file: 'components/shared/sidebar-left.html' },
        { id: '.main-footer-status', file: 'components/shared/footer.html' }
    ];

    for (const comp of components) {
        const el = document.querySelector(comp.id);
        if (el) {
            try {
                const response = await fetch(base + comp.file);
                const html = await response.text();
                el.innerHTML = html;
            } catch (err) {
                console.error(`Error loading ${comp.file}:`, err);
            }
        }
    }

    // Set Active Link in Top Nav
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes(currentPath)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// --- Role Typewriter Logic ---
function initRoleRotation() {
    const roles = [
        "Flutter & App Developer",
        "Cross-platform Mobile App & Web Developer"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    const roleEl = document.getElementById('rotating-role');

    if (!roleEl) return;

    function type() {
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            roleEl.innerText = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 50;
        } else {
            roleEl.innerText = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeSpeed = 500; // Pause before next
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// --- Sidebar Indicator Logic ---
function updateIndicator(activeLink) {
    const indicator = document.querySelector('.nav-active-indicator');
    const navList = document.querySelector('.sidebar-nav ul');
    if (!activeLink || !indicator || !navList) return;

    const linkTop = activeLink.parentElement.offsetTop;
    const linkHeight = activeLink.parentElement.offsetHeight;
    const targetY = linkTop + (linkHeight / 2) - (indicator.offsetHeight / 2);
    indicator.style.transform = `translateY(${targetY}px)`;
}

// --- Scroll Spy Logic ---
function handleScrollSpy() {
    const scrollY = window.pageYOffset + 200; // Calibrated offset for top-nav
    const sections = Array.from(document.querySelectorAll('section[id]'))
        .filter(section => section.style.display !== 'none');
    
    const navLinks = document.querySelectorAll('.sidebar-link');
    let currentSectionId = '';

    // Find the last section that has passed the scroll threshold
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    if (currentSectionId) {
        navLinks.forEach(link => {
            // Only update indicator for links that are actually visible
            if (link.parentElement.style.display === 'none') {
                link.classList.remove('active');
                return;
            }
            
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href.includes(`#${currentSectionId}`)) {
                link.classList.add('active');
                updateIndicator(link);
            }
        });
    }
}

// --- Project Gallery Loader ---
async function loadProjectGallery() {
    const workGrid = document.getElementById('work-grid');
    const newsAppsGrid = document.getElementById('news-apps-grid');
    if (!workGrid) return;

    try {
        const response = await fetch(getBasePath() + 'data/projects.json');
        const projects = await response.json();
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Define IDs to be simplified into the list view (only for work.html)
        const news10kIds = [
            'india-7-live-news', 'khoji-narad-news', 'narad-post-news', 'tehelka-india-news'
        ];

        // Other news projects to exclude from work.html to avoid duplication
        const excludeNewsIds = [
            'dev-bhoomi-dialogue', 'devbhoomi-media-news', 'headlines247-news', 'hill-mail-news',
            'hnn-24x7-news', 'khabar-inbox-news', 'news-bulletin-live', 'news-in-hand', 'the-hill-india-news'
        ];

        const projectEntries = Object.entries(projects);

        // Filter projects to define the "curated" pool (excluding hidden news apps)
        const curatedEntries = projectEntries.filter(([id]) => !news10kIds.includes(id) && !excludeNewsIds.includes(id));
        const news10kEntries = projectEntries.filter(([id]) => news10kIds.includes(id));
        const otherNewsEntries = projectEntries.filter(([id]) => excludeNewsIds.includes(id));

        // The total count of projects we want to acknowledge in the portfolio
        const displayCount = curatedEntries.length + news10kEntries.length + otherNewsEntries.length;

        let mainProjects = [];
        let newsProjects = [];

        if (currentPage === 'work.html') {
            mainProjects = curatedEntries;
            newsProjects = news10kEntries;
        } else if (currentPage === 'index.html') {
            mainProjects = curatedEntries.slice(0, 6);
        } else {
            mainProjects = curatedEntries;
        }

        // Update counts in headers
        const featuredHeader = document.getElementById('featured-work-header');
        if (featuredHeader) {
            const text = `Featured work (${displayCount})`;
            featuredHeader.innerText = text;
            featuredHeader.setAttribute('data-scramble', text);
        }

        const allProjectsHeader = document.getElementById('all-projects-header');
        if (allProjectsHeader) {
            const text = `All Projects (${displayCount})`;
            allProjectsHeader.innerText = text;
            allProjectsHeader.setAttribute('data-scramble', text);
        }

        // Render Main Grid
        workGrid.innerHTML = ''; 
        mainProjects.forEach(([id, project]) => {
            const card = document.createElement('a');
            card.href = `work-details.html?id=${id}`;
            card.className = 'work-card';

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${project.title}</h3>
                    <div class="card-arrow"><i class="fas fa-arrow-right"></i></div>
                </div>
                <div class="card-body">
                    <img src="${project.thumbnail}" alt="${project.title} Project">
                </div>
            `;
            workGrid.appendChild(card);
        });

        // Render Simplified News Apps List (Only on work.html)
        if (newsAppsGrid && newsProjects.length > 0) {
            newsAppsGrid.innerHTML = '';
            newsProjects.forEach(([id, project]) => {
                const item = document.createElement('div');
                item.className = 'news-app-item';
                item.innerHTML = `
                    <div class="news-app-info">
                        <span class="news-app-title">${project.title}</span>
                        <span class="news-app-meta">FlutterFlow • Android • 10k+ Downloads</span>
                    </div>
                    <a href="${project.liveLink}" target="_blank" class="news-app-link">
                        <span>View on Play Store</span>
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                `;
                newsAppsGrid.appendChild(item);
            });
        }

        // Render Names-only for the rest of news projects (Only on work.html)
        const otherNewsNamesGrid = document.getElementById('other-news-names');
        if (otherNewsNamesGrid && otherNewsEntries.length > 0) {
            otherNewsNamesGrid.innerHTML = otherNewsEntries.map(([id, project]) => project.title).join(' • ');
        }

        // Force line number update after dynamic content loads
        setTimeout(updateLineNumbers, 100);
    } catch (err) {
        console.error('Error loading project gallery:', err);
    }
}

// --- Ongoing Projects Loader ---
async function loadOngoingProjects() {
    const ongoingGrid = document.getElementById('ongoing-grid');
    if (!ongoingGrid) return;

    try {
        const response = await fetch(getBasePath() + 'data/ongoing.json');
        const ongoing = await response.json();

        ongoingGrid.innerHTML = '';

        Object.entries(ongoing).forEach(([id, project]) => {
            const card = document.createElement('div');
            card.className = 'work-card';

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${project.title}</h3>
                    <div class="card-arrow"><i class="fas fa-clock"></i></div>
                </div>
                <div class="card-body" style="position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #1a1a1a;">
                    <img src="${project.thumbnail}" alt="${project.title} Ongoing" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.4;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7));">
                        <span style="color: var(--accent); font-size: 10px; font-weight: 800; letter-spacing: 1.5px; margin-bottom: 12px; text-transform: uppercase; border: 1px solid var(--accent); padding: 3px 10px; background: rgba(0,0,0,0.3);">${project.status}</span>
                        <p style="font-size: 13px; color: #eee; line-height: 1.5; margin: 0; font-family: 'IBM Plex Mono', monospace; max-width: 90%; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${project.description}</p>
                    </div>
                </div>
            `;

            ongoingGrid.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading ongoing projects:', err);
    }
}

// --- Dynamic Project Data Loader ---
async function loadProjectDetails() {
    const isProjectPage = window.location.pathname.includes('work-details.html');
    if (!isProjectPage) return;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    if (!projectId) return;

    console.log('Loading project:', projectId);

    try {
        const response = await fetch(getBasePath() + 'data/projects.json');
        const data = await response.json();
        const project = data[projectId];

        if (!project) {
            console.error('Project not found in JSON:', projectId);
            return;
        }

        // Update Text Fields
        const fields = ['title', 'shortDescription', 'role', 'platform', 'year'];
        fields.forEach(field => {
            const el = document.querySelector(`[data-project-field="${field}"]`);
            if (el && project[field]) el.innerText = project[field];
        });

        // Update URLs (Live Link & GitHub Link)
        const linkFields = ['liveLink', 'githubUrl'];
        linkFields.forEach(field => {
            const btn = document.querySelector(`[data-project-field="${field}"]`);
            if (btn) {
                const url = project[field];
                if (url && url !== '#') {
                    btn.href = url;
                    btn.target = '_blank';
                    btn.rel = 'noopener noreferrer';
                    btn.style.display = 'inline-flex';
                } else {
                    btn.href = '#';
                    btn.removeAttribute('target');
                    btn.removeAttribute('rel');
                    btn.style.display = 'none';
                }
            }
        });

        // Hide meta-cta container if no links exist
        const metaCta = document.querySelector('.meta-cta');
        if (metaCta) {
            const hasLinks = linkFields.some(field => project[field] && project[field] !== '#');
            metaCta.style.display = hasLinks ? '' : 'none';
        }

        // Hero Image
        const heroImg = document.querySelector('[data-project-field="heroImage"]');
        if (heroImg) {
            heroImg.src = project['project-poster'];
            heroImg.alt = project.title;
        }

        // Project Video
        const videoEl = document.querySelector('[data-project-field="videoUrl"]');
        const videoSection = document.getElementById('project-video');
        const videoSidebarLink = document.querySelector('.sidebar-link[href="#project-video"]');
        const videoBadge = document.querySelector('.video-shortcut-badge');

        if (videoEl) {
            if (project.videoUrl) {
                videoEl.src = project.videoUrl;
                videoEl.poster = project['project-poster'];
                if (videoSection) videoSection.style.display = '';
                if (videoSidebarLink) videoSidebarLink.parentElement.style.display = '';
                if (videoBadge) videoBadge.style.display = 'inline-flex';
            } else {
                videoEl.removeAttribute('src');
                videoEl.removeAttribute('poster');
                videoEl.load();
                if (videoSection) videoSection.style.display = 'none';
                if (videoSidebarLink) videoSidebarLink.parentElement.style.display = 'none';
                if (videoBadge) videoBadge.style.display = 'none';
            }
        }

        // Overview
        const detailTextBlock = document.querySelector('#overview .detail-text-block');
        if (detailTextBlock && project.overview.about) {
            // Support for HTML content in about section
            let aboutHtml = project.overview.about;
            
            // Bold labels before colon in lists within the about section
            aboutHtml = aboutHtml.replace(/<li>(.*?):/g, '<li><strong>$1:</strong>');
            
            detailTextBlock.innerHTML = aboutHtml;
        }

        // Note: Approach might be moved or hidden if about is comprehensive
        const approachBlock = document.getElementById('approach');
        if (approachBlock) {
            if (project.overview.approach) {
                approachBlock.style.display = '';
                const approachText = approachBlock.querySelector('p');
                if (approachText) approachText.innerText = project.overview.approach;
            } else {
                approachBlock.style.display = 'none';
            }
        }

        // Screenshots Grid
        const screenGrid = document.querySelector('.work-grid-brutalist');
        if (screenGrid && project.screenshots) {
            screenGrid.innerHTML = project.screenshots.map(src => `
                <div class="screenshot-card">
                    <img src="${src}" alt="App Screen">
                </div>
            `).join('');
        }

        // Features List
        const featureList = document.querySelector('.feature-bullet-list');
        if (featureList && project.keyFeatures) {
            featureList.innerHTML = project.keyFeatures.map((feat, index) => {
                // Support for nested object structure (Numbered list with bullets inside)
                if (typeof feat === 'object' && feat.title) {
                    const items = feat.items || [];
                    const itemsHtml = items.map(item => {
                        const colonIndex = item.indexOf(':');
                        if (colonIndex !== -1) {
                            const label = item.substring(0, colonIndex);
                            const description = item.substring(colonIndex);
                            return `<li><strong>${label}</strong>${description}</li>`;
                        }
                        return `<li>${item}</li>`;
                    }).join('');
                    
                    return `
                        <li class="nested-feature-item">
                            <div class="feature-main-row">
                                <span class="feature-number">${index + 1}.</span>
                                <strong>${feat.title}</strong>
                            </div>
                            <ul class="nested-bullet-list">
                                ${itemsHtml}
                            </ul>
                        </li>
                    `;
                }

                // Standard string handling with bold labels
                const colonIndex = feat.indexOf(':');
                if (colonIndex !== -1) {
                    const label = feat.substring(0, colonIndex);
                    const description = feat.substring(colonIndex);
                    return `<li><strong>${label}</strong>${description}</li>`;
                }
                return `<li>${feat}</li>`;
            }).join('');
        }

        // Tech Stack
        const techCols = document.querySelectorAll('.tech-detail-col ul');
        if (techCols.length >= 2) {
            const formatItem = (item) => {
                const colonIndex = item.indexOf(':');
                if (colonIndex !== -1) {
                    const label = item.substring(0, colonIndex);
                    const description = item.substring(colonIndex);
                    return `<li><strong>${label}</strong>${description}</li>`;
                }
                return `<li>${item}</li>`;
            };

            techCols[0].innerHTML = project.techUsed.core.map(formatItem).join('');
            techCols[1].innerHTML = project.techUsed.backend.map(formatItem).join('');
        }

        // Results
        const statsGrid = document.querySelector('.stats-grid-brutalist');
        if (statsGrid && project.results) {
            statsGrid.innerHTML = project.results.map(stat => `
                <div class="stat-card">
                    <div class="stat-number">${stat.number}</div>
                    <div class="stat-info">${stat.info}</div>
                </div>
            `).join('');
        }

        // Load Random Projects for "See More"
        loadRandomProjects(projectId, data);

        // Initialize Counter Animation for Stats
        initCounterAnimation();

        // Reset Scroll
        window.scrollTo(0, 0);

        // Force line number update after content injection
        setTimeout(updateLineNumbers, 100);

    } catch (err) {
        console.error('Error loading project details:', err);
    }
}

// --- Random Projects Loader for "See More" ---
function loadRandomProjects(currentId, projects) {
    const grid = document.getElementById('see-more-grid');
    if (!grid) return;

    // Filter out current project and shuffle
    const entries = Object.entries(projects).filter(([id]) => id !== currentId);
    const shuffled = entries.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);

    grid.innerHTML = '';
    selected.forEach(([id, project]) => {
        const card = document.createElement('a');
        card.href = `work-details.html?id=${id}`;
        card.className = 'work-card';
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${project.title}</h3>
                <div class="card-arrow"><i class="fas fa-arrow-right"></i></div>
            </div>
            <div class="card-body">
                <img src="${project.thumbnail}" alt="${project.title}">
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Number Counter Animation ---
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const valueStr = target.innerText;
                const match = valueStr.match(/(\d+)/);
                if (!match) return;

                const targetValue = parseInt(match[0]);
                const suffix = valueStr.substring(valueStr.indexOf(match[0]) + match[0].length);
                const prefix = valueStr.substring(0, valueStr.indexOf(match[0]));

                let duration = 2000; // 2 seconds
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing (easeOutExpo)
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentCount = Math.floor(easeProgress * targetValue);

                    target.innerText = prefix + currentCount + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        target.innerText = valueStr; // Final exact value
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(target); // Only animate once
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => observer.observe(counter));
}

// --- Line Number Gutter Generation ---
function updateLineNumbers() {
    const gutter = document.getElementById('line-numbers');
    const mainContent = document.querySelector('.main-content');

    if (!gutter || !mainContent) return;

    const lineHeight = 24;
    const contentElements = Array.from(mainContent.children).filter(el => el.id !== 'line-numbers');
    if (contentElements.length === 0) return;

    const lastElement = contentElements[contentElements.length - 1];
    const contentBottom = lastElement.offsetTop + lastElement.offsetHeight;
    const gutterTop = gutter.offsetTop;

    const totalHeight = contentBottom - gutterTop;
    const count = Math.max(0, Math.floor(totalHeight / lineHeight));

    let html = '';
    for (let i = 1; i <= count; i++) {
        html += `<span>${i}</span>`;
    }
    gutter.innerHTML = html;
    gutter.style.height = `${totalHeight}px`;
}

// --- Scramble Text Effect ---
class ScrambleText {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        this.el.innerText = '';
        this.el.classList.add('scramble-active');
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(i * 1.2);
            const end = start + Math.floor(Math.random() * 12);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += '';
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// --- Page Initialization Logic ---
function initPageEffects() {
    loadProjectDetails();
    // 1. Scramble Elements
    const scrambleElements = document.querySelectorAll('[data-scramble]');
    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.getAttribute('data-scramble');
                const fx = new ScrambleText(el);
                fx.setText(text);
                scrambleObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });
    scrambleElements.forEach(el => scrambleObserver.observe(el));

    // 2. Sidebar Scroll Links
    const navLinks = document.querySelectorAll('.sidebar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.includes('#')) {
                const targetId = '#' + href.split('#')[1];
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    window.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
                }
            }
        });
    });

    handleScrollSpy();    // 3. Universal Grid Toggles
    const toggles = document.querySelectorAll('.view-toggle');
    toggles.forEach(toggle => {
        // Find the associated grid (usually the next sibling of the header)
        const sectionHeader = toggle.closest('.work-section-header');
        if (!sectionHeader) return;

        const grid = sectionHeader.nextElementSibling;
        if (!grid || !grid.classList.contains('work-grid-brutalist')) return;

        const items = grid.children;
        const buttons = toggle.querySelectorAll('.toggle-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                // FLIP Animation Prep
                const firstRects = Array.from(items).map(item => item.getBoundingClientRect());

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const gridMode = btn.getAttribute('data-grid');
                grid.classList.remove('grid-3', 'grid-4', 'grid-6');
                grid.classList.add(gridMode);

                // FLIP Animation Execute
                requestAnimationFrame(() => {
                    Array.from(items).forEach((item, i) => {
                        const lastRect = item.getBoundingClientRect();
                        const firstRect = firstRects[i];

                        const dx = firstRect.left - lastRect.left;
                        const dy = firstRect.top - lastRect.top;
                        const dw = firstRect.width / lastRect.width;
                        const dh = firstRect.height / lastRect.height;

                        item.style.transition = 'none';
                        item.style.transformOrigin = 'top left';
                        item.style.transform = `translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`;

                        requestAnimationFrame(() => {
                            item.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s';
                            item.style.transform = 'none';
                        });
                    });

                    // Update line numbers after grid changes height
                    setTimeout(updateLineNumbers, 600);
                });
            });
        });
    });

    // 4. Scroll Reveal & Parallax Triggers
    const revealContainers = document.querySelectorAll('.scroll-reveal-sliding');
    const aboutCard = document.querySelector('.about-profile-card');

    const handleRevealScroll = () => {
        const viewportHeight = window.innerHeight;
        const scrollPos = window.scrollY;

        // Sliding Doors Effect
        revealContainers.forEach(container => {
            const rect = container.getBoundingClientRect();
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const elementTop = container.offsetTop;
                const speed = parseFloat(container.getAttribute('data-speed')) || 1.2;
                const diff = (elementTop - scrollPos) - (viewportHeight * 0.2);
                const movement = Math.max(0, diff * speed);
                const leftElements = container.querySelectorAll('.reveal-item-left, .reveal-filler.left');
                const rightElements = container.querySelectorAll('.reveal-item-right, .reveal-filler.right');
                leftElements.forEach(el => el.style.transform = `translateX(-${movement}px)`);
                rightElements.forEach(el => el.style.transform = `translateX(${movement}px)`);
            }
        });

        // About Card Parallax Scroll Trigger
        if (aboutCard) {
            const rect = aboutCard.getBoundingClientRect();
            const parent = aboutCard.closest('.about-layout');
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                if (parentRect.top < viewportHeight && parentRect.bottom > 0) {
                    // Subtle parallax when sticky
                    const speed = 0.05;
                    const movement = (parentRect.top) * speed;
                    aboutCard.style.transform = `translateY(${movement}px)`;
                }
            }
        }
    };

    window.addEventListener('scroll', handleRevealScroll);
    handleRevealScroll();

    // 5. Line Numbers Generation
    updateLineNumbers();
}

// --- AJAX Navigation Logic ---
async function navigateTo(url) {
    const mainContent = document.querySelector('.main-content');
    const sidebarRight = document.querySelector('.sidebar-right');

    mainContent.classList.add('content-exiting');
    sidebarRight.classList.add('content-exiting');

    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        setTimeout(() => {
            const newMain = newDoc.querySelector('.main-content');
            const newSidebar = newDoc.querySelector('.sidebar-right');

            if (newMain) {
                // Update Main Content
                mainContent.innerHTML = newMain.innerHTML;

                // Handle Sidebar Visibility & Layout
                if (newSidebar) {
                    sidebarRight.innerHTML = newSidebar.innerHTML;
                    sidebarRight.style.display = 'flex';
                    mainContent.classList.remove('no-right-sidebar');
                } else {
                    sidebarRight.style.display = 'none';
                    mainContent.classList.add('no-right-sidebar');
                }

                // Update Classes in newDoc as well for next load
                if (newMain.classList.contains('no-right-sidebar')) {
                    mainContent.classList.add('no-right-sidebar');
                } else if (newSidebar) {
                    mainContent.classList.remove('no-right-sidebar');
                }

                mainContent.classList.remove('content-exiting');
                if (newSidebar) sidebarRight.classList.remove('content-exiting');

                mainContent.classList.add('content-entering');
                if (newSidebar) sidebarRight.classList.add('content-entering');

                window.history.pushState({}, '', url);
                document.title = newDoc.title;

                const currentPath = url.split('/').pop() || 'index.html';
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').includes(currentPath));
                });

                window.scrollTo(0, 0);
                loadProjectGallery();
                loadOngoingProjects();
                initPageEffects();
                loadProjectDetails();

                requestAnimationFrame(() => {
                    mainContent.classList.remove('content-entering');
                    if (newSidebar) sidebarRight.classList.remove('content-entering');
                });
            }
        }, 400);
    } catch (err) {
        console.error('Navigation failed:', err);
        window.location.href = url;
    }
}

// --- Initialize All ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadSharedComponents();
    await loadProjectGallery();
    await loadOngoingProjects();
    initPageEffects();
    initRoleRotation();

    // Intercept Page Navigation
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        const isInternal = href && href.includes('.html') && !href.startsWith('http');
        if (isInternal) {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const targetPage = href.split('#')[0];
            if (targetPage !== currentPath && targetPage !== '') {
                e.preventDefault();
                navigateTo(href);
            }
        }
    });

    // Smooth Scroll for Anchor Links
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    window.addEventListener('popstate', () => location.reload());
    window.addEventListener('scroll', handleScrollSpy);
    window.addEventListener('resize', updateLineNumbers);
    window.addEventListener('load', updateLineNumbers);

    // Auto-update line numbers when content height changes (e.g. images load, dynamic data injected)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const resizeObserver = new ResizeObserver(() => {
            updateLineNumbers();
        });
        resizeObserver.observe(mainContent);
    }

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        const hoverables = document.querySelectorAll('a, button, .work-card, .tech-cell, .sidebar-link');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }

    // Update Time
    const timeEl = document.querySelector('.status-bar .status-item:last-child');
    if (timeEl) {
        const updateTime = () => {
            const now = new Date();
            const options = { hour: '2-digit', minute: '2-digit', hour12: true };
            timeEl.innerText = now.toLocaleTimeString([], options);
        };
        setInterval(updateTime, 10000);
        updateTime();
    }
});
