// Main JavaScript for ZimBuild Construction Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if(window.scrollY > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                header.style.background = 'white';
                header.style.backdropFilter = 'none';
            }
        }
    });

    // Active navigation highlighting
    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if(window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${currentSection}` || 
               link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav);

    // Counter Animation for Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target') || +counter.innerText.replace('+', '');
            const count = +counter.innerText.replace('+', '');
            const increment = target / speed;
            
            if(count < target) {
                counter.innerText = Math.ceil(count + increment) + (counter.innerText.includes('+') ? '+' : '');
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target + (counter.innerText.includes('+') ? '+' : '');
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Start counter animation for stats sections
                if (entry.target.classList.contains('stats') || 
                    entry.target.classList.contains('safety-stats') ||
                    entry.target.classList.contains('projects-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .project-item, .value-card, .stat, .benefit-card').forEach(el => {
        observer.observe(el);
    });

    // Form handling for all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--secondary)';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Show success message
                this.innerHTML = `
                    <div class="form-success" style="text-align: center; padding: 40px;">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--accent); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--primary); margin-bottom: 15px;">Thank You!</h3>
                        <p style="color: var(--gray);">Your message has been sent successfully. We'll get back to you soon.</p>
                    </div>
                `;
            }
        });
    });

    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit' || this.getAttribute('href') === '#') {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });

    // Image lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Initialize any page-specific functionality
    initPageSpecificFunctions();
});

// Page-specific functionality
function initPageSpecificFunctions() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'projects.html':
            initProjectsPage();
            break;
        case 'careers.html':
            initCareersPage();
            break;
        case 'contact.html':
            initContactPage();
            break;
        default:
            // Home page or other pages
            break;
    }
}

// Projects page functionality
function initProjectsPage() {
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Load more projects functionality
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more projects
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = 'No More Projects';
                this.style.opacity = '0.5';
                this.style.cursor = 'not-allowed';
            }, 1500);
        });
    }
}

// Careers page functionality
function initCareersPage() {
    // Job application form enhancement
    const applicationForm = document.getElementById('career-application');
    if (applicationForm) {
        const fileInput = applicationForm.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const fileName = this.files[0]?.name || 'No file chosen';
                const fileLabel = this.nextElementSibling;
                if (fileLabel && fileLabel.tagName === 'SMALL') {
                    fileLabel.textContent = `Selected: ${fileName}`;
                }
            });
        }
    }
    
    // Smooth scroll to application form
    const applyButtons = document.querySelectorAll('.job-actions .btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('Apply')) {
                e.preventDefault();
                const applicationForm = document.querySelector('.application-form');
                if (applicationForm) {
                    applicationForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Contact page functionality
function initContactPage() {
    // Enhanced form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const emailInput = contactForm.querySelector('#email');
        const phoneInput = contactForm.querySelector('#phone');
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value) && this.value) {
                    this.style.borderColor = 'var(--secondary)';
                } else {
                    this.style.borderColor = '';
                }
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d+-\s]/g, '');
            });
        }
        
        // File upload handling
        const fileInput = contactForm.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const files = this.files;
                if (files.length > 0) {
                    const fileList = Array.from(files).map(file => file.name).join(', ');
                    const fileLabel = this.nextElementSibling;
                    if (fileLabel && fileLabel.tagName === 'SMALL') {
                        fileLabel.textContent = `Selected files: ${fileList}`;
                    }
                }
            });
        }
    }
    
    // Map interaction
    const getDirectionsBtn = document.querySelector('.map-actions .btn');
    if (getDirectionsBtn) {
        getDirectionsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const address = encodeURIComponent('123 Construction Avenue, Sandton, Johannesburg, South Africa');
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
        });
    }
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initPageSpecificFunctions, debounce };
}