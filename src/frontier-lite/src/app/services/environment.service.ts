import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    private readonly apiBaseUrl = 'http://localhost:3000/api';

    public getApiUrl(endpoint: string): string {
        return `${this.apiBaseUrl}/${endpoint}`;
    }
}