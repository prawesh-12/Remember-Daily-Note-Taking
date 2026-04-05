const AUTH_TOKEN_KEY = "remember_daily_token";
const AUTH_USER_KEY = "remember_daily_user";

export function setAuthSession({ token, user }) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser() {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
}

export function clearAuthSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

export function isAuthenticated() {
    return Boolean(getAuthToken());
}
