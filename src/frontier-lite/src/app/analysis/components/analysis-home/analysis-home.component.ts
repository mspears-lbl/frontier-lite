import { CommonModule } from '@angular/common';
import { Component, EventEmitter, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThreatDataService } from '../../services/threat-data.service';
import { ThreatMapComponent } from '../threat-map/threat-map.component';
import { ThreatInfo } from '../../../../../../common/models/threat-info';
import { ThreatTableComponent } from '../threat-table/threat-table.component';

@Component({
  selector: 'app-analysis-home',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    ThreatMapComponent,
    ThreatTableComponent
  ],
  templateUrl: './analysis-home.component.html',
  styleUrl: './analysis-home.component.scss'
})
export class AnalysisHomeComponent {
    public loading = false;
    public data: any = null;
    public error: string | null = null;
    public threatInfo$ = new EventEmitter<ThreatInfo[]>();

    constructor(
        private dataService: ThreatDataService
    ) {
    }

    public getData(): void {
        this.loading = true;
        this.error = null;

        // this.dataService.get().subscribe({
        //     next: (data) => {
        //         console.log('Received data:', data);
        //         this.data = data;
        //         this.loading = false;
        //     },
        //     error: (error) => {
        //         console.error('Error fetching data:', error);
        //         this.error = `Failed to fetch data: ${error.message || 'Unknown error'}`;
        //         this.loading = false;
        //     }
        // });
    }

    public handleThreatInfoEvent(params: ThreatInfo[]): void {
        console.log('Received threat info:', params);
        this.threatInfo$.emit(params);
    }
}
