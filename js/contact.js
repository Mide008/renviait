/**
 * Renvia IT - Contact Form Handler (Resend via Netlify Functions)
 * Sends to info@renviait.co.uk + auto-reply to customers
 */

document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateContactForm(contactForm)) {
                return;
            }
            
            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Prepare data for API
            const contactData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email').trim(),
                phone: formData.get('phone')?.trim() || '',
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            try {
                // Call Netlify Function
                const response = await fetch('/.netlify/functions/send-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Show success message
                    showSuccessMessage();
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    throw new Error(result.error || 'Form submission failed');
                }
                
            } catch (error) {
                console.error('Contact form error:', error);
                showErrorMessage('There was an error sending your message. Please try again or email us directly at info@renviait.co.uk');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    // ===================================
    // FORM VALIDATION
    // ===================================
    function validateContactForm(form) {
        let isValid = true;
        
        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(el => {
            el.classList.remove('visible');
        });
        form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
            el.classList.remove('error');
        });
        
        // Get required fields
        const firstName = form.querySelector('[name="firstName"]');
        const lastName = form.querySelector('[name="lastName"]');
        const email = form.querySelector('[name="email"]');
        const subject = form.querySelector('[name="subject"]');
        const message = form.querySelector('[name="message"]');
        
        // Validate first name
        if (!firstName.value.trim()) {
            showFieldError(firstName, 'Please enter your first name');
            isValid = false;
        }
        
        // Validate last name
        if (!lastName.value.trim()) {
            showFieldError(lastName, 'Please enter your last name');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showFieldError(email, 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        if (!subject.value) {
            showFieldError(subject, 'Please select a subject');
            isValid = false;
        }
        
        // Validate message
        if (!message.value.trim()) {
            showFieldError(message, 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showFieldError(message, 'Please enter a message with at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = field.closest('.form-group')?.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ===================================
    // SUCCESS MESSAGE
    // ===================================
    function showSuccessMessage() {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>Message sent successfully!</strong><br>
                Thank you for contacting us. We'll get back to you within 24 hours. Please check your email for a confirmation.
            </div>
        `;
        
        const form = document.getElementById('contactForm');
        if (form) {
            form.insertBefore(alert, form.firstChild);
            alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            setTimeout(() => {
                alert.style.transition = 'opacity 0.3s ease';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, 8000);
        }
    }
    
    // ===================================
    // ERROR MESSAGE
    // ===================================
    function showErrorMessage(message) {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div>${message}</div>
        `;
        
        const form = document.getElementById('contactForm');
        if (form) {
            form.insertBefore(alert, form.firstChild);
            alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            setTimeout(() => {
                alert.style.transition = 'opacity 0.3s ease';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, 8000);
        }
    }
    
    console.log('Contact form initialized with Resend (Netlify Functions)');
});