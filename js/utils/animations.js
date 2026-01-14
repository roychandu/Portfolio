/**
 * Animation Utilities
 * Common animation functions
 */

/**
 * Typewriter effect for a single element
 * @param {HTMLElement} element - The element to animate
 * @param {string} text - The text to type
 * @param {number} speed - Typing speed in milliseconds
 */
export function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Typewriter effect with callback
 * @param {HTMLElement} element - The element to animate
 * @param {string} text - The text to type
 * @param {number} speed - Typing speed in milliseconds
 * @param {Function} callback - Callback function after typing completes
 */
export function typeText(element, text, speed, callback) {
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
 * Animate element with fade and slide
 * @param {HTMLElement} element - Element to animate
 * @param {string} direction - Animation direction ('up', 'down', 'left', 'right')
 * @param {number} distance - Distance to move in pixels
 * @param {number} duration - Animation duration in seconds
 */
export function animateElement(element, direction = 'up', distance = 30, duration = 0.6) {
    const directions = {
        up: `translateY(${distance}px)`,
        down: `translateY(-${distance}px)`,
        left: `translateX(${distance}px)`,
        right: `translateX(-${distance}px)`
    };

    element.style.opacity = '0';
    element.style.transform = directions[direction] || directions.up;
    element.style.transition = `opacity ${duration}s ease, transform ${duration}s ease`;
}

/**
 * Apply staggered animation to multiple elements
 * @param {NodeList|Array} elements - Elements to animate
 * @param {string} direction - Animation direction
 * @param {number} distance - Distance to move
 * @param {number} duration - Animation duration
 * @param {number} staggerDelay - Delay between each element
 */
export function animateStaggered(elements, direction = 'up', distance = 30, duration = 0.6, staggerDelay = 0.1) {
    elements.forEach((element, index) => {
        animateElement(element, direction, distance, duration);
        element.style.transition = `opacity ${duration}s ease ${index * staggerDelay}s, transform ${duration}s ease ${index * staggerDelay}s`;
    });
}

