

if (typeof process.env.ADMIN_EMAIL !== 'string') {
    throw new Error('ADMIN_EMAIL environment variable not set');
}

/** The email address of the application administrators */
export const adminEmail = process.env.ADMIN_EMAIL.trim();
