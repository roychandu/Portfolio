/**
 * IntersectionObserver Utilities v2.0
 * Common observer patterns for scroll animations within the app frame
 */

/**
 * Get the app content container as the default root
 */
function getRoot() {
    return null; // Search the whole viewport
}


/**
 * Create a skill bar observer
 */
export function createSkillBarObserver() {
    const observerOptions = {
        root: getRoot(),
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const level = skillBar.getAttribute('data-level');
                skillBar.style.width = `${level}%`;
                observer.unobserve(skillBar);
            }
        });
    }, observerOptions);

    return observer;
}

/**
 * Create a scroll animation observer
 */
export function createScrollAnimationObserver(options = {}) {
    const defaultOptions = {
        root: getRoot(),
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observerOptions = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    return observer;
}

/**
 * Create a stats counter observer
 */
export function createStatsObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const originalText = statNumber.textContent;
                const targetValue = parseInt(originalText.replace(/[^0-9]/g, ''));
                const suffix = originalText.replace(/[0-9]/g, '');
                
                let currentValue = 0;
                const duration = 2000;
                const frames = 60;
                const increment = targetValue / frames;
                const stepTime = duration / frames;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        statNumber.textContent = targetValue + suffix;
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = Math.floor(currentValue) + suffix;
                    }
                }, stepTime);
                
                observer.unobserve(entry.target);
            }
        });
    }, { 
        root: getRoot(),
        threshold: 0.5 
    });

    return observer;
}

/**
 * Create a reveal animation observer
 * For premium scroll-triggered entrance animations
 */
export function createRevealObserver() {
    const options = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    return observer;
}
