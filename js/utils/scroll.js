/**
 * Scroll Utilities v2.0
 * Handles app-frame container scrolling and parallax effects
 */

/**
 * Initialize navbar scroll behavior (Legacy compatibility)
 */
export function initNavbarScroll() {
    // Legacy navbar removed, we use app-header now.
    // Returning a no-op update function to prevent errors in script.js
    return () => {};
}

/**
 * Parallax effect for hero section within the app frame
 */
export function initParallaxEffect() {
    const appContent = document.getElementById('appContent');
    if (!appContent) return;

    appContent.addEventListener('scroll', () => {
        const scrolled = appContent.scrollTop;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < hero.offsetHeight) {
                // Adjust parallax factor for the smaller frame
                heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroContent.style.opacity = 1 - (scrolled / (hero.offsetHeight * 0.8));
            }
        }
    });
}

