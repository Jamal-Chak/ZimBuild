// Additional animations and effects
class ConstructionAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.animateNumbers();
        this.setupParallax();
        this.setupSmoothScrolling();
        this.setupImageHoverEffects();
        this.setupLoadingAnimations();
    }

    // Animate numbers throughout the site
    animateNumbers() {
        const animateValue = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = value.toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const numberElements = document.querySelectorAll('[data-animate-number]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const finalValue = parseInt(element.getAttribute('data-animate-number'));
                    animateValue(element, 0, finalValue, 2000);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        numberElements.forEach(element => observer.observe(element));
    }

    // Setup parallax effects
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(element => {
                const rate = element.getAttribute('data-parallax-rate') || 0.5;
                const movement = -(scrolled * rate);
                element.style.transform = `translateY(${movement}px)`;
            });
        };

        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', handleParallax);
        }
    }

    // Enhanced smooth scrolling
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Image hover effects
    setupImageHoverEffects() {
        const images = document.querySelectorAll('.project-image img, .safety-image img');
        
        images.forEach(img => {
            const parent = img.parentElement;
            
            parent.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
            });
            
            parent.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });
    }

    // Loading animations
    setupLoadingAnimations() {
        // Add loading animation to elements with data-delay
        const delayedElements = document.querySelectorAll('[data-delay]');
        
        delayedElements.forEach(element => {
            const delay = parseInt(element.getAttribute('data-delay')) || 0;
            setTimeout(() => {
                element.classList.add('animate-in');
            }, delay);
        });

        // Stagger animation for grid items
        const staggerElements = document.querySelectorAll('.services-grid > *, .projects-grid > *');
        staggerElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Typing effect for hero text
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    window.constructionAnimations = new ConstructionAnimations();
});

// Utility function for CSS transitions
const css = (element, style) => {
    for (const property in style) {
        element.style[property] = style[property];
    }
};

// Intersection Observer utility
const createObserver = (callback, options = {}) => {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            callback(entry);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
    });
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConstructionAnimations };
}