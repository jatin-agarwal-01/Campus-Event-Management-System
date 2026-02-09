/* ============================================
   Events Module (Minimal Front-End)
   ============================================ */

function createEvent(eventData) {
    if (!eventData.name || !eventData.description || !eventData.category || 
        !eventData.date || !eventData.venue || !eventData.maxCapacity) {
        return { success: false, message: 'All required fields must be filled' };
    }
    if (eventData.maxCapacity < 1) {
        return { success: false, message: 'Event capacity must be at least 1' };
    }
    const user = getCurrentUser();
    const newEvent = addEvent({
        ...eventData,
        organizerId: user.id,
        organizer: user.name,
        attendees: []
    });
    return { success: true, data: newEvent };
}

function deleteEvent(eventId) {
    const event = getEventById(eventId);
    if (!event) {
        return { success: false, message: 'Event not found' };
    }
    const user = getCurrentUser();
    if (user.role === 'organizer' && event.organizerId !== user.id) {
        return { success: false, message: 'You can only delete your own events' };
    }
    deleteEventFromStorage(eventId);
    return { success: true };
}

function getUpcomingEvents(limit = null) {
    const events = getAllEvents();
    const now = new Date();
    const upcoming = events
        .filter(e => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    return limit ? upcoming.slice(0, limit) : upcoming;
}

function getPastEvents() {
    const events = getAllEvents();
    const now = new Date();
    return events
        .filter(e => new Date(e.date) <= now)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function searchEvents(query) {
    const events = getAllEvents();
    const lowerQuery = query.toLowerCase();
    return events.filter(e => 
        e.name.toLowerCase().includes(lowerQuery) ||
        e.description.toLowerCase().includes(lowerQuery) ||
        e.venue.toLowerCase().includes(lowerQuery)
    );
}

function registerForEvent(eventId) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Must be logged in' };
    return registerUserForEvent(user.id, eventId);
}

function unregisterFromEvent(eventId) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Must be logged in' };
    return unregisterUserFromEvent(user.id, eventId);
}
