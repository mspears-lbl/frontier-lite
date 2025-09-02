import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NewProjectThreatComponent, DialogParams } from './new-project-threat.component';

@Injectable({
    providedIn: 'root',
})
export class NewProjectThreatService {

    constructor(
        private dialog: MatDialog
    ) {
    }

    public open(params: DialogParams): Observable<boolean> {
        return this.dialog.open(NewProjectThreatComponent, {
                // height: '290px',
                width: '400px',
                data: params
            })
            .afterClosed();
    }
}
