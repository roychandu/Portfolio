/**
 * Chandan Roy - Portfolio Script
 * Exact Match Version
 */

// --- Scramble Text Effect ---
class ScrambleText {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        this.el.innerText = ''; // Clear existing text immediately for "invisible start"
        this.el.classList.add('scramble-active'); // Make element visible now that animation is starting
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            
            // Sequential Typewriter Timing: 
            // i * 1.5 creates the typewriter reveal progression
            // i * 1.5 + random(12) ensures each character scrambles briefly before settling
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
                output += ''; // Do not show 'from' text, keeping it invisible until reveal
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

// --- Initialize Effects ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Scramble Elements on Intersection
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

    const navList = document.querySelector('.sidebar-nav ul');
    const navLinks = document.querySelectorAll('.sidebar-link');
    const indicator = document.querySelector('.nav-active-indicator');
    const sections = document.querySelectorAll('section[id]');

    const updateIndicator = (activeLink) => {
        if (!activeLink || !indicator || !navList) return;
        
        // Calculate position relative to the UL container
        const linkTop = activeLink.parentElement.offsetTop;
        const linkHeight = activeLink.parentElement.offsetHeight;
        
        // Center the indicator relative to the link
        const targetY = linkTop + (linkHeight / 2) - (indicator.offsetHeight / 2);
        indicator.style.transform = `translateY(${targetY}px)`;
    };

    const handleScrollSpy = () => {
        const scrollY = window.pageYOffset + 150; // Offset for better trigger point
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
                const isTarget = link.getAttribute('href') === `#${currentSectionId}`;
                link.classList.toggle('active', isTarget);
                if (isTarget) updateIndicator(link);
            });
        }
    };

    // Smooth scroll for sidebar links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy(); // Initial call

    // 5. Work Grid Toggle Functionality (FLIP Animation)
    const gridToggle = document.getElementById('work-grid-toggle');
    const workGrid = document.querySelector('.work-grid-brutalist');
    const workCards = document.querySelectorAll('.work-card');

    if (gridToggle && workGrid) {
        const buttons = gridToggle.querySelectorAll('.toggle-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                // 1. FIRST: Record the current positions
                const firstRects = Array.from(workCards).map(card => card.getBoundingClientRect());

                // 2. LAST: Update classes
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const gridMode = btn.getAttribute('data-grid');
                workGrid.classList.remove('grid-4', 'grid-6');
                workGrid.classList.add(gridMode);

                // 3. INVERT & PLAY
                requestAnimationFrame(() => {
                    workCards.forEach((card, i) => {
                        const lastRect = card.getBoundingClientRect();
                        const firstRect = firstRects[i];

                        const dx = firstRect.left - lastRect.left;
                        const dy = firstRect.top - lastRect.top;
                        const dw = firstRect.width / lastRect.width;
                        const dh = firstRect.height / lastRect.height;

                        // Invert
                        card.style.transition = 'none';
                        card.style.transformOrigin = 'top left';
                        card.style.transform = `translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`;

                        // Play
                        requestAnimationFrame(() => {
                            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                            card.style.transform = 'none';
                        });
                    });

                    // Recalculate line numbers after a short delay to match final height
                    setTimeout(() => {
                        if (typeof updateLineNumbers === 'function') {
                            updateLineNumbers();
                        }
                    }, 600);
                });
            });
        });
    }

    // 6. Generic Scroll Reveal Animation (Sliding Doors Component)
    const revealContainers = document.querySelectorAll('.scroll-reveal-sliding');

    if (revealContainers.length > 0) {
        const handleRevealScroll = () => {
            const viewportHeight = window.innerHeight;
            const scrollPos = window.scrollY;

            revealContainers.forEach(container => {
                const rect = container.getBoundingClientRect();
                
                if (rect.top < viewportHeight && rect.bottom > 0) {
                    const elementTop = container.offsetTop;
                    
                    // Inverted Logic: 
                    // When scrollPos is low (above element), diff is high -> Spread
                    // When scrollPos increases (scrolling down), diff decreases -> Close
                    const speed = parseFloat(container.getAttribute('data-speed')) || 1.2;
                    const offset = viewportHeight * (parseFloat(container.getAttribute('data-offset')) || 0.5);
                    
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
        handleRevealScroll(); // Initial call
    }

    // 3. Custom Cursor with Hover Effects
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverables = document.querySelectorAll('a, button, .work-card, .tech-cell, .sidebar-link, .experience-item, .feature-list-item');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }

    // 4. Update Time in Header
    const timeEl = document.querySelector('.status-bar .status-item:last-child');
    if (timeEl) {
        const updateTime = () => {
            const now = new Date();
            const options = { hour: '2-digit', minute: '2-digit', hour12: true };
            timeEl.innerText = now.toLocaleTimeString([], options);
        };
        setInterval(updateTime, 10000); // Update every 10 seconds
        updateTime();
    }

    // 5. Line Number Gutter Generation (VS Code Style)
    const gutter = document.getElementById('line-numbers');
    const mainContent = document.querySelector('.main-content');
    
    if (gutter && mainContent) {
        const updateLineNumbers = () => {
            const lineHeight = 24; // Must match CSS line-height
            
            // Calculate height from the top of the gutter to the bottom of the last content element
            // We exclude the gutter itself from the calculation
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
            
            // Ensure gutter height matches the calculated range exactly
            gutter.style.height = `${totalHeight}px`;
        };

        // Update on load and when images/content might change
        window.addEventListener('load', updateLineNumbers);
        updateLineNumbers();
        
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
                window.requestAnimationFrame(updateLineNumbers);
            });
            ro.observe(mainContent);
            // Also observe the last element specifically
            const sections = mainContent.querySelectorAll('section, footer');
            if (sections.length > 0) {
                ro.observe(sections[sections.length - 1]);
            }
        } else {
            window.addEventListener('resize', updateLineNumbers);
        }
    }
});
