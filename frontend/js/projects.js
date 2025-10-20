// Projects page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initProjectsFilter();
    initProjectModals();
    initProjectGallery();
});

// Projects filtering functionality
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const projectsContainer = document.getElementById('projects-container');
    
    if (!filterButtons.length || !projectItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Animate filtering
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    // Show matching items
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Hide non-matching items
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update project count
            updateProjectCount(filterValue);
        });
    });
}

// Update project count display
function updateProjectCount(filter) {
    const projectItems = document.querySelectorAll('.project-item');
    const visibleCount = filter === 'all' 
        ? projectItems.length 
        : document.querySelectorAll(`.project-item[data-category="${filter}"]`).length;
    
    // You could update a counter element here if needed
    console.log(`Showing ${visibleCount} projects for filter: ${filter}`);
}

// Project modal functionality
function initProjectModals() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const projectItem = this.closest('.project-item');
            showProjectModal(projectItem);
        });
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.querySelector('.project-modal');
        if (modal && e.target === modal) {
            closeProjectModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
}

function showProjectModal(projectItem) {
    // Get project data
    const title = projectItem.querySelector('h3').textContent;
    const category = projectItem.querySelector('.project-category').textContent;
    const location = projectItem.querySelector('.project-location').textContent;
    const description = projectItem.querySelector('.project-description').textContent;
    const imageSrc = projectItem.querySelector('img').src;
    const specs = projectItem.querySelector('.project-specs').innerHTML;
    
    // Create modal HTML
    const modalHTML = `
        <div class="project-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
        ">
            <div class="modal-content" style="
                background: white;
                border-radius: 12px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: var(--secondary);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    font-size: 1.2rem;
                ">×</button>
                
                <div class="modal-body" style="padding: 0;">
                    <div class="modal-image" style="
                        height: 300px;
                        overflow: hidden;
                        border-radius: 12px 12px 0 0;
                    ">
                        <img src="${imageSrc}" alt="${title}" style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        ">
                    </div>
                    
                    <div style="padding: 30px;">
                        <div style="margin-bottom: 20px;">
                            <span style="
                                background: var(--secondary);
                                color: white;
                                padding: 5px 15px;
                                border-radius: 20px;
                                font-size: 0.8rem;
                                font-weight: 600;
                                text-transform: uppercase;
                            ">${category}</span>
                        </div>
                        
                        <h2 style="color: var(--primary); margin-bottom: 15px;">${title}</h2>
                        
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: var(--gray);">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location}</span>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            ${specs}
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <h3 style="color: var(--primary); margin-bottom: 10px;">Project Description</h3>
                            <p style="line-height: 1.6;">${description}</p>
                        </div>
                        
                        <div style="display: flex; gap: 15px;">
                            <button class="btn">View Full Case Study</button>
                            <button class="btn btn-outline">Similar Projects</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add close functionality
    const closeBtn = document.querySelector('.modal-close');
    const modal = document.querySelector('.project-modal');
    
    closeBtn.addEventListener('click', closeProjectModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.querySelector('.project-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Project gallery functionality
function initProjectGallery() {
    // This would be enhanced with a proper gallery library in a real implementation
    console.log('Project gallery initialized');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initProjectsFilter, 
        initProjectModals, 
        initProjectGallery 
    };
}