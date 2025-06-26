import { AppUserAuth } from '../models/app-user-auth';

export type NextFunc = (error: any, authenticatedUser: AppUserAuth | undefined) => void;
