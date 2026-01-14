/**
 * Main Application Script
 * Imports and initializes all utility modules
 */

// Import utilities
import { initTheme, setupThemeToggle, isDarkMode } from './utils/theme.js';
import { initNavigation } from './utils/navigation.js';
import { initNavbarScroll, initParallaxEffect } from './utils/scroll.js';
import { createSkillBarObserver, createScrollAnimationObserver, createStatsObserver } from './utils/observers.js';
import { animateStaggered } from './utils/animations.js';
import { initTypewriter } from './utils/typewriter.js';
import { initContactForm } from './utils/form.js';
import { initHero3DScene } from './utils/threejs.js';

// Initialize theme
initTheme();

// Initialize navigation
initNavigation();

// Initialize navbar scroll
const updateNavbarOnThemeChange = initNavbarScroll();

// Initialize 3D scene in hero section
let hero3DScene = null;

// Setup theme toggle with navbar update callback
setupThemeToggle(() => {
    if (updateNavbarOnThemeChange) {
        updateNavbarOnThemeChange();
    }
    // Update 3D scene colors on theme change
    if (hero3DScene && hero3DScene.updateColors) {
        hero3DScene.updateColors(isDarkMode());
    }
});

// Initialize parallax effect
initParallaxEffect();

// Initialize typewriter effect
initTypewriter();

// Initialize 3D scene when page loads
window.addEventListener('load', () => {
    // Initialize 3D particle scene (change 'particles' to 'geometric' for geometric shapes)
    hero3DScene = initHero3DScene('particles', {
        particleCount: 1500,
        speed: 0.3,
        colors: {
            light: [0x02569B, 0x0175C2, 0x13B9FD],
            dark: [0x13B9FD, 0x0175C2, 0x02569B]
        }
    });
});

// Initialize skill bar animations
const skillBarObserver = createSkillBarObserver();
document.querySelectorAll('.skill-bar').forEach(bar => {
    skillBarObserver.observe(bar);
});

// Initialize scroll animations
const animateOnScroll = createScrollAnimationObserver();

// Animate project cards
const projectCards = document.querySelectorAll('.project-card');
if (projectCards.length > 0) {
    animateStaggered(projectCards, 'up', 30, 0.6, 0.1);
    projectCards.forEach(card => {
        animateOnScroll.observe(card);
    });
}

// Animate timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length > 0) {
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        animateOnScroll.observe(item);
    });
}

// Animate about section
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
    aboutContent.style.opacity = '0';
    aboutContent.style.transform = 'translateY(30px)';
    aboutContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    animateOnScroll.observe(aboutContent);
}

// Initialize stats counter
const statsObserver = createStatsObserver();
document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize contact form
initContactForm();

// Console message
console.log('%c👋 Hello! Welcome to my Flutter Developer Portfolio!', 'color: #13B9FD; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using Flutter colors', 'color: #02569B; font-size: 14px;');
