// Form handling JavaScript for ZimBuild Construction Website - Backend Integrated

const API_BASE_URL = 'http://localhost:5000/api';

// Common headers for API requests
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Handle API errors
const handleApiError = (error, defaultMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  return defaultMessage;
};

// Contact form handler with backend integration
const handleContactForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/inquiry`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit inquiry');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError(error, 'Failed to submit inquiry')
    };
  }
};

// Career application handler with backend integration
const handleCareerApplication = async (formData) => {
  try {
    const submitData = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/contact/career`, {
      method: 'POST',
      body: submitData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit application');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError(error, 'Failed to submit application')
    };
  }
};

// Newsletter subscription handler
const handleNewsletterSubscription = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/newsletter`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to subscribe');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError(error, 'Failed to subscribe to newsletter')
    };
  }
};

// Get projects from backend
const getProjects = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/projects?${queryParams}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch projects');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError(error, 'Failed to load projects')
    };
  }
};

// Get project categories
const getProjectCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/categories`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError(error, 'Failed to load categories')
    };
  }
};

// Get featured projects
const getFeaturedProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/featured`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch featured projects');
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError(error, 'Failed to load featured projects')
    };
  }
};

// Health check
const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    return {
      success: response.ok,
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'API server is not responding'
    };
  }
};

// Initialize API health check on page load
document.addEventListener('DOMContentLoaded', async () => {
  const health = await checkApiHealth();
  
  if (!health.success) {
    console.warn('Backend API is not available:', health.message);
  } else {
    console.log('Backend API is running:', health.data);
    
    // Load projects dynamically if on projects page
    if (window.location.pathname.includes('projects.html')) {
      loadProjectsFromBackend();
    }
  }
});

// Load projects from backend for projects page
async function loadProjectsFromBackend() {
  const projectsResult = await getProjects();
  
  if (projectsResult.success) {
    console.log('Projects loaded from backend:', projectsResult.data.projects);
    // You can update the DOM here with the projects from backend
  } else {
    console.error('Failed to load projects:', projectsResult.message);
  }
}

// Update form submissions to use backend
document.addEventListener('DOMContentLoaded', function() {
  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        company: document.getElementById('company').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
      };

      const result = await handleContactForm(formData);
      
      if (result.success) {
        // Show success message
        alert('Thank you! Your message has been sent successfully.');
        contactForm.reset();
      } else {
        alert('Error: ' + result.message);
      }
    });
  }

  // Career form
  const careerForm = document.getElementById('career-application');
  if (careerForm) {
    careerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        position: document.getElementById('position').value,
        experience: document.getElementById('experience').value,
        coverLetter: document.getElementById('cover-letter').value
      };

      const result = await handleCareerApplication(formData);
      
      if (result.success) {
        alert('Thank you! Your application has been submitted successfully.');
        careerForm.reset();
      } else {
        alert('Error: ' + result.message);
      }
    });
  }
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleContactForm,
    handleCareerApplication,
    handleNewsletterSubscription,
    getProjects,
    getProjectCategories,
    getFeaturedProjects,
    checkApiHealth
  };
}