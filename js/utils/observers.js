/**
 * IntersectionObserver Utilities
 * Common observer patterns for scroll animations
 */

/**
 * Create a skill bar observer
 */
export function createSkillBarObserver() {
    const observerOptions = {
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
                const targetValue = parseInt(statNumber.textContent);
                let currentValue = 0;
                const increment = targetValue / 50;
                const duration = 2000;
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        statNumber.textContent = statNumber.textContent; // Keep original format
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = Math.floor(currentValue) + statNumber.textContent.replace(/[0-9]/g, '');
                    }
                }, stepTime);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    return observer;
}

