// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            localStorage.setItem('theme', 'light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        
        // Update navbar styles after theme change
        setTimeout(() => {
            if (navbar) {
                updateNavbarStyles();
            }
        }, 50);
    });
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar shrink on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

function updateNavbarStyles() {
    if (!navbar) return;
    
    const isDarkMode = body.classList.contains('dark-mode');
    const currentScroll = window.pageYOffset;
    
    // Add shrink class when scrolling down
    if (currentScroll > 50) {
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

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        updateNavbarStyles();
        lastScroll = currentScroll;
    });
    
    // Initialize navbar styles on page load
    window.addEventListener('load', () => {
        updateNavbarStyles();
    });
}

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Animate skill bars on scroll
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

document.querySelectorAll('.skill-bar').forEach(bar => {
    observer.observe(bar);
});

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add animation to project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    animateOnScroll.observe(card);
});

// Add animation to timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    animateOnScroll.observe(item);
});

// Add animation to about section
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
    aboutContent.style.opacity = '0';
    aboutContent.style.transform = 'translateY(30px)';
    aboutContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    animateOnScroll.observe(aboutContent);
}

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
        const message = contactForm.querySelector('textarea').value;
        
        // Here you would typically send the data to a server
        // For now, we'll just show an alert
        alert(`Thank you for your message, ${name}! I'll get back to you soon at ${email}.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Typing animation for hero section (optional enhancement)
function typeWriter(element, text, speed = 100) {
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

// Parallax effect for hero section
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

// Add active class to nav links on page load
window.addEventListener('load', () => {
    activateNavLink();
});

// Smooth reveal animation for stats
const statsObserver = new IntersectionObserver((entries) => {
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
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

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

// Typewriter Effect for Hero Title (with loop)
let typewriterTimeout = null;

// Store original texts (only fetch once)
function getOriginalTexts() {
    const greeting = document.querySelector('.greeting');
    const name = document.querySelector('.name');
    const role = document.querySelector('.role');
    
    return {
        greeting: greeting ? greeting.textContent.trim() : '',
        name: name ? name.textContent.trim() : '',
        role: role ? role.textContent.trim() : ''
    };
}

function typeWriterEffect() {
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
    
    // Typewriter function
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

// Initialize typewriter effect when page loads
window.addEventListener('load', () => {
    // Small delay to ensure DOM is fully loaded
    setTimeout(typeWriterEffect, 500);
});

// Console message
console.log('%c👋 Hello! Welcome to my Flutter Developer Portfolio!', 'color: #13B9FD; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using Flutter colors', 'color: #02569B; font-size: 14px;');
