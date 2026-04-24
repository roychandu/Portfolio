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
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
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
                output += from;
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

    // 2. Scroll Spy for Sidebar Links & Sliding Indicator
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-link');
    const indicator = document.querySelector('.nav-active-indicator');

    const updateIndicator = (activeLink) => {
        if (!activeLink || !indicator) return;
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('.sidebar-nav').getBoundingClientRect();
        const topOffset = linkRect.top - navRect.top + (linkRect.height / 2) - 12; // 12 is half of indicator height (24)
        indicator.style.transform = `translateY(${topOffset}px)`;
    };

    const handleScrollSpy = () => {
        const scrollY = window.pageYOffset;
        let currentSectionId = '';

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset for sticky header
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                    updateIndicator(link);
                }
            });
        }
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy(); // Initial call

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
