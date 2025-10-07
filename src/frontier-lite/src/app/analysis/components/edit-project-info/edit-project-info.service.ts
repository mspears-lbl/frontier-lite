import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EditProjectInfoComponent, DialogParams } from './edit-project-info.component';

@Injectable({
    providedIn: 'root',
})
export class EditProjectInfoService {

    constructor(
        private dialog: MatDialog
    ) {
    }

    public open(params: DialogParams): Observable<boolean> {
        return this.dialog.open(EditProjectInfoComponent, {
                width: '400px',
                data: params
            })
            .afterClosed();
    }
}