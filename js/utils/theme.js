/**
 * Theme Management Utilities
 * Handles dark/light mode switching
 */

const THEME_KEY = 'theme';
const DARK_MODE_CLASS = 'dark-mode';

/**
 * Initialize theme from localStorage
 */
export function initTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
    
    if (currentTheme === 'dark') {
        body.classList.add(DARK_MODE_CLASS);
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    return currentTheme;
}

/**
 * Toggle theme between light and dark
 * @param {Function} callback - Optional callback after theme change
 */
export function toggleTheme(callback) {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle(DARK_MODE_CLASS);
    
    if (body.classList.contains(DARK_MODE_CLASS)) {
        localStorage.setItem(THEME_KEY, 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        localStorage.setItem(THEME_KEY, 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    if (callback) {
        setTimeout(callback, 50);
    }
}

/**
 * Check if dark mode is active
 * @returns {boolean}
 */
export function isDarkMode() {
    return document.body.classList.contains(DARK_MODE_CLASS);
}

/**
 * Setup theme toggle button
 * @param {Function} onThemeChange - Callback when theme changes
 */
export function setupThemeToggle(onThemeChange) {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            toggleTheme(onThemeChange);
        });
    }
}

