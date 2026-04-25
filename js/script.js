// --- Component Loader ---
async function loadSharedComponents() {
    const components = [
        { id: '.top-nav', file: 'components/shared/top-nav.html' },
        { id: '.sidebar-left', file: 'components/shared/sidebar-left.html' },
        { id: '.main-footer-status', file: 'components/shared/footer.html' }
    ];

    for (const comp of components) {
        const el = document.querySelector(comp.id);
        if (el) {
            try {
                const response = await fetch(comp.file);
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
    const scrollY = window.pageYOffset + 150;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-link');
    let currentSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = sectionId;
        }
    });

    if (currentSectionId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isTarget = href.endsWith(`#${currentSectionId}`);
            
            if (isTarget) {
                link.classList.add('active');
                updateIndicator(link);
            } else {
                link.classList.remove('active');
            }
        });
    }
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

    // 4. Scroll Reveal
    const revealContainers = document.querySelectorAll('.scroll-reveal-sliding');
    if (revealContainers.length > 0) {
        const handleRevealScroll = () => {
            const viewportHeight = window.innerHeight;
            const scrollPos = window.scrollY;
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
        };
        window.addEventListener('scroll', handleRevealScroll);
        handleRevealScroll();
    }

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

            if (newMain && newSidebar) {
                mainContent.innerHTML = newMain.innerHTML;
                sidebarRight.innerHTML = newSidebar.innerHTML;
                
                mainContent.classList.remove('content-exiting');
                sidebarRight.classList.remove('content-exiting');
                mainContent.classList.add('content-entering');
                sidebarRight.classList.add('content-entering');

                window.history.pushState({}, '', url);
                document.title = newDoc.title;
                
                const currentPath = url.split('/').pop() || 'index.html';
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').includes(currentPath));
                });

                window.scrollTo(0, 0);
                initPageEffects();

                requestAnimationFrame(() => {
                    mainContent.classList.remove('content-entering');
                    sidebarRight.classList.remove('content-entering');
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
    initPageEffects();

    // Intercept Navigation
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

    window.addEventListener('popstate', () => location.reload());
    window.addEventListener('scroll', handleScrollSpy);
    window.addEventListener('resize', updateLineNumbers);
    window.addEventListener('load', updateLineNumbers);

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
