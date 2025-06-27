// VISHWAVASU TECHNOLOGIES - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
    initMobileMenu();
    initScrollToTop();
    initSmoothScrolling();
    initParallaxEffects();
    initLoadingStates();
    initAccessibility();
    initBreadcrumbs();
    initPageTransitions();
    initNavigationSearch();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background on scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Active link highlighting for single-page sections
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('text-blue-600');
                        link.classList.add('text-gray-700');
                        
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('text-blue-600');
                            link.classList.remove('text-gray-700');
                        }
                    });
                }
            });
        });
    }
    
    // Highlight current page navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if it's the current page
        if (href === currentPage || 
            (currentPage === 'index.html' && href === '#home') ||
            (currentPage === '' && href === '#home')) {
            link.classList.add('text-blue-600');
            link.classList.remove('text-gray-700');
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuIcon = mobileMenuButton.querySelector('i');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isOpen = !mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                // Close menu
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.className = 'fas fa-bars text-xl';
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            } else {
                // Open menu
                mobileMenu.classList.remove('hidden');
                mobileMenuIcon.className = 'fas fa-times text-xl';
                mobileMenuButton.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Close menu when clicking on links
        const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.className = 'fas fa-bars text-xl';
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Scroll effects
function initScrollEffects() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Validate form
            if (validateForm(formObject)) {
                submitForm(formObject);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const errors = {};
    
    // Required fields
    const requiredFields = ['first-name', 'last-name', 'email', 'message'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors[field] = 'This field is required';
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Display errors
    displayFormErrors(errors);
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let error = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        error = 'This field is required';
    }
    
    // Email validation
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        error = 'Please enter a valid email address';
    }
    
    // Display field error
    displayFieldError(field, error);
    
    return !error;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    
    // Display new errors
    Object.keys(errors).forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            displayFieldError(field, errors[fieldName]);
        }
    });
}

function displayFieldError(field, error) {
    // Remove existing error
    clearFieldError(field);
    
    if (error) {
        // Add error class
        field.classList.add('border-red-500');
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error text-red-500 text-sm mt-1';
        errorElement.textContent = error;
        
        // Insert error message
        field.parentNode.appendChild(errorElement);
    }
}

function clearFieldError(field) {
    // Remove error class
    field.classList.remove('border-red-500');
    
    // Remove error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Form submission
function submitForm(data) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contact-form').reset();
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Set type-specific styles
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            notification.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Animations
function initAnimations() {
    // Typing animation for hero text
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #667eea';
        
        let i = 0;
        const typeTimer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i > text.length) {
                clearInterval(typeTimer);
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    });
    
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const observerOptions = {
            threshold: 0.7
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        
        if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');
    
    if (scrollButton) {
        // Add progress ring
        const progressRing = document.createElement('div');
        progressRing.className = 'absolute inset-0 rounded-full';
        progressRing.innerHTML = `
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none" class="text-blue-200" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none" class="text-blue-600 transition-all duration-300" 
                        stroke-dasharray="125.6" stroke-dashoffset="125.6" id="progress-circle" />
            </svg>
        `;
        scrollButton.appendChild(progressRing);
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            const progressCircle = document.getElementById('progress-circle');
            
            if (scrollTop > 300) {
                scrollButton.classList.remove('opacity-0');
                scrollButton.classList.add('opacity-100');
            } else {
                scrollButton.classList.add('opacity-0');
                scrollButton.classList.remove('opacity-100');
            }
            
            // Update progress ring
            if (progressCircle) {
                const offset = 125.6 - (scrollPercent * 125.6);
                progressCircle.style.strokeDashoffset = offset;
            }
        });
        
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                // Smooth scroll with easing
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
                
                // Focus management for accessibility
                setTimeout(() => {
                    target.focus({ preventScroll: true });
                }, 1000);
            }
        });
    });
}

// Breadcrumb navigation
function initBreadcrumbs() {
    const breadcrumbContainer = document.getElementById('breadcrumb');
    if (!breadcrumbContainer) return;
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageNames = {
        'index.html': 'Home',
        'about.html': 'About Us',
        'services.html': 'Services',
        'contact.html': 'Contact'
    };
    
    let breadcrumbHTML = '<nav aria-label="Breadcrumb" class="text-sm text-gray-600 mb-6">';
    breadcrumbHTML += '<a href="index.html" class="hover:text-blue-600 transition-colors">Home</a>';
    
    if (currentPage !== 'index.html' && currentPage !== '') {
        breadcrumbHTML += ' <i class="fas fa-chevron-right mx-2"></i> ';
        breadcrumbHTML += `<span class="text-gray-900 font-medium">${pageNames[currentPage] || 'Page'}</span>`;
    }
    
    breadcrumbHTML += '</nav>';
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Page transition effects
function initPageTransitions() {
    // Add loading animation for page transitions
    const pageLinks = document.querySelectorAll('a[href$=".html"]');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's an external link or special link
            if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                return;
            }
            
            e.preventDefault();
            
            // Add loading overlay
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300';
            overlay.innerHTML = `
                <div class="text-center">
                    <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-600 font-medium">Loading...</p>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Navigate after a short delay for smooth transition
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
    
    // Remove loading overlay on page load
    window.addEventListener('load', function() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    });
}

// Navigation search functionality
function initNavigationSearch() {
    // Create search overlay
    const searchOverlay = document.createElement('div');
    searchOverlay.id = 'search-overlay';
    searchOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-start justify-center pt-20';
    searchOverlay.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div class="p-6">
                <div class="flex items-center mb-4">
                    <i class="fas fa-search text-gray-400 mr-3"></i>
                    <input type="text" id="search-input" placeholder="Search pages, services, or content..." 
                           class="w-full text-lg outline-none">
                    <button id="close-search" class="ml-3 text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="search-results" class="max-h-96 overflow-y-auto"></div>
            </div>
        </div>
    `;
    document.body.appendChild(searchOverlay);
    
    // Search data
    const searchData = [
        { title: 'Home', url: 'index.html', description: 'Homepage with overview of our services' },
        { title: 'About Us', url: 'about.html', description: 'Company story, mission, vision and team' },
        { title: 'Services', url: 'services.html', description: 'Software writing, modification, and testing' },
        { title: 'Contact', url: 'contact.html', description: 'Get in touch with our team' },
        { title: 'Software Writing', url: 'services.html#writing', description: 'Custom software development services' },
        { title: 'Software Modification', url: 'services.html#modification', description: 'Enhancement of existing software' },
        { title: 'Software Testing', url: 'services.html#testing', description: 'Quality assurance and testing services' },
    ];
    
    // Add keyboard shortcut (Ctrl/Cmd + K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearch();
        }
        
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
    
    function toggleSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
            input.focus();
        } else {
            closeSearch();
        }
    }
    
    function closeSearch() {
        const overlay = document.getElementById('search-overlay');
        overlay.classList.add('hidden');
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeButton = document.getElementById('close-search');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );
        
        displaySearchResults(results);
    });
    
    closeButton.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSearch();
        }
    });
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-gray-500 text-center py-4">No results found</p>';
            return;
        }
        
        const resultsHTML = results.map(item => `
            <div class="p-3 hover:bg-gray-50 rounded cursor-pointer border-b border-gray-100 last:border-b-0" 
                 onclick="window.location.href='${item.url}'">
                <h3 class="font-medium text-gray-900">${item.title}</h3>
                <p class="text-sm text-gray-600 mt-1">${item.description}</p>
            </div>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
        }
    });
    
    // Monitor scroll performance
    let scrollTicking = false;
    
    function updateScrollPosition() {
        // Your scroll-related code here
        scrollTicking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(updateScrollPosition);
            scrollTicking = true;
        }
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Export functions for global use
window.VISHWAVASU = {
    showNotification,
    validateForm,
    debounce,
    throttle,
    isMobile,
    isTablet,
    isDesktop
};
