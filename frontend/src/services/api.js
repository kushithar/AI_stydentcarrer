import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage on invalid/expired token if not on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('careerai_token');
        localStorage.removeItem('careerai_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Student Endpoints
export const studentApi = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getDashboard: () => api.get('/student/dashboard'),
};

// Assessment Endpoints
export const assessmentApi = {
  submitAssessment: (data) => api.post('/assessments', data),
  getAssessments: () => api.get('/assessments'),
  getAssessment: (id) => api.get(`/assessments/${id}`),
  getResults: (id) => api.get(`/assessments/${id}/results`),
};

// Recommendations & Public Careers
export const careerApi = {
  getLatestRecommendations: () => api.get('/recommendations/latest'),
  getRecommendation: (id) => api.get(`/recommendations/${id}`),
  generateFromProfile: () => api.post('/recommendations/generate'),
  listCareers: (params) => api.get('/careers', { params }),
  getCareerDetails: (id) => api.get(`/careers/${id}`),
  getCareerResources: (id) => api.get(`/careers/${id}/resources`),
};

// Saved Careers (Bookmarks)
export const savedCareerApi = {
  getSavedCareers: () => api.get('/saved-careers'),
  saveCareer: (careerId, notes = '') => api.post('/saved-careers', { career_id: careerId, notes }),
  removeSavedCareer: (careerId) => api.delete(`/saved-careers/${careerId}`),
};

// Courses & Learning Resources
export const courseApi = {
  listCourses: (params) => api.get('/courses', { params }),
};

// Admin Endpoints
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  updateStudentStatus: (id, status) => api.put(`/admin/students/${id}/status`, { account_status: status }),
  getCareers: (params) => api.get('/admin/careers', { params }),
  createCareer: (data) => api.post('/admin/careers', data),
  updateCareer: (id, data) => api.put(`/admin/careers/${id}`, data),
  deleteCareer: (id) => api.delete(`/admin/careers/${id}`),
  getSkills: () => api.get('/admin/skills'),
  createSkill: (data) => api.post('/admin/skills', data),
  getResources: () => api.get('/admin/resources'),
  createResource: (data) => api.post('/admin/resources', data),
  updateResource: (id, data) => api.put(`/admin/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/admin/resources/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getLogs: (params) => api.get('/admin/logs', { params }),
};

export default api;
