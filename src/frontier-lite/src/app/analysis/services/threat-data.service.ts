import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../services/environment.service';
import { ThreatDataRequest } from '../../../../../common/models/threat-data'
import { ThreatInfo } from '../../../../../common/models/threat-info'

@Injectable({
    providedIn: 'root'
})
export class ThreatDataService {

    constructor(
        private http: HttpClient,
        private environmentService: EnvironmentService
    ) {
    }

    public get(params: ThreatDataRequest): Observable<any> {
        const endpoint = this.environmentService.getApiUrl('threat-data');
        return this.http.post<any>(endpoint, params);
    }

    public getThreatNames(z: number, x: number, y: number): Observable<ThreatInfo[]> {
        const endpoint = this.environmentService.getApiUrl(`threat-info/${z}/${x}/${y}.mvt`);
        return this.http.get<ThreatInfo[]>(endpoint);
    }

    public getThreatsInBounds(bounds: { north: number, south: number, east: number, west: number }): Observable<ThreatInfo[]> {
        const endpoint = this.environmentService.getApiUrl('threats-in-bounds');
        return this.http.post<ThreatInfo[]>(endpoint, bounds);
    }

}
