import * as nodemailer from 'nodemailer';
import { createLogger } from '../logging';
import * as util from 'util';
import axios from 'axios';
import { Stream } from 'stream';

const logger = createLogger(module);

logger.debug('build the mailer...');

interface MailConfigRequired {
	host: string;
	port: number;
	secure: boolean;
}
interface MailConfigOptional {
	auth?: {
		user: string | null | undefined;
		pass: string | null | undefined;
	} | null | undefined
}
interface MailConfig extends MailConfigRequired, MailConfigOptional {}


function isMailConfig(config: any): config is MailConfig {
	return typeof config.host === 'string'
		&& config.host
		&& typeof config.port === 'number'
		&& config.port > 0
		&& typeof config.secure === 'boolean'
		&& (
			config.auth == null
			||
			(
				typeof config.auth.user === 'string'
				&& config.auth.user
				&& typeof config.auth.pass === 'string'
				&& config.auth.pass
			)
		)
}

function buildMailConfigFromEnv(): MailConfig {
	let config: any = {
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT ? +process.env.SMTP_PORT : undefined,
		secure: process.env.SMTP_SECURE ? true : false
	}
	if (process.env.SMTP_USER && process.env.SMTP_PASS) {
		config.auth = {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		}
	};
	if (!isMailConfig(config)) {
		throw new Error('Invalid mail configuration');
	}
	return config;
}

function getMailConfig(): MailConfig | undefined {
	try {
		return buildMailConfigFromEnv();
	} catch (error: any) {
		logger.debug('mail config error');
		logger.debug(util.inspect(error, {depth: null}))
	}
}

class TransportBuilder {
	private constructor(
		private config: MailConfig
	) {
	}

	public static fromMailConfig(config: MailConfig): nodemailer.Transporter {
		const builder = new TransportBuilder(config);
		return builder.run();
	}

	private run(): nodemailer.Transporter {
		return this.hasAuthInfo()
			? this.buildWithUserInfo()
			: this.buildWithoutUserInfo();
	}

	private hasAuthInfo(): boolean {
		return this.config.auth && this.config.auth.user && this.config.auth.pass
			? true : false;
	}

	private buildWithUserInfo(): nodemailer.Transporter {
		return nodemailer.createTransport({
            host: this.config.host,
            port: this.config.port,
            secure: this.config.secure,
            auth: {
                user: this.config.auth!.user!,
                pass: this.config.auth!.pass!
            },
			tls: {rejectUnauthorized: false}
        })
	}

	private buildWithoutUserInfo(): nodemailer.Transporter {
		return nodemailer.createTransport({
            host: this.config.host,
            port: this.config.port,
            secure: this.config.secure
        })
	}
}

export interface MailParams {
	from: string;
	to: string | string[];
	cc?: string | string[] | undefined;
	subject: string;
	message: string;
	attachments?: {filename: string, content: any, contentType?: string}[]
}

class PostOffice {
	private constructor(
		private transporter: nodemailer.Transporter
	) {
	}

	public static fromTransporter(transporter: nodemailer.Transporter): PostOffice {
		const obj = new PostOffice(transporter);
		return obj;
	}

	public static canSendMail(): boolean {
		return postOffice ? true : false;
	}

	public async sendMail(params: MailParams): Promise<any> {
		const results = await this.sendMessage(params);
	}

	private sendMessage(params: MailParams): Promise<any> {
		return new Promise((resolve, reject) => {
			this.transporter.sendMail({
				from: params.from,
				to: params.to,
				cc: params.cc,
				subject: params.subject,
				html: params.message,
				attachments: params.attachments
			}, (err, info) => {
				if (err) {
					logger.error('Error sending email', err);
					reject(err);
				} else {
					logger.info('send mail success');
					logger.debug(util.inspect(info, {depth: null}));
					resolve(info);
				}
			})
		})

	}

}

const mailConfig = getMailConfig();
console.log('mail config');
console.log(mailConfig);
const transporter = mailConfig ? TransportBuilder.fromMailConfig(mailConfig) : undefined;
const postOffice = transporter ? PostOffice.fromTransporter(transporter) : undefined;

export function canSendMail(): boolean {
	return postOffice ? true : false;
}

// function hasAPIMailParams(): boolean {
// 	return process.env.MAIL_API_USER && process.env.MAIL_API_PASSWORD && process.env.MAIL_API_HOST && process.env.MAIL_API_PORT
// 		? true : false
// }

// class MailApiSender {
// 	private userEmail: string;
// 	private userPassword: string;
// 	private mailHost: string;
// 	private mailPort: number;
// 	private token: string | undefined;
// 	private expireTime: number | undefined;
// 	private apiEndpointMail = 'api/mail-it';
// 	private apiEndpointLogin = 'api/login';
// 	private mailUrl: string;
// 	private loginUrl: string;

// 	constructor() {
// 		if (!process.env.MAIL_API_USER || !process.env.MAIL_API_PASSWORD || !process.env.MAIL_API_HOST || !process.env.MAIL_API_PORT) {
// 			throw new Error('Mail API not configured');
// 		} 
// 		console.log('configuring MailAPISender...');
// 		this.userEmail = process.env.MAIL_API_USER;
// 		this.userPassword = process.env.MAIL_API_PASSWORD;
// 		this.mailHost = process.env.MAIL_API_HOST;
// 		this.mailPort = +process.env.MAIL_API_PORT;
// 		this.mailUrl = `${this.mailHost}:${this.mailPort}/${this.apiEndpointMail}`;
// 		this.loginUrl = `${this.mailHost}:${this.mailPort}/${this.apiEndpointLogin}`;
// 	}

// 	public async sendMessage(message: MailParams): Promise<void> {
// 		if (!this.hasValidToken()) {
// 			await this.login();
// 		}
// 		await this.sendMail(message);
// 	}
	

// 	private hasValidToken(): boolean {
// 		return this.token && this.expireTime && Date.now() < this.expireTime
// 			? true : false;
// 	}

// 	private async login(): Promise<void> {
// 		const response = await axios.post(this.loginUrl, {
// 			email: this.userEmail,
// 			password: this.userPassword
// 		});
// 		const token = response.data.token;
// 		const expiresIn = +response.data.expiresIn;
// 		if (!token || !expiresIn || Number.isNaN(expiresIn)) {
// 			throw new Error('Login to mail api not successful, response not recognized');
// 		}
// 		this.token = token;
// 		this.expireTime = Date.now() + expiresIn - 10000;
// 	}

// 	private async sendMail(message: MailParams): Promise<void> {
// 		try {
// 			logger.debug('send the message...')
// 			logger.debug(util.inspect(message, {depth: null}));
// 			await axios.post(this.mailUrl,  message, {
// 				headers: {
// 					Authorization: `Bearer ${this.token}`
// 				}
// 			});
// 		} catch (error) {
// 			console.log('error sending mail');
// 			console.log(util.inspect(error, {depth: null}));
// 		}
// 	}
// }

// const mailSender = hasAPIMailParams() ? new MailApiSender() : undefined;

export async function sendMail(
	params: MailParams
): Promise<any> {
	if (!postOffice) {
		throw new Error('Mail not configured');
	}
	console.log('send the email...')

	logger.debug(util.inspect(params, {depth: null}));
	await postOffice.sendMail(params);
	// if (mailSender) {
	// 	await mailSender.sendMessage(params);
	// }

	// axios.post('http://localhost:3030/api/login', {
	// 	email: process.env.MAIL_API_USER,
	// 	password: process.env.MAIL_API_PASSWORD
	// }).then(result => {
	// 	console.log('login success)');
	// 	console.log(result);
	// 	const token = result.data.token;
	// 	console.log(`token: ${token}`);
	// });
	// axios.post('http://localhost:3030/api/mail-it', params);
	// console.log('done');
	// return postOffice.sendMail(params);
}


// const testParams: MailParams = {
// 	from: 'mspears@lbl.gov',
// 	to: 'maikerugd@gmail.com',
// 	cc: undefined,
// 	subject: 'test 1234',
// 	message: '<h1>Hey Mike</h1><p>This is a test</p>'
// }
// sendMail(testParams);
