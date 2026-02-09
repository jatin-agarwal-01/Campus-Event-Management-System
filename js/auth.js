/* ============================================
   Authentication Module (Minimal Front-End)
   ============================================ */

function registerUser(name, email, password, role) {
    if (!name || !email || !password || !role) {
        return { success: false, message: 'All fields are required' };
    }
    if (getUserByEmail(email)) {
        return { success: false, message: 'Email already registered' };
    }
    const newUser = addUser({ name, email, password, role });
    return { success: true, data: newUser };
}

function loginUser(email, password) {
    if (!email || !password) return null;
    const user = getUserByEmail(email);
    if (!user || user.password !== password) return null;
    setCurrentUser(user);
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function logoutUser() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function getCurrentUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}
