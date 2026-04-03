/**
 * Custom Cursor v2.0
 * Provides a modern, trailing cursor interaction for the portfolio.
 */

export function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;

    // Movement tracking
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Follower smooth tracking
    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function() {
            posX += (mouseX - posX) / 9;
            posY += (mouseY - posY) / 9;

            gsap.set(follower, {
                css: {
                    left: posX - 20,
                    top: posY - 20
                }
            });

            gsap.set(cursor, {
                css: {
                    left: mouseX,
                    top: mouseY
                }
            });
        }
    });

    // Handle mouse move
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Interactive elements interaction
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .social-link');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-active');
            follower.classList.add('follower-active');
            
            // Magnetic effect if it's a button
            if (el.classList.contains('btn') || el.classList.contains('social-link')) {
                gsap.to(follower, {
                    scale: 3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-active');
            follower.classList.remove('follower-active');
            
            gsap.to(follower, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Hide/Show cursor on window focus
    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
    
    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
}

/**
 * Magnetic Button Utility
 * Makes elements "pull" toward the cursor
 */
export function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .social-link, .theme-toggle');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', function() {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}
