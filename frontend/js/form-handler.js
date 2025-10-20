// Form handling JavaScript for ZimBuild Construction Website

document.addEventListener('DOMContentLoaded', function() {
    initFormHandlers();
    initFormValidation();
});

// Initialize form handlers
function initFormHandlers() {
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Career application form handling
    const careerForm = document.getElementById('career-application');
    if (careerForm) {
        careerForm.addEventListener('submit', handleCareerForm);
    }
    
    // Newsletter form handling (if exists)
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s+\-()]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // File validation
    if (field.type === 'file' && field.hasAttribute('required')) {
        if (!field.files || field.files.length === 0) {
            showFieldError(field, 'Please select a file');
            return false;
        }
        
        // File size validation (5MB limit)
        const file = field.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showFieldError(field, 'File size must be less than 5MB');
            return false;
        }
        
        // File type validation
        const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            showFieldError(field, 'Please select a valid file type (PDF, DOC, JPG, PNG)');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = 'var(--secondary)';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: var(--secondary);
        font-size: 0.8rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Contact form handler
async function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await simulateAPICall();
        
        // Show success message
        showFormSuccess(form, `
            <h3>Thank You for Your Message!</h3>
            <p>We've received your inquiry and will get back to you within 24 hours.</p>
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>Our team will review your message</li>
                <li>We'll contact you to discuss your project</li>
                <li>We'll provide a preliminary assessment</li>
            </ul>
        `);
        
        // You would typically send the form data to your server here
        // await sendFormData(formData);
        
    } catch (error) {
        showFormError(form, 'Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Career form handler
async function handleCareerForm(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await simulateAPICall();
        
        // Show success message
        showFormSuccess(form, `
            <h3>Application Submitted Successfully!</h3>
            <p>Thank you for your interest in joining the ZimBuild team.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>We'll review your application</li>
                <li>If there's a match, we'll contact you for an interview</li>
                <li>We keep applications on file for 6 months</li>
            </ul>
            <p>We wish you the best in your job search!</p>
        `);
        
    } catch (error) {
        showFormError(form, 'Sorry, there was an error submitting your application. Please try again or email your resume directly to careers@zimbuild.co.za');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Newsletter form handler
async function handleNewsletterForm(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!validateForm(form)) {
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    try {
        await simulateAPICall();
        showFormSuccess(form, `
            <h3>Welcome to Our Newsletter!</h3>
            <p>Thank you for subscribing. You'll receive our latest updates and construction insights directly in your inbox.</p>
        `);
        
    } catch (error) {
        showFormError(form, 'Sorry, there was an error with your subscription. Please try again.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Validate entire form
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show form success message
function showFormSuccess(form, message) {
    form.style.display = 'none';
    
    const successHTML = `
        <div class="form-success" style="
            text-align: center;
            padding: 40px 20px;
            background: var(--light);
            border-radius: var(--border-radius);
            border: 2px solid var(--accent);
        ">
            <i class="fas fa-check-circle" style="
                font-size: 3rem;
                color: var(--accent);
                margin-bottom: 20px;
            "></i>
            <div style="color: var(--dark);">
                ${message}
            </div>
            <button class="btn" onclick="location.reload()" style="margin-top: 20px;">
                Submit Another
            </button>
        </div>
    `;
    
    form.insertAdjacentHTML('afterend', successHTML);
}

// Show form error message
function showFormError(form, message) {
    const errorHTML = `
        <div class="form-error" style="
            background: #fed7d7;
            color: #c53030;
            padding: 15px;
            border-radius: var(--border-radius);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        ">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    form.insertAdjacentHTML('afterbegin', errorHTML);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        const errorElement = form.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }, 5000);
}

// Simulate API call (replace with actual API call)
function simulateAPICall() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            Math.random() > 0.1 ? resolve() : reject(new Error('API Error'));
        }, 2000);
    });
}

// Utility function to get form data as object
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFormHandlers,
        validateForm,
        handleContactForm,
        handleCareerForm,
        handleNewsletterForm
    };
}