const memoryStorage = require('../utils/memoryStorage');
const { emailTemplates, sendEmail } = require('../config/email');

// Submit contact inquiry
const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Create new inquiry
    const inquiry = memoryStorage.contacts.create({
      type: 'general',
      name,
      email,
      phone,
      company,
      subject,
      message,
      status: 'new'
    });

    // Send confirmation email (mock for now)
    const userTemplate = emailTemplates.contactConfirmation(name, email, message);
    await sendEmail(email, userTemplate.subject, userTemplate.html);

    console.log('📧 Contact inquiry received:', {
      name, email, subject, inquiryId: inquiry.id
    });

    res.status(201).json({
      status: 'success',
      message: 'Thank you for your inquiry. We will contact you soon.',
      data: {
        inquiryId: inquiry.id,
        submittedAt: inquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Contact inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit inquiry. Please try again.'
    });
  }
};

// Submit career application
const submitCareerApplication = async (req, res) => {
  try {
    const { fullName, email, phone, position, experience, coverLetter } = req.body;

    // Handle file upload
    let resumeFile = null;
    if (req.file) {
      resumeFile = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      };
    }

    // Create career application
    const application = memoryStorage.contacts.create({
      type: 'career',
      name: fullName,
      email,
      phone,
      position,
      experience,
      coverLetter,
      resume: resumeFile,
      status: 'new'
    });

    // Send confirmation email (mock for now)
    const applicantTemplate = emailTemplates.careerApplication(fullName, position);
    await sendEmail(email, applicantTemplate.subject, applicantTemplate.html);

    console.log('📧 Career application received:', {
      name: fullName, email, position, applicationId: application.id
    });

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully. We will review your application.',
      data: {
        applicationId: application.id,
        position,
        submittedAt: application.createdAt
      }
    });

  } catch (error) {
    console.error('Career application error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit application. Please try again.'
    });
  }
};

// Subscribe to newsletter
const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Create new subscriber
    const subscriber = memoryStorage.subscribers.create({
      email,
      source: 'website',
      isActive: true
    });

    console.log('📧 Newsletter subscription:', { email });

    res.status(201).json({
      status: 'success',
      message: 'Successfully subscribed to our newsletter!',
      data: {
        email,
        subscribedAt: subscriber.createdAt
      }
    });

  } catch (error) {
    if (error.message === 'Email already subscribed') {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already subscribed to our newsletter.'
      });
    }
    
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to subscribe to newsletter. Please try again.'
    });
  }
};

// Get all inquiries (admin)
const getAllInquiries = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;

    let inquiries = memoryStorage.contacts.findAll();
    
    // Apply filters
    if (type) {
      inquiries = inquiries.filter(inquiry => inquiry.type === type);
    }
    if (status) {
      inquiries = inquiries.filter(inquiry => inquiry.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedInquiries = inquiries.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: {
        inquiries: paginatedInquiries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: inquiries.length,
          totalPages: Math.ceil(inquiries.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch inquiries.'
    });
  }
};

// Get single inquiry
const getInquiry = async (req, res) => {
  try {
    const inquiry = memoryStorage.contacts.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found.'
      });
    }

    res.json({
      status: 'success',
      data: { inquiry }
    });

  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch inquiry.'
    });
  }
};

// Update inquiry status
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = memoryStorage.contacts.updateStatus(req.params.id, status);

    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found.'
      });
    }

    res.json({
      status: 'success',
      message: 'Inquiry status updated successfully.',
      data: { inquiry }
    });

  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update inquiry status.'
    });
  }
};

module.exports = {
  submitInquiry,
  submitCareerApplication,
  subscribeToNewsletter,
  getAllInquiries,
  getInquiry,
  updateInquiryStatus
};