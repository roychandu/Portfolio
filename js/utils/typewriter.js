/**
 * Typewriter Effect Utilities
 * Handles typewriter animations for hero section
 */

let typewriterTimeout = null;

/**
 * Get original texts from hero elements
 * @returns {Object} Object containing greeting, name, and role texts
 */
export function getOriginalTexts() {
    const greeting = document.querySelector('.greeting');
    const name = document.querySelector('.name');
    const role = document.querySelector('.role');
    
    return {
        greeting: greeting ? greeting.textContent.trim() : '',
        name: name ? name.textContent.trim() : '',
        role: role ? role.textContent.trim() : ''
    };
}

/**
 * Typewriter effect function
 * @param {HTMLElement} element - Element to type in
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in milliseconds
 * @param {Function} callback - Callback after typing completes
 */
function typeText(element, text, speed, callback) {
    // Add typing class to show cursor
    element.classList.add('typing');
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            // Remove typing class to hide cursor
            element.classList.remove('typing');
            if (callback) {
                setTimeout(callback, 400); // Delay before next line
            }
        }
    }, speed);
}

/**
 * Main typewriter effect for hero section
 */
export function typeWriterEffect() {
    const greeting = document.querySelector('.greeting');
    const name = document.querySelector('.name');
    const role = document.querySelector('.role');
    
    // Get original texts
    const texts = getOriginalTexts();
    const greetingText = texts.greeting;
    const nameText = texts.name;
    const roleText = texts.role;
    
    // Clear all texts initially
    if (greeting) greeting.textContent = '';
    if (name) name.textContent = '';
    if (role) role.textContent = '';
    
    // Remove typing class if exists
    if (greeting) greeting.classList.remove('typing');
    if (name) name.classList.remove('typing');
    if (role) role.classList.remove('typing');
    
    // Type each line sequentially
    if (greeting && greetingText) {
        typeText(greeting, greetingText, 100, () => {
            if (name && nameText) {
                typeText(name, nameText, 80, () => {
                    if (role && roleText) {
                        typeText(role, roleText, 100, () => {
                            // All typing complete - wait 3 seconds then restart
                            clearTimeout(typewriterTimeout);
                            typewriterTimeout = setTimeout(() => {
                                typeWriterEffect(); // Restart the effect
                            }, 3000); // 3 seconds delay before restart
                        });
                    }
                });
            }
        });
    }
}

/**
 * Initialize typewriter effect
 */
export function initTypewriter() {
    window.addEventListener('load', () => {
        // Small delay to ensure DOM is fully loaded
        setTimeout(typeWriterEffect, 500);
    });
}

