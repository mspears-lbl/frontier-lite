import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EditProjectThreatInfoComponent, DialogParams } from './edit-project-threat-info.component';

@Injectable({
    providedIn: 'root',
})
export class EditProjectThreatInfoService {

    constructor(
        private dialog: MatDialog
    ) {
    }

    public open(params: DialogParams): Observable<boolean> {
        return this.dialog.open(EditProjectThreatInfoComponent, {
                // height: '290px',
                width: '400px',
                data: params
            })
            .afterClosed();
    }
}
