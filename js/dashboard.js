/* ============================================
   Dashboard Module (Minimal Front-End)
   ============================================ */

// Get current user's basic stats
function getUserStats() {
    const user = getCurrentUser();
    if (!user) return null;

    const allEvents = getAllEvents();
    const now = new Date();

    if (user.role === 'student') {
        const registered = allEvents.filter(e => e.attendees.includes(user.id));
        const upcoming = registered.filter(e => new Date(e.date) > now);
        const past = registered.filter(e => new Date(e.date) <= now);
        return { registered: registered.length, upcoming: upcoming.length, past: past.length };
    }

    if (user.role === 'organizer') {
        const organized = allEvents.filter(e => e.organizerId === user.id);
        const upcoming = organized.filter(e => new Date(e.date) > now);
        let totalAttendees = 0;
        organized.forEach(e => { totalAttendees += e.attendees.length; });
        return { created: organized.length, upcoming: upcoming.length, totalAttendees };
    }

    if (user.role === 'admin') {
        let totalRegs = 0;
        allEvents.forEach(e => { totalRegs += e.attendees.length; });
        const upcoming = allEvents.filter(e => new Date(e.date) > now);
        return { totalUsers: getAllUsers().length, totalEvents: allEvents.length, totalRegs, upcoming: upcoming.length };
    }
}

// Get events for current user
function getUserEvents() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const allEvents = getAllEvents();

    if (user.role === 'student') {
        return allEvents.filter(e => e.attendees.includes(user.id));
    }
    if (user.role === 'organizer') {
        return allEvents.filter(e => e.organizerId === user.id);
    }
    if (user.role === 'admin') {
        return allEvents;
    }
    return [];
}
