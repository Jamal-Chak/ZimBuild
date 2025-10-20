// Simple in-memory storage for development/testing
const contacts = [];
const projects = [];
const subscribers = [];

let contactId = 1;
let projectId = 1;
let subscriberId = 1;

const memoryStorage = {
  // Contact operations
  contacts: {
    create: (data) => {
      const contact = { id: contactId++, ...data, createdAt: new Date(), updatedAt: new Date() };
      contacts.push(contact);
      return contact;
    },
    findAll: () => [...contacts],
    findById: (id) => contacts.find(c => c.id === parseInt(id)),
    updateStatus: (id, status) => {
      const contact = contacts.find(c => c.id === parseInt(id));
      if (contact) {
        contact.status = status;
        contact.updatedAt = new Date();
      }
      return contact;
    }
  },

  // Project operations
  projects: {
    create: (data) => {
      const project = { id: projectId++, ...data, createdAt: new Date(), updatedAt: new Date(), views: 0 };
      projects.push(project);
      return project;
    },
    findAll: (filters = {}) => {
      let filtered = [...projects];
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.status) {
        filtered = filtered.filter(p => p.status === filters.status);
      }
      if (filters.featured !== undefined) {
        filtered = filtered.filter(p => p.featured === (filters.featured === 'true'));
      }
      return filtered;
    },
    findById: (id) => {
      const project = projects.find(p => p.id === parseInt(id));
      if (project) {
        project.views += 1;
      }
      return project;
    },
    getCategories: () => {
      const categories = [...new Set(projects.map(p => p.category))];
      return categories.map(category => ({
        category,
        count: projects.filter(p => p.category === category).length
      }));
    },
    getFeatured: () => projects.filter(p => p.featured && p.status === 'completed').slice(0, 6)
  },

  // Subscriber operations
  subscribers: {
    create: (data) => {
      const existing = subscribers.find(s => s.email === data.email);
      if (existing) {
        throw new Error('Email already subscribed');
      }
      const subscriber = { id: subscriberId++, ...data, createdAt: new Date(), isActive: true };
      subscribers.push(subscriber);
      return subscriber;
    },
    findAll: () => [...subscribers]
  }
};

module.exports = memoryStorage;