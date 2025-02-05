/** An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = ['/']

export const privateRoutes = ['/protected']

/** An array of routes that are use for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */

export const authRoutes = ['/auth/login', '/auth/register']

/** The prefix for API authentification routes
 * Routes that start with this prefix are used for API authentication
 * @type {string}
 */

export const apiAuthPrefix = '/api/auth'

/** The default redirect path after login
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = '/dashboard'
