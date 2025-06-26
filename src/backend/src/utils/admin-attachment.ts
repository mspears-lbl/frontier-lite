

if (typeof process.env.ADMIN_ATTACH_EMAIL !== 'string') {
    throw new Error('ADMIN_ATTACH_EMAIL environment variable not set');
}

/**
 * The email addresses of the application administrators for when email attachments are sent.
 * Multiple email addresses can be separated by commas.
 */
export const adminAttachEmail = process.env.ADMIN_ATTACH_EMAIL.trim();
