import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NewAnalysisProjectComponent } from './new-analysis-project.component';

@Injectable({
    providedIn: 'root',
})
export class NewAnalysisProjectService {

    constructor(
        private dialog: MatDialog
    ) {
    }

    public open(): Observable<boolean> {
        return this.dialog.open(NewAnalysisProjectComponent, {
                height: '290px',
                width: '400px',
            })
            .afterClosed();
    }
}
