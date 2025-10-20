const Project = require('../models/Project');
const { sendEmail } = require('../config/email');

// Get all projects with filtering and pagination
const getAllProjects = async (req, res) => {
  try {
    const { 
      category, 
      status, 
      featured, 
      page = 1, 
      limit = 9,
      sort = '-createdAt'
    } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';

    // Pagination
    const skip = (page - 1) * limit;

    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Project.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: 'success',
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch projects.'
    });
  }
};

// Get project categories
const getProjectCategories = async (req, res) => {
  try {
    const categories = await Project.distinct('category');
    
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Project.countDocuments({ category, status: 'completed' });
        return { category, count };
      })
    );

    res.json({
      status: 'success',
      data: { categories: categoryCounts }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch project categories.'
    });
  }
};

// Get featured projects
const getFeaturedProjects = async (req, res) => {
  try {
    const featuredProjects = await Project.find({ 
      featured: true, 
      status: 'completed' 
    })
    .sort('-completionDate')
    .limit(6)
    .select('title category location images featured description');

    res.json({
      status: 'success',
      data: { projects: featuredProjects }
    });

  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured projects.'
    });
  }
};

// Get single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found.'
      });
    }

    // Increment views
    project.views += 1;
    await project.save();

    res.json({
      status: 'success',
      data: { project }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch project.'
    });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      status,
      featured,
      startDate,
      completionDate,
      budget,
      size,
      client,
      tags
    } = req.body;

    // Handle image uploads
    const images = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    })) : [];

    const project = new Project({
      title,
      description,
      category,
      location,
      status: status || 'planning',
      featured: featured || false,
      startDate,
      completionDate,
      budget,
      size,
      client,
      tags: tags ? tags.split(',') : [],
      images,
      createdBy: req.user?.id || 'system'
    });

    await project.save();

    res.status(201).json({
      status: 'success',
      message: 'Project created successfully.',
      data: { project }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create project.'
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      status,
      featured,
      startDate,
      completionDate,
      budget,
      size,
      client,
      tags
    } = req.body;

    // Handle new image uploads
    const newImages = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    })) : [];

    const updateData = {
      title,
      description,
      category,
      location,
      status,
      featured,
      startDate,
      completionDate,
      budget,
      size,
      client,
      tags: tags ? tags.split(',') : [],
      updatedBy: req.user?.id || 'system',
      updatedAt: new Date()
    };

    // Add new images to existing ones
    if (newImages.length > 0) {
      const existingProject = await Project.findById(req.params.id);
      updateData.images = [...existingProject.images, ...newImages];
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found.'
      });
    }

    res.json({
      status: 'success',
      message: 'Project updated successfully.',
      data: { project }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update project.'
    });
  }
};

// Update project status
const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedBy: req.user?.id || 'system',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found.'
      });
    }

    res.json({
      status: 'success',
      message: 'Project status updated successfully.',
      data: { project }
    });

  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update project status.'
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found.'
      });
    }

    // TODO: Delete associated images from storage

    res.json({
      status: 'success',
      message: 'Project deleted successfully.'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete project.'
    });
  }
};

// Add project images
const addProjectImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No images uploaded.'
      });
    }

    const newImages = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { images: { $each: newImages } },
        updatedBy: req.user?.id || 'system',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found.'
      });
    }

    res.json({
      status: 'success',
      message: 'Images added successfully.',
      data: { 
        images: newImages,
        totalImages: project.images.length
      }
    });

  } catch (error) {
    console.error('Add project images error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add project images.'
    });
  }
};

// Delete project image
const deleteProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found.'
      });
    }

    // Find and remove the image
    const imageIndex = project.images.findIndex(
      img => img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found.'
      });
    }

    // Remove image from array
    project.images.splice(imageIndex, 1);
    project.updatedBy = req.user?.id || 'system';
    project.updatedAt = new Date();

    await project.save();

    // TODO: Delete image file from storage

    res.json({
      status: 'success',
      message: 'Image deleted successfully.',
      data: { 
        totalImages: project.images.length
      }
    });

  } catch (error) {
    console.error('Delete project image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete project image.'
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectCategories,
  getFeaturedProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
  addProjectImages,
  deleteProjectImage
};