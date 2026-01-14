/**
 * Form Utilities
 * Handles form submissions and validations
 */

/**
 * Handle contact form submission
 * @param {HTMLElement} form - The form element
 * @param {Function} onSubmit - Callback function for form submission
 */
export function handleContactForm(form, onSubmit) {
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const subject = form.querySelectorAll('input[type="text"]')[1].value;
        const message = form.querySelector('textarea').value;
        
        if (onSubmit) {
            onSubmit({ name, email, subject, message });
        } else {
            // Default behavior - show alert
            alert(`Thank you for your message, ${name}! I'll get back to you soon at ${email}.`);
        }
        
        // Reset form
        form.reset();
    });
}

/**
 * Initialize contact form
 */
export function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    handleContactForm(contactForm);
}

