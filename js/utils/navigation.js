/**
 * Navigation Utilities v2.1
 * Handles window scrolling, header navigation, and active link highlighting
 */

/**
 * Setup smooth scrolling for anchor links
 */
export function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Update active navigation link based on scroll position
 */
export function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    
    const options = {
        root: null,
        rootMargin: "-20% 0px -70% 0px", // Trigger when section is in the top portion of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Toggle the mobile navigation menu
 */
export function toggleMobileNav() {
    const hamburger = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.main-header .container'); // Or your mobile nav selector
    
    // Note: The index.html has .mobile-nav-toggle but might need a dedicated mobile-nav menu
    // For now, let's just allow it to toggle a class on the header or body
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }
}

/**
 * Initialize navigation functionality
 */
export function initNavigation() {
    setupSmoothScrolling();
    toggleMobileNav();
    
    // Set up the IntersectionObserver for scroll-based highlighting
    updateActiveNavLink();
}


