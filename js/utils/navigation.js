/**
 * Navigation Utilities v2.0
 * Handles app-frame scrolling, tab-bar navigation, and active tab indicator
 */

/**
 * Setup smooth scrolling for anchor links within the app container
 */
export function setupSmoothScrolling() {
    const appContent = document.getElementById('appContent');
    if (!appContent) return;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Scroll the container, not the window
                appContent.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Activate tab item based on scroll position in the app container
 */
export function activateTab() {
    const appContent = document.getElementById('appContent');
    if (!appContent) return;

    const scrollY = appContent.scrollTop;
    const sections = document.querySelectorAll('section[id]');
    const tabItems = document.querySelectorAll('.tab-item');
    const indicator = document.querySelector('.tab-indicator');

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150; // Offset for header
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            tabItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                    updateTabIndicator(item, indicator);
                }
            });
        }
    });
}

/**
 * Update the sliding indicator position
 */
function updateTabIndicator(activeItem, indicator) {
    if (!indicator) return;
    
    const rect = activeItem.getBoundingClientRect();
    const parentRect = activeItem.parentElement.getBoundingClientRect();
    
    // Position indicator at the bottom of the active tab
    indicator.style.width = `20px`;
    indicator.style.left = `${rect.left - parentRect.left + (rect.width / 2) - 10}px`;
    indicator.style.opacity = '1';
}

/**
 * Toggle the mobile navigation menu
 */
export function toggleMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Disable scrolling when menu is open
            const appContent = document.getElementById('appContent');
            if (appContent) {
                if (mobileNav.classList.contains('active')) {
                    appContent.style.overflow = 'hidden';
                } else {
                    appContent.style.overflow = 'auto';
                }
            }
        });
        
        // Close menu when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                
                const appContent = document.getElementById('appContent');
                if (appContent) {
                    appContent.style.overflow = 'auto';
                }
            });
        });
    }
}

/**
 * Initialize navigation functionality
 */
export function initNavigation() {
    const appContent = document.getElementById('appContent');
    
    setupSmoothScrolling();
    toggleMobileNav();
    
    if (appContent) {
        appContent.addEventListener('scroll', activateTab);
        // Initial call to set active state
        window.addEventListener('load', () => {
            activateTab();
        });
    }
}

