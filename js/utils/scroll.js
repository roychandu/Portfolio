/**
 * Scroll Utilities
 * Handles scroll-based effects like navbar shrinking and parallax
 */

/**
 * Update navbar styles based on scroll position
 * @param {HTMLElement} navbar - The navbar element
 * @param {HTMLElement} body - The body element
 * @param {number} threshold - Scroll threshold in pixels
 */
export function updateNavbarStyles(navbar, body, threshold = 50) {
    if (!navbar) return;
    
    const isDarkMode = body.classList.contains('dark-mode');
    const currentScroll = window.pageYOffset;
    
    // Add shrink class when scrolling down
    if (currentScroll > threshold) {
        navbar.classList.add('shrink');
        
        // Update background and shadow
        if (isDarkMode) {
            navbar.style.background = 'rgba(10, 25, 41, 0.98)';
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        }
    } else {
        navbar.classList.remove('shrink');
        
        // Reset background and shadow
        if (isDarkMode) {
            navbar.style.background = 'rgba(10, 25, 41, 0.95)';
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    }
}

/**
 * Initialize navbar scroll behavior
 * @param {Function} onThemeChange - Callback when theme changes
 */
export function initNavbarScroll(onThemeChange) {
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    if (!navbar) return;
    
    const handleScroll = () => {
        updateNavbarStyles(navbar, body);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
    
    // Return update function for theme changes
    return () => updateNavbarStyles(navbar, body);
}

/**
 * Parallax effect for hero section
 */
export function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight);
            }
        }
    });
}

