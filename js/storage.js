/* ============================================
   Storage Module - localStorage Layer (Minimal)
   ============================================ */

function initializeStorage() {
    if (!getFromStorage('users')) setDefaultUsers();
    if (!getFromStorage('events')) setDefaultEvents();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStorage);
} else {
    initializeStorage();
}

// ============ Storage Helpers ============
function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Storage error:', e);
        return false;
    }
}

function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Storage error:', e);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Storage error:', e);
        return false;
    }
}

// ============ User Management ============

function setDefaultUsers() {
    const defaultUsers = [
        { id: 'user-1', name: 'John Student', email: 'student@example.com', password: 'password123', role: 'student', createdAt: new Date().toISOString() },
        { id: 'user-2', name: 'Alice Organizer', email: 'organizer@example.com', password: 'password123', role: 'organizer', createdAt: new Date().toISOString() },
        { id: 'user-3', name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin', createdAt: new Date().toISOString() },
        { id: 'user-4', name: 'Jane Student', email: 'jane@example.com', password: 'password123', role: 'student', createdAt: new Date().toISOString() },
        { id: 'user-5', name: 'Bob Organizer', email: 'bob@example.com', password: 'password123', role: 'organizer', createdAt: new Date().toISOString() }
    ];
    setToStorage('users', defaultUsers);
}

function getAllUsers() {
    return getFromStorage('users') || [];
}

function getUserById(userId) {
    return getAllUsers().find(u => u.id === userId);
}

function getUserByEmail(email) {
    return getAllUsers().find(u => u.email === email);
}

function addUser(user) {
    const users = getAllUsers();
    const newUser = { id: 'user-' + Date.now(), ...user, createdAt: new Date().toISOString() };
    users.push(newUser);
    setToStorage('users', users);
    return newUser;
}

function updateUser(userId, updates) {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    setToStorage('users', users);
    return users[idx];
}

// ============ Event Management ============

function setDefaultEvents() {
    const future = (daysAhead) => {
        const d = new Date();
        d.setDate(d.getDate() + daysAhead);
        return d.toISOString().split('T')[0];
    };
    const defaultEvents = [
        { id: 'event-1', name: 'Web Development Workshop', description: 'Learn modern web development with HTML, CSS, and JavaScript.', category: 'Workshop', date: future(7), time: '14:00', venue: 'Engineering Building, Room 201', maxCapacity: 30, attendees: ['user-1', 'user-4'], organizer: 'Alice Organizer', organizerId: 'user-2', type: 'In-person', createdAt: new Date().toISOString() },
        { id: 'event-2', name: 'Annual Cultural Festival', description: 'Celebrate diversity with music, dance, food, and cultural performances.', category: 'Cultural', date: future(14), time: '10:00', venue: 'Main Campus Grounds', maxCapacity: 500, attendees: ['user-1'], organizer: 'Alice Organizer', organizerId: 'user-2', type: 'In-person', createdAt: new Date().toISOString() },
        { id: 'event-3', name: 'Basketball Tournament', description: 'Compete in our inter-class basketball tournament. All skill levels welcome.', category: 'Sports', date: future(21), time: '16:00', venue: 'Sports Complex', maxCapacity: 100, attendees: ['user-4'], organizer: 'Bob Organizer', organizerId: 'user-5', type: 'In-person', createdAt: new Date().toISOString() },
        { id: 'event-4', name: 'Data Science Seminar', description: 'Exploring the latest trends in data science and machine learning.', category: 'Academic', date: future(10), time: '13:00', venue: 'Virtual Meeting Room', maxCapacity: 150, attendees: ['user-1', 'user-4'], organizer: 'Alice Organizer', organizerId: 'user-2', type: 'Online', createdAt: new Date().toISOString() },
        { id: 'event-5', name: 'Student Networking Dinner', description: 'Connect with fellow students over dinner.', category: 'Social', date: future(5), time: '18:00', venue: 'Student Center, Main Hall', maxCapacity: 80, attendees: ['user-1'], organizer: 'Bob Organizer', organizerId: 'user-5', type: 'In-person', createdAt: new Date().toISOString() },
        { id: 'event-6', name: 'UI/UX Design Masterclass', description: 'Master the principles of user interface and user experience design.', category: 'Workshop', date: future(28), time: '15:00', venue: 'Design Lab, Building A', maxCapacity: 25, attendees: [], organizer: 'Alice Organizer', organizerId: 'user-2', type: 'Hybrid', createdAt: new Date().toISOString() }
    ];
    setToStorage('events', defaultEvents);
}

function getAllEvents() {
    return getFromStorage('events') || [];
}

function getEventById(eventId) {
    return getAllEvents().find(e => e.id === eventId);
}

function getEventsByOrganizer(organizerId) {
    return getAllEvents().filter(e => e.organizerId === organizerId);
}

function addEvent(event) {
    const events = getAllEvents();
    const newEvent = { id: 'event-' + Date.now(), attendees: [], ...event, createdAt: new Date().toISOString() };
    events.push(newEvent);
    setToStorage('events', events);
    return newEvent;
}

function updateEvent(eventId, updates) {
    const events = getAllEvents();
    const idx = events.findIndex(e => e.id === eventId);
    if (idx === -1) return null;
    events[idx] = { ...events[idx], ...updates };
    setToStorage('events', events);
    return events[idx];
}

function deleteEventFromStorage(eventId) {
    const events = getAllEvents();
    setToStorage('events', events.filter(e => e.id !== eventId));
    return true;
}

// ============ Event Registration ============

function registerUserForEvent(userId, eventId) {
    const event = getEventById(eventId);
    if (!event) {
        return { success: false, message: 'Event not found' };
    }
    if (event.attendees.includes(userId)) {
        return { success: false, message: 'Already registered' };
    }
    if (event.attendees.length >= event.maxCapacity) {
        return { success: false, message: 'Event is full' };
    }
    const updated = updateEvent(eventId, { attendees: [...event.attendees, userId] });
    return { success: true, data: updated };
}

function unregisterUserFromEvent(userId, eventId) {
    const event = getEventById(eventId);
    if (!event) {
        return { success: false, message: 'Event not found' };
    }
    if (!event.attendees.includes(userId)) {
        return { success: false, message: 'Not registered' };
    }
    const updated = updateEvent(eventId, { attendees: event.attendees.filter(id => id !== userId) });
    return { success: true, data: updated };
}

// ============ Session Management ============

function setCurrentUser(user) {
    const userSession = { id: user.id, name: user.name, email: user.email, role: user.role };
    setToStorage('currentUser', userSession);
}

function getCurrentUser() {
    return getFromStorage('currentUser');
}

function clearCurrentUser() {
    removeFromStorage('currentUser');
}

// ============ Dark Mode ============

function toggleDarkMode(event) {
    event?.preventDefault();
    const isDarkMode = document.body.classList.toggle('dark-mode');
    setToStorage('darkMode', isDarkMode);
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) toggle.textContent = isDarkMode ? '☀️' : '🌙';
}

function loadDarkModePreference() {
    const isDarkMode = getFromStorage('darkMode');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) toggle.textContent = isDarkMode ? '☀️' : '🌙';
}

loadDarkModePreference();

// ============ Utilities ============

function finishLoading(mainElementId, duration = 1000, callback = null) {
    const loader = document.getElementById('loaderContainer');
    const mainContent = document.getElementById(mainElementId);

    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = `opacity 0.5s ease`;
        loader.style.pointerEvents = 'none';
    }

    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '0';
        mainContent.style.transition = `opacity 0.5s ease`;
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 50);
    }

    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        if (callback) callback();
    }, duration);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function capitalizeRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1);
}
