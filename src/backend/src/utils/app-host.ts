
export const appHost = String(process.env.APP_HOST);

if (!appHost) {
	throw new Error('APP_HOST is not set');
}
