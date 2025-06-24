import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ConfirmDialogService {

    constructor(
        private dialog: MatDialog
    ) {
    }

    public confirm(message: string): Observable<boolean> {
        return this.dialog.open(ConfirmDialogComponent, {
                height: '175px',
                width: '400px',
                data: { message },
            })
            .afterClosed()
            .pipe(map(result => result ? true : false));
    }
}
