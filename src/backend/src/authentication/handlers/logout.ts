import { Request, Response } from 'express';

export function logoutHandler(request: Request, response: Response) {
    if (request.isAuthenticated()) {
        request.logout((err: any) => {
            if (err) {
                response.status(500).send();
            }
            else {
                response.status(200).send();
            }
        });
    }
}
