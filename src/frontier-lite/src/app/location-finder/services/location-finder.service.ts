import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as fl from '../../../../../common/models/find-locations'
import { EnvironmentService } from '../../services/environment.service';

@Injectable({
    providedIn: 'root'
})
export class LocationFinderService {
    private apiEndpoint = 'api/find-locations'

    constructor(
        private http: HttpClient,
        private environmentService: EnvironmentService
    ) {
    }

    public get(params: fl.FindLocationsRequest): Observable<fl.FindLocationsResponse> {
        const endpoint = this.environmentService.getApiUrl('find-locations');
        return this.http.post<fl.FindLocationsResponse>(endpoint, params);
    }

}
